import type { Metadata } from "next";
import { PostCard } from "@/components/PostCard";
import { PageIntro } from "@/components/ui/PageIntro";
import { buildPageMetadata } from "@/lib/seo";
import { getPosts, getProfile } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteName = profile?.name ?? "Personal Portfolio";
  const description = `Tulisan dan catatan dari ${siteName}.`;

  return buildPageMetadata({ title: "Blog", siteName, description });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-5xl">
        <PageIntro>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            My <span className="text-shimmer">Blog</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Thoughts, insights, and articles about projects, technologies, and my learning journey.
          </p>
        </PageIntro>

        {posts.length === 0 ? (
          <p className="mt-16 text-center text-subtle-foreground">
            No articles yet — stay tuned, I’ll be sharing insights and projects soon.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                coverImageUrl={post.coverImageUrl}
                publishedAt={post.publishedAt}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
