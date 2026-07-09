"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePortfolioButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Hapus portofolio "${title}"? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    setIsDeleting(false);

    if (res.ok) {
      router.refresh();
    } else {
      window.alert("Gagal menghapus portofolio.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm font-medium text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? "Menghapus..." : "Hapus"}
    </button>
  );
}
