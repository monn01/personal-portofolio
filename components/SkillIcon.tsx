import { getSimpleIconHex, getSimpleIconMarkup } from "@/lib/simple-icon";

type SkillIconProps = {
  name: string;
  iconSlug?: string | null;
  iconUrl?: string | null;
  className?: string;
  useBrandColor?: boolean;
};

export function SkillIcon({
  name,
  iconSlug,
  iconUrl,
  className = "h-6 w-6",
  useBrandColor = false,
}: SkillIconProps) {
  if (iconUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={iconUrl}
        alt={name}
        className={`${className} object-contain`}
      />
    );
  }

  const markup = iconSlug ? getSimpleIconMarkup(iconSlug) : null;
  if (markup) {
    const hex = useBrandColor && iconSlug ? getSimpleIconHex(iconSlug) : null;
    return (
      <span
        aria-hidden="true"
        className={`${className} inline-block ${hex ? "" : "text-foreground-secondary"}`}
        style={hex ? { color: hex } : undefined}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }

  return null;
}
