"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FormSection, inputClass } from "@/components/FormField";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { TIERS } from "@/lib/constants";

type AchievementFormProps = {
  mode: "create" | "edit";
  achievementId?: string;
  initial?: {
    title: string;
    description: string | null;
    organizer: string;
    year: number;
    tier: string;
    certificateUrl: string | null;
    imageUrl: string | null;
  };
};

export function AchievementForm({
  mode,
  achievementId,
  initial,
}: AchievementFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [organizer, setOrganizer] = useState(initial?.organizer ?? "");
  const [year, setYear] = useState(initial?.year ?? new Date().getFullYear());
  const [tier, setTier] = useState(initial?.tier ?? TIERS[0]);
  const [certificateUrl, setCertificateUrl] = useState(
    initial?.certificateUrl ?? "",
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const payload = {
      title,
      description: description || null,
      organizer,
      year: Number(year),
      tier,
      certificateUrl: certificateUrl || null,
      imageUrl: imageUrl || null,
    };

    const url =
      mode === "create" ? "/api/achievement" : `/api/achievement/${achievementId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.error ?? "Gagal menyimpan award.");
      setStatus("error");
      return;
    }

    router.push("/admin/dashboard/achievements");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormSection title="Detail Award">
        <ImageUpload
          value={imageUrl || null}
          onChange={(url) => setImageUrl(url)}
          label="Gambar Award (opsional)"
        />

        <Field label="Judul">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Penyelenggara">
          <input
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            required
            placeholder="mis. Universitas Ahmad Dahlan"
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
          <Field label="Tier">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className={inputClass}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Deskripsi (opsional)">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </Field>

        <Field label="Link Sertifikat (opsional)">
          <input
            value={certificateUrl}
            onChange={(e) => setCertificateUrl(e.target.value)}
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
            ? "Tambah Award"
            : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
