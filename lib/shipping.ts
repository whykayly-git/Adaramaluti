import { getSetting, setSetting } from "@/lib/db";
import type { ShippingOption } from "@/types";

/**
 * Node-only (imports lib/db.ts, which uses node:sqlite) — only call from
 * server components or route handlers. Client components that need these
 * (CheckoutClient, OrderReceipt) receive them as props instead, fetched by
 * their parent server page (app/checkout/page.tsx, app/order-confirmation/page.tsx).
 *
 * Only the label/description/rate/ETA of the three fixed zones are
 * editable at /admin/settings — the zone ids themselves are a fixed union
 * type (ShippingZone) used elsewhere (checkout form, order records), so
 * zones can't be added or removed here.
 */

const SETTINGS_KEY = "shipping_options";

const defaultShippingOptions: ShippingOption[] = [
  {
    id: "lagos",
    label: "Lagos Delivery",
    description: "Door-to-door delivery within Lagos",
    rateNGN: 5000,
    etaDays: "1-2 business days",
  },
  {
    id: "other-states",
    label: "Other Nigerian States",
    description: "Delivery to any other state in Nigeria",
    rateNGN: 8500,
    etaDays: "3-5 business days",
  },
  {
    id: "international",
    label: "International Shipping",
    description: "Worldwide delivery outside Nigeria",
    rateNGN: 45000,
    etaDays: "7-14 business days",
  },
];

export function getShippingOptions(): ShippingOption[] {
  const stored = getSetting(SETTINGS_KEY);
  if (!stored) return defaultShippingOptions;

  const overrides = JSON.parse(stored) as Record<string, Partial<ShippingOption>>;
  return defaultShippingOptions.map((option) => ({ ...option, ...overrides[option.id] }));
}

export function getShippingOption(id: string): ShippingOption {
  return getShippingOptions().find((option) => option.id === id) ?? defaultShippingOptions[0];
}

export function updateShippingOptions(options: ShippingOption[]): void {
  const byId: Record<string, ShippingOption> = {};
  for (const option of options) byId[option.id] = option;
  setSetting(SETTINGS_KEY, JSON.stringify(byId));
}
