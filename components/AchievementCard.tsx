import { ExpandableDetails } from "@/components/ui/ExpandableDetails";
import { RipplePanel } from "@/components/ui/RipplePanel";
import { TierTag } from "@/components/ui/TierTag";

type AchievementCardProps = {
  title: string;
  description: string | null;
  organizer: string;
  year: number;
  tier: string;
  certificateUrl: string | null;
  collapsibleDescription?: boolean;
};

export function AchievementCard({
  title,
  description,
  organizer,
  year,
  tier,
  certificateUrl,
  collapsibleDescription = false,
}: AchievementCardProps) {
  return (
    <RipplePanel className="rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-tertiary/50 hover:shadow-xl hover:shadow-accent-tertiary/10">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tertiary/15 text-accent-tertiary">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 4h10v4a5 5 0 01-10 0V4zM7 5.5H4.5A2.5 2.5 0 007 9M17 5.5h2.5A2.5 2.5 0 0117 9M12 13v3.5m-3 3.5h6m-3-3.5a3.5 3.5 0 003.5-3.5"
          />
        </svg>
      </div>

      <div className="mt-4">
        <TierTag tier={tier} />
      </div>

      <h3 className="mt-2 text-lg font-black tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {organizer} · {year}
      </p>

      {description &&
        (collapsibleDescription ? (
          <ExpandableDetails text={description} className="mt-3" />
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
            {description}
          </p>
        ))}

      {certificateUrl && (
        <a
          href={certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-tertiary transition-colors hover:text-accent"
        >
          Tampilkan Sertifikat ↗
        </a>
      )}
    </RipplePanel>
  );
}
