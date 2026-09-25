import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllCollections } from "@/data/collections";

export function FeaturedCollections() {
  const featured = getAllCollections().slice(0, 3);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Curated"
          title="Featured Collections"
          description="Explore edits designed around the moments that matter most."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="(min-width: 1024px) 33vw, 90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-bold text-xl text-white">{collection.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/80">{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
