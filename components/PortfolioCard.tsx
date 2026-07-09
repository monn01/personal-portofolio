import Link from "next/link";
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
}: PortfolioCardProps) {
  return (
    <div className="group rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-colors duration-200 hover:border-blue-500/50">
      <Link href={`/portfolio/${id}`} className="block">
        <div className="flex items-start justify-between">
          <PortfolioIcon category={category} thumbnailUrl={thumbnailUrl} title={title} />
          <span className="text-sm text-neutral-500">{year}</span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-neutral-100 transition-colors group-hover:text-blue-400">
          {title}
        </h3>
        <p className="mt-1 text-sm font-medium text-blue-500">Peran: {role}</p>
        <p className="mt-3 line-clamp-3 text-sm text-neutral-400">
          {description}
        </p>
      </Link>

      {techStack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300"
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
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
        >
          Repo / Demo ↗
        </a>
      )}
    </div>
  );
}
