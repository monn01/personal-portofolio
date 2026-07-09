"use client";

import Link from "next/link";
import { useState } from "react";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  email,
}: {
  links: NavLink[];
  email?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Toggle menu"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 text-neutral-300"
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
      </button>

      {isOpen && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
            >
              {link.label}
            </Link>
          ))}
          {email && (
            <a
              href={`mailto:${email}`}
              onClick={() => setIsOpen(false)}
              className="mt-1 rounded-full bg-blue-600 px-2 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              Contact
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
