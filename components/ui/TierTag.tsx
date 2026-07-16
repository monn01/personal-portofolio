const TIER_STYLES: Record<string, string> = {
  international: "bg-accent-tertiary/15 text-accent-tertiary border-accent-tertiary/40",
  local: "bg-surface-hover text-muted-foreground border-border",
};

const DEFAULT_STYLE = "bg-surface-hover text-muted-foreground border-border";

type TierTagProps = {
  tier: string;
  className?: string;
};

export function TierTag({ tier, className = "" }: TierTagProps) {
  const style = TIER_STYLES[tier] ?? DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black tracking-wide uppercase ${style} ${className}`}
    >
      {tier}
    </span>
  );
}
