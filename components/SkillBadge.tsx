import { SkillIcon } from "./SkillIcon";

type SkillBadgeProps = {
  name: string;
  iconSlug?: string | null;
  iconUrl?: string | null;
};

export function SkillBadge({ name, iconSlug, iconUrl }: SkillBadgeProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 transition-colors hover:border-blue-500/50">
      <SkillIcon name={name} iconSlug={iconSlug} iconUrl={iconUrl} />
      <span className="text-sm font-medium text-neutral-200">{name}</span>
    </div>
  );
}
