"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type RotatingTextProps = {
  items: string[];
  intervalMs?: number;
  containerClassName?: string;
  textClassName?: string;
};

export function RotatingText({
  items,
  intervalMs = 3000,
  containerClassName = "h-9 sm:h-11",
  textClassName = "text-2xl font-bold tracking-tight text-accent-tertiary sm:text-3xl",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [items.length, intervalMs]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${containerClassName}`}>
      <AnimatePresence mode="wait">
        <motion.p
          key={items[index]}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={textClassName}
        >
          {items[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
