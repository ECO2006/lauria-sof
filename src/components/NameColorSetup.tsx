"use client";

import { useState } from "react";
import { ELECTRIC_BLUE_PALETTE, saveIdentity } from "@/lib/identity";

export default function NameColorSetup({
  onComplete,
}: {
  onComplete: (name: string, color: string) => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(ELECTRIC_BLUE_PALETTE[0]);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Inserisci il tuo nome");
      return;
    }
    saveIdentity(trimmed, color);
    onComplete(trimmed, color);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-xl font-bold text-slate-900">Benvenuto! 🎓</h2>
        <p className="mt-1 text-sm text-slate-500">
          Scegli il tuo nome e un colore: verranno mostrati sulle foto che scatti.
        </p>

        <label className="mt-5 block text-sm font-medium text-slate-700">
          Il tuo nome
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Es. Marco"
          maxLength={40}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Il tuo colore
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {ELECTRIC_BLUE_PALETTE.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className="h-9 w-9 rounded-full ring-offset-2 transition"
              style={{
                backgroundColor: c,
                boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
              }}
              aria-label={`Colore ${c}`}
            />
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Entra nella festa
        </button>
      </form>
    </div>
  );
}
