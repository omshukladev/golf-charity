"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

type Draw = {
  id: string;
  month: string;
  year: number;
  is_winner: boolean;
  created_at: string;
  status: string;
  charity_name: string | null;
  proof_url: string | null;
};

export default function WinningsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // FETCH DRAWS
  const fetchDraws = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("draws")
      .select(
        `
        id,
        month,
        year,
        is_winner,
        created_at,
        status,
        proof_url,
        charities ( name )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      setDraws([]);
      setLoading(false);
      return;
    }

    const formatted: Draw[] =
      data?.map((d: any) => ({
        id: d.id,
        month: d.month,
        year: d.year,
        is_winner: d.is_winner,
        created_at: d.created_at,
        status: d.status || "pending",
        proof_url: d.proof_url,
        charity_name: d.charities?.name || null,
      })) || [];

    setDraws(formatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  // UPLOAD PROOF
  const handleProofUpload = async (file: File, drawId: string) => {
    try {
      setUploadingId(drawId);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUploadingId(null);
        return;
      }

      const fileExt = file.name.split(".").pop() || "jpg";

      // overwrite same file every time
      const filePath = `${user.id}/${drawId}.${fileExt}`;

      // 1. UPLOAD FILE
      const { error: uploadError } = await supabase.storage
        .from("proofs")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Upload failed");
        setUploadingId(null);
        return;
      }

      // 2. GET PUBLIC URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("proofs").getPublicUrl(filePath);

      if (!publicUrl) {
        console.error("Public URL missing");
        setUploadingId(null);
        return;
      }

      // 3. UPDATE DATABASE
      const { error: updateError } = await supabase
        .from("draws")
        .update({
          proof_url: publicUrl,
          status: "submitted",
        })
        .eq("id", drawId);

      if (updateError) {
        console.error("DB update error:", updateError);
        alert("Failed to save proof");
        setUploadingId(null);
        return;
      }

      // 4. REFRESH UI
      await fetchDraws();
      setUploadingId(null);
    } catch (err) {
      console.error("Unexpected error:", err);
      setUploadingId(null);
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "pending") return "Pending";
    if (status === "submitted") return "Waiting for verification";
    if (status === "verified") return "Approved by admin";
    if (status === "rejected") return "Rejected by admin";
    return "Unknown";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Your Winnings"
          subtitle="Track your participation and results in monthly draws."
        />

        <GlassCard>
          {loading ? (
            <p className="text-white/70">Loading...</p>
          ) : draws.length === 0 ? (
            <p className="text-white/70">No draw history yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {draws.map((draw) => (
                <div
                  key={draw.id}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {draw.month} {draw.year}
                      </p>

                      <p className="text-sm text-white/60">
                        Charity: {draw.charity_name || "Not selected"}
                      </p>

                      <p className="text-xs text-white/40">
                        Status: {getStatusLabel(draw.status)}
                      </p>
                    </div>

                    <span
                      className={`text-sm font-semibold ${
                        draw.is_winner ? "text-green-400" : "text-red-300"
                      }`}
                    >
                      {draw.is_winner ? "Won" : "Lost"}
                    </span>
                  </div>

                  {draw.is_winner && (
                    <>
                      {uploadingId === draw.id && (
                        <p className="text-xs text-yellow-300">Uploading...</p>
                      )}

                      {draw.status === "pending" && uploadingId !== draw.id && (
                        <label className="cursor-pointer text-xs text-yellow-300 underline">
                          Upload Proof
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleProofUpload(file, draw.id);
                              }
                            }}
                          />
                        </label>
                      )}

                      {draw.status === "submitted" && (
                        <p className="text-xs text-yellow-300 font-semibold">
                          Waiting for admin approval
                        </p>
                      )}

                      {draw.status === "verified" && (
                        <p className="text-xs text-green-400 font-semibold">
                          Approved by admin
                        </p>
                      )}

                      {draw.status === "rejected" && (
                        <p className="text-xs text-red-400 font-semibold">
                          Rejected by admin
                        </p>
                      )}

                      {draw.proof_url && (
                        <a
                          href={draw.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 underline"
                        >
                          View Proof
                        </a>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
