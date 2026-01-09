import { ethers } from "ethers";
import { provider } from "./ethers";

const FEED_REGISTRY = "0x47Fb2585D2C56Fe188D0E6ec628a38B74fCeeeDf";
const QUOTE_USD = "0x0000000000000000000000000000000000000348";
const NATIVE_ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const FEED_REGISTRY_ABI = [
  "function latestRoundData(address base, address quote) view returns (uint80,int256,uint256,uint256,uint80)",
  "function decimals(address base, address quote) view returns (uint8)"
];

const feedRegistry = new ethers.Contract(FEED_REGISTRY, FEED_REGISTRY_ABI, provider);

export async function getUsdPriceOnchain(tokenAddress?: string | null): Promise<number> {
  const base = tokenAddress ? ethers.getAddress(tokenAddress) : NATIVE_ETH;
  try {
    const [, answer] = await feedRegistry.latestRoundData(base, QUOTE_USD);
    const decimals: number = await feedRegistry.decimals(base, QUOTE_USD);
    const price = Number(answer) / 10 ** decimals;
    if (!Number.isFinite(price) || price <= 0) return 0;
    return price;
  } catch {
    return 0;
  }
}
