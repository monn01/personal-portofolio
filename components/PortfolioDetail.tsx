import Link from "next/link";
import { PortfolioIcon } from "./PortfolioIcon";

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
        className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-200"
      >
        ← Kembali ke Portfolio
      </Link>

      <div className="mt-6 flex items-start justify-between">
        <PortfolioIcon
          category={category}
          thumbnailUrl={thumbnailUrl}
          title={title}
          className="h-14 w-14"
        />
        <span className="text-sm text-neutral-500">{year}</span>
      </div>

      <h1 className="mt-6 text-3xl font-bold text-neutral-100">{title}</h1>
      <p className="mt-1 text-sm font-medium text-blue-500">Peran: {role}</p>

      <p className="mt-6 leading-relaxed whitespace-pre-line text-neutral-300">
        {description}
      </p>

      {techStack.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
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
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Kunjungi Repo / Demo ↗
        </a>
      )}
    </article>
  );
}
