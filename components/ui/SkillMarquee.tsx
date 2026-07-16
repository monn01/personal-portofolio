"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type MarqueeSkill = {
  name: string;
  icon: ReactNode;
};

type SkillMarqueeProps = {
  skills: MarqueeSkill[];
  direction?: "left" | "right";
};

// Duplicated enough times that the strip is always wider than the viewport —
// with only 2 copies, short skill lists ran out of content mid-scroll and
// showed a blank gap before looping back (looked like the animation "broke").
const REPEAT_COUNT = 6;

export function SkillMarquee({ skills, direction = "left" }: SkillMarqueeProps) {
  if (skills.length === 0) return null;

  const items = Array.from({ length: REPEAT_COUNT }, () => skills).flat();
  const shiftPercent = 100 / REPEAT_COUNT;
  const animate =
    direction === "left"
      ? { x: ["0%", `-${shiftPercent}%`] }
      : { x: [`-${shiftPercent}%`, "0%"] };

  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <motion.div
        className="flex w-max gap-4"
        animate={animate}
        transition={{ duration: skills.length * 3, repeat: Infinity, ease: "linear" }}
      >
        {items.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-surface/70 px-6 py-3 backdrop-blur-md transition-all hover:scale-105 hover:border-accent/50 hover:bg-surface"
          >
            <span className="h-7 w-7 shrink-0">{skill.icon}</span>
            <span className="text-base font-bold whitespace-nowrap text-foreground-secondary">
              {skill.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
