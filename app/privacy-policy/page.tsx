import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { MarkdownLite } from "@/components/legal/MarkdownLite";
import { getPageContent } from "@/lib/page-content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout eyebrow="Policies" title="Privacy Policy" updated="June 2026">
      <MarkdownLite content={getPageContent("privacy_policy")} />
    </LegalLayout>
  );
}
