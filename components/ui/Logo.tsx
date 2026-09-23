import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  size?: number;
  href?: string | null;
  withWordmark?: boolean;
}

export function Logo({
  className,
  imageClassName,
  size = 48,
  href = "/",
  withWordmark = false,
}: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 overflow-hidden",
          imageClassName
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={siteConfig.logo}
          alt="Adaramaluti House of Fashion logo"
          width={size * 2}
          height={size * 2}
          className="h-full w-full object-cover"
          priority
        />
      </span>
      {withWordmark && (
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="font-bold text-primary text-base tracking-tight">
            {siteConfig.shortName}
          </span>
          <span className="text-[11px] uppercase tracking-widest text-gray-500">
            House of Fashion
          </span>
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label={`${siteConfig.name} home`}>
      {content}
    </Link>
  );
}
