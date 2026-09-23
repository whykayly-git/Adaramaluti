import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collections } from "@/data/collections";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse curated Adaramaluti House of Fashion collections.",
};

export default function CollectionsPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Collections"
          description="Every collection tells a story — from the boardroom to the ballroom."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group relative block aspect-[16/11] overflow-hidden rounded-2xl"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h2 className="font-bold text-2xl text-white">{collection.name}</h2>
                <p className="mt-1 max-w-sm text-sm text-white/80">{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
