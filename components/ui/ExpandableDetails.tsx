"use client";

import { useState } from "react";

type ExpandableDetailsProps = {
  text: string;
  className?: string;
};

export function ExpandableDetails({
  text,
  className = "",
}: ExpandableDetailsProps) {
  const [open, setOpen] = useState(false);

  if (!text) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-expanded={open}
        className="flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
      >
        Keterangan
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {text}
        </p>
      )}
    </div>
  );
}
