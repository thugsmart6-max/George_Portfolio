import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { fetchAliceQuote, readAliceSession, searchAliceNse } from "@/lib/alice-blue";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`stocks-search:${ip}`, 40, 60_000);
    if (!limited.success) return jsonError("Too many searches. Try later.", 429);

    const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
    if (q.length < 1) return jsonOk({ results: [] });
    if (q.length > 40) return jsonError("Search is too long.", 400);
    if (/\.BO\b/i.test(q) || /\bBSE\b/i.test(q)) {
      return jsonOk({
        results: [],
        notice: "This analysis currently supports NSE equities only.",
      });
    }

    const results = await searchAliceNse(q);
    const session = await readAliceSession();
    if (session) {
      const priced = await Promise.all(
        results.slice(0, 6).map(async (hit) => {
          const quote = await fetchAliceQuote(hit.symbol, session).catch(() => null);
          return { ...hit, ltp: quote?.ltp ?? null };
        })
      );
      const rest = results.slice(6).map((hit) => ({ ...hit, ltp: null as number | null }));
      return jsonOk({ results: [...priced, ...rest] });
    }

    return jsonOk({ results: results.map((hit) => ({ ...hit, ltp: null })) });
  } catch (error) {
    return handleApiError(error);
  }
}
