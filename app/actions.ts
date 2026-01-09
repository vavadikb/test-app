'use server';

import { z } from "zod";
import { unstable_noStore as noStore } from "next/cache";
import {
  getEthBalance,
  getUsdcBalance,
  sendEth,
  sendUsdc,
  getEtherscanTxUrl
} from "./lib/ethers";
import { buildCacheKey, getFromCache, setCache } from "./lib/cache";
import { getUsdPriceOnchain } from "./lib/prices";
import type { ProfitSeries, Timeframe, WalletSummary } from "./types";
import { buildProfitSeries, buildFallbackSeries } from "./services/profitSeries";
import { getTokenHoldings, sumTokenValue } from "./services/portfolio";
import { getOptionalEnv, requireEnv } from "./config/env";

const withdrawSchema = z.object({
  asset: z.enum(["ETH", "USDC"]),
  toAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/i, { message: "Invalid address" }),
  amount: z
    .string()
    .refine((v) => Number(v) > 0, { message: "Amount must be positive" })
});

export async function getWalletSummary(): Promise<WalletSummary> {
  noStore();
  const address = requireEnv("PUBLIC_KEY");
  const usdcAddress = getOptionalEnv("USDC_ADDRESS")?.toLowerCase() ?? "";

  const [usdcBalance, ethBalance, ethPrice, tokenHoldings, dayProfit] = await Promise.all([
    getUsdcBalance(address),
    getEthBalance(address),
    getUsdPriceOnchain(null),
    getTokenHoldings(address, usdcAddress),
    getProfitSeries("1D")
  ]);

  const tokenValue = sumTokenValue(tokenHoldings);
  const portfolioUsd = ethBalance * ethPrice + tokenValue;
  const totalUsd = portfolioUsd + usdcBalance;
  const deltaDay = dayProfit.profitLoss.isProfit ? dayProfit.profitLoss.amount : -dayProfit.profitLoss.amount;
  const deltaPercent = totalUsd > 0 ? (deltaDay / totalUsd) * 100 : 0;

  return {
    address,
    usdcBalance,
    ethBalance,
    portfolioUsd,
    totalUsd,
    deltaDay,
    deltaPercent
  };
}

export async function getProfitSeries(timeframe: Timeframe): Promise<ProfitSeries> {
  noStore();
  const address = requireEnv("PUBLIC_KEY");
  const usdcAddress = getOptionalEnv("USDC_ADDRESS")?.toLowerCase() ?? "";

  const cacheKey = buildCacheKey(["profit", address, timeframe]);
  const cached = getFromCache<ProfitSeries>(cacheKey);
  if (cached) return cached;

  try {
    const series = await buildProfitSeries(timeframe, address, usdcAddress);
    setCache(cacheKey, series);
    return series;
  } catch (error) {
    console.error("Error fetching price history:", error);
    const fallback = buildFallbackSeries(timeframe);
    setCache(cacheKey, fallback);
    return fallback;
  }
}

export async function withdrawAction(form: FormData) {
  const data = {
    toAddress: form.get("toAddress"),
    amount: form.get("amount"),
    asset: form.get("asset")
  };
  const parsed = withdrawSchema.parse(data);

  const receipt =
    parsed.asset === "ETH"
      ? await sendEth(parsed.toAddress, parsed.amount)
      : await sendUsdc(parsed.toAddress, parsed.amount);

  return {
    hash: receipt?.hash ?? "",
    explorerUrl: getEtherscanTxUrl(receipt?.hash ?? "")
  };
}

export type { ProfitSeries, Timeframe, WalletSummary } from "./types";
