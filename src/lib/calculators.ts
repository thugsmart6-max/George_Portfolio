/** Pure calculation helpers for financial tools */

export function sipFutureValue(
  monthlyInvestment: number,
  annualRatePercent: number,
  years: number
) {
  const r = annualRatePercent / 12 / 100;
  const n = years * 12;
  if (r === 0) {
    const invested = monthlyInvestment * n;
    return { invested, futureValue: invested, gains: 0 };
  }
  const futureValue =
    monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthlyInvestment * n;
  return {
    invested,
    futureValue,
    gains: futureValue - invested,
  };
}

/** One-time lumpsum investment compound growth */
export function lumpsumFutureValue(
  principal: number,
  annualRatePercent: number,
  years: number
) {
  const invested = Math.max(0, principal);
  const futureValue = invested * Math.pow(1 + annualRatePercent / 100, years);
  return {
    invested,
    futureValue,
    gains: futureValue - invested,
  };
}

/** SWP: starting corpus, monthly withdrawal, annual return %, years */
export function swpProjection(
  corpus: number,
  monthlyWithdrawal: number,
  annualRatePercent: number,
  years: number
) {
  const r = annualRatePercent / 12 / 100;
  const n = Math.floor(years * 12);
  let balance = corpus;
  let totalWithdrawn = 0;
  let monthsLasted = 0;

  for (let i = 0; i < n; i++) {
    balance = balance * (1 + r) - monthlyWithdrawal;
    if (balance < 0) {
      totalWithdrawn += monthlyWithdrawal + balance;
      balance = 0;
      monthsLasted = i + 1;
      break;
    }
    totalWithdrawn += monthlyWithdrawal;
    monthsLasted = i + 1;
  }

  return {
    endingCorpus: Math.max(0, balance),
    totalWithdrawn,
    monthsLasted,
    yearsLasted: monthsLasted / 12,
    sustained: balance > 0 && monthsLasted >= n,
  };
}

export type GstMode = "exclusive" | "inclusive";

export function gstCalculate(
  amount: number,
  ratePercent: number,
  mode: GstMode
) {
  const rate = ratePercent / 100;
  if (mode === "exclusive") {
    const gst = amount * rate;
    return {
      base: amount,
      gst,
      cgst: gst / 2,
      sgst: gst / 2,
      total: amount + gst,
    };
  }
  const base = amount / (1 + rate);
  const gst = amount - base;
  return {
    base,
    gst,
    cgst: gst / 2,
    sgst: gst / 2,
    total: amount,
  };
}

export function emiCalculate(
  principal: number,
  annualRatePercent: number,
  years: number
) {
  const r = annualRatePercent / 12 / 100;
  const n = years * 12;
  if (r === 0) {
    return { emi: principal / n, totalPayment: principal, interest: 0 };
  }
  const emi =
    (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  return {
    emi,
    totalPayment,
    interest: totalPayment - principal,
  };
}

export type BrokerSegment = "delivery" | "intraday";

/** Groww-style equity brokerage estimate (illustrative). */
function orderBrokerage(tradeValue: number) {
  const pct = tradeValue * 0.001; // 0.1%
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

  const exchange = turnover * 0.0000297; // NSE approx
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

/** Equity margin / leverage estimate (illustrative). */
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
