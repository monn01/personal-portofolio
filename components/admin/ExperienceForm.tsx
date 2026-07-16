"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FormSection, inputClass } from "@/components/FormField";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";

type ExperienceFormProps = {
  mode: "create" | "edit";
  experienceId?: string;
  initial?: {
    title: string;
    organization: string;
    startDate: Date;
    endDate: Date | null;
    description: string;
    imageUrl: string | null;
  };
};

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function ExperienceForm({
  mode,
  experienceId,
  initial,
}: ExperienceFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [organization, setOrganization] = useState(
    initial?.organization ?? "",
  );
  const [startDate, setStartDate] = useState(
    toDateInputValue(initial?.startDate ?? null),
  );
  const [isOngoing, setIsOngoing] = useState(
    initial ? initial.endDate === null : true,
  );
  const [endDate, setEndDate] = useState(
    toDateInputValue(initial?.endDate ?? null),
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const payload = {
      title,
      organization,
      startDate: startDate || null,
      endDate: isOngoing ? null : endDate || null,
      description,
      imageUrl: imageUrl || null,
    };

    const url =
      mode === "create"
        ? "/api/experience"
        : `/api/experience/${experienceId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.error ?? "Gagal menyimpan experience.");
      setStatus("error");
      return;
    }

    router.push("/admin/dashboard/experience");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormSection title="Detail Experience">
        <ImageUpload
          value={imageUrl || null}
          onChange={(url) => setImageUrl(url)}
          label="Gambar (opsional)"
        />

        <Field label="Judul">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Organisasi">
          <input
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tanggal Mulai">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Tanggal Selesai">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isOngoing}
              className={`${inputClass} disabled:opacity-50`}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground-secondary">
          <input
            type="checkbox"
            checked={isOngoing}
            onChange={(e) => setIsOngoing(e.target.checked)}
            className="h-4 w-4 rounded border-border-strong bg-background accent-accent"
          />
          Masih berjalan sampai sekarang
        </label>

        <Field label="Deskripsi">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
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
            ? "Tambah Experience"
            : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
