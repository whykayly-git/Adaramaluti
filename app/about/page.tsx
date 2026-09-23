import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";
import { unsplash } from "@/lib/unsplash";

export const metadata: Metadata = {
  title: "About",
  description: `The story, philosophy and craftsmanship behind ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-light px-4 py-2">
              <Image
                src={siteConfig.logo}
                alt="Adaramaluti House of Fashion logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Our Story
              </span>
            </div>
            <h1 className="font-bold text-4xl text-primary sm:text-5xl">
              Crafted with Purpose, Worn with Pride
            </h1>
            <p className="mt-5 text-gray-600">
              Adaramaluti House of Fashion was founded in Lagos with a singular belief: that
              clothing should tell a story. What began as a small tailoring studio has grown into
              a respected atelier, dressing clients across Nigeria, the UK, the US and beyond for
              weddings, ceremonies, galas and everyday elegance.
            </p>
            <p className="mt-4 text-gray-600">
              Our founder&rsquo;s vision was simple — blend the richness of Nigerian textile
              heritage with the precision of modern tailoring. Every piece that leaves our atelier
              carries that promise.
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
            <Image
              src={unsplash("1489987707025-afc232f7ea0f", 1000, 1250)}
              alt="Adaramaluti House of Fashion designer at work"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <h3 className="font-bold text-xl text-primary">Craftsmanship</h3>
            <p className="mt-2 text-sm text-gray-600">
              Every garment is cut, sewn and finished by hand by master tailors and embroiderers
              in our Victoria Island atelier.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl text-primary">Heritage</h3>
            <p className="mt-2 text-sm text-gray-600">
              We draw on Nigerian textile traditions — Aso-Oke, Ankara and hand embroidery — and
              reinterpret them for the modern wardrobe.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl text-primary">Sustainability</h3>
            <p className="mt-2 text-sm text-gray-600">
              We make to order wherever possible, reducing waste and ensuring every piece is
              treated as an investment, not a trend.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="Philosophy" title="Elegance, Tailored for You" />
          <p className="mt-4 max-w-2xl text-gray-600">
            We believe true luxury lies in the details — a perfect fit, a considered fabric
            choice, a finish that lasts. Our philosophy is to dress our clients not for a single
            moment, but for a lifetime of moments that matter.
          </p>
        </div>
      </Container>
    </div>
  );
}
