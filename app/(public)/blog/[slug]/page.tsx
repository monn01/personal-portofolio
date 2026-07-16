import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { PageIntro } from "@/components/ui/PageIntro";
import { formatDate } from "@/lib/format";
import { buildPageMetadata } from "@/lib/seo";
import { getPostBySlug, getProfile } from "@/lib/queries";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    getPostBySlug(slug),
    getProfile(),
  ]);

  if (!post) {
    return { title: "Blog" };
  }

  return buildPageMetadata({
    title: post.title,
    siteName: profile?.name ?? "Personal Portfolio",
    description: post.excerpt,
    image: post.coverImageUrl ?? undefined,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-20 sm:py-24">
      <article className="relative mx-auto max-w-3xl">
        <PageIntro>
          {post.publishedAt && (
            <p className="text-sm text-subtle-foreground">
              {formatDate(post.publishedAt)}
            </p>
          )}
          <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
        </PageIntro>

        {post.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="mt-8 w-full rounded-xl border border-border bg-surface-hover object-cover"
          />
        )}

        <div className="prose prose-neutral mt-10 max-w-none">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>
    </main>
  );
}
