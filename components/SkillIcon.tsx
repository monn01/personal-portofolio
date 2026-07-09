import { getSimpleIconMarkup } from "@/lib/simple-icon";

type SkillIconProps = {
  name: string;
  iconSlug?: string | null;
  iconUrl?: string | null;
  className?: string;
};

export function SkillIcon({
  name,
  iconSlug,
  iconUrl,
  className = "h-6 w-6",
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
    return (
      <span
        aria-hidden="true"
        className={`${className} inline-block text-neutral-300`}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${className} inline-flex items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-300`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
