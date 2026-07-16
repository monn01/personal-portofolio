const PLATFORM_SLUGS: { match: RegExp; slug: string }[] = [
  { match: /github\.com/i, slug: "github" },
  { match: /linkedin\.com/i, slug: "linkedin" },
  { match: /instagram\.com/i, slug: "instagram" },
  { match: /(twitter\.com|x\.com)/i, slug: "x" },
  { match: /youtube\.com/i, slug: "youtube" },
  { match: /tiktok\.com/i, slug: "tiktok" },
  { match: /facebook\.com/i, slug: "facebook" },
  { match: /dribbble\.com/i, slug: "dribbble" },
  { match: /behance\.net/i, slug: "behance" },
  { match: /medium\.com/i, slug: "medium" },
  { match: /gitlab\.com/i, slug: "gitlab" },
];

export function resolveSocialSlug(url: string): string | null {
  const found = PLATFORM_SLUGS.find((platform) => platform.match.test(url));
  return found?.slug ?? null;
}

// simple-icons pulled LinkedIn's mark after a trademark dispute, so it's
// missing from the installed package — hand-drawn fallback for that one slug.
const FALLBACK_MARKUP: Record<string, string> = {
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
};

export function getSocialFallbackMarkup(slug: string): string | null {
  return FALLBACK_MARKUP[slug] ?? null;
}
