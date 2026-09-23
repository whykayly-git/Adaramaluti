import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";
import { unsplash } from "@/lib/unsplash";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-light">
      <Container className="grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm">
            <Image
              src={siteConfig.logo}
              alt="Adaramaluti House of Fashion logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              priority
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {siteConfig.shortName}
            </span>
          </div>
          <h1 className="font-bold text-4xl leading-tight text-primary sm:text-5xl lg:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-5 max-w-md text-gray-600">
            Bespoke gowns, sharply tailored suits and hand-embroidered native wear, crafted in
            Lagos and shipped worldwide.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/shop" size="lg">
              Shop Collection
            </Button>
            <Button href="/bespoke" size="lg" variant="outline">
              Request Bespoke
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl">
          <Image
            src={unsplash("1490481651871-ab68de25d43d", 1000, 1250)}
            alt="Adaramaluti House of Fashion model in a signature gown"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
