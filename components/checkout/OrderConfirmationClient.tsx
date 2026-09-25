"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { OrderReceipt } from "@/components/checkout/OrderReceipt";
import { getPendingOrder } from "@/lib/order";
import { useCartStore } from "@/store/cart-store";
import type { OrderDetails, ShippingOption } from "@/types";

type Status = "verifying" | "success" | "failed";

export function OrderConfirmationClient({ shippingOptions }: { shippingOptions: ShippingOption[] }) {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clear);
  const [status, setStatus] = useState<Status>("verifying");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      const provider = searchParams.get("provider");
      const reference = searchParams.get("reference");

      if (!provider || !reference) {
        setStatus("failed");
        setErrorMessage("Missing order reference.");
        return;
      }

      const pending = getPendingOrder(reference);
      if (!pending) {
        setStatus("failed");
        setErrorMessage("We couldn't find this order in your session.");
        return;
      }

      try {
        let successful = false;

        if (provider === "paystack") {
          const res = await fetch(`/api/payments/paystack?reference=${reference}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          successful = data.successful;
        } else if (provider === "stripe") {
          const sessionId = searchParams.get("session_id");
          const res = await fetch(`/api/payments/stripe?session_id=${sessionId}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          successful = data.successful;
        } else if (provider === "flutterwave") {
          const transactionId = searchParams.get("transaction_id");
          const res = await fetch(`/api/payments/flutterwave?transaction_id=${transactionId}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          successful = data.successful;
        }

        if (successful) {
          setOrder({ ...pending, paidAt: new Date().toISOString() });
          setStatus("success");
          clearCart();
        } else {
          setStatus("failed");
          setErrorMessage("Payment could not be confirmed.");
        }
      } catch (err) {
        setStatus("failed");
        setErrorMessage(err instanceof Error ? err.message : "Verification failed.");
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-16">
      <Container>
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-gray-600">Verifying your payment...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-3 text-center">
            <XCircle className="h-12 w-12 text-red-500" />
            <h1 className="font-bold text-2xl text-primary">Payment Not Confirmed</h1>
            <p className="max-w-md text-gray-600">
              {errorMessage ??
                "We could not confirm your payment. If you were charged, please contact us with your reference."}
            </p>
            <Button href="/checkout" className="mt-4">
              Return to Checkout
            </Button>
          </div>
        )}

        {status === "success" && order && (
          <div>
            <div className="mb-8 flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="h-12 w-12 text-accent" />
              <h1 className="font-bold text-3xl text-primary">Thank You, {order.customer.fullName.split(" ")[0]}!</h1>
              <p className="max-w-md text-gray-600">
                Your order has been confirmed. A receipt has been sent to {order.customer.email}.
              </p>
            </div>
            <OrderReceipt order={order} shippingOptions={shippingOptions} />
            <div className="mt-8 flex justify-center gap-3">
              <Button href="/shop" variant="outline">
                Continue Shopping
              </Button>
              <Button href="/" >Back Home</Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
