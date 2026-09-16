import { NextResponse } from "next/server";
import { handleApiError, jsonError } from "@/lib/api";
import {
  ALICE_NEXT_COOKIE,
  aliceConfig,
  aliceLoginUrl,
  cookieOptions,
  safeAliceNext,
} from "@/lib/alice-blue";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`alice-login:${ip}`, 20, 60_000);
    if (!limited.success) return jsonError("Too many Alice Blue login attempts. Try later.", 429);

    const url = new URL(request.url);
    const next = safeAliceNext(url.searchParams.get("next"));

    if (!aliceConfig().configured) {
      const dest = new URL(next, url.origin);
      dest.searchParams.set("alice", "error");
      dest.searchParams.set("reason", "Add Alice Blue App Code and API Secret in .env.local, then restart npm run dev.");
      return NextResponse.redirect(dest);
    }

    const res = NextResponse.redirect(aliceLoginUrl());
    res.cookies.set(ALICE_NEXT_COOKIE, encodeURIComponent(next), cookieOptions(10 * 60));
    return res;
  } catch (error) {
    return handleApiError(error);
  }
}
