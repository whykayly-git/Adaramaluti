import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { shippingOptions } from "@/lib/shipping";
import { Price } from "@/components/ui/Price";

export const metadata: Metadata = { title: "Shipping & Returns" };

export default function ShippingReturnsPage() {
  return (
    <LegalLayout eyebrow="Policies" title="Shipping & Returns" updated="June 2026">
      <div>
        <h2>Shipping Rates</h2>
        <p>We offer the following shipping options at checkout:</p>
        <ul>
          {shippingOptions.map((option) => (
            <li key={option.id}>
              <span className="font-medium text-primary">{option.label}</span> —{" "}
              <Price amountNGN={option.rateNGN} /> ({option.etaDays})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Order Processing</h2>
        <p>
          Ready-to-wear pieces are processed within 1-2 business days. Made-to-order and bespoke
          pieces require additional production time, which will be communicated at the time of
          order.
        </p>
      </div>

      <div>
        <h2>Returns & Exchanges</h2>
        <p>
          Ready-to-wear items may be returned within 7 days of delivery for store credit or
          exchange, provided the item is unworn, unwashed and in its original packaging with tags
          attached. Bespoke and made-to-order pieces are final sale, as they are cut and
          constructed specifically for you.
        </p>
      </div>

      <div>
        <h2>How to Start a Return</h2>
        <p>
          Contact our customer service team at hello@adaramaluti.com with your order reference
          and reason for return. Our team will guide you through the next steps.
        </p>
      </div>

      <div>
        <h2>Customs & Duties (International Orders)</h2>
        <p>
          International customers are responsible for any customs duties, taxes or import fees
          levied by their destination country. These are not included in our shipping rates.
        </p>
      </div>
    </LegalLayout>
  );
}
