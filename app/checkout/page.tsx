import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getShippingOptions } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return <CheckoutClient shippingOptions={getShippingOptions()} />;
}
