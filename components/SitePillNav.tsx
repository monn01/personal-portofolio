"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCENT_BG, isNavActive, NAV_ITEMS } from "@/lib/nav";

export function SitePillNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-full border border-border bg-surface/80 px-2 py-1.5 shadow-lg backdrop-blur-md">
      {NAV_ITEMS.map((item) => {
        const active = isNavActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className="relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition-colors"
          >
            {active && (
              <motion.span
                layoutId="activeNav"
                className={`absolute inset-0 -z-10 rounded-full ${ACCENT_BG[item.accent]}`}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`h-4 w-4 ${active ? "text-white" : "text-muted-foreground"}`}
            >
              <Icon />
            </span>
            <span
              className={`hidden xl:block ${active ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
