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

type PortfolioIconProps = {
  category: string;
  thumbnailUrl?: string | null;
  title: string;
  className?: string;
};

export function PortfolioIcon({
  category,
  thumbnailUrl,
  title,
  className = "h-8 w-8",
}: PortfolioIconProps) {
  if (thumbnailUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={thumbnailUrl}
        alt={title}
        className={`${className} rounded-xl object-cover`}
      />
    );
  }

  const path = CATEGORY_ICON_PATH[category];
  if (path) {
    const colorClass = CATEGORY_COLOR_CLASSES[category] ?? "bg-accent/10 text-accent";
    return (
      <span
        className={`${className} flex items-center justify-center rounded-xl ${colorClass}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-1/2 w-1/2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${className} flex items-center justify-center rounded-xl bg-surface-hover text-sm font-semibold text-foreground-secondary`}
    >
      {title.charAt(0).toUpperCase()}
    </span>
  );
}
