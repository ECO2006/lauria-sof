"use client";

import { Photo } from "@/lib/types";

type Props = {
  photo: Photo;
  canDelete: boolean;
  onOpen: () => void;
  onToggleLike: () => void;
  onDelete: () => void;
};

export default function PhotoCard({ photo, canDelete, onOpen, onToggleLike, onDelete }: Props) {
  return (
    <div
      className="group relative mb-3 break-inside-avoid overflow-hidden rounded-xl bg-slate-900 shadow-lg animate-[fadeInUp_0.5s_ease-out]"
      style={{ border: `3px solid ${photo.owner_color}` }}
    >
      <button onClick={onOpen} className="block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={`Foto di ${photo.owner_name}`}
          loading="lazy"
          className="w-full object-cover"
        />
      </button>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-2.5 pt-6">
        <span
          className="max-w-[60%] truncate rounded-full px-2.5 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: photo.owner_color }}
        >
          {photo.owner_name}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleLike}
            className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm transition active:scale-90"
          >
            <span>{photo.liked_by_me ? "❤️" : "🤍"}</span>
            <span>{photo.likes_count}</span>
          </button>

          {canDelete && (
            <button
              onClick={onDelete}
              className="rounded-full bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm transition active:scale-90"
              aria-label="Elimina foto"
              title="Elimina la tua foto"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
