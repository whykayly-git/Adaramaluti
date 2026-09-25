import { unsplash } from "@/lib/unsplash";

/** Initial lookbook gallery, loaded into the database once on first run. Edit afterwards via /admin/lookbook. */
export const seedLookbookImages = [
  { url: unsplash("1490481651871-ab68de25d43d", 900, 1200), alt: "Adaramaluti lookbook editorial 1" },
  { url: unsplash("1595777457583-95e059d581b8", 900, 1200), alt: "Adaramaluti lookbook editorial 2" },
  { url: unsplash("1543163521-1bf539c55dd2", 900, 1200), alt: "Adaramaluti lookbook editorial 3" },
  { url: unsplash("1591047139829-d91aecb6caea", 900, 1200), alt: "Adaramaluti lookbook editorial 4" },
  { url: unsplash("1483985988355-763728e1935b", 900, 1200), alt: "Adaramaluti lookbook editorial 5" },
  { url: unsplash("1600091166971-7f9faad6c1e2", 900, 1200), alt: "Adaramaluti lookbook editorial 6" },
  { url: unsplash("1622470953794-aa9c70b0fb9d", 900, 1200), alt: "Adaramaluti lookbook editorial 7" },
  { url: unsplash("1523293182086-7651a899d37f", 900, 1200), alt: "Adaramaluti lookbook editorial 8" },
  { url: unsplash("1544441893-675973e31985", 900, 1200), alt: "Adaramaluti lookbook editorial 9" },
];
