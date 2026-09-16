import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { AliceBlueError, fetchAliceQuote, readAliceSession, resolveNseEquity } from "@/lib/alice-blue";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  context: { params: Promise<{ symbol: string }> }
) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`stocks-quote:${ip}`, 40, 60_000);
    if (!limited.success) return jsonError("Too many quote refreshes. Try later.", 429);

    const { symbol } = await context.params;
    const resolved = await resolveNseEquity(symbol);
    if (!resolved.ok) {
      return jsonError(resolved.message, resolved.code === "empty" ? 400 : 404);
    }

    const session = await readAliceSession();
    if (!session) return jsonError("Connect Alice Blue to load live LTP.", 401);

    const quote = await fetchAliceQuote(resolved.instrument.symbol, session);
    return jsonOk({
      stock: resolved.instrument,
      quote,
    });
  } catch (error) {
    if (error instanceof AliceBlueError) {
      const status = error.code === "not-connected" || error.code === "session" ? 401 : 502;
      return jsonError(error.message, status);
    }
    return handleApiError(error);
  }
}
