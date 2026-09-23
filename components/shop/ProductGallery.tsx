"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-light">
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "relative h-20 w-16 overflow-hidden rounded-lg ring-2 ring-offset-2",
                active === i ? "ring-accent" : "ring-transparent"
              )}
            >
              <Image src={image} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
