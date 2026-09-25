import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllLookbookImages } from "@/data/lookbook";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "An editorial gallery of Adaramaluti House of Fashion collections in motion.",
};

export default function LookbookPage() {
  const images = getAllLookbookImages();

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Editorial"
          title="Lookbook"
          description="A visual journey through our most recent collections."
        />
        <div className="mt-10 columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
          {images.map((image) => (
            <div key={image.id} className="relative overflow-hidden rounded-xl">
              <Image
                src={image.url}
                alt={image.alt}
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
