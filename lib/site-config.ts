export const siteConfig = {
  name: "Adaramaluti House of Fashion",
  shortName: "Adaramaluti",
  tagline: "Elegance, Tailored for You",
  description:
    "Adaramaluti House of Fashion is a Nigerian luxury fashion house crafting bespoke dresses, suits, native wear and accessories for the modern, elegant individual.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://adaramaluti.com",
  logo: "/images/logo.png",
  email: "hello@adaramaluti.com",
  phone: "+234 801 234 5678",
  whatsapp: "2348012345678",
  address: {
    line1: "12 Adeola Odeku Street",
    line2: "Victoria Island",
    city: "Lagos",
    country: "Nigeria",
  },
  social: {
    instagram: "https://instagram.com/adaramaluti",
    facebook: "https://facebook.com/adaramaluti",
    twitter: "https://twitter.com/adaramaluti",
    tiktok: "https://tiktok.com/@adaramaluti",
    pinterest: "https://pinterest.com/adaramaluti",
  },
} as const;

export const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/bespoke", label: "Bespoke" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLinks = {
  shop: [
    { href: "/shop", label: "All Products" },
    { href: "/collections", label: "Collections" },
    { href: "/shop?category=Dresses", label: "Dresses" },
    { href: "/shop?category=Suits", label: "Suits" },
    { href: "/shop?category=Native+Wear", label: "Native Wear" },
    { href: "/shop?category=Accessories", label: "Accessories" },
  ],
  customerService: [
    { href: "/contact", label: "Contact Us" },
    { href: "/bespoke", label: "Bespoke Orders" },
    { href: "/shipping-returns", label: "Shipping & Returns" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
} as const;
