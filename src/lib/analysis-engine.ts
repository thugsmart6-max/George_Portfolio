import type { CompanyFundamentals } from "@/lib/fundamental-provider";
import type { AliceQuote } from "@/lib/alice-types";
import type { NseInstrument } from "@/lib/alice-blue";
import {
  atr,
  bollinger,
  cagr,
  classicPivots,
  ema,
  historicalVolatility,
  last,
  macd,
  maxDrawdown,
  recoveryFromDrawdown,
  returnOver,
  rsi,
  sharpeZeroRf,
  sma,
  smaSeries,
  emaSeries,
  bollingerSeries,
  stochasticRsi,
  swings,
  type Bar,
} from "@/lib/market-indicators";

export type TrendLabel = "Strong Bullish" | "Bullish" | "Neutral" | "Bearish" | "Strong Bearish";
export type LevelStrength = "Strong" | "Medium";

export type AnalysisLevel = {
  price: number;
  strength: LevelStrength;
  why: string;
};

export type ScoreCategory = {
  id: string;
  label: string;
  score: number | null;
  weight: number;
  metrics: string[];
  explanation: string;
};

export type NseAnalysis = {
  stock: {
    symbol: string;
    name: string;
    exchange: "NSE";
    segment: "EQ";
    token: string;
  };
  quote: {
    ltp: number | null;
    previousClose: number | null;
    open: number | null;
    high: number | null;
    low: number | null;
    volume: number | null;
    change: number | null;
    changePct: number | null;
    asOf: string | null;
  };
  historical: {
    bars: { t: number; time: string; o: number; h: number; l: number; c: number; v: number }[];
    range: string;
  };
  technical: {
    sma20: number | null;
    sma50: number | null;
    sma100: number | null;
    sma200: number | null;
    ema20: number | null;
    ema50: number | null;
    ema200: number | null;
    rsi14: number | null;
    macd: number | null;
    macdSignal: number | null;
    macdHist: number | null;
    stochRsi: number | null;
    atr: number | null;
    bbUpper: number | null;
    bbMid: number | null;
    bbLower: number | null;
    histVol: number | null;
    avgVolume: number | null;
    volumeSma: number | null;
    relativeVolume: number | null;
    volumeChange: number | null;
    high52: number | null;
    low52: number | null;
    distHigh52: number | null;
    distLow52: number | null;
    swingHigh: number | null;
    swingLow: number | null;
    sma50Series: (number | null)[];
    sma200Series: (number | null)[];
    ema50Series: (number | null)[];
    bbUpperSeries: (number | null)[];
    bbMidSeries: (number | null)[];
    bbLowerSeries: (number | null)[];
  };
  trend: {
    label: TrendLabel;
    strength: number;
    reasons: { ok: boolean; text: string }[];
  };
  levels: {
    support: AnalysisLevel[];
    resistance: AnalysisLevel[];
  };
  returns: {
    d1: number | null;
    w1: number | null;
    m1: number | null;
    m3: number | null;
    m6: number | null;
    y1: number | null;
    cagr: number | null;
    volatility: number | null;
    maxDrawdown: number | null;
    recovery: number | null;
    sharpe: number | null;
  };
  risk: {
    level: "Low" | "Moderate" | "High" | "Severe" | "Unavailable";
    metrics: { label: string; value: string }[];
    explanation: string;
  };
  evidence: {
    technicalTrend: string;
    momentum: string;
    volatility: string;
    priceStructure: string;
    risk: string;
  };
  scorecard: {
    categories: ScoreCategory[];
    overall: number | null;
    availableWeight: number;
  };
  fundamentals: {
    available: boolean;
    message: string;
    source: string | null;
    url: string | null;
    about: string | null;
    keyPoints: string | null;
    marketCapCr: number | null;
    revenue: number | null;
    pat: number | null;
    eps: number | null;
    roe: number | null;
    roce: number | null;
    debt: number | null;
    pe: number | null;
    pb: number | null;
    bookValue: number | null;
    promoterHolding: number | null;
    dividendYield: number | null;
  };
  theory: {
    scope: string;
    blocks: { title: string; formula: string; applied: string; meaning: string }[];
  };
  metadata: {
    source: "Alice Blue";
    exchange: "NSE";
    segment: "EQ";
    updatedAt: string;
    connected: boolean;
    barCount: number;
    notes: string[];
  };
};

function fmt(n: number | null, digits = 2) {
  if (n == null || !Number.isFinite(n)) return "unavailable";
  return n.toFixed(digits);
}

function distPct(price: number | null, level: number | null, from: "high" | "low") {
  if (price == null || level == null || !level) return null;
  return from === "high" ? ((level - price) / level) * 100 : ((price - level) / level) * 100;
}

function clusterLevels(
  prices: number[],
  spot: number,
  side: "support" | "resistance"
): AnalysisLevel[] {
  const band = spot * 0.012;
  const groups: { sum: number; n: number; hits: number }[] = [];
  const sorted = [...prices].sort((a, b) => a - b);
  for (const price of sorted) {
    if (side === "support" && price >= spot * 0.995) continue;
    if (side === "resistance" && price <= spot * 1.005) continue;
    const found = groups.find((g) => Math.abs(g.sum / g.n - price) <= band);
    if (found) {
      found.sum += price;
      found.n += 1;
      found.hits += 1;
    } else {
      groups.push({ sum: price, n: 1, hits: 1 });
    }
  }
  return groups
    .map((g) => {
      const price = g.sum / g.n;
      return {
        price,
        strength: (g.hits >= 3 ? "Strong" : "Medium") as LevelStrength,
        why: g.hits >= 3 ? "Clustered swings" : "Recent swing",
      };
    })
    .sort((a, b) =>
      side === "support" ? b.price - a.price : a.price - b.price
    )
    .slice(0, 3);
}

export function buildNseAnalysis(input: {
  instrument: NseInstrument;
  quote: AliceQuote | null;
  bars: Bar[];
  connected: boolean;
}): NseAnalysis {
  const { instrument, quote, bars, connected } = input;
  const closes = bars.map((b) => b.c);
  const volumes = bars.map((b) => b.v);
  const spot = quote?.ltp ?? last(closes);
  const yearBars = bars.filter((b) => b.t >= Date.now() - 365 * 24 * 60 * 60 * 1000);
  const yearHigh = yearBars.length ? Math.max(...yearBars.map((b) => b.h), spot ?? 0) : last(closes);
  const yearLow = yearBars.length ? Math.min(...yearBars.map((b) => b.l), spot ?? 0) : last(closes);

  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  const sma100 = sma(closes, 100);
  const sma200 = sma(closes, 200);
  const ema20 = ema(closes, 20);
  const ema50 = ema(closes, 50);
  const ema200 = ema(closes, 200);
  const rsi14 = rsi(closes, 14);
  const macdPack = macd(closes);
  const stoch = stochasticRsi(closes);
  const atr14 = atr(bars, 14);
  const bb = bollinger(closes, 20, 2);
  const bbSeries = bollingerSeries(closes, 20, 2);
  const histVol = historicalVolatility(closes, 20);
  const volSma = sma(volumes, 20);
  const lastVol = last(volumes);
  const prevVol = volumes.length >= 2 ? volumes[volumes.length - 2]! : null;
  const relVol = lastVol != null && volSma ? lastVol / volSma : null;
  const volChg = lastVol != null && prevVol ? ((lastVol - prevVol) / (prevVol || 1)) * 100 : null;

  const swingList = swings(bars, 4);
  const lastHigh = [...swingList].reverse().find((s) => s.kind === "high")?.price ?? null;
  const lastLow = [...swingList].reverse().find((s) => s.kind === "low")?.price ?? null;

  const reasons = [
    {
      ok: spot != null && sma200 != null && spot > sma200,
      text:
        spot != null && sma200 != null
          ? `Price ${spot > sma200 ? "above" : "below"} SMA 200 (${fmt(sma200)})`
          : "SMA 200 unavailable",
    },
    {
      ok: sma50 != null && sma200 != null && sma50 > sma200,
      text:
        sma50 != null && sma200 != null
          ? `SMA 50 ${sma50 > sma200 ? "above" : "below"} SMA 200`
          : "SMA 50 / 200 unavailable",
    },
    {
      ok: rsi14 != null && rsi14 > 50,
      text: rsi14 != null ? `RSI(14) = ${fmt(rsi14, 1)}` : "RSI unavailable",
    },
    {
      ok: macdPack.histogram != null && macdPack.histogram > 0,
      text:
        macdPack.histogram != null
          ? `MACD histogram ${macdPack.histogram > 0 ? "positive" : "negative"} (${fmt(macdPack.histogram)})`
          : "MACD unavailable",
    },
    {
      ok: relVol != null && relVol >= 1,
      text: relVol != null ? `Relative volume = ${fmt(relVol, 2)}x` : "Volume confirmation unavailable",
    },
  ];
  const hits = reasons.filter((r) => r.ok).length;
  const known = reasons.filter((r) => !r.text.includes("unavailable")).length;
  let label: TrendLabel = "Neutral";
  if (known >= 3) {
    if (hits >= 4 && (rsi14 ?? 50) >= 55) label = "Strong Bullish";
    else if (hits >= 3) label = "Bullish";
    else if (hits <= 1 && (rsi14 ?? 50) <= 45) label = "Strong Bearish";
    else if (hits <= 2) label = "Bearish";
  }

  const support: AnalysisLevel[] = [];
  const resistance: AnalysisLevel[] = [];
  if (spot != null) {
    support.push(...clusterLevels(swingList.filter((s) => s.kind === "low").map((s) => s.price), spot, "support"));
    resistance.push(
      ...clusterLevels(swingList.filter((s) => s.kind === "high").map((s) => s.price), spot, "resistance")
    );
    if (sma50 && sma50 < spot) {
      support.push({ price: sma50, strength: "Medium", why: "SMA 50" });
    }
    if (sma200 && sma200 < spot) {
      support.push({ price: sma200, strength: "Strong", why: "SMA 200" });
    }
    if (sma50 && sma50 > spot) {
      resistance.push({ price: sma50, strength: "Medium", why: "SMA 50" });
    }
    if (sma200 && sma200 > spot) {
      resistance.push({ price: sma200, strength: "Strong", why: "SMA 200" });
    }
    const lastBar = last(bars);
    if (lastBar) {
      const piv = classicPivots(lastBar);
      if (piv.s1 < spot) support.push({ price: piv.s1, strength: "Medium", why: "Classic pivot S1" });
      if (piv.r1 > spot) resistance.push({ price: piv.r1, strength: "Medium", why: "Classic pivot R1" });
    }
  }
  const uniq = (rows: AnalysisLevel[]) => {
    const seen = new Set<string>();
    return rows
      .sort((a, b) => Math.abs((spot ?? 0) - a.price) - Math.abs((spot ?? 0) - b.price))
      .filter((row) => {
        const key = row.price.toFixed(1);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 3);
  };

  const dd = maxDrawdown(closes);
  const vol = histVol;
  let riskLevel: NseAnalysis["risk"]["level"] = "Unavailable";
  if (dd != null && vol != null) {
    const stress = Math.abs(dd) + vol;
    if (stress < 35) riskLevel = "Low";
    else if (stress < 55) riskLevel = "Moderate";
    else if (stress < 80) riskLevel = "High";
    else riskLevel = "Severe";
  } else if (dd != null) {
    riskLevel = Math.abs(dd) > 40 ? "High" : Math.abs(dd) > 20 ? "Moderate" : "Low";
  }

  const techScore = known
    ? Math.round((hits / Math.max(known, 1)) * 70 + (rsi14 != null ? Math.min(20, Math.max(0, (rsi14 - 40) * 0.8)) : 0) + (relVol && relVol > 1 ? 10 : 0))
    : null;
  const clampedTech = techScore != null ? Math.max(5, Math.min(95, techScore)) : null;

  const growthParts = [returnOver(closes, 21), returnOver(closes, 126), returnOver(closes, 252)].filter(
    (n): n is number => n != null
  );
  const growthScore =
    growthParts.length >= 2
      ? Math.max(5, Math.min(95, Math.round(50 + growthParts.reduce((s, n) => s + n, 0) / growthParts.length)))
      : null;

  const structureScore =
    spot != null && yearLow != null && yearHigh != null && yearHigh !== yearLow
      ? Math.round(((spot - yearLow) / (yearHigh - yearLow)) * 100)
      : null;

  const riskScore =
    riskLevel === "Unavailable"
      ? null
      : riskLevel === "Low"
        ? 78
        : riskLevel === "Moderate"
          ? 62
          : riskLevel === "High"
            ? 42
            : 28;

  const categories: ScoreCategory[] = [
    {
      id: "business",
      label: "Business Quality",
      score: null,
      weight: 0.18,
      metrics: [],
      explanation: "Fundamental data unavailable from Alice Blue.",
    },
    {
      id: "financial",
      label: "Financial Quality",
      score: null,
      weight: 0.18,
      metrics: [],
      explanation: "Fundamental data unavailable from Alice Blue.",
    },
    {
      id: "technical",
      label: "Technical Strength",
      score: clampedTech,
      weight: 0.22,
      metrics: [
        `RSI ${fmt(rsi14, 1)}`,
        `MACD hist ${fmt(macdPack.histogram)}`,
        `SMA trend ${label}`,
        `Rel volume ${fmt(relVol, 2)}x`,
      ],
      explanation:
        clampedTech == null
          ? "Insufficient historical data"
          : `Weighted from trend votes (${hits}/${known} available), RSI, MACD, and volume.`,
    },
    {
      id: "valuation",
      label: "Valuation",
      score: null,
      weight: 0.14,
      metrics: [],
      explanation: "P/E, P/B and similar fundamentals are not supplied by Alice Blue.",
    },
    {
      id: "risk",
      label: "Risk",
      score: riskScore,
      weight: 0.14,
      metrics: [
        `Max drawdown ${fmt(dd, 1)}%`,
        `HV ${fmt(vol, 1)}%`,
        `Avg volume ${fmt(volSma, 0)}`,
      ],
      explanation:
        riskScore == null
          ? "Insufficient historical data"
          : "Higher score means more comfortable tape (smaller drawdown / volatility) — not a buy call.",
    },
    {
      id: "growth",
      label: "Growth",
      score: growthScore,
      weight: 0.14,
      metrics: [
        `1M ${fmt(returnOver(closes, 21), 1)}%`,
        `6M ${fmt(returnOver(closes, 126), 1)}%`,
        `1Y ${fmt(returnOver(closes, 252), 1)}%`,
      ],
      explanation:
        growthScore == null
          ? "Insufficient historical data"
          : "From realised price returns over 1M / 6M / 1Y — not earnings growth.",
    },
  ];

  const usable = categories.filter((c) => c.score != null);
  const availableWeight = usable.reduce((s, c) => s + c.weight, 0);
  const overall =
    usable.length && availableWeight
      ? Math.round(usable.reduce((s, c) => s + (c.score as number) * c.weight, 0) / availableWeight)
      : null;

  const notes: string[] = [];
  if (!connected) notes.push("Connect Alice Blue for live LTP and history.");
  if (closes.length < 200) notes.push("SMA 200 and some long-horizon metrics need more history.");
  if (quote == null) notes.push("Live quote missing; last history close used where needed.");

  const momentum =
    rsi14 == null && macdPack.histogram == null
      ? "Unavailable"
      : rsi14 != null && rsi14 >= 55 && (macdPack.histogram ?? 0) > 0
        ? "Positive"
        : rsi14 != null && rsi14 <= 45 && (macdPack.histogram ?? 0) < 0
          ? "Negative"
          : "Neutral";

  const volLabel =
    vol == null ? "Unavailable" : vol > 40 ? "High" : vol > 22 ? "Moderate" : "Low";

  const structure =
    structureScore == null
      ? "Unavailable"
      : structureScore >= 70
        ? "Near 52-week high"
        : structureScore <= 30
          ? "Near 52-week low"
          : "Mid-range";

  return {
    stock: {
      symbol: instrument.symbol,
      name: instrument.name,
      exchange: "NSE",
      segment: "EQ",
      token: instrument.token,
    },
    quote: {
      ltp: quote?.ltp ?? spot ?? null,
      previousClose: quote?.previousClose ?? (closes.length >= 2 ? closes[closes.length - 2]! : null),
      open: quote?.open ?? last(bars)?.o ?? null,
      high: quote?.high ?? last(bars)?.h ?? null,
      low: quote?.low ?? last(bars)?.l ?? null,
      volume: quote?.volume ?? lastVol ?? null,
      change: quote?.change ?? null,
      changePct: quote?.changePct ?? returnOver(closes, 1),
      asOf: quote?.asOf ?? last(bars)?.time ?? null,
    },
    historical: {
      bars: bars.map((b) => ({ t: b.t, time: b.time, o: b.o, h: b.h, l: b.l, c: b.c, v: b.v })),
      range: "2Y",
    },
    technical: {
      sma20,
      sma50,
      sma100,
      sma200,
      ema20,
      ema50,
      ema200,
      rsi14,
      macd: macdPack.macd,
      macdSignal: macdPack.signal,
      macdHist: macdPack.histogram,
      stochRsi: stoch,
      atr: atr14,
      bbUpper: bb.upper,
      bbMid: bb.mid,
      bbLower: bb.lower,
      histVol,
      avgVolume: volSma,
      volumeSma: volSma,
      relativeVolume: relVol,
      volumeChange: volChg,
      high52: yearHigh ?? null,
      low52: yearLow ?? null,
      distHigh52: distPct(spot ?? null, yearHigh ?? null, "high"),
      distLow52: distPct(spot ?? null, yearLow ?? null, "low"),
      swingHigh: lastHigh,
      swingLow: lastLow,
      sma50Series: smaSeries(closes, 50),
      sma200Series: smaSeries(closes, 200),
      ema50Series: emaSeries(closes, 50),
      bbUpperSeries: bbSeries.upper,
      bbMidSeries: bbSeries.mid,
      bbLowerSeries: bbSeries.lower,
    },
    trend: { label, strength: known ? hits / known : 0, reasons },
    levels: { support: uniq(support), resistance: uniq(resistance) },
    returns: {
      d1: returnOver(closes, 1),
      w1: returnOver(closes, 5),
      m1: returnOver(closes, 21),
      m3: returnOver(closes, 63),
      m6: returnOver(closes, 126),
      y1: returnOver(closes, 252),
      cagr: cagr(closes, Math.min(252, closes.length - 1)),
      volatility: vol,
      maxDrawdown: dd,
      recovery: recoveryFromDrawdown(closes),
      sharpe: sharpeZeroRf(closes),
    },
    risk: {
      level: riskLevel,
      metrics: [
        { label: "Maximum drawdown", value: dd == null ? "Insufficient historical data" : `${fmt(dd, 1)}%` },
        { label: "1Y-style HV (20d ann.)", value: vol == null ? "Insufficient historical data" : `${fmt(vol, 1)}%` },
        { label: "Average volume (20d)", value: volSma == null ? "Insufficient historical data" : fmt(volSma, 0) },
      ],
      explanation:
        dd == null
          ? "Insufficient historical data"
          : `The stock has experienced a maximum historical drawdown of ${fmt(dd, 1)}% during the loaded Alice Blue series.`,
    },
    evidence: {
      technicalTrend: label,
      momentum,
      volatility: volLabel,
      priceStructure: structure,
      risk: riskLevel,
    },
    scorecard: { categories, overall, availableWeight },
    fundamentals: {
      available: false,
      message: "Fundamental data unavailable",
      source: null,
      url: null,
      about: null,
      keyPoints: null,
      marketCapCr: null,
      revenue: null,
      pat: null,
      eps: null,
      roe: null,
      roce: null,
      debt: null,
      pe: null,
      pb: null,
      bookValue: null,
      promoterHolding: null,
      dividendYield: null,
    },
    theory: {
      scope: `Every NSE equity uses the same formulas on that symbol’s Alice Blue OHLCV. ${instrument.symbol} is not read from a stored report.`,
      blocks: [
        {
          title: "Trend (SMA / EMA)",
          formula: "SMA(n) = average of the last n closing prices. EMA(n) weights recent closes more.",
          applied:
            spot != null
              ? `LTP ${fmt(spot)} vs SMA20 ${fmt(sma20)}, SMA50 ${fmt(sma50)}, SMA200 ${fmt(sma200)}. Trend label = ${label} from ${hits}/${known} available votes.`
              : "Insufficient historical data",
          meaning:
            "Price above a long SMA is treated as a bullish bias in trend theory; it is not a forecast and not a buy call.",
        },
        {
          title: "Momentum (RSI / MACD)",
          formula: "RSI(14) compares average up-closes to down-closes. MACD = EMA(12) − EMA(26); signal = EMA(9) of MACD.",
          applied: `RSI ${fmt(rsi14, 1)}. MACD ${fmt(macdPack.macd)}, signal ${fmt(macdPack.signal)}, histogram ${fmt(macdPack.histogram)}. Stochastic RSI ${fmt(stoch)}. Momentum = ${momentum}.`,
          meaning:
            "RSI above 50 means recent average gains beat losses. A positive MACD histogram means the MACD line is above its signal. Missing values stay unavailable.",
        },
        {
          title: "Volatility & volume",
          formula: "ATR(14) = average true range. HV ≈ annualised standard deviation of log returns × √252. Rel volume = last volume / SMA(volume, 20).",
          applied: `ATR ${fmt(atr14)}. HV ${fmt(histVol, 1)}%. Rel volume ${fmt(relVol, 2)}x. Volume change ${fmt(volChg, 1)}%.`,
          meaning:
            "High ATR/HV means wider typical daily moves. Rel volume ≥ 1 means the last session traded at or above its 20-day average.",
        },
        {
          title: "Price structure",
          formula: "52-week high/low from daily highs/lows in the last 365 days. Support/resistance from swing pivots, SMAs, and classic floor pivots.",
          applied: `52-week ${fmt(yearLow)} – ${fmt(yearHigh)}. Distance from high ${fmt(distPct(spot ?? null, yearHigh ?? null, "high"), 1)}%. Structure = ${structure}.`,
          meaning:
            "Near the 52-week high is tape strength, not valuation. Support/resistance are calculated zones from this series only.",
        },
        {
          title: "Returns, drawdown, risk",
          formula: "Period return = last close / close n sessions ago − 1. Max drawdown = worst peak-to-trough on the loaded closes. Sharpe uses daily returns with rf = 0.",
          applied: `1D ${fmt(returnOver(closes, 1), 2)}%, 1M ${fmt(returnOver(closes, 21), 2)}%, 1Y ${fmt(returnOver(closes, 252), 2)}%. CAGR ${fmt(cagr(closes, Math.min(252, closes.length - 1)), 2)}%. Max DD ${fmt(dd, 1)}%. Sharpe ${fmt(sharpeZeroRf(closes))}. Risk = ${riskLevel}.`,
          meaning:
            "These are realised path statistics for the bars Alice Blue returned. They are not expected returns or a target price.",
        },
        {
          title: "Scorecard (tape only)",
          formula: "Overall = weighted average of categories that have a score. Business, financials, and valuation stay null without a fundamental provider.",
          applied:
            overall == null
              ? "Insufficient historical data"
              : `Overall ${overall}/100 from available weight ${fmt(availableWeight * 100, 0)}%. Technical ${fmt(clampedTech, 0)}, risk ${fmt(riskScore, 0)}, growth ${fmt(growthScore, 0)}.`,
          meaning:
            "A technical score is not a quality rating of the company. Hardcoded lesson scores for a few teaching names are not used here.",
        },
      ],
    },
    metadata: {
      source: "Alice Blue",
      exchange: "NSE",
      segment: "EQ",
      updatedAt: new Date().toISOString(),
      connected,
      barCount: bars.length,
      notes,
    },
  };
}

function clampScore(n: number) {
  return Math.max(5, Math.min(95, Math.round(n)));
}

export function attachFundamentals(analysis: NseAnalysis, fund: CompanyFundamentals | null): NseAnalysis {
  if (!fund) return analysis;

  analysis.fundamentals = {
    available: true,
    message: `Company ratios from ${fund.source}. Live LTP remains Alice Blue.`,
    source: fund.source,
    url: fund.url,
    about: fund.about,
    keyPoints: fund.keyPoints,
    marketCapCr: fund.marketCapCr,
    revenue: fund.revenue,
    pat: fund.pat,
    eps: fund.eps,
    roe: fund.roe,
    roce: fund.roce,
    debt: fund.debt,
    pe: fund.pe,
    pb: fund.pb,
    bookValue: fund.bookValue,
    promoterHolding: fund.promoterHolding,
    dividendYield: fund.dividendYield,
  };

  const business =
    fund.about || fund.revenue != null || fund.roce != null
      ? clampScore(
          48 +
            (fund.about ? 12 : 0) +
            (fund.revenue != null ? 8 : 0) +
            (fund.roce != null ? Math.min(22, fund.roce * 0.7) : 0)
        )
      : null;
  const financial =
    fund.roe != null || fund.roce != null || fund.pat != null
      ? clampScore(
          40 +
            (fund.roe != null ? Math.min(28, fund.roe) : 0) +
            (fund.roce != null ? Math.min(20, fund.roce * 0.5) : 0) +
            (fund.pat != null && fund.pat > 0 ? 6 : 0)
        )
      : null;
  const valuation =
    fund.pe != null || fund.pb != null
      ? clampScore(
          (fund.pe == null ? 50 : fund.pe < 15 ? 82 : fund.pe < 25 ? 68 : fund.pe < 40 ? 52 : 34) -
            (fund.pb != null && fund.pb > 8 ? 8 : 0)
        )
      : null;

  for (const cat of analysis.scorecard.categories) {
    if (cat.id === "business" && business != null) {
      cat.score = business;
      cat.metrics = [
        fund.marketCapCr != null ? `Mcap ${fund.marketCapCr} Cr` : "",
        fund.revenue != null ? `Sales ${fund.revenue} Cr` : "",
        fund.roce != null ? `ROCE ${fund.roce}%` : "",
      ].filter(Boolean);
      cat.explanation = "From Screener.in about text, sales and ROCE — not a moat rating from Alice Blue.";
    }
    if (cat.id === "financial" && financial != null) {
      cat.score = financial;
      cat.metrics = [
        fund.roe != null ? `ROE ${fund.roe}%` : "",
        fund.roce != null ? `ROCE ${fund.roce}%` : "",
        fund.pat != null ? `PAT ${fund.pat} Cr` : "",
        fund.eps != null ? `EPS ${fund.eps}` : "",
      ].filter(Boolean);
      cat.explanation = "From Screener.in ROE, ROCE, PAT and EPS. Higher score means stronger reported returns, not a buy call.";
    }
    if (cat.id === "valuation" && valuation != null) {
      cat.score = valuation;
      cat.metrics = [
        fund.pe != null ? `P/E ${fund.pe}` : "",
        fund.pb != null ? `P/B ${fund.pb.toFixed(2)}` : "",
        fund.bookValue != null ? `Book ${fund.bookValue}` : "",
      ].filter(Boolean);
      cat.explanation = "From Screener.in P/E and book value. A lower multiple scores higher here — still not advice.";
    }
  }

  const usable = analysis.scorecard.categories.filter((c) => c.score != null);
  const availableWeight = usable.reduce((s, c) => s + c.weight, 0);
  analysis.scorecard.availableWeight = availableWeight;
  analysis.scorecard.overall =
    usable.length && availableWeight
      ? Math.round(usable.reduce((s, c) => s + (c.score as number) * c.weight, 0) / availableWeight)
      : null;
  analysis.metadata.notes = [...analysis.metadata.notes.filter((n) => !/fundamental/i.test(n)), `Fundamentals: ${fund.source}`];
  return analysis;
}
