export type CashFlow = { date: Date; amount: number };

function yearFrac(from: Date, to: Date) {
  return (to.getTime() - from.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

function npv(rate: number, flows: CashFlow[], t0: Date) {
  return flows.reduce((sum, flow) => {
    return sum + flow.amount / Math.pow(1 + rate, yearFrac(t0, flow.date));
  }, 0);
}

/** Annualized IRR from dated cash flows. Null if the series cannot be solved. */
export function xirr(flows: CashFlow[]): number | null {
  const usable = flows.filter((flow) => Number.isFinite(flow.amount) && !Number.isNaN(flow.date.getTime()));
  if (usable.length < 2) return null;
  const hasIn = usable.some((flow) => flow.amount > 0);
  const hasOut = usable.some((flow) => flow.amount < 0);
  if (!hasIn || !hasOut) return null;

  const t0 = usable.reduce((min, flow) => (flow.date < min ? flow.date : min), usable[0].date);
  let guess = 0.1;
  for (let i = 0; i < 80; i++) {
    const value = npv(guess, usable, t0);
    const nearby = npv(guess + 1e-6, usable, t0);
    const slope = (nearby - value) / 1e-6;
    if (Math.abs(slope) < 1e-12) break;
    const next = guess - value / slope;
    if (!Number.isFinite(next) || next <= -0.999) return null;
    if (Math.abs(next - guess) < 1e-7) {
      return Math.abs(npv(next, usable, t0)) < 1 ? next : null;
    }
    guess = next;
  }
  return Math.abs(npv(guess, usable, t0)) < 1 ? guess : null;
}

export function parseDay(iso: string) {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
