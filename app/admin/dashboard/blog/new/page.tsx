import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
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
          Tambah Artikel
        </h1>

        <div className="mt-8">
          <PostForm mode="create" />
        </div>
      </div>
    </main>
  );
}
