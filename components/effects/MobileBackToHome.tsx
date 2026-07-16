"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MOBILE_QUERY = "(max-width: 1023px)";

function isMobileViewport() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

export function MobileBackToHome() {
  const router = useRouter();

  useEffect(() => {
    function redirectHomeIfNeeded() {
      if (!isMobileViewport()) return;
      if (window.location.pathname === "/") return;
      router.replace("/");
    }

    function handlePopState() {
      redirectHomeIfNeeded();
    }

    // iOS Safari (and some other mobile browsers) restore the previous page
    // from the back-forward cache on swipe-back instead of firing a normal
    // popstate — pageshow with `persisted: true` is the reliable signal there.
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) redirectHomeIfNeeded();
    }

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  return null;
}
