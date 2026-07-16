const CATEGORY_STYLES: Record<string, string> = {
  web: "bg-accent/15 text-accent border-accent/40",
  app: "bg-accent-secondary/15 text-accent-secondary border-accent-secondary/40",
  design: "bg-accent-tertiary/15 text-accent-tertiary border-accent-tertiary/40",
};

const DEFAULT_STYLE = "bg-surface-hover text-muted-foreground border-border";

type CategoryTagProps = {
  category: string;
  className?: string;
};

export function CategoryTag({ category, className = "" }: CategoryTagProps) {
  const style = CATEGORY_STYLES[category] ?? DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black tracking-wide uppercase ${style} ${className}`}
    >
      {category}
    </span>
  );
}
