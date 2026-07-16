"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FormSection, inputClass } from "@/components/FormField";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";

type PostFormProps = {
  mode: "create" | "edit";
  postId?: string;
  initial?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImageUrl: string | null;
    published: boolean;
  };
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PostForm({ mode, postId, initial }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initial?.coverImageUrl ?? "",
  );
  const [published, setPublished] = useState(initial?.published ?? false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl: coverImageUrl || null,
      published,
    };

    const url = mode === "create" ? "/api/blog" : `/api/blog/${postId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.error ?? "Gagal menyimpan artikel.");
      setStatus("error");
      return;
    }

    router.push("/admin/dashboard/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormSection title="Konten Artikel">
        <Field label="Judul">
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Slug">
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="judul-artikel-saya"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Ringkasan">
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={2}
            className={inputClass}
          />
        </Field>

        <Field label="Konten (Markdown)">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={16}
            className={`${inputClass} font-mono`}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Media & Publikasi"
        description="Cover image opsional, dan status tampil-tidaknya artikel di halaman publik."
      >
        <ImageUpload
          value={coverImageUrl || null}
          onChange={(url) => setCoverImageUrl(url)}
          label="Cover Image (opsional)"
        />

        <label className="flex items-center gap-2 text-sm text-foreground-secondary">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-border-strong accent-accent"
          />
          Publish artikel ini (tampil di halaman publik)
        </label>
      </FormSection>

      {errorMessage && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "saving"}
        variant="primary"
        tone="bold"
        className="self-start"
      >
        {status === "saving"
          ? "Menyimpan..."
          : mode === "create"
            ? "Tambah Artikel"
            : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
