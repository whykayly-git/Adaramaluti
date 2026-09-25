import { getSetting, setSetting } from "@/lib/db";

/**
 * Node-only. Stores free-text content for legal/info pages, editable at
 * /admin/settings, using a lightweight markdown-lite convention rendered
 * by <MarkdownLite> (components/legal/MarkdownLite.tsx):
 *   - A blank line separates blocks.
 *   - A block starting with "## " is a heading.
 *   - A block where every line starts with "- " is a bullet list.
 *   - Anything else is a paragraph.
 */

export type PageContentKey =
  | "shipping_returns"
  | "privacy_policy"
  | "terms"
  | "contact_intro";

const DEFAULTS: Record<PageContentKey, string> = {
  shipping_returns: `## Order Processing
Ready-to-wear pieces are processed within 1-2 business days. Made-to-order and bespoke pieces require additional production time, which will be communicated at the time of order.

## Returns & Exchanges
Ready-to-wear items may be returned within 7 days of delivery for store credit or exchange, provided the item is unworn, unwashed and in its original packaging with tags attached. Bespoke and made-to-order pieces are final sale, as they are cut and constructed specifically for you.

## How to Start a Return
Contact our customer service team with your order reference and reason for return. Our team will guide you through the next steps.

## Customs & Duties (International Orders)
International customers are responsible for any customs duties, taxes or import fees levied by their destination country. These are not included in our shipping rates.`,

  privacy_policy: `## Information We Collect
When you place an order, create a wishlist, or contact us, we collect information such as your name, email address, phone number, shipping address and order details. Payment information is processed directly by our payment providers (Paystack, Stripe and Flutterwave) and is never stored on our servers.

## How We Use Your Information
- To process and fulfil your orders
- To communicate order updates and respond to enquiries
- To send marketing communications, if you opt in
- To improve our products and website experience

## Sharing Your Information
We share your information only with trusted third parties necessary to fulfil your order — payment processors, shipping carriers — and never sell your personal data to third parties.

## Your Rights
You may request access to, correction of, or deletion of your personal data at any time by contacting us.

## Cookies
We use cookies to remember your currency preference and to keep your cart and wishlist in sync across sessions on the same device.`,

  terms: `## Orders & Payment
All prices are listed in Nigerian Naira and converted to your selected display currency for convenience; the amount charged may be settled in your selected currency depending on the payment method used. Orders are confirmed once payment has been verified.

## Bespoke Orders
Bespoke and made-to-measure orders are custom-made based on measurements you provide and are therefore non-refundable once production has begun.

## Intellectual Property
All designs, images, logos and content on this site are the property of the brand and may not be reproduced without written permission.

## Limitation of Liability
We are not liable for delays caused by shipping carriers, customs authorities, or circumstances beyond our reasonable control.

## Governing Law
These terms are governed by the laws of the Federal Republic of Nigeria.`,

  contact_intro: `Questions about an order, bespoke piece or collaboration? We'd love to hear from you.`,
};

export function getPageContent(key: PageContentKey): string {
  return getSetting(`page_${key}`) ?? DEFAULTS[key];
}

export function setPageContent(key: PageContentKey, content: string): void {
  setSetting(`page_${key}`, content);
}

export function getAllPageContent(): Record<PageContentKey, string> {
  return {
    shipping_returns: getPageContent("shipping_returns"),
    privacy_policy: getPageContent("privacy_policy"),
    terms: getPageContent("terms"),
    contact_intro: getPageContent("contact_intro"),
  };
}
