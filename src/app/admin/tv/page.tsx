"use client";

import { useEffect, useState, useCallback } from "react";
import { Photo } from "@/lib/types";

const SLIDE_INTERVAL_MS = 5000;
const POLL_INTERVAL_MS = 5000;

export default function TvModePage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.isAdmin))
      .finally(() => setChecking(false));
  }, []);

  const fetchPhotos = useCallback(async () => {
    const res = await fetch("/api/photos");
    if (!res.ok) return;
    const data = await res.json();
    setPhotos(data.photos);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPhotos();
    const interval = setInterval(fetchPhotos, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAdmin, fetchPhotos]);

  useEffect(() => {
    if (photos.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % photos.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [photos.length]);

  useEffect(() => {
    // Se arrivano nuove foto, evita indice fuori range
    if (current >= photos.length) setCurrent(0);
  }, [photos.length, current]);

  if (checking) return null;

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Accesso richiesto. Vai su /admin per effettuare il login.</p>
      </main>
    );
  }

  const photo = photos[current];

  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
      {!photo && (
        <p className="text-2xl text-white/60">In attesa delle prime foto...</p>
      )}

      {photo && (
        <>
          {/* Sfondo sfocato per riempire lo schermo senza tagliare la foto */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={photo.id}
            src={photo.url}
            alt={`Foto di ${photo.owner_name}`}
            className="relative z-10 max-h-[92vh] max-w-[92vw] rounded-xl object-contain shadow-2xl animate-[fadeInUp_0.6s_ease-out]"
            style={{ border: `6px solid ${photo.owner_color}` }}
          />

          <div
            className="absolute bottom-8 left-8 z-20 rounded-full px-5 py-2.5 text-xl font-bold text-white shadow-lg"
            style={{ backgroundColor: photo.owner_color }}
          >
            {photo.owner_name}
          </div>
        </>
      )}

      <div className="absolute right-6 top-6 z-20 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
        Laurea Sofia · {photos.length} foto
      </div>
    </main>
  );
}
