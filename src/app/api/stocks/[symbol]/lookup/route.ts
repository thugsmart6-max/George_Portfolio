import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import {
  AliceBlueError,
  fetchAliceQuote,
  readAliceSession,
  resolveNseEquity,
  searchAliceNse,
} from "@/lib/alice-blue";
import { fundamentalDataProvider } from "@/lib/fundamental-provider";
import { nseTicker } from "@/lib/nse-symbol";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  context: { params: Promise<{ symbol: string }> }
) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`stocks-lookup:${ip}`, 40, 60_000);
    if (!limited.success) return jsonError("Too many lookups. Try later.", 429);

    const { symbol: raw } = await context.params;
    const ticker = nseTicker(decodeURIComponent(raw));
    if (!ticker) return jsonError("Add an NSE symbol.", 400);

    let resolved = await resolveNseEquity(ticker);
    if (!resolved.ok) {
      const hits = await searchAliceNse(ticker).catch(() => []);
      const hit = hits[0];
      if (hit?.symbol) resolved = await resolveNseEquity(hit.symbol);
    }
    if (!resolved.ok) {
      return jsonError(resolved.message, resolved.code === "empty" ? 400 : 404);
    }

    const key = resolved.instrument.symbol;
    const session = await readAliceSession();
    const [quote, fund] = await Promise.all([
      session ? fetchAliceQuote(key, session).catch(() => null) : Promise.resolve(null),
      fundamentalDataProvider.getByNseSymbol(key).catch(() => null),
    ]);

    const aliceLtp = quote?.ltp ?? null;
    const screenerPx = fund?.price ?? null;
    const ltp = aliceLtp ?? screenerPx;
    const ltpSource = aliceLtp != null ? "alice-blue" : screenerPx != null ? "screener" : null;

    return jsonOk({
      symbol: key,
      name: quote?.name || fund?.name || resolved.instrument.name,
      ltp,
      ltpSource,
      changePct: quote?.changePct ?? null,
      pe: fund?.pe ?? null,
      marketCapCr: fund?.marketCapCr ?? null,
      connected: Boolean(session),
      url: fund?.url ?? null,
    });
  } catch (error) {
    if (error instanceof AliceBlueError) {
      const status = error.code === "not-connected" || error.code === "session" ? 401 : 502;
      return jsonError(error.message, status);
    }
    return handleApiError(error);
  }
}
