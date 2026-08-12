import { requireUser } from "@/lib/auth/require-user";
import { getLatestConversation } from "@/services/ai-service";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const conversation = await getLatestConversation(auth.session.userId);
    return jsonOk({ conversation });
  } catch (error) {
    return handleApiError(error);
  }
}
