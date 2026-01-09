'use client';

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { WalletSummary } from "../types";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { AnimatedNumber } from "./AnimatedNumber";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DepositIcon,
  EditIcon,
  UsdcIcon,
  WalletIcon,
  WithdrawIcon
} from "./Icons";

type Props = {
  summary: WalletSummary;
};

export function WalletCard({ summary }: Props) {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const isProfit = summary.deltaDay >= 0;
  const deltaAbs = Math.abs(summary.deltaDay);
  const todayText = useMemo(() => {
    const sign = isProfit ? "+" : "-";
    return `${sign}$`;
  }, [isProfit]);

  return (
    <>
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
        className="card px-6 py-5 flex flex-col gap-[19px] w-full lg:min-w-[400px]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <div className="absolute inset-0 rounded-full bg-[color:var(--orange-avatar)] flex items-center justify-center">
                <WalletIcon />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-neutral-900">My Wallet</span>
                <EditIcon className="text-neutral-400" />
              </div>
              <div className="text-xs text-[color:var(--text-secondary)]">Joined Nov 2025</div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-7">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-[color:var(--text-secondary)] whitespace-nowrap">
                Portfolio (Not USDC)
              </span>
              <span className="text-sm sm:text-base font-medium">
                <AnimatedNumber
                  value={summary.portfolioUsd}
                  format={{ style: "currency", currency: "USD", maximumFractionDigits: 2 }}
                />
              </span>
            </div>
            <div className="h-6 w-px bg-[color:var(--border-card)]" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-[color:var(--text-secondary)] whitespace-nowrap">
                USDC + Portfolio
              </span>
              <div className="flex items-center gap-1.5">
                <UsdcIcon />
                <span className="text-sm sm:text-base font-medium">
                  <AnimatedNumber
                    value={summary.totalUsd}
                    format={{ style: "currency", currency: "USD", maximumFractionDigits: 2 }}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[28px] sm:text-[40px] font-normal tracking-[-0.8px]">
            <AnimatedNumber
              value={summary.usdcBalance}
              format={{ style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 }}
            />
            {" USDC"}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <span
              className={`text-sm font-medium ${
                isProfit ? "text-[color:var(--green-profit)]" : "text-[color:var(--red-loss)]"
              }`}
            >
              {todayText}
              <AnimatedNumber
                value={deltaAbs}
                format={{ style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </span>
            <div className="flex items-center gap-0.5">
              <span className={isProfit ? "text-[color:var(--green-profit)]" : "text-[color:var(--red-loss)]"}>
                {isProfit ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </span>
              <span
                className={`text-sm font-medium ${
                  isProfit ? "text-[color:var(--green-profit)]" : "text-[color:var(--red-loss)]"
                }`}
              >
                <AnimatedNumber
                  value={Math.abs(summary.deltaPercent)}
                  format={{ style: "decimal", minimumFractionDigits: 1, maximumFractionDigits: 1 }}
                />
                %
              </span>
            </div>
            <span className="text-sm font-medium text-[color:var(--text-secondary)]">Today</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.12}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowDeposit(true)}
            className="btn btn-primary flex-1 h-12 text-base"
          >
            <DepositIcon />
            Deposit
          </motion.button>
          <motion.button
            type="button"
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.12}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowWithdraw(true)}
            className="btn btn-secondary flex-1 h-12 text-base"
          >
            <WithdrawIcon />
            Withdraw
          </motion.button>
        </div>
      </motion.div>

      <DepositModal open={showDeposit} onClose={() => setShowDeposit(false)} address={summary.address} />
      <WithdrawModal open={showWithdraw} onClose={() => setShowWithdraw(false)} />
    </>
  );
}
