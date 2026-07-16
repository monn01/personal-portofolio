import Link from "next/link";
import { RipplePanel } from "@/components/ui/RipplePanel";
import { formatDate } from "@/lib/format";

type PostCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
};

export function PostCard({
  slug,
  title,
  excerpt,
  coverImageUrl,
  publishedAt,
}: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="block overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
    >
      <RipplePanel>
        {coverImageUrl ? (
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt={title}
              className="h-40 w-full bg-surface-hover object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-accent-secondary/10 text-accent-secondary transition-transform duration-300 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-10 w-10"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5h9l6 6v9a1.5 1.5 0 01-1.5 1.5h-13.5A1.5 1.5 0 013 19.5v-13.5A1.5 1.5 0 014.5 4.5zM13.5 4.5v6h6M8 13.5h8M8 17h5"
              />
            </svg>
          </div>
        )}
        <div className="p-5">
          {publishedAt && (
            <p className="text-xs text-subtle-foreground">
              {formatDate(publishedAt)}
            </p>
          )}
          <h3 className="mt-1 font-black tracking-tight text-foreground transition-colors group-hover:text-accent">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {excerpt}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
            Baca selengkapnya →
          </span>
        </div>
      </RipplePanel>
    </Link>
  );
}
