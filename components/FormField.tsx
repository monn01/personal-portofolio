export const inputClass =
  "w-full rounded-lg border border-border-strong bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors hover:border-accent/40 focus:border-accent focus:ring-1 focus:ring-accent";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-foreground-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}

export function FormSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-base font-black text-foreground">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
