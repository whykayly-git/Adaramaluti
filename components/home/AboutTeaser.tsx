import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { unsplash } from "@/lib/unsplash";

export function AboutTeaser() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
          <Image
            src={unsplash("1506629082955-511b1aa562c8", 1000, 1250)}
            alt="The Adaramaluti design atelier in Lagos"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            The Designer
          </p>
          <h2 className="font-bold text-3xl text-primary sm:text-4xl">
            Rooted in Lagos, worn around the world
          </h2>
          <p className="mt-4 text-gray-600">
            Every Adaramaluti piece begins in our Ogun State atelier, where a small team of
            master tailors and embroiderers bring each design to life by hand. We blend
            traditional Nigerian craftsmanship with contemporary silhouettes for the modern,
            elegant individual.
          </p>
          <Button href="/about" variant="outline" className="mt-6">
            Our Story
          </Button>
        </div>
      </Container>
    </section>
  );
}
