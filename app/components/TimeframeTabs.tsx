'use client';

import { motion } from "framer-motion";
import { TIMEFRAMES, type Timeframe } from "../types";

type Props = {
  value: Timeframe;
  onChange: (tf: Timeframe) => void;
  disabled?: boolean;
};

export function TimeframeTabs({ value, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-1 sm:gap-[5px] overflow-x-auto">
      {TIMEFRAMES.map((tf) => (
        <motion.button
          key={tf}
          type="button"
          drag
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.12}
          whileHover={!disabled && value !== tf ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.97 } : {}}
          disabled={disabled}
          onClick={() => onChange(tf)}
          className={`h-6 px-2 sm:px-3 rounded-[70px] text-xs transition-colors shrink-0 ${
            value === tf
              ? "bg-[color:var(--orange-light)] text-[color:var(--orange-primary)]"
              : "text-[color:var(--text-secondary)] hover:bg-gray-100"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {tf}
        </motion.button>
      ))}
    </div>
  );
}
