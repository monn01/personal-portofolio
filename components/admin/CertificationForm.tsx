"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FormSection, inputClass } from "@/components/FormField";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { TIERS } from "@/lib/constants";

type CertificationFormProps = {
  mode: "create" | "edit";
  certificationId?: string;
  initial?: {
    title: string;
    issuer: string;
    issueDate: Date;
    credentialUrl: string | null;
    imageUrl: string;
    tier: string;
    featuredOnHome: boolean;
  };
};

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function CertificationForm({
  mode,
  certificationId,
  initial,
}: CertificationFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [issuer, setIssuer] = useState(initial?.issuer ?? "");
  const [issueDate, setIssueDate] = useState(
    toDateInputValue(initial?.issueDate ?? null),
  );
  const [credentialUrl, setCredentialUrl] = useState(
    initial?.credentialUrl ?? "",
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [tier, setTier] = useState(initial?.tier ?? TIERS[0]);
  const [featuredOnHome, setFeaturedOnHome] = useState(
    initial?.featuredOnHome ?? true,
  );
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imageUrl) {
      setErrorMessage("Gambar sertifikat wajib diupload.");
      setStatus("error");
      return;
    }

    setStatus("saving");
    setErrorMessage(null);

    const payload = {
      title,
      issuer,
      issueDate: issueDate || null,
      credentialUrl: credentialUrl || null,
      imageUrl,
      tier,
      featuredOnHome,
    };

    const url =
      mode === "create"
        ? "/api/certification"
        : `/api/certification/${certificationId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.error ?? "Gagal menyimpan certification.");
      setStatus("error");
      return;
    }

    router.push("/admin/dashboard/certifications");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormSection title="Detail Certification">
        <ImageUpload
          value={imageUrl || null}
          onChange={(url) => setImageUrl(url)}
          label="Gambar Sertifikat"
        />

        <Field label="Judul">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Issuer">
          <input
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tanggal Terbit">
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
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

        <Field label="Link Credential (opsional)">
          <input
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm font-medium text-foreground-secondary">
          <input
            type="checkbox"
            checked={featuredOnHome}
            onChange={(e) => setFeaturedOnHome(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Tampilkan di preview Home
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
            ? "Tambah Certification"
            : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
