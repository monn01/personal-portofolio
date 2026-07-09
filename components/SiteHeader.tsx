import Link from "next/link";
import { getProfile } from "@/lib/queries";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/portfolio", label: "Projects" },
];

export async function SiteHeader() {
  const profile = await getProfile();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-neutral-100"
        >
          {profile?.name ?? "Portfolio"}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {profile?.email && (
          <a
            href={`mailto:${profile.email}`}
            className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 md:inline-block"
          >
            Contact
          </a>
        )}

        <MobileNav links={NAV_LINKS} email={profile?.email} />
      </div>
    </header>
  );
}
