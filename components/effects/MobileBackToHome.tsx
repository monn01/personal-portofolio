"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MOBILE_QUERY = "(max-width: 1023px)";

export function MobileBackToHome() {
  const router = useRouter();

  useEffect(() => {
    function handlePopState() {
      if (!window.matchMedia(MOBILE_QUERY).matches) return;
      if (window.location.pathname === "/") return;
      router.replace("/");
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  return null;
}
