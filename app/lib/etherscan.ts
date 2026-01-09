import { requireEnv } from "../config/env";

type EtherscanResponse<T> = {
  status: string;
  message: string;
  result: T;
};

const BASE_URL = "https://api.etherscan.io/api";

function getApiKey(): string {
  return requireEnv("ETHERSCAN_API_KEY");
}

export async function fetchTxList(address: string) {
  const params = new URLSearchParams({
    module: "account",
    action: "txlist",
    address,
    startblock: "0",
    endblock: "99999999",
    sort: "asc",
    apikey: getApiKey()
  });
  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    cache: "no-store"
  });
  const data = (await res.json()) as EtherscanResponse<
    Array<{
      timeStamp: string;
      value: string;
      to: string;
      from: string;
      isError: string;
    }>
  >;
  if (data.status !== "1") {
    if (data.message?.toLowerCase().includes("no transactions")) return [];
    // Graceful fallback on rate limits / NOTOK to avoid breaking UI
    return [];
  }
  return data.result;
}

export async function fetchEthPrice(): Promise<number> {
  const params = new URLSearchParams({
    module: "stats",
    action: "ethprice",
    apikey: getApiKey()
  });
  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    cache: "no-store"
  });
  const data = (await res.json()) as EtherscanResponse<{
    ethusd: string;
  }>;
  if (data.result?.ethusd) {
    return Number(data.result.ethusd);
  }

  // Fallback: Coingecko (unauthenticated)
  try {
    const cg = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { cache: "no-store" }
    ).then((r) => r.json()) as { ethereum?: { usd?: number } };
    if (cg?.ethereum?.usd) return cg.ethereum.usd;
  } catch {
    // ignore
  }

  // Final fallback to avoid zeroing portfolio
  return 2000;
}

export async function fetchTokenTxList(address: string) {
  const params = new URLSearchParams({
    module: "account",
    action: "tokentx",
    address,
    startblock: "0",
    endblock: "99999999",
    sort: "asc",
    apikey: getApiKey()
  });
  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    cache: "no-store"
  });
  const data = (await res.json()) as EtherscanResponse<
    Array<{
      timeStamp: string;
      value: string;
      to: string;
      from: string;
      isError: string;
      tokenDecimal: string;
      contractAddress: string;
    }>
  >;
  if (data.status !== "1") {
    if (data.message?.toLowerCase().includes("no transactions")) return [];
    return [];
  }
  return data.result;
}
