"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type DeleteEntityButtonProps = {
  endpoint: string;
  confirmMessage: string;
  errorMessage?: string;
};

export function DeleteEntityButton({
  endpoint,
  confirmMessage,
  errorMessage = "Gagal menghapus data.",
}: DeleteEntityButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    setIsDeleting(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    setIsDeleting(false);

    if (res.ok) {
      router.refresh();
    } else {
      window.alert(errorMessage);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      variant="danger"
      size="sm"
    >
      {isDeleting ? "Menghapus..." : "Hapus"}
    </Button>
  );
}
