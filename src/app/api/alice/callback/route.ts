import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ALICE_NEXT_COOKIE,
  ALICE_SESSION_COOKIE,
  cookieOptions,
  encodeAliceSession,
  exchangeAliceAuth,
  safeAliceNext,
  sessionMaxAge,
} from "@/lib/alice-blue";
import { rateLimit } from "@/lib/rate-limit";

function redirectWith(origin: string, next: string, alice: "connected" | "error", reason?: string) {
  const dest = new URL(safeAliceNext(next), origin);
  dest.searchParams.set("alice", alice);
  if (reason) dest.searchParams.set("reason", reason);
  return NextResponse.redirect(dest);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const store = await cookies();
  const destPath = safeAliceNext(
    decodeURIComponent(store.get(ALICE_NEXT_COOKIE)?.value || "")
  );

  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`alice-callback:${ip}`, 20, 60_000);
    if (!limited.success) {
      return redirectWith(url.origin, destPath, "error", "Too many Alice Blue attempts. Try later.");
    }

    const authCode = url.searchParams.get("authCode") ?? url.searchParams.get("authcode") ?? "";
    const userId = url.searchParams.get("userId") ?? url.searchParams.get("userid") ?? "";
    const aliceError = url.searchParams.get("emsg") ?? url.searchParams.get("error") ?? "";

    if (aliceError || !authCode || !userId) {
      const res = redirectWith(
        url.origin,
        destPath,
        "error",
        aliceError || "Alice Blue login did not return an auth code. Connect again."
      );
      res.cookies.set(ALICE_NEXT_COOKIE, "", cookieOptions(0));
      return res;
    }

    const session = await exchangeAliceAuth(authCode, userId);
    const res = redirectWith(url.origin, destPath, "connected");
    res.cookies.set(
      ALICE_SESSION_COOKIE,
      encodeAliceSession(session),
      cookieOptions(sessionMaxAge(session))
    );
    res.cookies.set(ALICE_NEXT_COOKIE, "", cookieOptions(0));
    return res;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Alice Blue could not complete login.";
    const res = redirectWith(url.origin, destPath, "error", message);
    res.cookies.set(ALICE_NEXT_COOKIE, "", cookieOptions(0));
    return res;
  }
}
