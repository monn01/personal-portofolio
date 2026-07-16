import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { PortfolioThumbnail } from "./PortfolioIcon";

type PortfolioDetailProps = {
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string | null;
  year: number;
  role: string;
  techStack: string[];
  externalUrl?: string | null;
};

export function PortfolioDetail({
  title,
  description,
  category,
  thumbnailUrl,
  year,
  role,
  techStack,
  externalUrl,
}: PortfolioDetailProps) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/portfolio"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
      >
        ← Kembali ke Portfolio
      </Link>

      <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface-hover">
        <PortfolioThumbnail
          category={category}
          thumbnailUrl={thumbnailUrl}
          title={title}
          className="h-full w-full"
          iconClassName="h-16 w-16"
        />
        <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {year}
        </span>
      </div>

      <div className="mt-6">
        <CategoryTag category={category} />
      </div>

      <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-1 text-sm font-bold tracking-wide text-accent uppercase">
        Peran: {role}
      </p>

      <p className="mt-6 leading-relaxed whitespace-pre-line text-foreground-secondary">
        {description}
      </p>

      {techStack.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-surface-hover px-3 py-1 text-xs font-bold text-foreground-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {externalUrl && (
        <Button href={externalUrl} variant="primary" tone="bold" className="mt-8">
          Kunjungi Repo / Demo ↗
        </Button>
      )}
    </article>
  );
}
