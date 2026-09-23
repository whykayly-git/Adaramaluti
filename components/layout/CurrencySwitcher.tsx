"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrencyStore } from "@/store/currency-store";
import { currencySymbols } from "@/lib/currency";
import type { Currency } from "@/types";
import { cn } from "@/lib/utils";

const currencies: Currency[] = ["NGN", "USD", "GBP", "EUR"];

export function CurrencySwitcher({ className }: { className?: string }) {
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-primary hover:border-accent"
      >
        <span>{currencySymbols[currency]}</span>
        <span>{currency}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
        >
          {currencies.map((c) => (
            <li key={c}>
              <button
                type="button"
                role="option"
                aria-selected={currency === c}
                onClick={() => {
                  setCurrency(c);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-light",
                  currency === c && "text-accent font-semibold"
                )}
              >
                <span className="w-4">{currencySymbols[c]}</span>
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
