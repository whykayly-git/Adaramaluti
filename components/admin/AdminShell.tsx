import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { getAdminSessionForPage } from "@/lib/require-admin";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin", label: "Submissions" },
  { href: "/admin/products", label: "Shop" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/lookbook", label: "Lookbook" },
  { href: "/admin/admins", label: "Admins" },
];

export async function AdminShell({
  children,
  activePath,
}: {
  children: React.ReactNode;
  activePath: string;
}) {
  const session = await getAdminSessionForPage();

  return (
    <div className="min-h-screen bg-light">
      <div className="bg-white">
        <Container className="flex items-center justify-between py-4">
          <Logo size={40} href={null} withWordmark />
          <div className="flex items-center gap-4">
            {session && <span className="hidden text-sm text-gray-500 sm:block">{session.email}</span>}
            <LogoutButton />
          </div>
        </Container>
        <Container>
          <nav className="flex gap-1 overflow-x-auto pb-2" aria-label="Admin">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium",
                  activePath === link.href
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-light"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
      <Container className="py-10">{children}</Container>
    </div>
  );
}
