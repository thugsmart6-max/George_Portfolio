import { requireUser } from "@/lib/auth/require-user";
import { createGoal, getGoalProjections } from "@/services/goal-service";
import { goalSchema } from "@/validators/finance";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const data = await getGoalProjections(auth.session.userId);
    return jsonOk(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const body = await request.json();
    const data = goalSchema.parse(body);
    const goal = await createGoal(auth.session.userId, {
      name: data.name,
      targetAmount: data.targetAmount,
      currentSavings: data.currentSavings,
      targetDate: data.targetDate.toISOString(),
      monthlyContribution: data.monthlyContribution,
      priority: data.priority,
      category: data.category,
    });
    return jsonOk({ goal }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
