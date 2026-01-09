'use client';

import { useCallback, useMemo, useRef } from "react";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import type { ProfitSeries } from "../types";

type Props = {
  series: ProfitSeries;
  loading?: boolean;
  onHover?: (point: ProfitSeries["points"][number] | null) => void;
};

export function ProfitChart({ series, loading, onHover }: Props) {
  const lastPointRef = useRef<ProfitSeries["points"][number] | null>(null);
  const data = series.points;

  const { minValue, maxValue } = useMemo(() => {
    if (data.length === 0) return { minValue: 0, maxValue: 100 };
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return {
      minValue: min - padding,
      maxValue: max + padding
    };
  }, [data]);

  const formatXAxisLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  const xAxisTicks = useMemo(() => {
    if (data.length < 2) return [];
    const tickCount = 5;
    const step = Math.floor((data.length - 1) / (tickCount - 1));
    return Array.from({ length: tickCount }, (_, i) => {
      const index = Math.min(i * step, data.length - 1);
      return data[index].timestamp;
    });
  }, [data]);

  const handleMouseLeave = useCallback(() => {
    lastPointRef.current = null;
    onHover?.(null);
  }, [onHover]);

  const renderTooltip = useCallback((props: TooltipProps<number, string>) => {
    const point = props.payload?.[0]?.payload as ProfitSeries["points"][number] | undefined;
    if (props.active && point) {
      if (lastPointRef.current?.timestamp !== point.timestamp) {
        lastPointRef.current = point;
        onHover?.(point);
      }
    }
    return null;
  }, [onHover]);

  if (data.length === 0) {
    return (
      <div className="h-[80px] flex items-center justify-center text-sm text-[color:var(--text-secondary)]">
        No data available
      </div>
    );
  }

  return (
    <div className="relative h-[80px] w-full" onMouseLeave={handleMouseLeave}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
          <defs>
            <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5100" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#FF5100" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#868686" }}
            tickFormatter={formatXAxisLabel}
            ticks={xAxisTicks}
            interval="preserveStartEnd"
          />
          <YAxis domain={[minValue, maxValue]} hide />
          <Tooltip
            content={renderTooltip as TooltipProps<number, string>["content"]}
            cursor={{ stroke: "#FF5100", strokeWidth: 1, strokeDasharray: "3 3" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#FF5100"
            strokeWidth={2}
            fill="url(#profitFill)"
            animationDuration={500}
            activeDot={{ r: 6, fill: "#FF5100", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl animate-pulse" />
      )}
    </div>
  );
}
