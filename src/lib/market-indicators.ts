export type Bar = {
  t: number;
  time: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

export function last<T>(values: T[]): T | null {
  return values.length ? values[values.length - 1]! : null;
}

export function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((sum, n) => sum + n, 0) / period;
}

export function smaSeries(values: number[], period: number): (number | null)[] {
  return values.map((_, i) => {
    if (i + 1 < period) return null;
    const slice = values.slice(i + 1 - period, i + 1);
    return slice.reduce((sum, n) => sum + n, 0) / period;
  });
}

export function ema(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const k = 2 / (period + 1);
  let prev = values.slice(0, period).reduce((sum, n) => sum + n, 0) / period;
  for (let i = period; i < values.length; i++) {
    prev = values[i]! * k + prev * (1 - k);
  }
  return prev;
}

export function emaSeries(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = values.map(() => null);
  if (values.length < period) return out;
  const k = 2 / (period + 1);
  let prev = values.slice(0, period).reduce((sum, n) => sum + n, 0) / period;
  out[period - 1] = prev;
  for (let i = period; i < values.length; i++) {
    prev = values[i]! * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

export function rsi(values: number[], period = 14): number | null {
  if (values.length < period + 1) return null;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i]! - values[i - 1]!;
    if (diff >= 0) gain += diff;
    else loss -= diff;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i]! - values[i - 1]!;
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export function rsiSeries(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = values.map(() => null);
  if (values.length < period + 1) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i]! - values[i - 1]!;
    if (diff >= 0) gain += diff;
    else loss -= diff;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  const value = (g: number, l: number) => (l === 0 ? 100 : 100 - 100 / (1 + g / l));
  out[period] = value(avgGain, avgLoss);
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i]! - values[i - 1]!;
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    out[i] = value(avgGain, avgLoss);
  }
  return out;
}

export function macd(values: number[], fast = 12, slow = 26, signal = 9) {
  const emaFast = emaSeries(values, fast);
  const emaSlow = emaSeries(values, slow);
  const line = values.map((_, i) => {
    const a = emaFast[i];
    const b = emaSlow[i];
    return a != null && b != null ? a - b : null;
  });
  const compact = line.filter((n): n is number => n != null);
  const signalSeries = emaSeries(compact, signal);
  const macdLine = last(compact);
  const signalLine = last(signalSeries.filter((n): n is number => n != null));
  const histogram =
    macdLine != null && signalLine != null ? macdLine - signalLine : null;
  return { macd: macdLine, signal: signalLine, histogram };
}

export function stochasticRsi(values: number[], rsiPeriod = 14, stochPeriod = 14): number | null {
  const series = rsiSeries(values, rsiPeriod).filter((n): n is number => n != null);
  if (series.length < stochPeriod) return null;
  const slice = series.slice(-stochPeriod);
  const min = Math.min(...slice);
  const max = Math.max(...slice);
  const current = slice[slice.length - 1]!;
  if (max === min) return 50;
  return ((current - min) / (max - min)) * 100;
}

export function atr(bars: Bar[], period = 14): number | null {
  if (bars.length < period + 1) return null;
  const trs: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1]!;
    const cur = bars[i]!;
    trs.push(Math.max(cur.h - cur.l, Math.abs(cur.h - prev.c), Math.abs(cur.l - prev.c)));
  }
  if (trs.length < period) return null;
  return sma(trs, period);
}

export function bollinger(values: number[], period = 20, mult = 2) {
  const mid = sma(values, period);
  if (mid == null || values.length < period) {
    return { mid: null, upper: null, lower: null };
  }
  const slice = values.slice(-period);
  const variance = slice.reduce((sum, n) => sum + (n - mid) ** 2, 0) / period;
  const sd = Math.sqrt(variance);
  return { mid, upper: mid + mult * sd, lower: mid - mult * sd };
}

export function bollingerSeries(values: number[], period = 20, mult = 2) {
  const mid = smaSeries(values, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i + 1 < period || mid[i] == null) {
      upper.push(null);
      lower.push(null);
      continue;
    }
    const slice = values.slice(i + 1 - period, i + 1);
    const mean = mid[i]!;
    const variance = slice.reduce((sum, n) => sum + (n - mean) ** 2, 0) / period;
    const sd = Math.sqrt(variance);
    upper.push(mean + mult * sd);
    lower.push(mean - mult * sd);
  }
  return { mid, upper, lower };
}

export function historicalVolatility(values: number[], period = 20): number | null {
  if (values.length < period + 1) return null;
  const rets: number[] = [];
  const slice = values.slice(-(period + 1));
  for (let i = 1; i < slice.length; i++) {
    if (slice[i - 1]) rets.push(Math.log(slice[i]! / slice[i - 1]!));
  }
  if (rets.length < 2) return null;
  const mean = rets.reduce((s, n) => s + n, 0) / rets.length;
  const variance = rets.reduce((s, n) => s + (n - mean) ** 2, 0) / (rets.length - 1);
  return Math.sqrt(variance) * Math.sqrt(252) * 100;
}

export function returnOver(values: number[], sessions: number): number | null {
  if (values.length < sessions + 1) return null;
  const prev = values[values.length - 1 - sessions];
  const lastClose = values[values.length - 1];
  if (!prev || !lastClose) return null;
  return ((lastClose - prev) / prev) * 100;
}

export function cagr(values: number[], tradingDays: number): number | null {
  if (values.length < tradingDays + 1) return null;
  const start = values[values.length - 1 - tradingDays];
  const end = values[values.length - 1];
  if (!start || !end || start <= 0) return null;
  const years = tradingDays / 252;
  if (years <= 0) return null;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

export function maxDrawdown(values: number[]): number | null {
  if (values.length < 2) return null;
  let peak = values[0]!;
  let maxDd = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    if (peak > 0) maxDd = Math.min(maxDd, (v - peak) / peak);
  }
  return maxDd * 100;
}

export function recoveryFromDrawdown(values: number[]): number | null {
  if (values.length < 2) return null;
  let peak = values[0]!;
  let trough = values[0]!;
  let peakIdx = 0;
  let troughIdx = 0;
  let worst = 0;
  values.forEach((v, i) => {
    if (v > peak) {
      peak = v;
      peakIdx = i;
      trough = v;
      troughIdx = i;
    }
    if (v < trough) {
      trough = v;
      troughIdx = i;
    }
    const dd = peak > 0 ? (v - peak) / peak : 0;
    if (dd < worst) worst = dd;
  });
  const lastClose = values[values.length - 1]!;
  if (peak <= 0) return null;
  return ((lastClose - trough) / (peak - trough || lastClose)) * 100;
}

export function sharpeZeroRf(values: number[]): number | null {
  if (values.length < 30) return null;
  const rets: number[] = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1]) rets.push(values[i]! / values[i - 1]! - 1);
  }
  if (rets.length < 20) return null;
  const mean = rets.reduce((s, n) => s + n, 0) / rets.length;
  const variance = rets.reduce((s, n) => s + (n - mean) ** 2, 0) / (rets.length - 1);
  const std = Math.sqrt(variance);
  if (!std) return null;
  return (mean * 252) / (std * Math.sqrt(252));
}

export type SwingLevel = { price: number; kind: "high" | "low"; t: number };

export function swings(bars: Bar[], look = 4): SwingLevel[] {
  const out: SwingLevel[] = [];
  for (let i = look; i < bars.length - look; i++) {
    const h = bars[i]!.h;
    const l = bars[i]!.l;
    let isHigh = true;
    let isLow = true;
    for (let j = i - look; j <= i + look; j++) {
      if (j === i) continue;
      if (bars[j]!.h >= h) isHigh = false;
      if (bars[j]!.l <= l) isLow = false;
    }
    if (isHigh) out.push({ price: h, kind: "high", t: bars[i]!.t });
    if (isLow) out.push({ price: l, kind: "low", t: bars[i]!.t });
  }
  return out;
}

export function classicPivots(bar: Bar) {
  const p = (bar.h + bar.l + bar.c) / 3;
  const r1 = 2 * p - bar.l;
  const s1 = 2 * p - bar.h;
  const r2 = p + (bar.h - bar.l);
  const s2 = p - (bar.h - bar.l);
  return { p, r1, s1, r2, s2 };
}
