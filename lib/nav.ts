import type { ComponentType } from "react";
import {
  AwardIcon,
  BriefcaseIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  MailIcon,
  SkillsIcon,
  UserIcon,
} from "@/components/NavIcons";

export type AccentToken =
  | "accent"
  | "accent-secondary"
  | "accent-tertiary"
  | "accent-pink"
  | "accent-mint";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType;
  accent: AccentToken;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: HomeIcon, accent: "accent" },
  { href: "/about", label: "About", icon: UserIcon, accent: "accent-pink" },
  { href: "/skills", label: "Skills", icon: SkillsIcon, accent: "accent-mint" },
  { href: "/portfolio", label: "Projects", icon: FolderIcon, accent: "accent-tertiary" },
  { href: "/experience", label: "Experience", icon: BriefcaseIcon, accent: "accent-secondary" },
  { href: "/certifications", label: "Certifications", icon: AwardIcon, accent: "accent" },
  { href: "/blog", label: "Blog", icon: DocumentIcon, accent: "accent-pink" },
];

export const MOBILE_TAB_ITEMS: NavItem[] = [
  ...NAV_ITEMS,
  { href: "/contact", label: "Contact", icon: MailIcon, accent: "accent-secondary" },
];

export const ACCENT_BG: Record<AccentToken, string> = {
  accent: "bg-accent",
  "accent-secondary": "bg-accent-secondary",
  "accent-tertiary": "bg-accent-tertiary",
  "accent-pink": "bg-accent-pink",
  "accent-mint": "bg-accent-mint",
};

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
