"use client";

import { useRef, useState } from "react";
import { supabaseClient, PHOTOS_BUCKET } from "@/lib/supabaseClient";

type Props = {
  deviceId: string;
  name: string;
  color: string;
  onUploaded: () => void;
};

type Status = "idle" | "preview" | "uploading" | "error";

export default function CameraCapture({ deviceId, name, color, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setStatus("preview");
  }

  function reset() {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setStatus("idle");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");

    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();

      const signRes = await fetch("/api/photos/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileExt: ext }),
      });
      if (!signRes.ok) throw new Error("Impossibile preparare l'upload");
      const { path, token } = await signRes.json();

      const { error: uploadError } = await supabaseClient.storage
        .from(PHOTOS_BUCKET)
        .uploadToSignedUrl(path, token, file, {
          contentType: file.type || "image/jpeg",
        });
      if (uploadError) throw uploadError;

      const createRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storage_path: path,
          owner_device_id: deviceId,
          owner_name: name,
          owner_color: color,
        }),
      });
      if (!createRes.ok) throw new Error("Errore nel salvataggio della foto");

      reset();
      onUploaded();
    } catch (err) {
      console.error(err);
      setErrorMsg("Upload non riuscito, riprova.");
      setStatus("error");
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-500 active:scale-95"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8a2 2 0 012-2h1.17a2 2 0 001.42-.59l.82-.82A2 2 0 0110.83 4h2.34a2 2 0 011.42.59l.82.82A2 2 0 0016.83 6H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="13" r="3.5" stroke="white" strokeWidth="2" />
        </svg>
        Scatta foto
      </button>

      {status !== "idle" && previewUrl && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-4">
          <div className="relative max-h-[65vh] w-full max-w-md overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Anteprima" className="w-full object-contain" />
          </div>

          {errorMsg && <p className="mt-3 text-sm text-red-400">{errorMsg}</p>}

          <div className="mt-5 flex w-full max-w-md gap-3">
            <button
              onClick={reset}
              disabled={status === "uploading"}
              className="flex-1 rounded-xl border border-white/20 py-3 font-medium text-white disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              onClick={handleUpload}
              disabled={status === "uploading"}
              className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white disabled:opacity-60"
            >
              {status === "uploading" ? "Caricamento..." : "Carica foto"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
