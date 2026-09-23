import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddToCartForm } from "@/components/shop/AddToCartForm";
import { RelatedProducts } from "@/components/shop/RelatedProducts";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/data/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const onSale = typeof product.salePriceNGN === "number";

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <nav className="mb-6 flex items-center gap-1 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/shop" className="hover:text-accent">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>{product.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {product.collection}
            </p>
            <h1 className="mt-1 font-bold text-3xl text-primary sm:text-4xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3">
              {onSale ? (
                <>
                  <Price amountNGN={product.salePriceNGN as number} className="text-2xl font-bold text-primary" />
                  <Price amountNGN={product.priceNGN} className="text-base text-gray-400 line-through" />
                </>
              ) : (
                <Price amountNGN={product.priceNGN} className="text-2xl font-bold text-primary" />
              )}
            </div>

            <p className="mt-4 text-gray-600">{product.description}</p>

            <div className="mt-8">
              <AddToCartForm product={product} />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 text-sm">
              <div>
                <dt className="text-gray-500">Category</dt>
                <dd className="font-medium text-primary">{product.category}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Availability</dt>
                <dd className="font-medium text-primary">
                  {product.inStock ? "In Stock" : "Sold Out"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <RelatedProducts products={related} />
      </Container>
    </div>
  );
}
