"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Container } from "@/components/ui/Container";
import { footerLinks } from "@/lib/site-config";
import type { SiteSettings } from "@/lib/site-settings";

const paymentLogos = ["Visa", "Mastercard", "Verve", "Paystack", "Stripe", "Flutterwave"];

export function Footer({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-primary text-white">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="inline-flex rounded-2xl bg-white p-4">
              <Logo
                size={56}
                href="/"
                withWordmark={false}
                src={settings.logo}
                name={settings.name}
                shortName={settings.shortName}
              />
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/70">{settings.description}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={settings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-accent"
              >
                <SocialIcon name="instagram" />
              </a>
              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-accent"
              >
                <SocialIcon name="facebook" />
              </a>
              <a
                href={settings.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-accent"
              >
                <SocialIcon name="twitter" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Shop</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Customer Service
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.customerService.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {settings.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {settings.phone}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {settings.address.line1}, {settings.address.line2}, {settings.address.city}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-white/70">
              Be the first to know about new collections and private trunk shows.
            </p>
            <form onSubmit={onSubmit} className="mt-3 flex gap-2">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm placeholder:text-white/50 focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold hover:bg-accent/90"
              >
                Join
              </button>
            </form>
            {submitted && (
              <p className="mt-2 text-xs text-accent">Thank you for subscribing!</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-3">
            {paymentLogos.map((name) => (
              <li
                key={name}
                className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/70"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
