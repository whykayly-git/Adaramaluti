"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { PaymentBadge } from "@/components/checkout/PaymentBadge";
import { useCartStore } from "@/store/cart-store";
import { useCurrencyStore } from "@/store/currency-store";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validation/checkout";
import { shippingOptions } from "@/lib/shipping";
import { convertFromNGN, formatPrice } from "@/lib/currency";
import { generateOrderReference, savePendingOrder } from "@/lib/order";
import { cn } from "@/lib/utils";
import type { PaymentProvider } from "@/types";

export function CheckoutClient() {
  const items = useCartStore((s) => s.items);
  const subtotalNGN = useCartStore((s) => s.subtotalNGN());
  const currency = useCurrencyStore((s) => s.currency);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableProviders: PaymentProvider[] =
    currency === "NGN" ? ["paystack", "flutterwave"] : ["stripe", "flutterwave"];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: currency === "NGN" ? "Nigeria" : "",
      shippingZone: "lagos",
      paymentProvider: availableProviders[0],
    },
  });

  useEffect(() => {
    setValue("paymentProvider", availableProviders[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const shippingZone = watch("shippingZone");
  const paymentProvider = watch("paymentProvider");

  const shipping = shippingOptions.find((o) => o.id === shippingZone) ?? shippingOptions[0];
  const totalNGN = subtotalNGN + shipping.rateNGN;

  const displayedTotal = useMemo(
    () => formatPrice(totalNGN, currency),
    [totalNGN, currency]
  );

  if (items.length === 0) {
    return (
      <Container className="py-16 text-center">
        <p className="text-gray-500">Your cart is empty. Add something beautiful first.</p>
        <Button href="/shop" className="mt-6">
          Shop Collection
        </Button>
      </Container>
    );
  }

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitting(true);
    setError(null);

    const reference = generateOrderReference();
    const origin = window.location.origin;

    savePendingOrder({
      reference,
      items,
      subtotalNGN,
      shippingNGN: shipping.rateNGN,
      totalNGN,
      currency,
      shippingZone: values.shippingZone,
      customer: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        country: values.country,
      },
      paymentProvider: values.paymentProvider,
      paidAt: "",
    });

    try {
      if (values.paymentProvider === "paystack") {
        const res = await fetch("/api/payments/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            amountNGN: totalNGN,
            reference,
            callbackUrl: `${origin}/order-confirmation?provider=paystack&reference=${reference}`,
            metadata: { reference, customer: values.fullName },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        window.location.href = data.authorizationUrl;
        return;
      }

      if (values.paymentProvider === "stripe") {
        const amount = convertFromNGN(totalNGN, currency);
        const res = await fetch("/api/payments/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            amount,
            currency,
            reference,
            productName: "Adaramaluti House of Fashion Order",
            successUrl: `${origin}/order-confirmation?provider=stripe&reference=${reference}&session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${origin}/checkout`,
            metadata: { reference },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        window.location.href = data.url;
        return;
      }

      if (values.paymentProvider === "flutterwave") {
        const amount =
          currency === "NGN" ? totalNGN : Number(convertFromNGN(totalNGN, currency).toFixed(2));
        const res = await fetch("/api/payments/flutterwave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            name: values.fullName,
            amount,
            currency,
            txRef: reference,
            redirectUrl: `${origin}/order-confirmation?provider=flutterwave&reference=${reference}`,
            metadata: { reference },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        window.location.href = data.link;
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Checkout" title="Complete Your Order" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]"
        >
          <div className="space-y-8">
            <div>
              <h2 className="font-bold text-lg text-primary">Contact & Shipping</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name" error={errors.fullName?.message}>
                  <input {...register("fullName")} className="input" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <input type="email" {...register("email")} className="input" />
                </Field>
                <Field label="Phone" error={errors.phone?.message}>
                  <input {...register("phone")} className="input" />
                </Field>
                <Field label="Country" error={errors.country?.message}>
                  <input {...register("country")} className="input" />
                </Field>
                <Field label="Address" error={errors.address?.message} full>
                  <input {...register("address")} className="input" />
                </Field>
                <Field label="City" error={errors.city?.message}>
                  <input {...register("city")} className="input" />
                </Field>
                <Field label="State" error={errors.state?.message}>
                  <input {...register("state")} className="input" />
                </Field>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg text-primary">Shipping Method</h2>
              <div className="mt-4 space-y-3">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-xl border p-4",
                      shippingZone === option.id ? "border-primary bg-light" : "border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={option.id}
                        {...register("shippingZone")}
                        className="h-4 w-4 accent-primary"
                      />
                      <div>
                        <p className="font-medium text-primary">{option.label}</p>
                        <p className="text-xs text-gray-500">
                          {option.description} · {option.etaDays}
                        </p>
                      </div>
                    </div>
                    <Price amountNGN={option.rateNGN} className="text-sm font-semibold text-primary" />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg text-primary">Payment Method</h2>
              <p className="mt-1 text-xs text-gray-500">
                {currency === "NGN"
                  ? "Pay by card, bank transfer or USSD via Paystack, or use Flutterwave."
                  : "Pay by international card, Apple Pay or Google Pay via Stripe, or use Flutterwave."}
              </p>
              <div className="mt-4 space-y-3">
                {availableProviders.map((provider) => (
                  <label
                    key={provider}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-xl border p-4",
                      paymentProvider === provider ? "border-primary bg-light" : "border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={provider}
                        {...register("paymentProvider")}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="font-medium capitalize text-primary">{provider}</span>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {provider === "paystack" && (
                        <>
                          <PaymentBadge name="Paystack" />
                          <PaymentBadge name="Visa" />
                          <PaymentBadge name="Verve" />
                        </>
                      )}
                      {provider === "stripe" && (
                        <>
                          <PaymentBadge name="Stripe" />
                          <PaymentBadge name="Apple Pay" />
                          <PaymentBadge name="Google Pay" />
                        </>
                      )}
                      {provider === "flutterwave" && (
                        <>
                          <PaymentBadge name="Flutterwave" />
                          <PaymentBadge name="Mastercard" />
                        </>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="h-fit rounded-2xl bg-light p-6">
            <h2 className="font-bold text-lg text-primary">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md bg-white">
                    <Image src={item.image} alt={item.name} fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-primary">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.color} / {item.size} × {item.quantity}
                    </p>
                  </div>
                  <Price amountNGN={item.priceNGN * item.quantity} className="text-sm font-semibold" />
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <Price amountNGN={subtotalNGN} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <Price amountNGN={shipping.rateNGN} />
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-primary">
                <span>Total</span>
                <span>{displayedTotal}</span>
              </div>
            </div>

            <Button type="submit" className="mt-6 w-full" size="lg" disabled={submitting}>
              {submitting ? "Redirecting..." : `Pay ${displayedTotal}`}
            </Button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Payments are processed securely. We never store your card details.
            </p>
          </div>
        </form>
      </Container>
    </div>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
