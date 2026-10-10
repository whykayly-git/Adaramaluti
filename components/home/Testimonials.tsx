import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllTestimonials } from "@/data/testimonials";

export function Testimonials() {
  const testimonials = getAllTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-primary py-16 text-white sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Client Love"
          title="What Our Clients Say"
          className="mx-auto text-white [&_h2]:text-white [&_p]:text-white/70"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="rounded-2xl bg-white/10 p-6">
              <div className="mb-3 flex gap-1 text-accent">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm text-white/90">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">
                {t.name} <span className="font-normal text-white/60">— {t.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
