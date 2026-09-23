import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { NewArrivals } from "@/components/home/NewArrivals";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <NewArrivals />
      <AboutTeaser />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
