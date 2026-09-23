"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Photo } from "@/lib/types";
import { getDeviceId, getIdentity } from "@/lib/identity";
import NameColorSetup from "@/components/NameColorSetup";
import Header from "@/components/Header";
import PhotoGrid from "@/components/PhotoGrid";
import CameraCapture from "@/components/CameraCapture";
import Lightbox from "@/components/Lightbox";
import DownloadAllButton from "@/components/DownloadAllButton";

const POLL_INTERVAL_MS = 4000;

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [identity, setIdentity] = useState<{ name: string; color: string } | null>(null);
  const [deviceId, setDeviceId] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDeviceId(getDeviceId());
    setIdentity(getIdentity());
    setReady(true);
  }, []);

  const fetchPhotos = useCallback(async () => {
    const id = getDeviceId();
    try {
      const res = await fetch(`/api/photos?device_id=${id}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setPhotos(data.photos);
    } catch (err) {
      console.error("Errore nel polling foto:", err);
    }
  }, []);

  useEffect(() => {
    if (!ready || !identity) return;
    fetchPhotos();
    pollRef.current = setInterval(fetchPhotos, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [ready, identity, fetchPhotos]);

  async function handleToggleLike(photoId: string) {
    // Aggiornamento ottimistico
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? {
              ...p,
              liked_by_me: !p.liked_by_me,
              likes_count: p.likes_count + (p.liked_by_me ? -1 : 1),
            }
          : p
      )
    );
    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_id: photoId, device_id: deviceId }),
      });
    } catch (err) {
      console.error(err);
      fetchPhotos();
    }
  }

  async function handleDelete(photoId: string) {
    if (!confirm("Eliminare questa foto?")) return;
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    try {
      await fetch(`/api/photos/${photoId}?device_id=${deviceId}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      fetchPhotos();
    }
  }

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-slate-950 pb-28">
      <Header photoCount={photos.length} />

      {!identity && (
        <NameColorSetup
          onComplete={(name, color) => setIdentity({ name, color })}
        />
      )}

      <div className="mx-auto max-w-6xl px-3 pt-6">
        <div className="mb-4 flex justify-end">
          <DownloadAllButton photos={photos} />
        </div>

        <PhotoGrid
          photos={photos}
          deviceId={deviceId}
          onOpen={(i) => setLightboxIndex(i)}
          onToggleLike={handleToggleLike}
          onDelete={handleDelete}
        />
      </div>

      {identity && (
        <CameraCapture
          deviceId={deviceId}
          name={identity.name}
          color={identity.color}
          onUploaded={fetchPhotos}
        />
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </main>
  );
}
