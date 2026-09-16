import { nseTicker } from "@/lib/nse-symbol";
import { parseDay, todayIso, xirr, type CashFlow } from "@/lib/tracker-math";

export { todayIso };
export { nseTicker as nseKey } from "@/lib/nse-symbol";

export const LEDGER_KEY = "wbg-tracker-v3";
const LEGACY_KEY = "wbg-tracker-v2";
export const TRACKER_EVENT = "wbg-tracker-change";

export type OpenLot = {
  id: string;
  symbol: string;
  name: string;
  qty: number;
  buy: number;
  fees: number;
  boughtAt: string;
  current: number;
};

export type ClosedLot = {
  id: string;
  symbol: string;
  name: string;
  qty: number;
  buy: number;
  fees: number;
  boughtAt: string;
  soldAt: string;
  sell: number;
  sellFees: number;
};

export type TrackerBook = {
  opens: OpenLot[];
  closed: ClosedLot[];
};

export function money(n: number) {
  return Number.isFinite(n) ? n : 0;
}

export function notifyTracker() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TRACKER_EVENT));
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function asOpen(row: Partial<OpenLot> & { name?: string; kind?: unknown }): OpenLot | null {
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const symbol = nseTicker(typeof row.symbol === "string" ? row.symbol : name);
  if (!name || typeof row.id !== "string" || !symbol) return null;
  const qty = money(Number(row.qty));
  const buy = money(Number(row.buy));
  if (qty <= 0 || buy < 0) return null;
  return {
    id: row.id,
    symbol,
    name,
    qty,
    buy,
    fees: money(Number(row.fees)),
    boughtAt: typeof row.boughtAt === "string" && row.boughtAt ? row.boughtAt.slice(0, 10) : todayIso(),
    current: money(Number(row.current)) || buy,
  };
}

function migrateLegacy(): OpenLot[] {
  const parsed = readJson<unknown[]>(LEGACY_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const item = row as { id?: string; name?: string; qty?: number; buy?: number; current?: number };
      return asOpen({
        id: item.id,
        name: item.name,
        qty: item.qty,
        buy: item.buy,
        current: item.current,
        fees: 0,
        boughtAt: todayIso(),
      });
    })
    .filter((row): row is OpenLot => row != null);
}

export function emptyBook(): TrackerBook {
  return { opens: [], closed: [] };
}

export function readBook(): TrackerBook {
  const raw = readJson<unknown>(LEDGER_KEY, null);
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const rec = raw as { opens?: unknown; closed?: unknown };
    const opens = Array.isArray(rec.opens)
      ? rec.opens.map((row) => (row && typeof row === "object" ? asOpen(row as OpenLot) : null)).filter((row): row is OpenLot => row != null)
      : [];
    const closed = Array.isArray(rec.closed)
      ? rec.closed
          .map((row) => {
            if (!row || typeof row !== "object") return null;
            const item = row as Partial<ClosedLot>;
            const name = typeof item.name === "string" ? item.name.trim() : "";
            const symbol = nseTicker(typeof item.symbol === "string" ? item.symbol : name);
            if (!name || typeof item.id !== "string" || !symbol) return null;
            return {
              id: item.id,
              symbol,
              name,
              qty: money(Number(item.qty)),
              buy: money(Number(item.buy)),
              fees: money(Number(item.fees)),
              boughtAt: typeof item.boughtAt === "string" ? item.boughtAt.slice(0, 10) : todayIso(),
              soldAt: typeof item.soldAt === "string" ? item.soldAt.slice(0, 10) : todayIso(),
              sell: money(Number(item.sell)),
              sellFees: money(Number(item.sellFees)),
            } satisfies ClosedLot;
          })
          .filter((row): row is ClosedLot => row != null)
      : [];
    return { opens, closed };
  }

  const legacy = migrateLegacy();
  if (legacy.length) {
    const book = { opens: legacy, closed: [] as ClosedLot[] };
    writeBook(book);
    return book;
  }
  return emptyBook();
}

export function writeBook(book: TrackerBook) {
  localStorage.setItem(LEDGER_KEY, JSON.stringify(book));
  notifyTracker();
}

export function lotCost(lot: { qty: number; buy: number; fees: number }) {
  return lot.qty * lot.buy + lot.fees;
}

export function lotValue(lot: OpenLot) {
  return lot.qty * lot.current;
}

export function closedPnl(lot: ClosedLot) {
  return lot.qty * lot.sell - lot.sellFees - lotCost(lot);
}

export function bookCashFlows(book: TrackerBook, asOf = new Date()): CashFlow[] {
  const flows: CashFlow[] = [];
  for (const lot of book.opens) {
    const bought = parseDay(lot.boughtAt);
    if (bought) flows.push({ date: bought, amount: -lotCost(lot) });
  }
  for (const lot of book.closed) {
    const bought = parseDay(lot.boughtAt);
    const sold = parseDay(lot.soldAt);
    if (bought) flows.push({ date: bought, amount: -lotCost(lot) });
    if (sold) flows.push({ date: sold, amount: lot.qty * lot.sell - lot.sellFees });
  }
  const live = book.opens.reduce((sum, lot) => sum + lotValue(lot), 0);
  if (live > 0) flows.push({ date: asOf, amount: live });
  return flows;
}

export function bookXirr(book: TrackerBook) {
  return xirr(bookCashFlows(book));
}

export function symbolCashFlows(book: TrackerBook, symbol: string, asOf = new Date()) {
  const key = nseTicker(symbol);
  return bookCashFlows(
    {
      opens: book.opens.filter((lot) => lot.symbol === key),
      closed: book.closed.filter((lot) => lot.symbol === key),
    },
    asOf
  );
}

export function symbolXirr(book: TrackerBook, symbol: string) {
  return xirr(symbolCashFlows(book, symbol));
}

export function markOpen(lot: OpenLot, ltp: number | null | undefined): OpenLot {
  return typeof ltp === "number" && Number.isFinite(ltp) ? { ...lot, current: ltp } : lot;
}
