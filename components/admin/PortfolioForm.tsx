"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FormSection, inputClass } from "@/components/FormField";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";

type PortfolioFormProps = {
  mode: "create" | "edit";
  portfolioId?: string;
  initial?: {
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string | null;
    year: number;
    role: string;
    techStack: string[];
    externalUrl: string | null;
  };
};

export function PortfolioForm({ mode, portfolioId, initial }: PortfolioFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? PORTFOLIO_CATEGORIES[0]);
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnailUrl ?? "");
  const [year, setYear] = useState(initial?.year ?? new Date().getFullYear());
  const [role, setRole] = useState(initial?.role ?? "");
  const [techStack, setTechStack] = useState(
    initial?.techStack.join(", ") ?? "",
  );
  const [externalUrl, setExternalUrl] = useState(initial?.externalUrl ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const payload = {
      title,
      description,
      category,
      thumbnailUrl: thumbnailUrl || null,
      year: Number(year),
      role,
      techStack: techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      externalUrl: externalUrl || null,
    };

    const url =
      mode === "create" ? "/api/portfolio" : `/api/portfolio/${portfolioId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.error ?? "Gagal menyimpan portofolio.");
      setStatus("error");
      return;
    }

    router.push("/admin/dashboard/portfolio");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormSection title="Detail Portofolio">
        <ImageUpload
          value={thumbnailUrl || null}
          onChange={(url) => setThumbnailUrl(url)}
          label="Thumbnail (opsional)"
        />

        <Field label="Judul">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Deskripsi">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={inputClass}
          />
        </Field>

        <Field label="Kategori">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {PORTFOLIO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tahun">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Peran">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Tech Stack (pisahkan dengan koma)">
          <input
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="Next.js, TypeScript, Tailwind"
            className={inputClass}
          />
        </Field>

        <Field label="Link Eksternal (repo/demo)">
          <input
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
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
            ? "Tambah Portofolio"
            : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
