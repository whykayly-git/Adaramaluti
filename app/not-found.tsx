import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/site-settings";

export default function NotFound() {
  const settings = getSiteSettings();

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <Image
        src={settings.logo}
        alt={`${settings.name} logo`}
        width={72}
        height={72}
        className="h-18 w-18 rounded-full object-cover shadow-lg"
      />
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-2 font-bold text-3xl text-primary sm:text-4xl">Page Not Found</h1>
      <p className="mt-3 max-w-md text-gray-600">
        The page you&rsquo;re looking for may have been moved or no longer exists. Let&rsquo;s get
        you back to something beautiful.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Back Home</Button>
        <Button href="/shop" variant="outline">
          Shop Collection
        </Button>
      </div>
    </Container>
  );
}
