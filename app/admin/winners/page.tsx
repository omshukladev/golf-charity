"use client";

import { useEffect, useState } from "react";

type Draw = {
  id: string;
  month: string;
  year: number;
  status: string;
  proof_url: string | null;
  is_winner: boolean;
  charities: { name: string } | null;
};

export default function AdminWinnersPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // FETCH DATA
  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/draws");
      const data = await res.json();

      if (Array.isArray(data)) {
        setDraws(data);
      } else {
        console.error("Invalid API response:", data);
        setDraws([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setDraws([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // APPROVE / REJECT
  const handleAction = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/draws", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (data.success) {
        // REMOVE CARD INSTANTLY
        setDraws((prev) => prev.filter((d) => d.id !== id));

        // SHOW MESSAGE
        setMessage(
          status === "verified"
            ? "Winner approved successfully"
            : "Winner rejected",
        );

        // AUTO HIDE MESSAGE
        setTimeout(() => setMessage(null), 3000);
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Verify Winners</h1>

      {/* TOP MESSAGE */}
      {message && (
        <div className="mb-4 rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm text-green-300">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : draws.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="space-y-4">
          {draws.map((d) => (
            <div
              key={d.id}
              className="border border-white/10 p-4 rounded-xl bg-white/5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">User</p>
                  <p className="text-sm text-white/60">
                    {d.month} {d.year}
                  </p>
                  <p className="text-xs text-white/40">
                    Charity: {d.charities?.name || "N/A"}
                  </p>
                </div>

                <span className="text-green-400 font-semibold">Winner</span>
              </div>

              {d.proof_url && (
                <a
                  href={d.proof_url}
                  target="_blank"
                  className="text-sm text-blue-400 underline mt-2 inline-block"
                >
                  View Proof
                </a>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleAction(d.id, "verified")}
                  className="bg-green-500 px-4 py-2 rounded-lg text-black font-semibold"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleAction(d.id, "rejected")}
                  className="bg-red-500 px-4 py-2 rounded-lg text-black font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
