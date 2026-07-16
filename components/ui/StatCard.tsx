import type { ReactNode } from "react";
import { RipplePanel } from "./RipplePanel";

type StatCardColor =
  | "accent"
  | "accent-secondary"
  | "accent-tertiary"
  | "accent-pink"
  | "accent-mint";

type StatCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
  color?: StatCardColor;
};

const COLOR_CLASSES: Record<StatCardColor, { icon: string; hoverBorder: string; hoverShadow: string }> = {
  accent: {
    icon: "bg-accent/10 text-accent",
    hoverBorder: "hover:border-accent/60",
    hoverShadow: "hover:shadow-accent/10",
  },
  "accent-secondary": {
    icon: "bg-accent-secondary/10 text-accent-secondary",
    hoverBorder: "hover:border-accent-secondary/60",
    hoverShadow: "hover:shadow-accent-secondary/10",
  },
  "accent-tertiary": {
    icon: "bg-accent-tertiary/10 text-accent-tertiary",
    hoverBorder: "hover:border-accent-tertiary/60",
    hoverShadow: "hover:shadow-accent-tertiary/10",
  },
  "accent-pink": {
    icon: "bg-accent-pink/10 text-accent-pink",
    hoverBorder: "hover:border-accent-pink/60",
    hoverShadow: "hover:shadow-accent-pink/10",
  },
  "accent-mint": {
    icon: "bg-accent-mint/10 text-accent-mint",
    hoverBorder: "hover:border-accent-mint/60",
    hoverShadow: "hover:shadow-accent-mint/10",
  },
};

export function StatCard({ icon, value, label, color = "accent" }: StatCardProps) {
  const styles = COLOR_CLASSES[color];

  return (
    <RipplePanel
      className={`rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-surface-hover hover:shadow-xl ${styles.hoverBorder} ${styles.hoverShadow}`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${styles.icon}`}
      >
        {icon}
      </div>
      <p className="mt-4 text-4xl font-black tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground-secondary">
        {label}
      </p>
    </RipplePanel>
  );
}
