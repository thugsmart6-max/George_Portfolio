import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { AliceBlueError, fetchAlicePortfolio, readAliceSession } from "@/lib/alice-blue";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`alice-holdings:${ip}`, 30, 60_000);
    if (!limited.success) return jsonError("Too many holdings refreshes. Try later.", 429);

    const session = await readAliceSession();
    if (!session) {
      return jsonError("Connect Alice Blue to load live holdings.", 401);
    }

    const portfolio = await fetchAlicePortfolio(session);
    return jsonOk(portfolio);
  } catch (error) {
    if (error instanceof AliceBlueError) {
      const status = error.code === "not-connected" || error.code === "session" ? 401 : 502;
      return jsonError(error.message, status);
    }
    return handleApiError(error);
  }
}
