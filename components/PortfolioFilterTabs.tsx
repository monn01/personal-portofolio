import Link from "next/link";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";

const CATEGORIES: { value: string | null; label: string }[] = [
  { value: null, label: "Semua" },
  ...PORTFOLIO_CATEGORIES.map((category) => ({
    value: category as string,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  })),
];

const ACTIVE_STYLES: Record<string, string> = {
  web: "border-accent bg-accent text-white shadow-lg shadow-accent/20",
  app: "border-accent-secondary bg-accent-secondary text-white shadow-lg shadow-accent-secondary/20",
  design:
    "border-accent-tertiary bg-accent-tertiary text-white shadow-lg shadow-accent-tertiary/20",
};

const DEFAULT_ACTIVE_STYLE =
  "border-accent bg-accent text-white shadow-lg shadow-accent/20";

type PortfolioFilterTabsProps = {
  active: string | null;
};

export function PortfolioFilterTabs({ active }: PortfolioFilterTabsProps) {
  return (
    <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {CATEGORIES.map((category) => {
        const isActive = category.value === active;
        return (
          <Link
            key={category.label}
            href={category.value ? `/portfolio?category=${category.value}` : "/portfolio"}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
              isActive
                ? (category.value ? ACTIVE_STYLES[category.value] : null) ??
                  DEFAULT_ACTIVE_STYLE
                : "border-border bg-surface text-foreground-secondary hover:border-accent/60 hover:bg-surface-hover hover:text-foreground hover:shadow-accent/10"
            }`}
          >
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}
