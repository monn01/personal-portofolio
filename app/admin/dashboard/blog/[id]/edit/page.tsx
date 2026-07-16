import Link from "next/link";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { getPostById } from "@/lib/queries";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard/blog"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Kelola Blog
        </Link>

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Edit Artikel
        </h1>

        <div className="mt-8">
          <PostForm
            mode="edit"
            postId={post.id}
            initial={{
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              coverImageUrl: post.coverImageUrl,
              published: post.published,
            }}
          />
        </div>
      </div>
    </main>
  );
}
