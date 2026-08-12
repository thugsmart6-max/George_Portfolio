import { requireUser } from "@/lib/auth/require-user";
import { getDashboardData } from "@/services/dashboard-service";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    const data = await getDashboardData(auth.session.userId);
    if (!data) return jsonError("Unable to load wealth data", 404);
    return jsonOk({
      metrics: data.metrics,
      wealthScore: data.wealthScore,
      goals: data.goals,
      insight: data.insight,
      snapshots: data.snapshots,
      assetAllocation: data.assetAllocation,
      debtBreakdown: data.debtBreakdown,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
