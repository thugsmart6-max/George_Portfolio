import type { AliceHolding } from "@/lib/alice-types";

export type NseSearchHit = {
  symbol: string;
  nseSymbol: string;
  name: string;
  sector: string | null;
  industry: string | null;
};

export type NseQuote = {
  symbol: string;
  nseSymbol: string;
  name: string;
  exchange: "NSE";
  currency: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  previousClose: number | null;
  open: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  volume: number | null;
  avgVolume: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  rangePct: number | null;
  sma20: number | null;
  sma50: number | null;
  return1m: number | null;
  return6m: number | null;
  sector: string | null;
  industry: string | null;
  closes: number[];
  asOf: string | null;
  lotSize?: number | null;
  tickSize?: number | null;
  aliceToken?: string | null;
};

export type NseYearRow = {
  label: string;
  revenueCr: number;
  patCr: number;
};

export type NsePeer = {
  symbol: string;
  name: string;
  pe: number | null;
  price: number | null;
};

export type NseFundamentals = {
  marketCap: number | null;
  trailingPe: number | null;
  forwardPe: number | null;
  priceToBook: number | null;
  evEbitda: number | null;
  dividendYield: number | null;
  eps: number | null;
  bookValue: number | null;
  operatingMargin: number | null;
  profitMargin: number | null;
  grossMargin: number | null;
  revenueGrowth: number | null;
  earningsGrowth: number | null;
  roe: number | null;
  debtToEquity: number | null;
  totalRevenue: number | null;
  ebitda: number | null;
  totalCash: number | null;
  totalDebt: number | null;
  insiderPct: number | null;
  institutionPct: number | null;
  beta: number | null;
  analystMean: number | null;
  website: string | null;
  description: string | null;
  sector: string | null;
  industry: string | null;
  years: NseYearRow[];
  revenueCagr: number | null;
  patCagr: number | null;
};

export type NseSheet = {
  quote: NseQuote;
  fundamentals: NseFundamentals | null;
  peers: NsePeer[];
  holding?: AliceHolding | null;
};

function toCr(n: number | null) {
  if (n == null) return null;
  return n / 1_00_00_000;
}

export function formatNsePrice(n: number | null) {
  if (n == null) return "—";
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNsePct(n: number | null) {
  if (n == null) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function formatNseQty(n: number | null) {
  if (n == null) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_00_00_000) return `${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `${(n / 1_00_000).toFixed(2)} L`;
  return Math.round(n).toLocaleString("en-IN");
}

export function formatNseCr(n: number | null) {
  const cr = toCr(n);
  if (cr == null) return "—";
  return `₹${cr.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`;
}

export function formatNseX(n: number | null) {
  if (n == null) return "—";
  return `${n.toFixed(1)}x`;
}

export function formatNseRatioPct(n: number | null) {
  if (n == null) return "—";
  const pct = Math.abs(n) <= 1.5 ? n * 100 : n;
  return `${pct.toFixed(1)}%`;
}
