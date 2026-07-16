"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCENT_BG, isNavActive, MOBILE_TAB_ITEMS } from "@/lib/nav";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-between px-1">
        {MOBILE_TAB_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className="relative flex flex-1 flex-col items-center justify-center py-2.5"
            >
              {active && (
                <motion.span
                  layoutId="mobileActiveTab"
                  className={`absolute h-8 w-8 rounded-2xl ${ACCENT_BG[item.accent]}`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`relative h-5 w-5 transition-colors ${
                  active ? "text-white" : "text-muted-foreground"
                }`}
              >
                <Icon />
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
