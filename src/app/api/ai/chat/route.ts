import { requireUser } from "@/lib/auth/require-user";
import { aiChatSchema } from "@/validators/finance";
import { getDashboardData } from "@/services/dashboard-service";
import { listGoals } from "@/services/goal-service";
import { chatWithCoach } from "@/services/ai-service";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;

    const limited = rateLimit(`ai:${auth.session.userId}`, 30, 60_000);
    if (!limited.success) return jsonError("Too many AI requests. Slow down.", 429);

    const body = await request.json();
    const input = aiChatSchema.parse(body);
    const data = await getDashboardData(auth.session.userId);
    if (!data) return jsonError("Financial context unavailable", 400);
    const goals = await listGoals(auth.session.userId);

    const result = await chatWithCoach(
      auth.session.userId,
      input.message,
      {
        profile: data.profile,
        metrics: data.metrics,
        wealthScore: data.wealthScore,
        goals,
        projections: data.goals,
      },
      input.conversationId
    );

    return jsonOk(result);
  } catch (error) {
    return handleApiError(error);
  }
}
