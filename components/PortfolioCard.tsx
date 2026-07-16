import Link from "next/link";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { ExpandableDetails } from "@/components/ui/ExpandableDetails";
import { RipplePanel } from "@/components/ui/RipplePanel";
import { PortfolioIcon } from "./PortfolioIcon";

type PortfolioCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string | null;
  year: number;
  role: string;
  techStack: string[];
  externalUrl?: string | null;
  collapsibleDescription?: boolean;
};

export function PortfolioCard({
  id,
  title,
  description,
  category,
  thumbnailUrl,
  year,
  role,
  techStack,
  externalUrl,
  collapsibleDescription = false,
}: PortfolioCardProps) {
  return (
    <RipplePanel className="rounded-2xl border border-border bg-surface p-5 shadow-none transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10">
      <Link href={`/portfolio/${id}`} className="block">
        <div className="flex items-start justify-between">
          <PortfolioIcon
            category={category}
            thumbnailUrl={thumbnailUrl}
            title={title}
            className="h-11 w-11"
          />
          <span className="text-sm font-bold text-subtle-foreground">{year}</span>
        </div>

        <div className="mt-4">
          <CategoryTag category={category} />
        </div>

        <h3 className="mt-2 text-lg font-black tracking-tight text-foreground transition-colors group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-1 text-sm font-medium text-accent">Peran: {role}</p>
        {collapsibleDescription ? (
          <ExpandableDetails text={description} className="mt-3" />
        ) : (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </Link>

      {techStack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
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
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Repo / Demo ↗
        </a>
      )}
    </RipplePanel>
  );
}
