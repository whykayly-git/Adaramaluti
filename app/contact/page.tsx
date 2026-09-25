import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteSettings } from "@/lib/site-settings";
import { getPageContent } from "@/lib/page-content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return {
    title: "Contact",
    description: `Get in touch with ${settings.name}.`,
  };
}

export default function ContactPage() {
  const settings = getSiteSettings();
  const intro = getPageContent("contact_intro");
  const message = encodeURIComponent(`Hello ${settings.name}, I'd like to make an enquiry.`);

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Get in Touch" title="Contact Us" description={intro} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
          <ContactForm />

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 p-6">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold text-primary">Email</p>
                    <p className="text-gray-600">{settings.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold text-primary">Phone</p>
                    <p className="text-gray-600">{settings.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold text-primary">Atelier</p>
                    <p className="text-gray-600">
                      {settings.address.line1}, {settings.address.line2},{" "}
                      {settings.address.city}, {settings.address.country}
                    </p>
                  </div>
                </li>
              </ul>

              <a
                href={`https://wa.me/${settings.whatsapp}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>

            <div className="flex h-56 items-center justify-center rounded-2xl bg-light text-sm text-gray-500">
              Map placeholder — {settings.address.city}, {settings.address.country}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
