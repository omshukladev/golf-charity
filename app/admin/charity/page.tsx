"use client";

import { useEffect, useState } from "react";

type Charity = {
  id: string;
  name: string;
  description: string;
};

export default function AdminCharityPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchCharities = async () => {
    const res = await fetch("/api/admin/charity");
    const data = await res.json();
    setCharities(data);
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const addCharity = async () => {
    if (!name) return alert("Name required");

    await fetch("/api/admin/charity", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });

    setName("");
    setDescription("");
    fetchCharities();
  };

  const deleteCharity = async (id: string) => {
    await fetch("/api/admin/charity", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    fetchCharities();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Charities</h1>

      {/* ADD FORM */}
      <div className="rounded-xl border border-white/10 p-4 space-y-3">
        <input
          placeholder="Charity Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-black/30"
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-black/30"
        />

        <button
          onClick={addCharity}
          className="bg-[#f59f00] text-black px-4 py-2 rounded"
        >
          Add Charity
        </button>
      </div>

      {/* LIST */}
      <div className="rounded-xl border border-white/10 p-4">
        {charities.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center border-b border-white/10 py-3"
          >
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-white/60">{c.description}</p>
            </div>

            <button
              onClick={() => deleteCharity(c.id)}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}