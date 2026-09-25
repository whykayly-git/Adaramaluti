import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CurrencyInitializer } from "@/components/layout/CurrencyInitializer";
import { getSiteSettings } from "@/lib/site-settings";
import { getAllProducts } from "@/data/products";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: `${settings.name} | ${settings.tagline}`,
      template: `%s | ${settings.shortName}`,
    },
    description: settings.description,
    openGraph: {
      title: settings.name,
      description: settings.description,
      url: settings.url,
      siteName: settings.name,
      images: ["/opengraph-image"],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.name,
      description: settings.description,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const products = getAllProducts();
  const settings = getSiteSettings();

  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LoadingScreen settings={settings} />
        <CurrencyInitializer />
        <Navbar products={products} settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <CartDrawer />
        <WhatsAppButton settings={settings} />
      </body>
    </html>
  );
}
