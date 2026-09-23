import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalLayout eyebrow="Policies" title="Terms of Service" updated="June 2026">
      <div>
        <h2>Orders & Payment</h2>
        <p>
          All prices are listed in Nigerian Naira and converted to your selected display
          currency for convenience; the amount charged may be settled in your selected currency
          depending on the payment method used. Orders are confirmed once payment has been
          verified.
        </p>
      </div>
      <div>
        <h2>Bespoke Orders</h2>
        <p>
          Bespoke and made-to-measure orders are custom-made based on measurements you provide
          and are therefore non-refundable once production has begun.
        </p>
      </div>
      <div>
        <h2>Intellectual Property</h2>
        <p>
          All designs, images, logos and content on this site are the property of{" "}
          {siteConfig.name} and may not be reproduced without written permission.
        </p>
      </div>
      <div>
        <h2>Limitation of Liability</h2>
        <p>
          {siteConfig.name} is not liable for delays caused by shipping carriers, customs
          authorities, or circumstances beyond our reasonable control.
        </p>
      </div>
      <div>
        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>
      </div>
      <div>
        <h2>Contact</h2>
        <p>For questions about these terms, contact us at {siteConfig.email}.</p>
      </div>
    </LegalLayout>
  );
}
