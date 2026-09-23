"use client";

import { useEffect, useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Photo } from "@/lib/types";
import PhotoGrid from "@/components/PhotoGrid";
import Lightbox from "@/components/Lightbox";

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    setSiteUrl(window.location.origin);
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
    const interval = setInterval(fetchPhotos, 5000);
    return () => clearInterval(interval);
  }, [isAdmin, fetchPhotos]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsAdmin(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error || "Password errata");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAdmin(false);
  }

  async function handleDelete(photoId: string) {
    if (!confirm("Eliminare questa foto? (azione admin)")) return;
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
  }

  if (checking) return null;

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        >
          <h1 className="text-xl font-bold text-slate-900">Area Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Laurea Sofia — gestione galleria</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}

          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Accedi
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-3 pb-20 pt-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Area Admin — Laurea Sofia</h1>
            <p className="text-sm text-slate-400">{photos.length} foto totali</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/admin/tv"
              target="_blank"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
            >
              📺 Apri modalità TV
            </a>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
            >
              Esci
            </button>
          </div>
        </div>

        {siteUrl && (
          <div className="mt-6 flex flex-wrap items-center gap-5 rounded-2xl bg-white/5 p-5">
            <div className="rounded-xl bg-white p-3">
              <QRCodeSVG value={siteUrl} size={120} />
            </div>
            <div>
              <p className="font-medium">Condividi il sito con gli invitati</p>
              <p className="mt-1 max-w-md break-all text-sm text-slate-400">{siteUrl}</p>
            </div>
          </div>
        )}

        <div className="mt-8">
          <PhotoGrid
            photos={photos}
            deviceId=""
            isAdmin
            onOpen={(i) => setLightboxIndex(i)}
            onToggleLike={() => {}}
            onDelete={handleDelete}
          />
        </div>
      </div>

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
