import {
  AliceBlueError,
  fetchAliceOhlcv,
  fetchAliceQuote,
  readAliceSession,
  resolveNseEquity,
} from "@/lib/alice-blue";
import { attachFundamentals, buildNseAnalysis, type NseAnalysis } from "@/lib/analysis-engine";
import { fundamentalDataProvider } from "@/lib/fundamental-provider";
import type { Bar } from "@/lib/market-indicators";

const cache = new Map<string, { at: number; value: NseAnalysis }>();
const TTL = 25_000;

async function finish(analysis: NseAnalysis, symbol: string) {
  const fund = await fundamentalDataProvider.getByNseSymbol(symbol).catch(() => null);
  return attachFundamentals(analysis, fund);
}

export async function loadNseAnalysis(rawSymbol: string): Promise<
  | { ok: true; analysis: NseAnalysis }
  | { ok: false; status: number; message: string }
> {
  const resolved = await resolveNseEquity(rawSymbol);
  if (!resolved.ok) {
    return { ok: false, status: resolved.code === "empty" ? 400 : 404, message: resolved.message };
  }

  const session = await readAliceSession();
  if (!session) {
    const analysis = await finish(
      buildNseAnalysis({
        instrument: resolved.instrument,
        quote: null,
        bars: [],
        connected: false,
      }),
      resolved.instrument.symbol
    );
    return { ok: true, analysis };
  }

  const cacheKey = `${session.userId}:${resolved.instrument.symbol}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < TTL) {
    return { ok: true, analysis: hit.value };
  }

  try {
    const [quote, candles] = await Promise.all([
      fetchAliceQuote(resolved.instrument.symbol, session).catch(() => null),
      fetchAliceOhlcv(resolved.instrument.token, 800, "D", session),
    ]);

    const bars: Bar[] = candles.map((row) => ({
      t: row.t,
      time: row.time,
      o: row.open,
      h: row.high,
      l: row.low,
      c: row.close,
      v: row.volume,
    }));

    const analysis = await finish(
      buildNseAnalysis({
        instrument: resolved.instrument,
        quote,
        bars,
        connected: true,
      }),
      resolved.instrument.symbol
    );
    cache.set(cacheKey, { at: Date.now(), value: analysis });
    return { ok: true, analysis };
  } catch (error) {
    if (error instanceof AliceBlueError) {
      if (error.code === "not-connected" || error.code === "session") {
        const analysis = await finish(
          buildNseAnalysis({
            instrument: resolved.instrument,
            quote: null,
            bars: [],
            connected: false,
          }),
          resolved.instrument.symbol
        );
        analysis.metadata.notes = [
          error.message || "Connect Alice Blue to load live NSE market data.",
          ...analysis.metadata.notes,
        ];
        return { ok: true, analysis };
      }
      return { ok: false, status: 502, message: error.message };
    }
    return { ok: false, status: 502, message: "Unable to retrieve market data right now. Please try again." };
  }
}
