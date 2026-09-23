"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/types";

interface CurrencyState {
  currency: Currency;
  hasAutoDetected: boolean;
  setCurrency: (currency: Currency) => void;
  autoDetect: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "USD",
      hasAutoDetected: false,
      setCurrency: (currency) => set({ currency }),
      autoDetect: (currency) => {
        if (!get().hasAutoDetected) {
          set({ currency, hasAutoDetected: true });
        }
      },
    }),
    { name: "adaramaluti-currency" }
  )
);
