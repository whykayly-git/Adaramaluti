import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { MarkdownLite } from "@/components/legal/MarkdownLite";
import { shippingOptions } from "@/lib/shipping";
import { Price } from "@/components/ui/Price";
import { getPageContent } from "@/lib/page-content";

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

      <MarkdownLite content={getPageContent("shipping_returns")} />
    </LegalLayout>
  );
}
