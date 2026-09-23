import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BespokeForm } from "@/components/bespoke/BespokeForm";

export const metadata: Metadata = {
  title: "Bespoke Orders",
  description: "Request a bespoke, made-to-measure piece from Adaramaluti House of Fashion.",
};

export default function BespokePage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Made to Measure"
          title="Bespoke & Custom Orders"
          description="Share your vision and measurements, and our design team will bring your one-of-a-kind piece to life."
        />
        <div className="mt-10 rounded-2xl border border-gray-100 p-6 sm:p-10">
          <BespokeForm />
        </div>
      </Container>
    </div>
  );
}
