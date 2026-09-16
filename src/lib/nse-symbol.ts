/** Drop leading zeros so 099 → 99 and 0333 → 333. Keeps 0.99. */
export function stripLeadingZeros(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.replace(/^0+(?=\d)/, "");
}

export function nseTicker(input: string): string {
  return stripLeadingZeros(
    input
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "")
      .replace(/-EQ$/i, "")
      .replace(/\.(NS|BO)$/i, "")
  );
}

/** Qty / price from typed text. 099 → 99, 0333 → 333, 0.99 stays. */
export function parseAmount(raw: string | number): number {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  const cleaned = stripLeadingZeros(raw.replace(/,/g, "").trim());
  if (!cleaned) return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}
