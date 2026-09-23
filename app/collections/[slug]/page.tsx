import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/shop/ProductCard";
import { collections, getCollectionBySlug } from "@/data/collections";
import { products } from "@/data/products";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return { title: collection.name, description: collection.description };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const collectionProducts = products.filter((p) => p.collection === collection.name);

  return (
    <div>
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <Image src={collection.image} alt={collection.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-primary/50" />
        <Container className="relative flex h-full flex-col items-start justify-end pb-10 text-white">
          <h1 className="font-bold text-3xl sm:text-5xl">{collection.name}</h1>
          <p className="mt-2 max-w-lg text-white/85">{collection.description}</p>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        {collectionProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
