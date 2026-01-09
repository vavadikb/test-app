'use client';

import { motion } from "framer-motion";
import { FormEvent, useState, useTransition } from "react";
import { withdrawAction } from "../actions";
import { ModalShell } from "./ModalShell";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function WithdrawModal({ open, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [txUrl, setTxUrl] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        const res = await withdrawAction(form);
        setTxUrl(res.explorerUrl);
      } catch (err) {
        setError((err as Error).message ?? "Withdrawal failed");
      }
    });
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-neutral-900">Withdraw</div>
          <p className="text-sm text-neutral-500">Send ETH or USDC from your wallet. Gas fees apply.</p>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-700"
          aria-label="Close"
          disabled={isPending}
        >
          ✕
        </button>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">Recipient address</label>
          <input
            name="toAddress"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-accent focus:outline-none"
            placeholder="0x..."
            required
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">Amount</label>
            <input
              name="amount"
              type="number"
              step="0.0001"
              min="0"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-accent focus:outline-none"
              placeholder="0.1"
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">Asset</label>
            <select
              name="asset"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-accent focus:outline-none"
              disabled={isPending}
            >
              <option value="USDC">USDC</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {txUrl && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
            Success!{" "}
            <a className="underline font-semibold" href={txUrl} target="_blank" rel="noreferrer">
              View on Etherscan
            </a>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <motion.button
            type="submit"
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.12}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary flex-1"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send"}
          </motion.button>
          <motion.button
            type="button"
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.12}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="btn btn-secondary flex-1"
            disabled={isPending}
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </ModalShell>
  );
}
