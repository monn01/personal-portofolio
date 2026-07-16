import { BriefcaseIcon } from "@/components/NavIcons";
import { RipplePanel } from "@/components/ui/RipplePanel";
import { formatDate } from "@/lib/format";

type ExperienceItem = {
  id: string;
  title: string;
  organization: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  imageUrl?: string | null;
};

function DescriptionList({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((line) => line.trim().replace(/^[-•]\s*/, ""))
    .filter(Boolean);

  if (lines.length <= 1) {
    return (
      <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">
        {text}
      </p>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-2">
      {lines.map((line, i) => (
        <li
          key={i}
          className="flex gap-2.5 text-sm leading-relaxed text-foreground-secondary"
        >
          <span
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-secondary"
            aria-hidden="true"
          />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

export function ExperienceShowcase({
  experiences,
}: {
  experiences: ExperienceItem[];
}) {
  return (
    <ol className="flex flex-col gap-6">
      {experiences.map((experience, index) => {
        const isCurrent = !experience.endDate;

        return (
          <li key={experience.id}>
            <RipplePanel className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-secondary/50 hover:shadow-xl hover:shadow-accent-secondary/10 sm:p-8">
              <span
                className="pointer-events-none absolute -top-4 -right-2 text-7xl font-black text-foreground/5 select-none sm:text-8xl"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                {experience.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={experience.imageUrl}
                    alt={experience.title}
                    className="h-14 w-14 shrink-0 rounded-xl border border-border bg-surface-hover object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-secondary/15 p-3.5 text-accent-secondary">
                    <BriefcaseIcon />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                      isCurrent
                        ? "border-accent-mint/40 bg-accent-mint/10 text-accent-mint"
                        : "border-border text-subtle-foreground"
                    }`}
                  >
                    {isCurrent && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-accent-mint"
                        aria-hidden="true"
                      />
                    )}
                    {formatDate(experience.startDate)} —{" "}
                    {isCurrent ? "Sekarang" : formatDate(experience.endDate!)}
                  </span>

                  <h3 className="mt-3 text-2xl font-black tracking-tight text-foreground">
                    {experience.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-accent-secondary">
                    {experience.organization}
                  </p>

                  <DescriptionList text={experience.description} />
                </div>
              </div>
            </RipplePanel>
          </li>
        );
      })}
    </ol>
  );
}
