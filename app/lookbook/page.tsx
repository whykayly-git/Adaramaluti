import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { unsplash } from "@/lib/unsplash";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "An editorial gallery of Adaramaluti House of Fashion collections in motion.",
};

const lookbookImages = [
  unsplash("1490481651871-ab68de25d43d", 900, 1200),
  unsplash("1595777457583-95e059d581b8", 900, 1200),
  unsplash("1543163521-1bf539c55dd2", 900, 1200),
  unsplash("1591047139829-d91aecb6caea", 900, 1200),
  unsplash("1483985988355-763728e1935b", 900, 1200),
  unsplash("1600091166971-7f9faad6c1e2", 900, 1200),
  unsplash("1622470953794-aa9c70b0fb9d", 900, 1200),
  unsplash("1523293182086-7651a899d37f", 900, 1200),
  unsplash("1544441893-675973e31985", 900, 1200),
];

export default function LookbookPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Editorial"
          title="Lookbook"
          description="A visual journey through our most recent collections."
        />
        <div className="mt-10 columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
          {lookbookImages.map((image, i) => (
            <div key={image} className="relative overflow-hidden rounded-xl">
              <Image
                src={image}
                alt={`Adaramaluti House of Fashion lookbook editorial ${i + 1}`}
                width={900}
                height={1200}
                sizes="(min-width: 640px) 33vw, 50vw"
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
