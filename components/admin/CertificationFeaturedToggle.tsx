"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CertificationFeaturedToggleProps = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string | null;
  imageUrl: string;
  tier: string;
  featuredOnHome: boolean;
};

export function CertificationFeaturedToggle({
  id,
  title,
  issuer,
  issueDate,
  credentialUrl,
  imageUrl,
  tier,
  featuredOnHome,
}: CertificationFeaturedToggleProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    await fetch(`/api/certification/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        issuer,
        issueDate,
        credentialUrl,
        imageUrl,
        tier,
        featuredOnHome: !featuredOnHome,
      }),
    });
    setPending(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      title={
        featuredOnHome
          ? "Tampil di Home — klik untuk sembunyikan"
          : "Disembunyikan dari Home — klik untuk tampilkan"
      }
      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold transition-colors disabled:opacity-50 ${
        featuredOnHome
          ? "border-accent-mint/40 bg-accent-mint/15 text-accent-mint"
          : "border-border text-subtle-foreground hover:text-foreground-secondary"
      }`}
    >
      {featuredOnHome ? "★ Home" : "☆ Home"}
    </button>
  );
}
