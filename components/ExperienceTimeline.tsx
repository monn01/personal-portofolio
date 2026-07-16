import { ExpandableDetails } from "@/components/ui/ExpandableDetails";
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

export function ExperienceTimeline({
  experiences,
  collapsibleDescription = false,
}: {
  experiences: ExperienceItem[];
  collapsibleDescription?: boolean;
}) {
  return (
    <ol className="flex flex-col gap-8">
      {experiences.map((experience, index) => (
        <li key={experience.id} className="group flex gap-4">
          <div className="flex flex-col items-center">
            <span className="h-3 w-3 shrink-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
            {index < experiences.length - 1 && (
              <span className="mt-1 w-px flex-1 bg-surface-hover" />
            )}
          </div>

          <RipplePanel className="-mx-3 flex-1 rounded-lg px-3 pb-2 transition-colors duration-300 hover:bg-surface">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {experience.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={experience.imageUrl}
                  alt={experience.title}
                  className="h-32 w-full shrink-0 rounded-lg border border-border bg-surface-hover object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-24 sm:w-36"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-105">
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
                      d="M3.75 8.25A2.25 2.25 0 016 6h12a2.25 2.25 0 012.25 2.25v9A2.25 2.25 0 0118 19.5H6a2.25 2.25 0 01-2.25-2.25v-9zM9 6V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V6M3.75 12.75h16.5"
                    />
                  </svg>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-subtle-foreground">
                  {formatDate(experience.startDate)} —{" "}
                  {experience.endDate
                    ? formatDate(experience.endDate)
                    : "Sekarang"}
                </p>
                <h3 className="mt-1 text-lg font-black text-foreground">
                  {experience.title}
                </h3>
                <p className="text-sm font-medium text-accent">
                  {experience.organization}
                </p>
                {collapsibleDescription ? (
                  <ExpandableDetails
                    text={experience.description}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {experience.description}
                  </p>
                )}
              </div>
            </div>
          </RipplePanel>
        </li>
      ))}
    </ol>
  );
}
