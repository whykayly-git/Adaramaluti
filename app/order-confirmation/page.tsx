import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmationClient } from "@/components/checkout/OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false },
};

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationClient />
    </Suspense>
  );
}
