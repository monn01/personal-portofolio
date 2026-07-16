"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = ["Halo", "Hello", "こんにちは", "안녕하세요", "Bonjour"];

const COLOR_CLASSES = [
  "text-accent",
  "text-accent-secondary",
  "text-accent-pink",
  "text-accent-tertiary",
  "text-accent-mint",
];

export function Preloader() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Single-shot timeout re-armed by the `index` dependency on every
    // render, rather than `setInterval` — an interval left running across
    // renders can race with React re-invoking this effect (e.g. Strict
    // Mode's double-invoke in dev) and overshoot the last word, which
    // would permanently skip the `>= WORDS.length - 1` exit check below
    // and leave this full-screen, click-blocking overlay stuck forever.
    if (index >= WORDS.length - 1) {
      const timeout = setTimeout(() => setIsVisible(false), 450);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 200);

    return () => clearTimeout(timeout);
  }, [index]);

  // Hard failsafe: this is a full-screen, click-blocking overlay, so it
  // must never be able to get stuck up regardless of what the word-cycling
  // logic above does.
  useEffect(() => {
    const failsafe = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(failsafe);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.15 },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <div className="flex h-24 items-center justify-center overflow-hidden">
            <motion.p
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`text-5xl font-black tracking-tight md:text-7xl ${COLOR_CLASSES[index % COLOR_CLASSES.length]}`}
            >
              {WORDS[index]}
              <span className="text-foreground">.</span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
