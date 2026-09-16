import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { AliceBlueError, fetchAliceQuote, readAliceSession } from "@/lib/alice-blue";
import { rateLimit } from "@/lib/rate-limit";
import { nseTicker } from "@/lib/nse-symbol";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`alice-quote:${ip}`, 40, 60_000);
    if (!limited.success) return jsonError("Too many quote refreshes. Try later.", 429);

    const session = await readAliceSession();
    if (!session) {
      return jsonError("Connect Alice Blue to load live LTP.", 401);
    }

    const symbol = nseTicker(new URL(request.url).searchParams.get("symbol") ?? "");
    if (!symbol) return jsonError("Add an NSE symbol to quote.", 400);
    if (symbol.length > 20) return jsonError("Symbol is too long.", 400);

    const quote = await fetchAliceQuote(symbol, session);
    return jsonOk({ quote });
  } catch (error) {
    if (error instanceof AliceBlueError) {
      const status = error.code === "not-connected" || error.code === "session" ? 401 : 502;
      return jsonError(error.message, status);
    }
    return handleApiError(error);
  }
}
