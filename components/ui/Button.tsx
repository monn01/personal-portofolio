"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";
type Tone = "soft" | "bold";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-accent to-accent-secondary text-white transition-opacity hover:opacity-90",
  secondary:
    "border border-border-strong text-foreground-secondary hover:border-subtle-foreground",
  danger:
    "border border-border-strong text-muted-foreground hover:border-danger/60 hover:text-danger",
  ghost: "text-accent hover:text-accent-hover",
};

const sizeClasses: Record<Size, string> = {
  md: "rounded-full px-5 py-2.5 text-sm font-medium",
  sm: "rounded-md px-3 py-2 text-sm font-medium",
};

/**
 * "bold" is the reference-inspired, punchier treatment (heavier weight,
 * shadow) used everywhere except HeroSection.tsx, which never passes
 * `tone` and so stays on the original "soft" look untouched. The hover
 * "lift" itself lives in the motion props below (not a CSS translate
 * class) since Framer Motion's inline transform would otherwise clobber
 * a Tailwind `hover:-translate-y` class on the same element.
 */
const toneClasses: Record<Tone, string> = {
  soft: "",
  bold: "font-black shadow-md transition-shadow hover:shadow-lg",
};

const MOTION_PROPS: Record<Tone, object> = {
  soft: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.96 },
    transition: { duration: 0.15 },
  },
  bold: {
    whileHover: { scale: 1.03, y: -2 },
    whileTap: { scale: 0.96, y: 0 },
    transition: { duration: 0.15 },
  },
};

const MotionLink = motion.create(Link);

type CommonProps = {
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Native DOM event props (onDrag*, onAnimationStart, ...) collide with
 * Framer Motion's own gesture/animation prop signatures of the same name.
 * Passthrough props are spread loosely here; the public `ButtonProps` type
 * above is what keeps callers of `<Button>` type-safe.
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    tone = "soft",
    className = "",
    children,
    ...rest
  } = props;

  const passthrough = rest as Record<string, unknown>;
  const motionProps = MOTION_PROPS[tone];

  const classes = [
    "inline-flex items-center justify-center gap-1.5 transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    toneClasses[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = passthrough as { href: string } & Record<
      string,
      unknown
    >;
    const isInternal = href.startsWith("/") || href.startsWith("#");

    if (isInternal) {
      return (
        <MotionLink
          href={href}
          className={classes}
          {...motionProps}
          {...anchorRest}
        >
          {children}
        </MotionLink>
      );
    }

    const isMailto = href.startsWith("mailto:");

    return (
      <motion.a
        href={href}
        target={isMailto ? undefined : "_blank"}
        rel={isMailto ? undefined : "noopener noreferrer"}
        className={classes}
        {...motionProps}
        {...anchorRest}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button className={classes} {...motionProps} {...passthrough}>
      {children}
    </motion.button>
  );
}
