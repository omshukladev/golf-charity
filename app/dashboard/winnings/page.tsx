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

  const fetchDraws = async () => {
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
      console.error(error);
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
        status: d.status,
        proof_url: d.proof_url,
        charity_name: d.charities?.name || null,
      })) || [];

    setDraws(formatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  // PROOF UPLOAD FUNCTION (FINAL)
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

    // FIX ESLINT
    const timestamp = new Date().getTime();
    const filePath = `${user.id}/${drawId}-${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(filePath, file, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error(uploadError);
      setUploadingId(null);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("proofs")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("draws")
      .update({
        proof_url: publicUrl,
        status: "submitted",
      })
      .eq("id", drawId);

    if (updateError) {
      console.error(updateError);
      setUploadingId(null);
      return;
    }

    setUploadingId(null);
    fetchDraws();
  } catch (err) {
    console.error(err);
    setUploadingId(null);
  }
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
                        Status: {draw.status}
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

                  {/* WINNER ACTIONS */}
                  {draw.is_winner && (
                    <>
                      {/* Uploading */}
                      {uploadingId === draw.id && (
                        <p className="text-xs text-yellow-300">Uploading...</p>
                      )}

                      {/* Upload button */}
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

                      {/* Uploaded */}
                      {draw.status === "submitted" && (
                        <p className="text-xs text-green-400 font-semibold">
                          Proof Uploaded
                        </p>
                      )}

                      {/* View Proof */}
                      {draw.proof_url && (
                        <a
                          href={draw.proof_url}
                          target="_blank"
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
