"use client";

import { Photo } from "@/lib/types";
import PhotoCard from "./PhotoCard";

type Props = {
  photos: Photo[];
  deviceId: string;
  isAdmin?: boolean;
  onOpen: (index: number) => void;
  onToggleLike: (photoId: string) => void;
  onDelete: (photoId: string) => void;
};

export default function PhotoGrid({
  photos,
  deviceId,
  isAdmin = false,
  onOpen,
  onToggleLike,
  onDelete,
}: Props) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
        <p className="text-4xl">📷</p>
        <p className="mt-3 text-lg font-medium">Nessuna foto ancora</p>
        <p className="text-sm">Sii il primo a immortalare questo momento!</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
      {photos.map((photo, i) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          canDelete={isAdmin || photo.owner_device_id === deviceId}
          onOpen={() => onOpen(i)}
          onToggleLike={() => onToggleLike(photo.id)}
          onDelete={() => onDelete(photo.id)}
        />
      ))}
    </div>
  );
}
