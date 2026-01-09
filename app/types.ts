export const TIMEFRAMES = ["1H", "6H", "1D", "1W", "1M", "All"] as const;

export type Timeframe = (typeof TIMEFRAMES)[number];

export type ProfitPoint = {
  timestamp: number;
  value: number;
  date: string;
};

export type ProfitLoss = {
  amount: number;
  isProfit: boolean;
  periodLabel: string;
};

export type ProfitSeries = {
  points: ProfitPoint[];
  profitLoss: ProfitLoss;
};

export type WalletSummary = {
  address: string;
  usdcBalance: number;
  ethBalance: number;
  portfolioUsd: number;
  totalUsd: number;
  deltaDay: number;
  deltaPercent: number;
};
