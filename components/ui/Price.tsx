"use client";

import { formatPrice } from "@/lib/currency";
import { useCurrencyStore } from "@/store/currency-store";
import { cn } from "@/lib/utils";

export function Price({
  amountNGN,
  className,
}: {
  amountNGN: number;
  className?: string;
}) {
  const currency = useCurrencyStore((s) => s.currency);
  return <span className={cn(className)}>{formatPrice(amountNGN, currency)}</span>;
}
