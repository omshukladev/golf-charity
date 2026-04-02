"use client";

import { useState } from "react";

export default function DrawPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDraw = async () => {
    setLoading(true);

    const res = await fetch("/api/draw/run", {
      method: "POST",
    });

    const data = await res.json();
    setResult(data);

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Run Monthly Draw</h1>

      <button
        onClick={runDraw}
        disabled={loading}
        className="bg-[#f59f00] text-black px-6 py-3 rounded-xl font-semibold"
      >
        {loading ? "Running..." : "Run Draw"}
      </button>

      {result && (
        <div className="bg-white/5 p-4 rounded-xl">
          <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}