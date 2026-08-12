import { registerSchema } from "@/validators/auth";
import { registerUser } from "@/services/user-service";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`register:${ip}`, 10, 60_000);
    if (!limited.success) return jsonError("Too many attempts. Try later.", 429);

    const body = await request.json();
    const input = registerSchema.parse(body);
    const user = await registerUser(input);

    const token = await createSessionToken({
      sub: user.id,
      userId: user.userId,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(token);

    return jsonOk({ user }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return jsonError("An account with this email already exists.", 409);
    }
    return handleApiError(error);
  }
}
