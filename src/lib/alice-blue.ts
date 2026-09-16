import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { nseTicker } from "@/lib/nse-symbol";
import type {
  AliceFunds,
  AliceHolding,
  AlicePortfolio,
  AliceQuote,
  AliceSearchHit,
  AliceStatus,
} from "@/lib/alice-types";
import type { NseQuote, NseSheet } from "@/lib/nse-format";

export class AliceBlueError extends Error {
  constructor(
    message: string,
    readonly code:
      | "not-configured"
      | "not-connected"
      | "auth"
      | "session"
      | "upstream" = "upstream"
  ) {
    super(message);
    this.name = "AliceBlueError";
  }
}

export const ALICE_SESSION_COOKIE = "ab_session";
export const ALICE_NEXT_COOKIE = "ab_next";

type AliceSession = {
  userSession: string;
  userId: string;
  clientId: string;
};

type ContractRow = {
  symbol: string;
  trading_symbol: string;
  formatted_ins_name: string;
  token: string;
  group_name: string;
  pdc?: string | number | null;
  lot_size?: string | number | null;
  tick_size?: string | number | null;
};

type CachedContracts = {
  at: number;
  bySymbol: Map<string, ContractRow>;
  rows: ContractRow[];
};

const CONTRACT_TTL_MS = 6 * 60 * 60 * 1000;
let nseContracts: CachedContracts | null = null;

function sha256Hex(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

let fileEnvCache: { at: number; values: Record<string, string> } | null = null;

function readLocalEnvFile() {
  if (fileEnvCache && Date.now() - fileEnvCache.at < 5000) return fileEnvCache.values;
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    const values: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      values[key] = value;
    }
    fileEnvCache = { at: Date.now(), values };
    return values;
  } catch {
    fileEnvCache = { at: Date.now(), values: {} };
    return {};
  }
}

function envValue(name: string, fallback = "") {
  const fromProcess = process.env[name]?.trim() || "";
  if (fromProcess) return fromProcess;
  return (readLocalEnvFile()[name] ?? fallback).trim();
}

export function aliceConfig() {
  const appCode = envValue("ALICE_BLUE_APP_CODE") || envValue("ALICEBLUE_APP_CODE");
  const apiSecret = envValue("ALICE_BLUE_API_SECRET") || envValue("ALICEBLUE_API_SECRET");
  const userId = envValue("ALICE_BLUE_USER_ID") || envValue("ALICEBLUE_USER_ID");
  const redirectUrl =
    envValue("ALICE_BLUE_REDIRECT_URL") || "http://localhost:3000/api/alice/callback";
  const baseUrl = envValue("ALICE_BLUE_BASE_URL") || "https://a3.aliceblueonline.com";
  const authUrl = envValue("ALICE_BLUE_AUTH_URL") || "https://ant.aliceblueonline.com";
  return {
    appCode,
    apiSecret,
    userId,
    redirectUrl,
    baseUrl: baseUrl.replace(/\/$/, ""),
    authUrl: authUrl.replace(/\/$/, ""),
    configured: Boolean(appCode && apiSecret),
  };
}

export function aliceLoginUrl() {
  const { appCode, authUrl, configured } = aliceConfig();
  if (!configured) {
    throw new AliceBlueError(
      "Alice Blue App Code and API Secret are missing in .env.local.",
      "not-configured"
    );
  }
  return `${authUrl}/?appcode=${encodeURIComponent(appCode)}`;
}

export function safeAliceNext(raw: string | null | undefined) {
  if (!raw) return "/resources/tracker";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) {
    return "/resources/tracker";
  }
  if (raw.startsWith("/api") || raw.startsWith("/_")) return "/resources/tracker";
  return raw;
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

function jwtExpiryMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: unknown;
    };
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function encodeAliceSession(session: AliceSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeAliceSession(raw: string | undefined | null): AliceSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Partial<AliceSession>;
    if (!parsed.userSession || !parsed.userId) return null;
    const exp = jwtExpiryMs(parsed.userSession);
    if (exp && exp < Date.now() + 30_000) return null;
    return {
      userSession: parsed.userSession,
      userId: parsed.userId,
      clientId: parsed.clientId || parsed.userId,
    };
  } catch {
    return null;
  }
}

export async function readAliceSession(): Promise<AliceSession | null> {
  const store = await cookies();
  return decodeAliceSession(store.get(ALICE_SESSION_COOKIE)?.value);
}

export async function getAliceStatus(): Promise<AliceStatus> {
  const session = await readAliceSession();
  return {
    configured: aliceConfig().configured,
    connected: Boolean(session),
    clientId: session?.clientId ?? null,
  };
}

export async function exchangeAliceAuth(authCode: string, userId: string): Promise<AliceSession> {
  const cfg = aliceConfig();
  if (!cfg.configured) {
    throw new AliceBlueError(
      "Alice Blue App Code and API Secret are missing in .env.local.",
      "not-configured"
    );
  }
  if (cfg.userId && cfg.userId !== userId) {
    throw new AliceBlueError(
      "This Alice Blue login does not match the User ID in .env.local.",
      "auth"
    );
  }

  const checkSum = sha256Hex(`${userId}${authCode}${cfg.apiSecret}`);
  const res = await fetch(`${cfg.baseUrl}/open-api/od/v1/vendor/getUserDetails`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ checkSum }),
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  const nested =
    json?.result && typeof json.result === "object"
      ? (json.result as Record<string, unknown>)
      : null;
  const stat = text(json?.stat || json?.status);
  const session = text(json?.userSession) || text(nested?.userSession);
  const clientId = text(json?.clientId) || text(nested?.clientId) || userId;

  if (!res.ok || (stat && !/^ok$/i.test(stat)) || !session) {
    throw new AliceBlueError(
      friendlyAliceMessage(text(json?.emsg || json?.message) || `Alice Blue login failed (${res.status}).`),
      "auth"
    );
  }

  return { userSession: session, userId, clientId };
}

export function sessionMaxAge(session: AliceSession) {
  const exp = jwtExpiryMs(session.userSession);
  if (!exp) return 60 * 60 * 12;
  return Math.max(60, Math.floor((exp - Date.now()) / 1000));
}

function friendlyAliceMessage(raw: string) {
  const msg = raw.toLowerCase();
  if (msg.includes("auth code") || msg.includes("invalid auth")) {
    return "Alice Blue login expired. Connect again.";
  }
  if (msg.includes("api key") || msg.includes("app code") || msg.includes("secret")) {
    return "Alice Blue app is not active yet, or the App Code / API Secret needs updating.";
  }
  if (msg.includes("ip")) {
    return "Alice Blue rejected this IP. Use the public IPv4 saved on the app, then reconnect.";
  }
  if (msg.includes("session") || msg.includes("unauthorized") || msg.includes("expired")) {
    return "Alice Blue session expired. Connect again.";
  }
  if (msg.includes("not login") || msg.includes("does not login")) {
    return "Alice Blue login did not complete. Connect again.";
  }
  return raw || "Alice Blue request failed.";
}

type AliceJson = {
  status?: string;
  stat?: string;
  message?: string;
  emsg?: string;
  result?: unknown;
};

async function aliceFetch(session: AliceSession, path: string, init?: RequestInit) {
  const { baseUrl } = aliceConfig();
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.userSession}`,
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as AliceJson | null;
  const stat = text(json?.status || json?.stat);
  const message = text(json?.emsg || json?.message);
  const failed = !res.ok || (stat && !/^ok$/i.test(stat));

  if (failed) {
    const empty =
      /no data|not found|no holding|no position/i.test(message) || res.status === 404;
    if (empty) return [];
    const code =
      res.status === 401 || /session|unauthorized|expired/i.test(message)
        ? "session"
        : "upstream";
    throw new AliceBlueError(friendlyAliceMessage(message || `Alice Blue ${path} failed.`), code);
  }

  return json?.result ?? json;
}

function asRows(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object");
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.result)) return asRows(record.result);
  }
  return [];
}

function holdingQty(row: Record<string, unknown>) {
  const total = num(row.totalQuantity);
  if (total && total !== 0) return total;
  return (num(row.dpQuantity) ?? 0) + (num(row.t1Quantity) ?? 0);
}

function toHolding(row: Record<string, unknown>): AliceHolding | null {
  const trading = text(row.nseTradingSymbol || row.tradingSymbol || row.symbol);
  const symbol = nseTicker(trading.replace(/-EQ$/i, ""));
  const qty = holdingQty(row);
  const buy = num(row.averageTradedPrice) ?? num(row.investedPrice) ?? 0;
  const ltp = num(row.ltp) ?? buy;
  if (!symbol || qty <= 0) return null;
  const invested = qty * buy;
  const value = qty * ltp;
  const pnl = value - invested;
  return {
    symbol,
    name: text(row.formattedInstrumentName) || symbol,
    product: text(row.product) || "CNC",
    qty,
    buy,
    ltp,
    invested,
    value,
    pnl,
    pnlPct: invested ? (pnl / invested) * 100 : 0,
  };
}

function toFunds(value: unknown): AliceFunds | null {
  const row = asRows(value)[0] ?? (value && typeof value === "object" ? (value as Record<string, unknown>) : null);
  if (!row) return null;
  return {
    tradingLimit: num(row.tradingLimit),
    openingCash: num(row.openingCashLimit),
    collateral: num(row.collateralMargin),
    utilized: num(row.utilizedMargin),
  };
}

export async function fetchAlicePortfolio(session?: AliceSession | null): Promise<AlicePortfolio> {
  const live = session ?? (await readAliceSession());
  if (!live) {
    throw new AliceBlueError("Connect Alice Blue to load holdings.", "not-connected");
  }

  const [cnc, mtf, funds] = await Promise.all([
    aliceFetch(live, "/open-api/od/v1/holdings/CNC").catch((error) => {
      if (error instanceof AliceBlueError && error.code === "session") throw error;
      return [];
    }),
    aliceFetch(live, "/open-api/od/v1/holdings/MTF").catch(() => []),
    aliceFetch(live, "/open-api/od/v1/limits/").catch(() => null),
  ]);

  const holdings = [...asRows(cnc), ...asRows(mtf)]
    .map(toHolding)
    .filter((row): row is AliceHolding => row != null);

  return {
    holdings,
    funds: toFunds(funds),
    asOf: new Date().toISOString(),
  };
}

async function loadNseContracts() {
  if (nseContracts?.rows && Date.now() - nseContracts.at < CONTRACT_TTL_MS) {
    return nseContracts;
  }

  const res = await fetch("https://v2api.aliceblueonline.com/restpy/contract_master?exch=NSE", {
    headers: { Accept: "application/json" },
    next: { revalidate: 21600 },
  });
  if (!res.ok) {
    throw new AliceBlueError("Could not load the NSE contract list from Alice Blue.", "upstream");
  }

  const json = (await res.json()) as { NSE?: ContractRow[] };
  const bySymbol = new Map<string, ContractRow>();
  const rows: ContractRow[] = [];
  const seen = new Set<string>();
  for (const row of json.NSE ?? []) {
    const symbol = text(row.symbol).toUpperCase();
    const trading = text(row.trading_symbol).toUpperCase();
    const equity = row.group_name === "EQ" || trading.endsWith("-EQ");
    if (!symbol || !row.token || !equity) continue;
    bySymbol.set(symbol, row);
    bySymbol.set(trading.replace(/-EQ$/, ""), row);
    if (!seen.has(symbol)) {
      seen.add(symbol);
      rows.push({ ...row, symbol, trading_symbol: trading, formatted_ins_name: text(row.formatted_ins_name) });
    }
  }

  nseContracts = { at: Date.now(), bySymbol, rows };
  return nseContracts;
}

async function findNseContract(symbol: string) {
  const ticker = nseTicker(symbol);
  if (!ticker) return null;
  const { bySymbol } = await loadNseContracts();
  return bySymbol.get(ticker) ?? null;
}

function parseTick(msg: Record<string, unknown>, symbol: string, name: string | null): AliceQuote | null {
  const ltp = num(msg.lp);
  if (ltp == null) return null;
  const previousClose = num(msg.c);
  const change = num(msg.cv);
  const changePct = num(msg.pc);
  return {
    symbol,
    name,
    ltp,
    change: change ?? (previousClose != null ? ltp - previousClose : null),
    changePct,
    previousClose,
    open: num(msg.o),
    high: num(msg.h),
    low: num(msg.l),
    volume: num(msg.v),
    asOf: new Date().toISOString(),
    source: "alice-blue",
  };
}

async function createWsSession(session: AliceSession) {
  await aliceFetch(session, "/open-api/od/v1/profile/createWsSess", {
    method: "POST",
    body: JSON.stringify({ source: "API", userId: session.userId }),
  }).catch(() => null);
}

async function openSocket(url: string) {
  const Ctor = (globalThis as { WebSocket?: { new (url: string): WebSocket } }).WebSocket;
  if (Ctor) return new Ctor(url);
  throw new AliceBlueError(
    "Live Alice Blue quotes need a Node runtime with WebSocket support.",
    "upstream"
  );
}

async function fetchWsQuote(session: AliceSession, token: string, symbol: string, name: string | null) {
  await createWsSession(session);
  const susertoken = sha256Hex(sha256Hex(session.userSession));
  const actid = `${session.clientId || session.userId}_API`;
  const urls = ["wss://ws1.aliceblueonline.com/NorenWS", "wss://ws2.aliceblueonline.com/NorenWS"];

  for (const url of urls) {
    const tick = await fetchWsQuoteAt(url, susertoken, actid, token, symbol, name);
    if (tick) return tick;
  }
  return null;
}

async function fetchWsQuoteAt(
  url: string,
  susertoken: string,
  actid: string,
  token: string,
  symbol: string,
  name: string | null
) {
  let ws: WebSocket;
  try {
    ws = await openSocket(url);
  } catch {
    return null;
  }

  return new Promise<AliceQuote | null>((resolve) => {
    let settled = false;
    const finish = (value: AliceQuote | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      resolve(value);
    };

    const timer = setTimeout(() => finish(null), 4000);

    ws.addEventListener("open", () => {
      ws.send(
        JSON.stringify({
          susertoken,
          t: "c",
          actid,
          uid: actid,
          source: "API",
        })
      );
    });

    ws.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(String((event as MessageEvent).data)) as Record<string, unknown>;
        if (text(msg.t) === "cf") {
          if (text(msg.k).toUpperCase() !== "OK") {
            finish(null);
            return;
          }
          ws.send(JSON.stringify({ k: `NSE|${token}`, t: "t" }));
          return;
        }
        if (text(msg.t) === "tk" || text(msg.t) === "tf") {
          const tick = parseTick(msg, symbol, name);
          if (tick) finish(tick);
        }
      } catch {
        /* ignore malformed ticks */
      }
    });

    ws.addEventListener("error", () => finish(null));
    ws.addEventListener("close", () => finish(null));
  });
}

async function fetchHistoryQuote(
  session: AliceSession,
  token: string,
  symbol: string,
  name: string | null
): Promise<AliceQuote | null> {
  const to = Date.now();
  const from = to - 400 * 24 * 60 * 60 * 1000;
  const json = await aliceFetch(session, "/open-api/od/ChartAPIService/api/chart/history", {
    method: "POST",
    body: JSON.stringify({
      token,
      resolution: "D",
      from: String(from),
      to: String(to),
      exchange: "NSE",
    }),
  }).catch(() => null);

  const rows = asRows(json);
  const last = rows.at(-1);
  const close = num(last?.close);
  if (!last || close == null) return null;
  const prev = num(rows.at(-2)?.close);
  return {
    symbol,
    name,
    ltp: close,
    change: prev != null ? close - prev : null,
    changePct: prev ? ((close - prev) / prev) * 100 : null,
    previousClose: prev,
    open: num(last.open),
    high: num(last.high),
    low: num(last.low),
    volume: num(last.volume),
    asOf: text(last.time) || new Date().toISOString(),
    source: "alice-blue",
  };
}

export async function fetchAliceQuote(symbol: string, session?: AliceSession | null): Promise<AliceQuote | null> {
  const live = session ?? (await readAliceSession());
  if (!live) {
    throw new AliceBlueError("Connect Alice Blue to load live LTP.", "not-connected");
  }

  const ticker = nseTicker(symbol);
  if (!ticker) return null;

  const contract = await findNseContract(ticker).catch(() => null);
  if (contract?.token) {
    const tick = await fetchWsQuote(live, contract.token, ticker, contract.formatted_ins_name).catch(
      () => null
    );
    if (tick) return tick;
    const history = await fetchHistoryQuote(live, contract.token, ticker, contract.formatted_ins_name);
    if (history) return history;
  }

  const portfolio = await fetchAlicePortfolio(live).catch(() => null);
  const held = portfolio?.holdings.find((row) => row.symbol === ticker);
  if (!held?.ltp) return null;

  return {
    symbol: ticker,
    name: held.name,
    ltp: held.ltp,
    change: null,
    changePct: null,
    previousClose: null,
    open: null,
    high: null,
    low: null,
    volume: null,
    asOf: portfolio?.asOf ?? new Date().toISOString(),
    source: "alice-blue",
  };
}

export async function searchAliceNse(query: string): Promise<AliceSearchHit[]> {
  const q = query.trim().toUpperCase();
  if (q.length < 1) return [];
  const { rows } = await loadNseContracts();
  const hits: AliceSearchHit[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    const symbol = row.symbol.toUpperCase();
    const name = (row.formatted_ins_name || symbol).toUpperCase();
    if (!symbol.includes(q) && !name.includes(q) && !row.trading_symbol.includes(q)) continue;
    if (seen.has(symbol)) continue;
    seen.add(symbol);
    hits.push({
      symbol,
      name: row.formatted_ins_name || symbol,
      exchange: "NSE",
      segment: "EQ",
    });
    if (hits.length >= 24) break;
  }
  hits.sort((a, b) => {
    const as = a.symbol === q ? 0 : a.symbol.startsWith(q) ? 1 : 2;
    const bs = b.symbol === q ? 0 : b.symbol.startsWith(q) ? 1 : 2;
    return as - bs || a.symbol.localeCompare(b.symbol);
  });
  return hits.slice(0, 12);
}

function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((sum, value) => sum + value, 0) / period;
}

function returnOver(values: number[], sessions: number): number | null {
  if (values.length < sessions + 1) return null;
  const prev = values[values.length - 1 - sessions];
  const last = values[values.length - 1];
  if (!prev || !last) return null;
  return ((last - prev) / prev) * 100;
}

type HistoryCandle = {
  time: string;
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

function candleTime(raw: string | number | null): { time: string; t: number } {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    const ms = raw < 1e12 ? raw * 1000 : raw;
    return { t: ms, time: new Date(ms).toISOString() };
  }
  const textTime = typeof raw === "string" ? raw : "";
  const parsed = Date.parse(textTime);
  if (Number.isFinite(parsed)) return { t: parsed, time: new Date(parsed).toISOString() };
  const asNum = Number(textTime);
  if (Number.isFinite(asNum) && asNum > 0) {
    const ms = asNum < 1e12 ? asNum * 1000 : asNum;
    return { t: ms, time: new Date(ms).toISOString() };
  }
  const now = Date.now();
  return { t: now, time: new Date(now).toISOString() };
}

async function fetchHistoryCandles(
  session: AliceSession,
  token: string,
  fromMs = Date.now() - 800 * 24 * 60 * 60 * 1000,
  resolution = "D"
): Promise<HistoryCandle[]> {
  const json = await aliceFetch(session, "/open-api/od/ChartAPIService/api/chart/history", {
    method: "POST",
    body: JSON.stringify({
      token,
      resolution,
      from: String(fromMs),
      to: String(Date.now()),
      exchange: "NSE",
    }),
  }).catch(() => null);

  return asRows(json)
    .map((row) => {
      const close = num(row.close);
      const high = num(row.high);
      const low = num(row.low);
      const open = num(row.open) ?? close;
      if (close == null || high == null || low == null || open == null) return null;
      const stamp = candleTime((row.time as string | number | null) ?? num(row.ts) ?? null);
      return {
        ...stamp,
        open,
        high,
        low,
        close,
        volume: num(row.volume) ?? 0,
      };
    })
    .filter((row): row is HistoryCandle => row != null)
    .sort((a, b) => a.t - b.t);
}

export type NseInstrument = {
  symbol: string;
  name: string;
  token: string;
  lotSize: number | null;
  tickSize: number | null;
  exchange: "NSE";
  segment: "EQ";
};

export type NseResolveFail = {
  ok: false;
  code: "empty" | "bse" | "not-nse";
  message: string;
};

export async function resolveNseEquity(
  input: string
): Promise<{ ok: true; instrument: NseInstrument } | NseResolveFail> {
  const raw = input.trim();
  if (!raw) {
    return {
      ok: false,
      code: "empty",
      message: "Add an NSE equity symbol to analyse.",
    };
  }
  if (/\.BO\b/i.test(raw) || /\bBSE\b/i.test(raw)) {
    return {
      ok: false,
      code: "bse",
      message: "This analysis currently supports NSE equities only.",
    };
  }
  const ticker = nseTicker(raw);
  if (!ticker) {
    return {
      ok: false,
      code: "empty",
      message: "Add an NSE equity symbol to analyse.",
    };
  }
  const contract = await findNseContract(ticker).catch(() => null);
  if (!contract?.token) {
    return {
      ok: false,
      code: "not-nse",
      message: "NSE stock not found. Please search for a valid NSE-listed equity.",
    };
  }
  return {
    ok: true,
    instrument: {
      symbol: ticker,
      name: contract.formatted_ins_name || ticker,
      token: contract.token,
      lotSize: num(contract.lot_size),
      tickSize: num(contract.tick_size),
      exchange: "NSE",
      segment: "EQ",
    },
  };
}

export async function fetchAliceOhlcv(
  token: string,
  days = 800,
  resolution = "D",
  session?: AliceSession | null
): Promise<HistoryCandle[]> {
  const live = session ?? (await readAliceSession());
  if (!live) {
    throw new AliceBlueError("Connect Alice Blue to load historical NSE prices.", "not-connected");
  }
  return fetchHistoryCandles(live, token, Date.now() - days * 24 * 60 * 60 * 1000, resolution);
}

export async function fetchAliceQuotes(symbols: string[]): Promise<Record<string, AliceQuote>> {
  const unique = [...new Set(symbols.map(nseTicker).filter(Boolean))].slice(0, 12);
  const entries = await Promise.all(
    unique.map(async (symbol) => {
      const quote = await fetchAliceQuote(symbol).catch(() => null);
      return quote ? ([symbol, quote] as const) : null;
    })
  );
  return Object.fromEntries(entries.filter((row): row is readonly [string, AliceQuote] => row != null));
}

export async function fetchAliceMarketSheet(input: string): Promise<NseSheet | null> {
  const ticker = nseTicker(input);
  if (!ticker) return null;

  const live = await readAliceSession();
  const contract = await findNseContract(ticker).catch(() => null);
  if (!contract && !live) return null;

  const name = contract?.formatted_ins_name || ticker;
  const pdc = num(contract?.pdc);

  let tick: AliceQuote | null = null;
  let candles: HistoryCandle[] = [];
  let held: AliceHolding | null = null;

  if (live) {
    const [wsTick, history, bookRow] = await Promise.all([
      contract?.token
        ? fetchWsQuote(live, contract.token, ticker, name).catch(() => null)
        : Promise.resolve(null),
      contract?.token ? fetchHistoryCandles(live, contract.token) : Promise.resolve([] as HistoryCandle[]),
      fetchAlicePortfolio(live)
        .then((book) => book.holdings.find((row) => row.symbol === ticker) ?? null)
        .catch(() => null),
    ]);
    tick = wsTick;
    candles = history;
    held = bookRow;
  }

  const last = candles.at(-1);
  const prev = candles.at(-2);
  const ltp = tick?.ltp ?? held?.ltp ?? last?.close ?? pdc ?? null;
  if (!contract && ltp == null) return null;

  const previousClose = tick?.previousClose ?? prev?.close ?? pdc;
  const change = tick?.change ?? (ltp != null && previousClose != null ? ltp - previousClose : null);
  const changePct =
    tick?.changePct ??
    (ltp != null && previousClose ? ((ltp - previousClose) / previousClose) * 100 : null);
  const closes = candles.map((row) => row.close);
  if (ltp != null && closes.at(-1) !== ltp) closes.push(ltp);
  const high52 =
    candles.length && ltp != null
      ? Math.max(...candles.map((row) => row.high), ltp)
      : tick?.high ?? ltp;
  const low52 =
    candles.length && ltp != null
      ? Math.min(...candles.map((row) => row.low), ltp)
      : tick?.low ?? ltp;
  const rangePct =
    high52 != null && low52 != null && high52 !== low52 && ltp != null
      ? ((ltp - low52) / (high52 - low52)) * 100
      : null;

  const quote: NseQuote = {
    symbol: ticker,
    nseSymbol: ticker,
    name,
    exchange: "NSE",
    currency: "INR",
    price: ltp,
    change,
    changePct,
    previousClose: previousClose ?? null,
    open: tick?.open ?? null,
    dayHigh: tick?.high ?? null,
    dayLow: tick?.low ?? null,
    volume: tick?.volume ?? null,
    avgVolume: null,
    fiftyTwoWeekHigh: high52 ?? null,
    fiftyTwoWeekLow: low52 ?? null,
    rangePct,
    sma20: sma(closes, 20),
    sma50: sma(closes, 50),
    return1m: returnOver(closes, 21),
    return6m: returnOver(closes, 126),
    sector: null,
    industry: null,
    closes,
    asOf: tick?.asOf ?? last?.time ?? new Date().toISOString(),
    lotSize: num(contract?.lot_size),
    tickSize: num(contract?.tick_size),
    aliceToken: contract?.token ?? null,
  };

  return { quote, fundamentals: null, peers: [], holding: held };
}
