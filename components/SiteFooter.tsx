import Link from "next/link";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { getProfile } from "@/lib/queries";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/portfolio", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/certifications", label: "Certifications" },
];

export async function SiteFooter() {
  const profile = await getProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">
              {profile?.name ?? "Portfolio"}
            </p>
            <p className="mt-2 line-clamp-3 max-w-xs text-sm text-muted-foreground">
              {profile?.bio ?? "Personal portfolio & profil profesional."}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Quick Links
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Contact</p>
            <ul className="mt-3 flex flex-col gap-2">
              {profile?.email && (
                <li>
                  <MagneticButton strength={0.3} className="inline-block">
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {profile.email}
                    </a>
                  </MagneticButton>
                </li>
              )}
              {profile?.contactLinks.map((link) => (
                <li key={link.url}>
                  <MagneticButton strength={0.3} className="inline-block">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </MagneticButton>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-subtle-foreground">
          © {year} {profile?.name ?? "Portfolio"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
