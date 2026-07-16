"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  AwardIcon,
  BriefcaseIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  SkillsIcon,
  UserIcon,
} from "@/components/NavIcons";

type AccentToken =
  | "accent"
  | "accent-secondary"
  | "accent-tertiary"
  | "accent-pink"
  | "accent-mint";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType;
  accent: AccentToken;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: HomeIcon, accent: "accent" },
  { href: "/about", label: "About", icon: UserIcon, accent: "accent-pink" },
  { href: "/skills", label: "Skills", icon: SkillsIcon, accent: "accent-mint" },
  { href: "/portfolio", label: "Projects", icon: FolderIcon, accent: "accent-tertiary" },
  { href: "/experience", label: "Experience", icon: BriefcaseIcon, accent: "accent-secondary" },
  { href: "/certifications", label: "Certifications", icon: AwardIcon, accent: "accent" },
  { href: "/blog", label: "Blog", icon: DocumentIcon, accent: "accent-pink" },
];

const ACCENT_BG: Record<AccentToken, string> = {
  accent: "bg-accent",
  "accent-secondary": "bg-accent-secondary",
  "accent-tertiary": "bg-accent-tertiary",
  "accent-pink": "bg-accent-pink",
  "accent-mint": "bg-accent-mint",
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SitePillNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-full border border-border bg-surface/80 px-2 py-1.5 shadow-lg backdrop-blur-md">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
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
