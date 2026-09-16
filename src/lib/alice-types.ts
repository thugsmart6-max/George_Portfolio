export type AliceStatus = {
  configured: boolean;
  connected: boolean;
  clientId: string | null;
};

export type AliceQuote = {
  symbol: string;
  name: string | null;
  ltp: number;
  change: number | null;
  changePct: number | null;
  previousClose: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  asOf: string;
  source: "alice-blue";
};

export type AliceSearchHit = {
  symbol: string;
  name: string;
  exchange: "NSE";
  segment: "EQ";
  ltp?: number | null;
};

export type AliceHolding = {
  symbol: string;
  name: string;
  product: string;
  qty: number;
  buy: number;
  ltp: number;
  invested: number;
  value: number;
  pnl: number;
  pnlPct: number;
};

export type AliceFunds = {
  tradingLimit: number | null;
  openingCash: number | null;
  collateral: number | null;
  utilized: number | null;
};

export type AlicePortfolio = {
  holdings: AliceHolding[];
  funds: AliceFunds | null;
  asOf: string;
};
