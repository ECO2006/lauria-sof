import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, PHOTOS_BUCKET } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { fileExt } = await req.json();

    const safeExt = (fileExt || "jpg").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) || "jpg";
    const path = `${crypto.randomUUID()}.${safeExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from(PHOTOS_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("Errore creazione signed URL:", error);
      return NextResponse.json(
        { error: "Impossibile preparare l'upload" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }
}
