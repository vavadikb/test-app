import { fetchTokenTxList } from "../lib/etherscan";
import { getUsdPriceOnchain } from "../lib/prices";

export type TokenHolding = {
  address: string;
  amount: number;
  usdValue: number;
};

export function sumTokenValue(holdings: TokenHolding[]): number {
  return holdings.reduce((sum, holding) => sum + holding.usdValue, 0);
}

export async function getTokenHoldings(address: string, usdcAddress: string): Promise<TokenHolding[]> {
  const lower = address.toLowerCase();
  const txs = await fetchTokenTxList(address);
  const priceMap = await buildTokenPriceMap(txs, usdcAddress);
  const balances = new Map<string, number>();

  for (const tx of txs) {
    if (tx.isError === "1") continue;
    const tokenAddr = tx.contractAddress.toLowerCase();
    if (usdcAddress && tokenAddr === usdcAddress) continue;
    const decimals = Number(tx.tokenDecimal ?? "18");
    const isIncoming = tx.to.toLowerCase() === lower;
    const amount = Number(tx.value) / 10 ** decimals;
    const prev = balances.get(tokenAddr) ?? 0;
    balances.set(tokenAddr, prev + (isIncoming ? amount : -amount));
  }

  const holdings: TokenHolding[] = [];
  for (const [tokenAddr, amount] of balances.entries()) {
    if (Math.abs(amount) < 1e-12) continue;
    const price = priceMap.get(tokenAddr) ?? 0;
    holdings.push({
      address: tokenAddr,
      amount,
      usdValue: price * amount
    });
  }
  return holdings;
}

async function buildTokenPriceMap(
  tokenTxs: Awaited<ReturnType<typeof fetchTokenTxList>>,
  usdcAddress?: string | null
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  const seen = new Set<string>();
  for (const tx of tokenTxs) {
    const addr = tx.contractAddress.toLowerCase();
    if (usdcAddress && addr === usdcAddress) continue;
    if (seen.has(addr)) continue;
    seen.add(addr);
    const price = await getUsdPriceOnchain(addr);
    if (price > 0) {
      map.set(addr, price);
    }
  }
  return map;
}
