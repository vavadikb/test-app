export function formatCurrency(
  value: number,
  options?: { currency?: string; minimumFractionDigits?: number }
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: options?.currency ?? "USD",
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  }).format(new Date(timestamp));
}
