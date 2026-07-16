import Link from "next/link";
import { AdminListRow } from "@/components/admin/AdminListRow";
import { DocumentIcon } from "@/components/admin/AdminNavIcons";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { getAdminPosts } from "@/lib/queries";

export default async function AdminBlogListPage() {
  const posts = await getAdminPosts();

  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Dashboard
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">Kelola Blog</h1>
          <Button href="/admin/dashboard/blog/new" variant="primary" size="sm" tone="bold">
            + Tambah Artikel
          </Button>
        </div>

        {posts.length === 0 ? (
          <p className="mt-10 text-subtle-foreground">Belum ada artikel.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {posts.map((post) => (
              <AdminListRow
                key={post.id}
                editHref={`/admin/dashboard/blog/${post.id}/edit`}
                title={post.title}
                subtitle={`/${post.slug} · ${
                  post.publishedAt
                    ? formatDate(post.publishedAt)
                    : formatDate(post.createdAt)
                }`}
                imageUrl={post.coverImageUrl}
                icon={<DocumentIcon />}
                badge={
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.published
                        ? "bg-success/10 text-success"
                        : "bg-subtle-foreground/10 text-subtle-foreground"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                }
                deleteEndpoint={`/api/blog/${post.id}`}
                deleteConfirmMessage={`Hapus artikel "${post.title}"? Tindakan ini tidak bisa dibatalkan.`}
                deleteErrorMessage="Gagal menghapus artikel."
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
