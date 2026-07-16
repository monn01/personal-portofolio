import { RipplePanel } from "@/components/ui/RipplePanel";
import { formatDate } from "@/lib/format";

type CertificationCardProps = {
  title: string;
  issuer: string;
  issueDate: Date;
  credentialUrl?: string | null;
  imageUrl: string;
};

export function CertificationCard({
  title,
  issuer,
  issueDate,
  credentialUrl,
  imageUrl,
}: CertificationCardProps) {
  return (
    <RipplePanel className="rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-tertiary/50 hover:shadow-xl hover:shadow-accent-tertiary/10">
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="h-40 w-full bg-surface-hover object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-tertiary text-white shadow-lg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75l1.5 1.5L15 9.75m-8.25 9.44V21l3.114-1.297a1.5 1.5 0 011.172 0L15 21v-1.81M8.25 6a3.75 3.75 0 117.5 0v6.577a3.75 3.75 0 01-1.098 2.652L12 17.877l-2.652-2.648A3.75 3.75 0 018.25 12.577V6z"
            />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-black tracking-tight text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{issuer}</p>
        <p className="mt-1 text-xs text-subtle-foreground">{formatDate(issueDate)}</p>

        {credentialUrl && (
          <a
            href={credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-tertiary transition-colors hover:text-accent"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            Lihat Credential
          </a>
        )}
      </div>
    </RipplePanel>
  );
}
