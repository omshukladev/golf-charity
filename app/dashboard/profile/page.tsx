"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

type ProfileRecord = {
  full_name: string | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single<ProfileRecord>();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setName(data.full_name || "");
      setAvatar(data.avatar_url || "");
      setAvatarVersion((current) => current + 1);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProfile();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage({ type: "error", text: "User not logged in." });
        return;
      }

      const fileExt = file.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/avatar.${fileExt.toLowerCase()}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "0",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setMessage({ type: "error", text: "Error uploading image." });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: name,
        avatar_url: publicUrl,
      });

      if (profileError) {
        console.error(profileError);
        setMessage({
          type: "error",
          text: "Image uploaded, but profile could not be updated.",
        });
        setAvatar(publicUrl);
        setAvatarVersion((current) => current + 1);
        return;
      }

      setAvatar(publicUrl);
      setAvatarVersion((current) => current + 1);
      setMessage({ type: "success", text: "Avatar updated successfully." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage({ type: "error", text: "User not logged in." });
        return;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: name,
        avatar_url: avatar,
      });

      if (error) {
        console.error(error);
        setMessage({ type: "error", text: "Error saving profile." });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully." });
      }
    } finally {
      setLoading(false);
    }
  };

  const displayName = name.trim() || "Player";
  const avatarSrc = avatar
    ? `${avatar}${avatar.includes("?") ? "&" : "?"}v=${avatarVersion}`
    : "";

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
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt="avatar"
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-[#0c1e2d] text-lg font-semibold text-[#ffe7a3]">
                      {displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <label className="cursor-pointer rounded-full border border-[#ffe7a3]/70 bg-[#f59f00] px-4 py-2 text-sm font-semibold text-[#1e1400] transition hover:-translate-y-0.5">
                    {loading ? "Uploading..." : "Upload Avatar"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void handleUpload(file);
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
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#ffe7a3]/70 focus:ring-2 focus:ring-[#ffe7a3]/25"
                />
              </label>

              {message ? (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    message.type === "success"
                      ? "border-[#8ff1d2]/45 bg-[#8ff1d2]/10 text-[#c9ffe9]"
                      : "border-red-300/45 bg-red-400/10 text-red-100"
                  }`}
                >
                  {message.text}
                </div>
              ) : null}

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
                {displayName}
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
