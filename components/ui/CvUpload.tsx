"use client";

import { useRef, useState } from "react";
import { Button } from "./Button";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type CvUploadProps = {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
};

export function CvUpload({ value, onChange, label = "CV (PDF)" }: CvUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);

    if (file.type !== "application/pdf") {
      setError("Format file harus PDF.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran file maksimal 10MB.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setIsUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Gagal upload CV.");
      return;
    }

    const data = await res.json();
    onChange(data.url);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground-secondary">
        {label}
      </span>

      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            📄 Lihat CV saat ini ↗
          </a>
        ) : (
          <span className="text-xs text-subtle-foreground">
            Belum ada CV terupload.
          </span>
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading
            ? "Mengunggah..."
            : value
              ? "Ganti CV"
              : "Upload CV"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
