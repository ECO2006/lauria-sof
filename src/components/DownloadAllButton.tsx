"use client";

import { useState } from "react";
import JSZip from "jszip";
import { Photo } from "@/lib/types";

export default function DownloadAllButton({ photos }: { photos: Photo[] }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleDownloadAll() {
    if (photos.length === 0 || loading) return;
    setLoading(true);
    setProgress(0);

    try {
      const zip = new JSZip();

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const res = await fetch(photo.url);
        const blob = await res.blob();
        const ext = photo.storage_path.split(".").pop() || "jpg";
        const safeName = photo.owner_name.replace(/[^a-zA-Z0-9]/g, "_");
        zip.file(`${i + 1}_${safeName}.${ext}`, blob);
        setProgress(Math.round(((i + 1) / photos.length) * 100));
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "laurea-sofia-foto.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Errore durante la creazione dello zip. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownloadAll}
      disabled={loading}
      className="rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-sm transition hover:bg-blue-500/20 disabled:opacity-60"
    >
      {loading ? `Preparazione zip... ${progress}%` : "⬇️ Scarica tutte le foto"}
    </button>
  );
}
