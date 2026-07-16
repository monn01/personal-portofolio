"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type ToggleReadButtonProps = {
  id: string;
  isRead: boolean;
};

export function ToggleReadButton({ id, isRead }: ToggleReadButtonProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  async function handleToggle() {
    setIsSaving(true);
    const res = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !isRead }),
    });
    setIsSaving(false);

    if (res.ok) {
      router.refresh();
    } else {
      window.alert("Gagal mengubah status pesan.");
    }
  }

  return (
    <Button
      type="button"
      onClick={handleToggle}
      disabled={isSaving}
      variant="secondary"
      size="sm"
    >
      {isSaving ? "..." : isRead ? "Tandai Belum Dibaca" : "Tandai Dibaca"}
    </Button>
  );
}
