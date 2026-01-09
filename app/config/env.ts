type EnvKey =
  | "PUBLIC_KEY"
  | "PRIVATE_KEY"
  | "RPC_URL"
  | "CHAIN_ID"
  | "USDC_ADDRESS"
  | "ETHERSCAN_API_KEY"
  | "COINGECKO_API_KEY";

export function requireEnv(key: EnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not set`);
  }
  return value;
}

export function getOptionalEnv(key: EnvKey): string | undefined {
  return process.env[key];
}

export function getChainId(): number {
  const raw = process.env.CHAIN_ID;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : 1;
}
