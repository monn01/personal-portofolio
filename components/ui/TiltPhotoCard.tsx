"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

type TiltPhotoCardProps = {
  name: string;
  subtitle?: string | null;
  photoUrl: string;
  ctaHref: string;
  ctaLabel: string;
};

export function TiltPhotoCard({
  name,
  subtitle,
  photoUrl,
  ctaHref,
  ctaLabel,
}: TiltPhotoCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 150, damping: 22 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 22 });
  const rotateX = useTransform(ySpring, [-220, 220], [10, -10]);
  const rotateY = useTransform(xSpring, [-220, 220], [-10, 10]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      className="relative w-full max-w-sm"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-border shadow-[0_0_40px_rgba(59,130,246,0.2),0_0_80px_rgba(139,92,246,0.12)]"
        style={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute top-6 left-6 text-white">
          <p className="text-xl font-black tracking-tight">{name}</p>
          {subtitle && (
            <p className="text-sm font-bold text-white/80">{subtitle}</p>
          )}
        </div>

        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-full border border-white/10 bg-white/10 p-2.5 pl-4 text-white shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-mint shadow-[0_0_10px_2px_rgba(16,185,129,0.7)]" />
            <span className="text-xs font-black">Online</span>
          </div>
          <Link
            href={ctaHref}
            className="rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-black backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            {ctaLabel}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
