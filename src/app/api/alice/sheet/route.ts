import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { AliceBlueError, fetchAliceMarketSheet, readAliceSession } from "@/lib/alice-blue";
import { nseTicker } from "@/lib/nse-symbol";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`alice-sheet:${ip}`, 30, 60_000);
    if (!limited.success) return jsonError("Too many sheet refreshes. Try later.", 429);

    const symbol = nseTicker(new URL(request.url).searchParams.get("symbol") ?? "");
    if (!symbol) return jsonError("Add an NSE symbol.", 400);

    const connected = Boolean(await readAliceSession());
    const sheet = await fetchAliceMarketSheet(symbol);
    return jsonOk({ connected, sheet });
  } catch (error) {
    if (error instanceof AliceBlueError) {
      const status = error.code === "not-connected" || error.code === "session" ? 401 : 502;
      return jsonError(error.message, status);
    }
    return handleApiError(error);
  }
}
