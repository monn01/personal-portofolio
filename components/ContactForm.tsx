"use client";

import { useState } from "react";
import { Field, inputClass } from "@/components/FormField";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, company }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrorMessage(data?.error ?? "Gagal mengirim pesan. Coba lagi.");
      setStatus("error");
      return;
    }

    setName("");
    setEmail("");
    setMessage("");
    setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <Field label="Nama">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </Field>

      <Field label="Pesan">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className={inputClass}
        />
      </Field>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}

      {status === "success" && (
        <p className="text-sm text-success">
          Pesan berhasil dikirim. Terima kasih sudah menghubungi saya!
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "sending"}
        variant="primary"
        tone="bold"
        className="self-start"
      >
        {status === "sending" ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}
