"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="rounded-3xl bg-light px-6 py-14 text-center sm:px-16">
          <h2 className="font-bold text-3xl text-primary sm:text-4xl">Join the Inner Circle</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-600">
            Get early access to new collections, trunk shows and private styling sessions.
          </p>
          {submitted ? (
            <p className="mt-6 font-semibold text-accent">
              Thank you for joining — welcome to Adaramaluti.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="home-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="home-newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm focus:border-accent focus:outline-none"
              />
              <Button type="submit" className="shrink-0">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
