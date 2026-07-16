"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
};

export function AdminSidebarNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {items.map((item) => {
        const isActive =
          item.href === "/admin/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
              isActive
                ? "bg-accent text-white shadow-md shadow-accent/20"
                : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center ${isActive ? "text-white" : "text-subtle-foreground"}`}
            >
              {item.icon}
            </span>
            {item.label}
            {item.badge != null && item.badge > 0 && (
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-accent text-white"
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
