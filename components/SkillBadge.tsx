import { SkillIcon } from "./SkillIcon";

type SkillBadgeProps = {
  name: string;
  iconSlug?: string | null;
  iconUrl?: string | null;
};

export function SkillBadge({ name, iconSlug, iconUrl }: SkillBadgeProps) {
  const hasIcon = Boolean(iconUrl || iconSlug);

  return (
    <div
      className={`group flex items-center rounded-full border border-border bg-surface/70 px-4 py-2 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-accent/60 hover:bg-surface hover:shadow-lg hover:shadow-accent/10 ${hasIcon ? "gap-2.5" : ""}`}
    >
      {hasIcon && (
        <SkillIcon
          name={name}
          iconSlug={iconSlug}
          iconUrl={iconUrl}
          className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
          useBrandColor
        />
      )}
      <span className="text-sm font-bold text-foreground-secondary transition-colors duration-300 group-hover:text-foreground">
        {name}
      </span>
    </div>
  );
}
