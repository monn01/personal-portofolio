import Link from "next/link";
import { RipplePanel } from "@/components/ui/RipplePanel";

const CERTIFICATE_PATH =
  "M9 12.75l1.5 1.5L15 9.75m-8.25 9.44V21l3.114-1.297a1.5 1.5 0 011.172 0L15 21v-1.81M8.25 6a3.75 3.75 0 117.5 0v6.577a3.75 3.75 0 01-1.098 2.652L12 17.877l-2.652-2.648A3.75 3.75 0 018.25 12.577V6z";
const TROPHY_PATH =
  "M7 4h10v4a5 5 0 01-10 0V4zM7 5.5H4.5A2.5 2.5 0 007 9M17 5.5h2.5A2.5 2.5 0 0117 9M12 13v3.5m-3 3.5h6m-3-3.5a3.5 3.5 0 003.5-3.5";

type CertAwardPreviewCardProps = {
  title: string;
  imageUrl?: string | null;
  kind: "certification" | "achievement";
};

export function CertAwardPreviewCard({
  title,
  imageUrl,
  kind,
}: CertAwardPreviewCardProps) {
  return (
    <RipplePanel className="overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-mint/50 hover:shadow-xl hover:shadow-accent-mint/10">
      <Link href="/certifications" className="relative block aspect-[4/3] w-full">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent-tertiary/10 text-accent-tertiary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-14 w-14"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={kind === "achievement" ? TROPHY_PATH : CERTIFICATE_PATH}
              />
            </svg>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 pt-10">
          <p className="truncate text-sm font-black text-white">{title}</p>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-mint text-background shadow-lg transition-transform duration-300 group-hover:translate-x-0.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
            </svg>
          </span>
        </div>
      </Link>
    </RipplePanel>
  );
}
