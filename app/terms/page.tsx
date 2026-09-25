import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { MarkdownLite } from "@/components/legal/MarkdownLite";
import { getPageContent } from "@/lib/page-content";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalLayout eyebrow="Policies" title="Terms of Service" updated="June 2026">
      <MarkdownLite content={getPageContent("terms")} />
    </LegalLayout>
  );
}
