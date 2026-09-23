import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <p className="mt-2 text-xs text-gray-400">Last updated: {updated}</p>
        <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-gray-600 [&_h2]:mt-8 [&_h2]:font-bold [&_h2]:text-lg [&_h2]:text-primary [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </div>
  );
}
