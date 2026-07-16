"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type NavLink = { href: string; label: string };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav({ links }: { links: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={{ scale: 0.9 }}
        aria-expanded={isOpen}
        aria-label="Toggle menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground-secondary"
      >
        <span className="sr-only">Toggle menu</span>
        {isOpen ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-4 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-border bg-surface p-3 shadow-xl"
          >
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <motion.div key={link.href} whileTap={{ scale: 0.96 }}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                      active
                        ? "bg-accent text-white"
                        : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
            <Button
              href="/contact"
              onClick={() => setIsOpen(false)}
              variant="primary"
              tone="bold"
              className="mt-1"
            >
              Contact
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
