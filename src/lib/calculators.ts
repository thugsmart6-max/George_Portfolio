/** Pure calculation helpers for financial tools */

function monthlyRateFromAnnual(annualRatePercent: number) {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent <= 0) return 0;
  return Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
}

function monthsFromYears(years: number) {
  if (!Number.isFinite(years) || years <= 0) return 0;
  return Math.max(0, Math.round(years * 12));
}

export function sipFutureValue(
  monthlyInvestment: number,
  annualRatePercent: number,
  years: number
) {
  const p = Math.max(0, Number.isFinite(monthlyInvestment) ? monthlyInvestment : 0);
  const r =
    !Number.isFinite(annualRatePercent) || annualRatePercent <= 0
      ? 0
      : annualRatePercent / 12 / 100;
  const n = monthsFromYears(years);
  if (n === 0) return { invested: 0, futureValue: 0, gains: 0 };
  const invested = p * n;
  if (r === 0) return { invested, futureValue: invested, gains: 0 };
  const futureValue = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return {
    invested,
    futureValue,
    gains: futureValue - invested,
  };
}

/** One-time lumpsum — annual compounding, Groww-style */
export function lumpsumFutureValue(
  principal: number,
  annualRatePercent: number,
  years: number
) {
  const invested = Math.max(0, Number.isFinite(principal) ? principal : 0);
  const t = Math.max(0, Number.isFinite(years) ? years : 0);
  const rate = Number.isFinite(annualRatePercent) ? annualRatePercent : 0;
  const futureValue = invested * Math.pow(1 + rate / 100, t);
  return {
    invested,
    futureValue,
    gains: futureValue - invested,
  };
}

export type SwpYearSnap = {
  year: number;
  invested: number;
  withdrawn: number;
  remaining: number;
};

/** Groww SWP: effective monthly rate, grow then withdraw. */
export function swpProjection(
  corpus: number,
  monthlyWithdrawal: number,
  annualRatePercent: number,
  years: number
) {
  const start = Math.max(0, Number.isFinite(corpus) ? corpus : 0);
  const w = Math.max(0, Number.isFinite(monthlyWithdrawal) ? monthlyWithdrawal : 0);
  const r = monthlyRateFromAnnual(annualRatePercent);
  const n = monthsFromYears(years);
  const timeline: SwpYearSnap[] = [];

  let balance = start;
  let totalWithdrawn = 0;
  let monthsLasted = 0;

  for (let i = 0; i < n; i++) {
    if (balance > 0) {
      balance *= 1 + r;
      const take = Math.min(w, Math.max(0, balance));
      balance -= take;
      totalWithdrawn += take;
      monthsLasted = i + 1;
      if (balance < 0) balance = 0;
    }

    if ((i + 1) % 12 === 0 || i === n - 1) {
      const year = Math.ceil((i + 1) / 12);
      const last = timeline[timeline.length - 1];
      if (!last || last.year !== year) {
        timeline.push({
          year,
          invested: start,
          withdrawn: totalWithdrawn,
          remaining: Math.max(0, balance),
        });
      } else {
        last.withdrawn = totalWithdrawn;
        last.remaining = Math.max(0, balance);
      }
    }
  }

  if (timeline.length === 0) {
    timeline.push({ year: 1, invested: start, withdrawn: 0, remaining: start });
  }

  return {
    endingCorpus: Math.max(0, balance),
    totalWithdrawn,
    monthsLasted,
    yearsLasted: monthsLasted / 12,
    sustained: balance > 0 && monthsLasted >= n && n > 0,
    invested: start,
    timeline,
  };
}

export function swpAtYear(
  projection: ReturnType<typeof swpProjection>,
  year: number
): SwpYearSnap {
  const snaps = projection.timeline;
  if (!snaps.length) {
    return { year: 1, invested: projection.invested, withdrawn: 0, remaining: projection.endingCorpus };
  }
  const y = Math.max(1, Math.min(snaps[snaps.length - 1].year, Math.round(year)));
  return snaps.find((row) => row.year === y) ?? snaps[snaps.length - 1];
}

export type GstMode = "exclusive" | "inclusive";

export function gstCalculate(
  amount: number,
  ratePercent: number,
  mode: GstMode
) {
  const baseAmt = Math.max(0, Number.isFinite(amount) ? amount : 0);
  const rate = Math.max(0, Number.isFinite(ratePercent) ? ratePercent : 0) / 100;
  if (mode === "exclusive") {
    const gst = baseAmt * rate;
    return {
      base: baseAmt,
      gst,
      cgst: gst / 2,
      sgst: gst / 2,
      total: baseAmt + gst,
    };
  }
  const base = rate === 0 ? baseAmt : baseAmt / (1 + rate);
  const gst = baseAmt - base;
  return {
    base,
    gst,
    cgst: gst / 2,
    sgst: gst / 2,
    total: baseAmt,
  };
}

export function emiCalculate(
  principal: number,
  annualRatePercent: number,
  years: number
) {
  const p = Math.max(0, Number.isFinite(principal) ? principal : 0);
  const n = Math.max(1, monthsFromYears(Math.max(years, 1 / 12)));
  const r = (Number.isFinite(annualRatePercent) ? annualRatePercent : 0) / 12 / 100;
  if (r === 0) {
    return { emi: p / n, totalPayment: p, interest: 0 };
  }
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  return {
    emi,
    totalPayment,
    interest: totalPayment - p,
  };
}

export type BrokerSegment = "delivery" | "intraday";

function orderBrokerage(tradeValue: number) {
  const pct = tradeValue * 0.001;
  const capped = Math.min(pct, 20);
  if (capped < 5) return Math.min(5, tradeValue * 0.025);
  return capped;
}

export function brokerageCalculate(
  buyPrice: number,
  sellPrice: number,
  qty: number,
  segment: BrokerSegment
) {
  const buyValue = Math.max(0, buyPrice) * Math.max(0, qty);
  const sellValue = Math.max(0, sellPrice) * Math.max(0, qty);
  const turnover = buyValue + sellValue;

  const buyBrokerage = orderBrokerage(buyValue);
  const sellBrokerage = orderBrokerage(sellValue);
  const brokerage = buyBrokerage + sellBrokerage;

  const stt =
    segment === "delivery"
      ? (buyValue + sellValue) * 0.001
      : sellValue * 0.00025;

  const exchange = turnover * 0.0000297;
  const sebi = turnover * 0.000001;
  const ipft = turnover * 0.000001;
  const stamp =
    segment === "delivery" ? buyValue * 0.00015 : buyValue * 0.00003;
  const dp = segment === "delivery" ? 20 : 0;
  const gst = (brokerage + exchange + sebi + ipft) * 0.18;

  const totalCharges =
    brokerage + stt + exchange + sebi + ipft + stamp + gst + dp;
  const grossPnL = sellValue - buyValue;
  const netPnL = grossPnL - totalCharges;

  return {
    buyValue,
    sellValue,
    turnover,
    brokerage,
    stt,
    exchange,
    sebi,
    ipft,
    stamp,
    gst,
    dp,
    totalCharges,
    grossPnL,
    netPnL,
  };
}

export function marginCalculate(
  price: number,
  qty: number,
  marginPercent: number
) {
  const tradeValue = Math.max(0, price) * Math.max(0, qty);
  const pct = Math.max(1, Math.min(100, marginPercent));
  const marginRequired = tradeValue * (pct / 100);
  const leverage = 100 / pct;
  return {
    tradeValue,
    marginRequired,
    leverage,
    exposure: tradeValue,
    marginPercent: pct,
  };
}
