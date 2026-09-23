"use client";

import { useEffect, useCallback, useState } from "react";
import { Photo } from "@/lib/types";

type Props = {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
};

export default function Lightbox({ photos, index, onClose, onNavigate }: Props) {
  const photo = photos[index];
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!photo || downloading) return;
    setDownloading(true);
    try {
      // Scarica i byte originali (nessuna ricompressione) e forza il salvataggio,
      // così funziona in modo affidabile anche quando l'immagine è su un altro dominio.
      const res = await fetch(photo.url);
      const blob = await res.blob();
      const ext = photo.storage_path.split(".").pop() || "jpg";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laurea-sofia-${photo.owner_name}-${photo.id}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download non riuscito, riprova.");
    } finally {
      setDownloading(false);
    }
  }

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < photos.length - 1) onNavigate(index + 1);
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
    },
    [index, photos.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/95">
      <div className="flex items-center justify-between px-4 py-3">
        <span
          className="rounded-full px-3 py-1 text-sm font-semibold text-white"
          style={{ backgroundColor: photo.owner_color }}
        >
          {photo.owner_name}
        </span>
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 px-3 py-1.5 text-white"
        >
          Chiudi ✕
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-2">
        {index > 0 && (
          <button
            onClick={() => onNavigate(index - 1)}
            className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-white sm:left-4"
            aria-label="Foto precedente"
          >
            ‹
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={`Foto di ${photo.owner_name}`}
          className="max-h-[75vh] max-w-full rounded-lg object-contain"
        />

        {index < photos.length - 1 && (
          <button
            onClick={() => onNavigate(index + 1)}
            className="absolute right-2 z-10 rounded-full bg-white/10 p-3 text-white sm:right-4"
            aria-label="Foto successiva"
          >
            ›
          </button>
        )}
      </div>

      <div className="flex justify-center pb-6 pt-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-full bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          {downloading ? "Preparazione..." : "⬇️ Scarica originale"}
        </button>
      </div>
    </div>
  );
}
