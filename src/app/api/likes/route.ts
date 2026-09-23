import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { photo_id, device_id } = await req.json();

    if (!photo_id || !device_id) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("likes")
      .select("id")
      .eq("photo_id", photo_id)
      .eq("device_id", device_id)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);
      return NextResponse.json({ error: "Errore nel controllo like" }, { status: 500 });
    }

    if (existing) {
      const { error } = await supabaseAdmin.from("likes").delete().eq("id", existing.id);
      if (error) {
        return NextResponse.json({ error: "Errore rimozione like" }, { status: 500 });
      }
      return NextResponse.json({ liked: false });
    } else {
      const { error } = await supabaseAdmin
        .from("likes")
        .insert({ photo_id, device_id });
      if (error) {
        console.error(error);
        return NextResponse.json({ error: "Errore aggiunta like" }, { status: 500 });
      }
      return NextResponse.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }
}
