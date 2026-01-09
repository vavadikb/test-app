'use client';

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ModalShell } from "./ModalShell";

type Props = {
  open: boolean;
  onClose: () => void;
  address: string;
};

export function DepositModal({ open, onClose, address }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setCopied(false), 1400);
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-neutral-900">Deposit USDC or ETH</div>
          <p className="text-sm text-neutral-500">
            Send funds to your wallet. Network: Ethereum mainnet/testnet as configured.
          </p>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700" aria-label="Close">
          ✕
        </button>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 break-all">
        {address}
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          drag
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.12}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          className="btn btn-primary flex-1"
        >
          {copied ? "Copied!" : "Copy address"}
        </motion.button>
        <motion.button
          type="button"
          drag
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.12}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="btn btn-secondary flex-1"
        >
          Close
        </motion.button>
      </div>
    </ModalShell>
  );
}
