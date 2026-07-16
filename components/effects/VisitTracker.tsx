"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const payload = JSON.stringify({ path: pathname });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track-visit",
        new Blob([payload], { type: "application/json" }),
      );
      return;
    }

    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
