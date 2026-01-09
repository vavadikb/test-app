'use client';

import { useCallback, useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { ProfitChart } from "./ProfitChart";
import { TimeframeTabs } from "./TimeframeTabs";
import { getProfitSeries } from "../actions";
import type { ProfitSeries, Timeframe } from "../types";
import { AnimatedNumber } from "./AnimatedNumber";
import { ArrowDownIcon, ArrowUpIcon, EthLogo, RefreshIcon } from "./Icons";

type Props = {
  initialSeries: ProfitSeries;
  initialTimeframe?: Timeframe;
};

export function ProfitCard({ initialSeries, initialTimeframe = "6H" }: Props) {
  const [series, setSeries] = useState(initialSeries);
  const [timeframe, setTimeframe] = useState<Timeframe>(initialTimeframe);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const headline = useMemo(() => series.profitLoss.amount ?? 0, [series]);

  const isHovering = hoveredValue !== null;
  const displayDate = hoveredDate || series.profitLoss.periodLabel;
  const hoverSign = (hoveredValue ?? 0) >= 0 ? "+$" : "-$";
  const displayPrefix = isHovering ? hoverSign : series.profitLoss.isProfit ? "+$" : "-$";
  const displayValue = isHovering ? Math.abs(hoveredValue ?? 0) : headline;

  const loadSeries = useCallback(
    (tf: Timeframe) => {
      setError(null);
      startTransition(async () => {
        try {
          const next = await getProfitSeries(tf);
          setSeries(next);
        } catch (err) {
          setError((err as Error).message ?? "Failed to load");
        }
      });
    },
    [startTransition]
  );

  const handleChange = (tf: Timeframe) => {
    if (tf === timeframe) return;
    setTimeframe(tf);
    loadSeries(tf);
  };

  const handleRefresh = useCallback(() => {
    loadSeries(timeframe);
  }, [loadSeries, timeframe]);

  const handleChartHover = useCallback((point: ProfitSeries["points"][number] | null) => {
    if (point) {
      setHoveredValue(point.value);
      setHoveredDate(point.date);
    } else {
      setHoveredValue(null);
      setHoveredDate(null);
    }
  }, []);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      className="card px-6 py-5 flex flex-col gap-[19px] w-full lg:min-w-[400px]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[5px]">
            <span
              className={
                series.profitLoss.isProfit
                  ? "text-[color:var(--green-profit)]"
                  : "text-[color:var(--red-loss)]"
              }
            >
              {series.profitLoss.isProfit ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </span>
            <span className="text-sm text-[color:var(--text-secondary)]">Profit/Loss</span>
          </div>
          <motion.button
            onClick={handleRefresh}
            disabled={isPending}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <RefreshIcon className={isPending ? "animate-spin" : ""} />
          </motion.button>
        </div>
        <TimeframeTabs value={timeframe} onChange={handleChange} disabled={isPending} />
      </div>

      <div className="flex items-center justify-between gap-[5px]">
        <div className="flex-1 flex flex-col gap-1">
          <div className="text-[28px] sm:text-[40px] font-normal tracking-[-0.8px]">
            <motion.span
              className={!isHovering && !series.profitLoss.isProfit ? "text-[color:var(--red-loss)]" : ""}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {displayPrefix}
              <AnimatedNumber
                value={displayValue}
                format={{ style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              />
            </motion.span>
          </div>
          <motion.div
            className="text-sm font-medium text-[color:var(--text-secondary)]"
            key={displayDate}
            initial={{ opacity: 0.5, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {displayDate}
          </motion.div>
        </div>
        <EthLogo />
      </div>

      <div className={isPending ? "opacity-50 transition-opacity" : ""}>
        <ProfitChart series={series} loading={isPending} onHover={handleChartHover} />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
    </motion.div>
  );
}
