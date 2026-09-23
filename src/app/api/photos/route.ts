import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, PHOTOS_BUCKET } from "@/lib/supabaseAdmin";
import { Photo } from "@/lib/types";

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get("device_id") || "";

  const { data: photos, error } = await supabaseAdmin
    .from("photos")
    .select("id, storage_path, owner_device_id, owner_name, owner_color, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento foto" }, { status: 500 });
  }

  const { data: likes, error: likesError } = await supabaseAdmin
    .from("likes")
    .select("photo_id, device_id");

  if (likesError) {
    console.error(likesError);
    return NextResponse.json({ error: "Errore nel caricamento like" }, { status: 500 });
  }

  const likeCountByPhoto = new Map<string, number>();
  const likedByMeSet = new Set<string>();
  for (const like of likes || []) {
    likeCountByPhoto.set(like.photo_id, (likeCountByPhoto.get(like.photo_id) || 0) + 1);
    if (deviceId && like.device_id === deviceId) {
      likedByMeSet.add(like.photo_id);
    }
  }

  const result: Photo[] = (photos || []).map((p) => {
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(PHOTOS_BUCKET)
      .getPublicUrl(p.storage_path);

    return {
      id: p.id,
      storage_path: p.storage_path,
      url: publicUrlData.publicUrl,
      owner_device_id: p.owner_device_id,
      owner_name: p.owner_name,
      owner_color: p.owner_color,
      created_at: p.created_at,
      likes_count: likeCountByPhoto.get(p.id) || 0,
      liked_by_me: likedByMeSet.has(p.id),
    };
  });

  return NextResponse.json({ photos: result });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storage_path, owner_device_id, owner_name, owner_color } = body;

    if (!storage_path || !owner_device_id || !owner_name || !owner_color) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("photos")
      .insert({
        storage_path,
        owner_device_id,
        owner_name: String(owner_name).slice(0, 60),
        owner_color,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Errore nel salvataggio" }, { status: 500 });
    }

    return NextResponse.json({ photo: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }
}
