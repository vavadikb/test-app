# Test App (Wallet + Profit/Loss)

A Next.js (TypeScript) wallet dashboard that displays a two‑panel layout with USDC wallet info and a profit/loss chart. Data is fetched via Server Actions, with caching by wallet address. Animations use Framer Motion, numbers animate with NumberFlow, and prices/balances come from Etherscan + CoinGecko.

## Features
- Two main blocks: Wallet summary and Profit/Loss chart
- Server Actions for all data fetching
- Portfolio PnL excludes USDC
- Hoverable chart: updates date and value with NumberFlow
- Motion‑animated buttons (`whileHover`, `whileTap`, `drag`)
- Cached profit series by wallet + timeframe (60s)

## Tech Stack
- Next.js 14 (App Router)
- TypeScript only
- NumberFlow (animated numbers)
- Framer Motion (UI animation)
- Etherscan API (token/tx data)
- CoinGecko API (price history)

## Requirements
- Node.js 18+
- npm

## Environment Variables
Create a `.env` file in the project root:

```
PUBLIC_KEY=0xYourWalletAddress
PRIVATE_KEY=your_private_key
RPC_URL=https://mainnet.infura.io/v3/your_key
ETHERSCAN_API_KEY=your_etherscan_key
USDC_ADDRESS=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
CHAIN_ID=1
COINGECKO_API_KEY=your_coingecko_key
```

Notes:
- `COINGECKO_API_KEY` is optional. If empty or `your_key_here`, requests run without it.
- `PRIVATE_KEY` is required for withdraw to work.
- `USDC_ADDRESS` is used to exclude USDC from PnL.

## Install
```
npm install
```

## Run Locally
```
npm run dev
```
Open http://localhost:3000

## Lint
```
npm run lint
```

## Build
```
npm run build
npm run start
```

## Deployment (Vercel)
1) Push the repository to GitHub/GitLab.
2) In Vercel: **New Project** → Import repository.
3) Framework: **Next.js** (auto‑detected).
4) Add all environment variables from `.env` in:
   **Project Settings → Environment Variables**.
5) Click **Deploy**.

Important:
- `.env` is not committed. Vercel stores env vars securely.
- If you use a Preview environment, set vars for Preview too.

## Functional Requirements Checklist (TЗ)
- Two blocks layout: Wallet + Profit/Loss chart ✅
- Next.js + TypeScript only ✅
- NumberFlow for animated numbers ✅
- Etherscan integration ✅
- Motion animations (hover/drag/tap) ✅
- Profit/Loss excludes USDC ✅
- Working hover on chart (date + value) ✅
- Server Actions for data fetching ✅
- Client/server separation ✅
- Cached chart data (60s) per `PUBLIC_KEY` ✅

## Notes on Profit/Loss Logic
- Chart is built using CoinGecko price history.
- ETH and ERC‑20 token holdings are included (USDC excluded).
- PnL is based on price changes over the selected period.

## Project Structure
```
app/
  actions.ts
  components/
  config/
  lib/
  services/
  types.ts
```

## Security
- Never commit `.env` or private keys.
- Use Vercel Environment Variables for deployment.

