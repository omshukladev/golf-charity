"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  //  Fetch profile
  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setName(data.full_name || "");
      setAvatar(data.avatar_url || "");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  //  NEW: Upload avatar
  const handleUpload = async (file: File) => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not logged in");
      setLoading(false);
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/avatar.${fileExt}`; //  FIXED

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

    setAvatar(data.publicUrl);
    setLoading(false);
  };

  //  Save profile
  const handleSave = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: name,
      avatar_url: avatar,
    });

    if (error) {
      console.error(error);
      alert("Error saving profile");
    } else {
      alert("Profile updated");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Profile"
          subtitle="Update your account details and avatar shown across your dashboard."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <GlassCard className="lg:col-span-2">
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-white/55">
                  Avatar
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-16 w-16 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-[#0c1e2d] text-lg font-semibold text-[#ffe7a3]">
                      {name.trim()
                        ? name.trim().slice(0, 1).toUpperCase()
                        : "P"}
                    </div>
                  )}

                  <label className="cursor-pointer rounded-full border border-[#ffe7a3]/70 bg-[#f59f00] px-4 py-2 text-sm font-semibold text-[#1e1400] transition hover:-translate-y-0.5">
                    {loading ? "Uploading..." : "Upload Avatar"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-white/80">
                  Full Name
                </span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#ffe7a3]/70 focus:ring-2 focus:ring-[#ffe7a3]/25"
                />
              </label>

              <button
                onClick={handleSave}
                disabled={loading}
                className="rounded-xl border border-[#ffe7a3]/70 bg-[#f59f00] px-5 py-3 text-sm font-semibold text-[#1e1400] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Processing..." : "Save Profile"}
              </button>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-white/55">
                Profile Preview
              </p>
              <p className="mt-3 text-xl font-semibold text-[#ffe7a3]">
                {name.trim() || "Player"}
              </p>
              <p className="mt-2 text-sm text-white/70">
                Keep your profile current for a cleaner dashboard experience.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
