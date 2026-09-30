import Link from "next/link";
import { School } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { StaffCta } from "@/components/landing/staff-cta";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#get-started", label: "Get started" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <School className="size-4" />
          </span>
          SMS Registry
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <StaffCta size="sm" />
        </div>
      </div>
    </header>
  );
}
