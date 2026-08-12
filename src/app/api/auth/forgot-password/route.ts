import { forgotPasswordSchema } from "@/validators/auth";
import { createPasswordResetToken } from "@/services/user-service";
import { handleApiError, jsonOk } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { jsonError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`forgot:${ip}`, 8, 60_000);
    if (!limited.success) return jsonError("Too many attempts. Try later.", 429);

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);
    const token = await createPasswordResetToken(email);

    // Never reveal whether email exists. In development, return token for testing.
    const payload: { success: true; resetToken?: string } = { success: true };
    if (process.env.NODE_ENV !== "production" && token) {
      payload.resetToken = token;
    }
    return jsonOk(payload);
  } catch (error) {
    return handleApiError(error);
  }
}
