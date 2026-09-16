import { NextResponse } from "next/server";
import { jsonOk } from "@/lib/api";
import { ALICE_SESSION_COOKIE, cookieOptions } from "@/lib/alice-blue";

export async function POST() {
  const res = jsonOk({ success: true, connected: false });
  res.cookies.set(ALICE_SESSION_COOKIE, "", cookieOptions(0));
  return res;
}
