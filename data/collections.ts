import { unsplash } from "@/lib/unsplash";
import type { Collection } from "@/types";

export const collections: Collection[] = [
  {
    slug: "signature-evening",
    name: "Signature Evening",
    description:
      "Floor-length gowns and cocktail pieces designed for galas, weddings and unforgettable nights.",
    image: unsplash("1489987707025-afc232f7ea0f", 1400, 1000),
  },
  {
    slug: "boardroom",
    name: "Boardroom",
    description: "Sharply tailored suiting for the woman and man who lead the room.",
    image: unsplash("1506629082955-511b1aa562c8", 1400, 1000),
  },
  {
    slug: "heritage",
    name: "Heritage",
    description: "Hand-embroidered native wear celebrating Nigerian craftsmanship and ceremony.",
    image: unsplash("1441984904996-e0b6ba687e04", 1400, 1000),
  },
  {
    slug: "everyday-luxe",
    name: "Everyday Luxe",
    description: "Considered accessories and easy separates for effortless, elevated days.",
    image: unsplash("1520975954732-35dd22299614", 1400, 1000),
  },
  {
    slug: "city-edit",
    name: "City Edit",
    description: "Modern staples that move seamlessly from the studio to the street.",
    image: unsplash("1445205170230-053b83016050", 1400, 1000),
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
