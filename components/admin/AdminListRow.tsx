import Link from "next/link";
import type { ReactNode } from "react";
import { DeleteEntityButton } from "./DeleteEntityButton";

type AdminListRowProps = {
  editHref: string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  icon?: ReactNode;
  badge?: ReactNode;
  deleteEndpoint: string;
  deleteConfirmMessage: string;
  deleteErrorMessage?: string;
  extraAction?: ReactNode;
};

export function AdminListRow({
  editHref,
  title,
  subtitle,
  imageUrl,
  icon,
  badge,
  deleteEndpoint,
  deleteConfirmMessage,
  deleteErrorMessage,
  extraAction,
}: AdminListRowProps) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-3 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 sm:p-4">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title}
          className="h-14 w-14 shrink-0 rounded-xl border border-border bg-surface-hover object-cover"
        />
      ) : icon ? (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <span className="h-6 w-6">{icon}</span>
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-black text-foreground">{title}</p>
          {badge}
        </div>
        <p className="mt-0.5 truncate text-sm text-subtle-foreground">
          {subtitle}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3">
        {extraAction}
        <Link
          href={editHref}
          className="text-sm font-bold text-accent transition-colors hover:text-accent-hover"
        >
          Edit
        </Link>
        <DeleteEntityButton
          endpoint={deleteEndpoint}
          confirmMessage={deleteConfirmMessage}
          errorMessage={deleteErrorMessage}
        />
      </div>
    </div>
  );
}
