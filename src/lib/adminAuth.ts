import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "laurea_sofia_admin";

export function isAdminRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!cookie || !secret) return false;
  return cookie === secret;
}
