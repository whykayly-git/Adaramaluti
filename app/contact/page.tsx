import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  const message = encodeURIComponent("Hello Adaramaluti House of Fashion, I'd like to make an enquiry.");

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Get in Touch"
          title="Contact Us"
          description="Questions about an order, bespoke piece or collaboration? We'd love to hear from you."
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
          <ContactForm />

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 p-6">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold text-primary">Email</p>
                    <p className="text-gray-600">{siteConfig.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold text-primary">Phone</p>
                    <p className="text-gray-600">{siteConfig.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold text-primary">Atelier</p>
                    <p className="text-gray-600">
                      {siteConfig.address.line1}, {siteConfig.address.line2},{" "}
                      {siteConfig.address.city}, {siteConfig.address.country}
                    </p>
                  </div>
                </li>
              </ul>

              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>

            <div className="flex h-56 items-center justify-center rounded-2xl bg-light text-sm text-gray-500">
              Map placeholder — {siteConfig.address.city}, {siteConfig.address.country}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
