import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, PHOTOS_BUCKET } from "@/lib/supabaseAdmin";
import { isAdminRequest } from "@/lib/adminAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = isAdminRequest(req);

  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("device_id") || "";

  const { data: photo, error: fetchError } = await supabaseAdmin
    .from("photos")
    .select("id, storage_path, owner_device_id")
    .eq("id", id)
    .single();

  if (fetchError || !photo) {
    return NextResponse.json({ error: "Foto non trovata" }, { status: 404 });
  }

  if (!admin && photo.owner_device_id !== deviceId) {
    return NextResponse.json(
      { error: "Non puoi eliminare foto di altri utenti" },
      { status: 403 }
    );
  }

  const { error: storageError } = await supabaseAdmin.storage
    .from(PHOTOS_BUCKET)
    .remove([photo.storage_path]);

  if (storageError) {
    console.error("Errore eliminazione file storage:", storageError);
  }

  const { error: deleteError } = await supabaseAdmin
    .from("photos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error(deleteError);
    return NextResponse.json({ error: "Errore durante l'eliminazione" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
