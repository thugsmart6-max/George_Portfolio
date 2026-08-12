import { NextResponse } from "next/server";
import { getSession } from "./session";
import type { SessionPayload } from "@/types";

export async function requireUser(): Promise<
  | { session: SessionPayload; error?: never }
  | { session?: never; error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }
  return { session };
}
