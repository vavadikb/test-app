'use client';

import { useEffect, useMemo, useRef } from "react";
import { NumberFlowLite, partitionParts } from "number-flow";

type Props = {
  value: number;
  format?: Intl.NumberFormatOptions;
  className?: string;
};

export function AnimatedNumber({ value, format, className }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        ...format
      }),
    [format]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!customElements.get("number-flow")) {
      NumberFlowLite.define();
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const parts = partitionParts(value, formatter);
    const el = ref.current as HTMLElement & {
      parts?: ReturnType<typeof partitionParts>;
      root?: boolean;
    };
    el.root = true;
    el.parts = parts;
  }, [value, formatter]);

  const classes = ["inline-block", className].filter(Boolean).join(" ");

  return (
    <span className={classes} style={{ position: "relative", display: "inline-flex" }}>
      <number-flow
        ref={ref}
        style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
      />
      <span>{formatter.format(value)}</span>
    </span>
  );
}
