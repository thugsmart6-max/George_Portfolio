import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { AliceBlueError, fetchAliceQuotes, readAliceSession } from "@/lib/alice-blue";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`alice-quotes:${ip}`, 20, 60_000);
    if (!limited.success) return jsonError("Too many quote refreshes. Try later.", 429);

    const session = await readAliceSession();
    if (!session) return jsonError("Connect Alice Blue to load live LTP.", 401);

    const raw = new URL(request.url).searchParams.get("symbols") ?? "";
    const symbols = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (!symbols.length) return jsonError("Add NSE symbols to quote.", 400);

    const quotes = await fetchAliceQuotes(symbols);
    return jsonOk({ quotes });
  } catch (error) {
    if (error instanceof AliceBlueError) {
      const status = error.code === "not-connected" || error.code === "session" ? 401 : 502;
      return jsonError(error.message, status);
    }
    return handleApiError(error);
  }
}
