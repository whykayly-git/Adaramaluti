import type { Currency } from "@/types";

export const currencySymbols: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export const currencyLabels: Record<Currency, string> = {
  NGN: "Nigerian Naira",
  USD: "US Dollar",
  GBP: "British Pound",
  EUR: "Euro",
};

/**
 * Static exchange rates, expressed as "1 NGN = X currency".
 * Replace this with a live rates API (e.g. exchangerate.host, Open Exchange Rates)
 * by fetching rates on an interval/cron and writing them into this object,
 * or swapping `exchangeRates` for an async fetch inside a server action / route
 * handler that feeds the currency store on load.
 */
export const exchangeRates: Record<Currency, number> = {
  NGN: 1,
  USD: 1 / 1550,
  GBP: 1 / 1950,
  EUR: 1 / 1680,
};

export function convertFromNGN(amountNGN: number, currency: Currency): number {
  return amountNGN * exchangeRates[currency];
}

export function formatPrice(amountNGN: number, currency: Currency): string {
  const converted = convertFromNGN(amountNGN, currency);
  const symbol = currencySymbols[currency];

  const decimals = currency === "NGN" ? 0 : 2;
  const formatted = converted.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${symbol}${formatted}`;
}

/** Nigeria is detected via the Vercel/Next geo header set in middleware; defaults to USD. */
export function defaultCurrencyForCountry(countryCode: string | null | undefined): Currency {
  if (countryCode === "NG") return "NGN";
  return "USD";
}
