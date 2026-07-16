"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { RotatingText } from "@/components/ui/RotatingText";

type HeroSkill = {
  name: string;
  icon: ReactNode;
};

type HeroSectionProps = {
  name: string;
  shortBio: string;
  photoUrl: string | null;
  taglines: string[];
  skills: HeroSkill[];
};

const FLOAT_ICON_POSITIONS = [
  "left-0 top-8 -translate-x-6 sm:-translate-x-12",
  "right-0 top-16 translate-x-6 sm:translate-x-12",
  "left-2 bottom-20 -translate-x-4 sm:-translate-x-20",
  "right-2 bottom-8 translate-x-4 sm:translate-x-20",
];

const GREETINGS = [
  "Halo, saya",
  "Hello, I'm",
  "Bonjour, je suis",
  "Привет, я",
  "Hola, soy",
  "Hallo, ich bin",
  "こんにちは、私は",
  "안녕하세요, 저는",
  "你好，我是",
];

export function HeroSection({
  name,
  shortBio,
  photoUrl,
  taglines,
  skills,
}: HeroSectionProps) {
  const floatingSkills = skills.slice(0, 4);

  return (
    <div className="flex flex-col items-center rounded-2xl px-4 py-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-full border border-border px-4 py-1.5"
      >
        <RotatingText
          items={GREETINGS}
          intervalMs={2200}
          containerClassName="h-4"
          textClassName="text-xs font-medium tracking-wide text-muted-foreground uppercase"
        />
      </motion.div>

      <div className="relative mt-4 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl font-black leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          {name}
        </motion.h1>

        {taglines.length > 0 && (
          <div className="mt-1 flex justify-center">
            <RotatingText items={taglines} />
          </div>
        )}

        {photoUrl && (
          <div className="relative -mt-4 sm:-mt-8 md:-mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-accent-tertiary/30 via-accent-secondary/20 to-accent/30 blur-3xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt={name}
                  className="relative z-10 h-64 w-auto max-w-full object-contain drop-shadow-2xl sm:h-80 md:h-[24rem] [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]"
                />

                {floatingSkills.map((skill, i) => (
                  <motion.span
                    key={skill.name}
                    title={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                    className={`absolute z-20 hidden h-16 w-16 items-center justify-center rounded-full border border-border bg-surface/90 shadow-lg backdrop-blur sm:flex ${FLOAT_ICON_POSITIONS[i % FLOAT_ICON_POSITIONS.length]}`}
                  >
                    <span className="h-8 w-8">{skill.icon}</span>
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
        className="relative mt-6 max-w-xl"
      >
        <p className="mx-auto text-muted-foreground">{shortBio}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/portfolio" variant="primary">
            Lihat Projects
          </Button>
          <Button href="/about" variant="secondary">
            Tentang Saya
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
