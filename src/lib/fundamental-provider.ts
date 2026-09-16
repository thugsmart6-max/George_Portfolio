export type CompanyFundamentals = {
  symbol: string;
  name: string | null;
  price: number | null;
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
  source: string;
  url: string;
};

export interface FundamentalDataProvider {
  getByNseSymbol(symbol: string): Promise<CompanyFundamentals | null>;
}

function stripTags(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseIndian(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/[₹%]/g, "")
    .replace(/Cr\.?/gi, "")
    .replace(/,/g, "")
    .trim();
  if (!cleaned || cleaned === "-") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function ratioMap(html: string): Record<string, number> {
  const block = html.match(/id="top-ratios"([\s\S]*?)<\/ul>/i)?.[1] ?? "";
  const out: Record<string, number> = {};
  for (const li of block.matchAll(/<li[\s\S]*?<\/li>/gi)) {
    const name = stripTags(li[0].match(/class="name"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "");
    const numbers = [...li[0].matchAll(/class="number"[^>]*>([\s\S]*?)<\/span>/gi)].map((m) =>
      parseIndian(stripTags(m[1]))
    );
    const value = numbers.find((n) => n != null) ?? null;
    if (name && value != null) out[name.toLowerCase()] = value;
  }
  return out;
}

function firstMatch(html: string, pattern: RegExp) {
  const m = html.match(pattern);
  return m?.[1] ? stripTags(m[1]) : null;
}

function lastTableNumber(html: string, sectionId: string, rowLabel: string): number | null {
  const section = html.match(new RegExp(`id="${sectionId}"[\\s\\S]*?<table[\\s\\S]*?</table>`, "i"))?.[0];
  if (!section) return null;
  const headers = [...section.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => stripTags(m[1]));
  const skipTtm = /ttm/i.test(headers.at(-1) ?? "");
  const row = section.match(new RegExp(`<tr[\\s\\S]{0,1200}?${rowLabel}[\\s\\S]*?</tr>`, "i"))?.[0];
  if (!row) return null;
  const nums = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)]
    .map((m) => parseIndian(stripTags(m[1])))
    .filter((n): n is number => n != null);
  if (!nums.length) return null;
  if (skipTtm && nums.length > 1) return nums[nums.length - 2] ?? null;
  return nums[nums.length - 1] ?? null;
}

function lastPromoterPct(html: string): number | null {
  const row = html.match(/<tr[\s\S]{0,400}?Promoters[\s\S]*?<\/tr>/i)?.[0];
  if (!row) return null;
  const nums = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)]
    .map((m) => parseIndian(stripTags(m[1])))
    .filter((n): n is number => n != null);
  return nums.at(-1) ?? null;
}

const cache = new Map<string, { at: number; value: CompanyFundamentals | null }>();
const TTL = 30 * 60 * 1000;

async function screenerGet(path: string): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(`https://www.screener.in${path}`, {
      signal: ctrl.signal,
      headers: {
        Accept: "text/html,application/json",
        "User-Agent": "Mozilla/5.0 (compatible; GeorgePortfolio/1.0; research dashboard)",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export class ScreenerFundamentalProvider implements FundamentalDataProvider {
  async getByNseSymbol(symbol: string): Promise<CompanyFundamentals | null> {
    const ticker = symbol.trim().toUpperCase();
    if (!ticker) return null;
    const hit = cache.get(ticker);
    if (hit && Date.now() - hit.at < TTL) return hit.value;

    try {
      const searchRaw = await screenerGet(`/api/company/search/?q=${encodeURIComponent(ticker)}`);
      const search = searchRaw ? (JSON.parse(searchRaw) as { url?: string; name?: string }[]) : [];
      const match =
        search.find((row) => (row.url ?? "").toUpperCase().includes(`/COMPANY/${ticker}/`)) ?? search[0];
      const path = match?.url?.startsWith("/") ? match.url : `/company/${ticker}/consolidated/`;
      const html = await screenerGet(path);
      if (!html || /page not found/i.test(html)) {
        cache.set(ticker, { at: Date.now(), value: null });
        return null;
      }

      const ratios = ratioMap(html);
      const price = ratios["current price"] ?? null;
      const book = ratios["book value"] ?? null;
      const pe = ratios["stock p/e"] ?? null;
      const pb = price != null && book ? price / book : null;
      const about = firstMatch(html, /class="[^"]*about[^"]*"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/i);
      const keyPoints = firstMatch(html, /class="[^"]*commentary[^"]*"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/i);

      const value: CompanyFundamentals = {
        symbol: ticker,
        name: match?.name ?? null,
        price,
        about,
        keyPoints,
        marketCapCr: ratios["market cap"] ?? null,
        revenue: lastTableNumber(html, "profit-loss", "Sales"),
        pat: lastTableNumber(html, "profit-loss", "Net Profit"),
        eps: lastTableNumber(html, "profit-loss", "EPS in Rs"),
        roe: ratios["roe"] ?? null,
        roce: ratios["roce"] ?? null,
        debt: lastTableNumber(html, "balance-sheet", "Borrowings"),
        pe,
        pb,
        bookValue: book,
        promoterHolding: lastPromoterPct(html),
        dividendYield: ratios["dividend yield"] ?? null,
        source: "Screener.in",
        url: `https://www.screener.in${path}`,
      };

      const usable =
        value.pe != null ||
        value.roe != null ||
        value.about != null ||
        value.revenue != null ||
        value.promoterHolding != null ||
        value.price != null ||
        value.name != null;
      const next = usable ? value : null;
      cache.set(ticker, { at: Date.now(), value: next });
      return next;
    } catch {
      cache.set(ticker, { at: Date.now(), value: null });
      return null;
    }
  }
}

export const fundamentalDataProvider: FundamentalDataProvider = new ScreenerFundamentalProvider();
