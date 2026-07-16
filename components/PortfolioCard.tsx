import Link from "next/link";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { ExpandableDetails } from "@/components/ui/ExpandableDetails";
import { RipplePanel } from "@/components/ui/RipplePanel";
import { PortfolioThumbnail } from "./PortfolioIcon";

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
    <RipplePanel className="overflow-hidden rounded-2xl border border-border bg-surface shadow-none transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10">
      <Link href={`/portfolio/${id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden bg-surface-hover">
          <PortfolioThumbnail
            category={category}
            thumbnailUrl={thumbnailUrl}
            title={title}
            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
            iconClassName="h-12 w-12"
          />
          <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {year}
          </span>
        </div>

        <div className="p-5">
          <CategoryTag category={category} />

          <h3 className="mt-3 text-lg font-black tracking-tight text-foreground transition-colors group-hover:text-accent">
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
        </div>
      </Link>

      {(techStack.length > 0 || externalUrl) && (
        <div className="px-5 pb-5">
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
              className={`inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover ${
                techStack.length > 0 ? "mt-4" : ""
              }`}
            >
              Repo / Demo ↗
            </a>
          )}
        </div>
      )}
    </RipplePanel>
  );
}
