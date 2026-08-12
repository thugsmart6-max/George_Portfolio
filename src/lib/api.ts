import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError("Validation failed", 422, error.flatten());
  }
  console.error(error);
  return jsonError("Something went wrong. Please try again.", 500);
}

export function serializeDoc<T extends { _id: { toString(): string }; toObject?: () => unknown }>(
  doc: T
) {
  const obj = (typeof doc.toObject === "function" ? doc.toObject() : doc) as Record<
    string,
    unknown
  >;
  const { _id, __v, passwordHash, resetTokenHash, ...rest } = obj;
  return {
    id: String(_id),
    ...rest,
  };
}
