"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";

type RipplePanelProps = {
  children: ReactNode;
  className?: string;
};

export function RipplePanel({ children, className = "" }: RipplePanelProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 26, stiffness: 170, mass: 0.4 });
  const springY = useSpring(mouseY, { damping: 26, stiffness: 170, mass: 0.4 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.28), rgba(139,92,246,0.16) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
