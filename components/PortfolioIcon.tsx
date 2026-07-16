const CATEGORY_ICON_PATH: Record<string, string> = {
  web: "M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a13.5 13.5 0 010 18 13.5 13.5 0 010-18z",
  app: "M7 4.5A1.5 1.5 0 018.5 3h7A1.5 1.5 0 0117 4.5v15a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 19.5v-15zM11 18h2",
  design:
    "M12 21a9 9 0 110-18 6 6 0 016 6c0 1.657-1.343 3-3 3h-1.5a1.5 1.5 0 000 3H15a1.5 1.5 0 010 3h-3zM7.5 12a1 1 0 100-2 1 1 0 000 2zM9.5 8a1 1 0 100-2 1 1 0 000 2zM14 8a1 1 0 100-2 1 1 0 000 2z",
};

const CATEGORY_COLOR_CLASSES: Record<string, string> = {
  web: "bg-accent/10 text-accent",
  app: "bg-accent-secondary/10 text-accent-secondary",
  design: "bg-accent-tertiary/10 text-accent-tertiary",
};

const DEFAULT_COLOR_CLASS = "bg-accent/10 text-accent";

type PortfolioIconProps = {
  category: string;
  className?: string;
};

/** Bare category glyph (no background/sizing beyond className) — used inside PortfolioThumbnail's fallback. */
export function PortfolioIcon({ category, className = "h-8 w-8" }: PortfolioIconProps) {
  const path = CATEGORY_ICON_PATH[category];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path ?? CATEGORY_ICON_PATH.web} />
    </svg>
  );
}

type PortfolioThumbnailProps = {
  category: string;
  thumbnailUrl?: string | null;
  title: string;
  className?: string;
  iconClassName?: string;
};

/** Fills its container: the real thumbnail image, or a colored category-icon fallback when none was uploaded. */
export function PortfolioThumbnail({
  category,
  thumbnailUrl,
  title,
  className = "",
  iconClassName = "h-10 w-10",
}: PortfolioThumbnailProps) {
  if (thumbnailUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={thumbnailUrl} alt={title} className={`object-cover ${className}`} />
    );
  }

  const colorClass = CATEGORY_COLOR_CLASSES[category] ?? DEFAULT_COLOR_CLASS;

  return (
    <div className={`flex items-center justify-center ${colorClass} ${className}`}>
      <PortfolioIcon category={category} className={iconClassName} />
    </div>
  );
}
