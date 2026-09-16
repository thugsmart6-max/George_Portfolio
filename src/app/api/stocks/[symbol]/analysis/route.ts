import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { loadNseAnalysis } from "@/lib/alice-analysis";
import { explainNseAnalysis } from "@/lib/analysis-ai";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  context: { params: Promise<{ symbol: string }> }
) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`stocks-analysis:${ip}`, 24, 60_000);
    if (!limited.success) return jsonError("Too many analysis refreshes. Try later.", 429);

    const { symbol } = await context.params;
    const result = await loadNseAnalysis(symbol);
    if (!result.ok) return jsonError(result.message, result.status);

    const insight = await explainNseAnalysis(result.analysis).catch(() => null);
    return jsonOk({ ...result.analysis, insight });
  } catch (error) {
    return handleApiError(error);
  }
}
