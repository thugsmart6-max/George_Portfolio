import { NextResponse } from "next/server";

/** Public demo entry removed. */
export async function POST() {
  return NextResponse.json(
    { error: "Demo entry removed. Browse /advice or register." },
    { status: 410 }
  );
}
