import { resetPasswordSchema } from "@/validators/auth";
import { resetPasswordWithToken } from "@/services/user-service";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = resetPasswordSchema.parse(body);
    const ok = await resetPasswordWithToken(input.token, input.password);
    if (!ok) return jsonError("Invalid or expired reset link.", 400);
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
