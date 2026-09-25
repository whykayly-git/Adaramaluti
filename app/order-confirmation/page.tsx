import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmationClient } from "@/components/checkout/OrderConfirmationClient";
import { getShippingOptions } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false },
};

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationClient shippingOptions={getShippingOptions()} />
    </Suspense>
  );
}
