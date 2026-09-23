"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/store/currency-store";
import { defaultCurrencyForCountry } from "@/lib/currency";

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function CurrencyInitializer() {
  const autoDetect = useCurrencyStore((s) => s.autoDetect);

  useEffect(() => {
    const country = readCookie("adaramaluti-country");
    autoDetect(defaultCurrencyForCountry(country));
  }, [autoDetect]);

  return null;
}
