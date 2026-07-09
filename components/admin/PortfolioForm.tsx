"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

const CATEGORIES = ["web", "app", "design"];

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-neutral-300">{label}</span>
      {children}
    </label>
  );
}

export function PortfolioForm({ mode, portfolioId, initial }: PortfolioFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Thumbnail (URL)">
        <input
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
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

      {errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="self-start rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "saving"
          ? "Menyimpan..."
          : mode === "create"
            ? "Tambah Portofolio"
            : "Simpan Perubahan"}
      </button>
    </form>
  );
}
