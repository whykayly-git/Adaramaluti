import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-gray-200",
          currentPage === 1 ? "pointer-events-none opacity-40" : "hover:border-accent"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium",
            page === currentPage ? "bg-primary text-white" : "border border-gray-200 hover:border-accent"
          )}
        >
          {page}
        </Link>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-gray-200",
          currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:border-accent"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
