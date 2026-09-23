import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!adminPassword || !secret) {
      return NextResponse.json(
        { error: "Configurazione admin mancante sul server" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Password errata" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE_NAME, secret, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }
}
