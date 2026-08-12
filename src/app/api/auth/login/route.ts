import { loginSchema } from "@/validators/auth";
import { authenticateUser } from "@/services/user-service";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`login:${ip}`, 20, 60_000);
    if (!limited.success) return jsonError("Too many attempts. Try later.", 429);

    const body = await request.json();
    const input = loginSchema.parse(body);
    const user = await authenticateUser(input.email, input.password);
    if (!user) return jsonError("Invalid email or password.", 401);

    const token = await createSessionToken({
      sub: user.id,
      userId: user.userId,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(token);

    return jsonOk({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
