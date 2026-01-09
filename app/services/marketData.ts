import { getOptionalEnv } from "../config/env";
import type { Timeframe } from "../types";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const COINGECKO_API_KEY = getOptionalEnv("COINGECKO_API_KEY");

export interface CoinGeckoMarketChart {
  prices: [number, number][];
}

export const marketChartUrls = {
  eth: (days: string) => `${COINGECKO_API_URL}/coins/ethereum/market_chart?vs_currency=usd&days=${days}`,
  token: (tokenAddress: string, days: string) =>
    `${COINGECKO_API_URL}/coins/ethereum/contract/${tokenAddress}/market_chart?vs_currency=usd&days=${days}`
};

export async function fetchMarketChart(url: string): Promise<CoinGeckoMarketChart> {
  const response = await fetch(url, { cache: "no-store", headers: getCoingeckoHeaders() });
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  return response.json();
}

export function getPeriodParams(period: Timeframe): { days: string } {
  switch (period) {
    case "1H":
    case "6H":
    case "1D":
      return { days: "1" };
    case "1W":
      return { days: "7" };
    case "1M":
      return { days: "30" };
    case "All":
    default:
      return { days: "365" };
  }
}

export function filterDataByPeriod(prices: [number, number][], period: Timeframe): [number, number][] {
  const now = Date.now();
  let cutoff: number;

  switch (period) {
    case "1H":
      cutoff = now - 60 * 60 * 1000;
      break;
    case "6H":
      cutoff = now - 6 * 60 * 60 * 1000;
      break;
    case "1D":
      cutoff = now - 24 * 60 * 60 * 1000;
      break;
    case "1W":
      cutoff = now - 7 * 24 * 60 * 60 * 1000;
      break;
    case "1M":
      cutoff = now - 30 * 24 * 60 * 60 * 1000;
      break;
    case "All":
    default:
      return prices;
  }

  return prices.filter(([timestamp]) => timestamp >= cutoff);
}

export function getPeriodLabel(period: Timeframe): string {
  switch (period) {
    case "1H":
      return "Past Hour";
    case "6H":
      return "Past 6 Hours";
    case "1D":
      return "Past Day";
    case "1W":
      return "Past Week";
    case "1M":
      return "Past Month";
    case "All":
    default:
      return "All Time";
  }
}

export function formatPointDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function priceAtTimestamp(
  prices: [number, number][],
  timestamp: number,
  state: { index: number }
): number {
  while (state.index + 1 < prices.length && prices[state.index + 1][0] <= timestamp) {
    state.index += 1;
  }
  return prices[state.index]?.[1] ?? prices[0]?.[1] ?? 0;
}

export function getPeriodMs(period: Timeframe): number {
  switch (period) {
    case "1H":
      return 60 * 60 * 1000;
    case "6H":
      return 6 * 60 * 60 * 1000;
    case "1D":
      return 24 * 60 * 60 * 1000;
    case "1W":
      return 7 * 24 * 60 * 60 * 1000;
    case "1M":
      return 30 * 24 * 60 * 60 * 1000;
    case "All":
    default:
      return 365 * 24 * 60 * 60 * 1000;
  }
}

function getCoingeckoHeaders(): HeadersInit | undefined {
  if (!COINGECKO_API_KEY || COINGECKO_API_KEY === "your_key_here") return undefined;
  return { "x-cg-pro-api-key": COINGECKO_API_KEY };
}
