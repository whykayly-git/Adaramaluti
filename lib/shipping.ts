import type { ShippingOption } from "@/types";

export const shippingOptions: ShippingOption[] = [
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

export function getShippingOption(id: string): ShippingOption {
  return shippingOptions.find((option) => option.id === id) ?? shippingOptions[0];
}
