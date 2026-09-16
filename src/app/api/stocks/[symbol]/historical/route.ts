import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { AliceBlueError, fetchAliceOhlcv, readAliceSession, resolveNseEquity } from "@/lib/alice-blue";
import { rateLimit } from "@/lib/rate-limit";

const RANGES: Record<string, number> = {
  "1M": 40,
  "3M": 80,
  "6M": 140,
  "1Y": 280,
  "2Y": 800,
};

export async function GET(
  request: Request,
  context: { params: Promise<{ symbol: string }> }
) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`stocks-hist:${ip}`, 30, 60_000);
    if (!limited.success) return jsonError("Too many history refreshes. Try later.", 429);

    const { symbol } = await context.params;
    const range = new URL(request.url).searchParams.get("range") ?? "1Y";
    const days = RANGES[range] ?? RANGES["1Y"];

    const resolved = await resolveNseEquity(symbol);
    if (!resolved.ok) {
      return jsonError(resolved.message, resolved.code === "empty" ? 400 : 404);
    }

    const session = await readAliceSession();
    if (!session) return jsonError("Connect Alice Blue to load historical NSE prices.", 401);

    const bars = await fetchAliceOhlcv(resolved.instrument.token, days, "D", session);
    return jsonOk({
      stock: resolved.instrument,
      range,
      bars,
    });
  } catch (error) {
    if (error instanceof AliceBlueError) {
      const status = error.code === "not-connected" || error.code === "session" ? 401 : 502;
      return jsonError(error.message, status);
    }
    return handleApiError(error);
  }
}
