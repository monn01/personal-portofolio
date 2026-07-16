"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
      dot.classList.add("visible");
      trail.classList.add("visible");
    };

    const onLeave = () => {
      dot.classList.remove("visible");
      trail.classList.remove("visible");
    };

    const animate = () => {
      tx += (mx - tx) * 0.15;
      ty += (my - ty) * 0.15;
      trail.style.left = `${tx}px`;
      trail.style.top = `${ty}px`;
      raf = requestAnimationFrame(animate);
    };

    const onOverInteractive = () => {
      dot.style.width = "20px";
      dot.style.height = "20px";
      trail.style.width = "48px";
      trail.style.height = "48px";
    };
    const onLeaveInteractive = () => {
      dot.style.width = "12px";
      dot.style.height = "12px";
      trail.style.width = "32px";
      trail.style.height = "32px";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const interactives = document.querySelectorAll(
      "a, button, [role='button'], input, textarea",
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onOverInteractive);
      el.addEventListener("mouseleave", onLeaveInteractive);
    });

    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onOverInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" aria-hidden="true" />
      <div ref={trailRef} className="custom-cursor-trail" aria-hidden="true" />
    </>
  );
}
