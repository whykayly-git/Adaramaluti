import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout eyebrow="Policies" title="Privacy Policy" updated="June 2026">
      <div>
        <h2>Information We Collect</h2>
        <p>
          When you place an order, create a wishlist, or contact us, we collect information such
          as your name, email address, phone number, shipping address and order details. Payment
          information is processed directly by our payment providers (Paystack, Stripe and
          Flutterwave) and is never stored on our servers.
        </p>
      </div>
      <div>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To process and fulfil your orders</li>
          <li>To communicate order updates and respond to enquiries</li>
          <li>To send marketing communications, if you opt in</li>
          <li>To improve our products and website experience</li>
        </ul>
      </div>
      <div>
        <h2>Sharing Your Information</h2>
        <p>
          We share your information only with trusted third parties necessary to fulfil your
          order — payment processors, shipping carriers — and never sell your personal data to
          third parties.
        </p>
      </div>
      <div>
        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data at any time
          by contacting us at {siteConfig.email}.
        </p>
      </div>
      <div>
        <h2>Cookies</h2>
        <p>
          We use cookies to remember your currency preference and to keep your cart and wishlist
          in sync across sessions on the same device.
        </p>
      </div>
    </LegalLayout>
  );
}
