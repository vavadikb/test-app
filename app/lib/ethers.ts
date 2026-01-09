import { ethers } from "ethers";
import { getChainId, requireEnv } from "../config/env";

const USDC_DECIMALS = 6;

function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error("Server-only module");
  }
}

export const provider = (() => {
  assertServer();
  const rpc = requireEnv("RPC_URL");
  return new ethers.JsonRpcProvider(rpc, getChainId());
})();

const wallet = (() => {
  assertServer();
  const pk = requireEnv("PRIVATE_KEY");
  return new ethers.Wallet(pk, provider);
})();

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function decimals() view returns (uint8)"
];

export async function getEthBalance(address: string): Promise<number> {
  const balance = await provider.getBalance(address);
  return Number(ethers.formatEther(balance));
}

export async function getUsdcBalance(address: string): Promise<number> {
  const contract = getUsdcContract();
  const balance = await contract.balanceOf(address);
  return Number(
    ethers.formatUnits(balance as unknown as bigint, USDC_DECIMALS)
  );
}

export async function sendEth(to: string, amountEth: string) {
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountEth)
  });
  return tx.wait();
}

export async function sendUsdc(to: string, amount: string) {
  const contract = getUsdcContract(wallet);
  const tx = await contract.transfer(
    to,
    ethers.parseUnits(amount, USDC_DECIMALS)
  );
  return tx.wait();
}

function getUsdcContract(signerOrProvider: ethers.Signer | ethers.Provider = provider) {
  const checksummed = ethers.getAddress(requireEnv("USDC_ADDRESS"));
  return new ethers.Contract(checksummed, ERC20_ABI, signerOrProvider);
}

export function getWalletAddress(): string {
  return wallet.address;
}

export function getEtherscanTxUrl(txHash: string): string {
  const chainId = getChainId();
  if (chainId === 1) return `https://etherscan.io/tx/${txHash}`;
  if (chainId === 11155111) return `https://sepolia.etherscan.io/tx/${txHash}`;
  if (chainId === 5) return `https://goerli.etherscan.io/tx/${txHash}`;
  return `https://etherscan.io/tx/${txHash}`;
}
