import { readFileSync } from "node:fs";
import path from "node:path";

const ICONS_DIR = path.join(process.cwd(), "node_modules/simple-icons/icons");
const DATA_FILE = path.join(
  process.cwd(),
  "node_modules/simple-icons/data/simple-icons.json",
);

const SLUG_REGEX = /^[a-z0-9]+$/;

export function getSimpleIconMarkup(slug: string): string | null {
  if (!SLUG_REGEX.test(slug)) {
    return null;
  }

  try {
    const raw = readFileSync(path.join(ICONS_DIR, `${slug}.svg`), "utf-8");
    return raw.replace("<svg ", '<svg fill="currentColor" ');
  } catch {
    return null;
  }
}

let hexBySlug: Map<string, string> | null = null;

function loadHexMap(): Map<string, string> {
  if (!hexBySlug) {
    const raw = readFileSync(DATA_FILE, "utf-8");
    const data = JSON.parse(raw) as { slug: string; hex: string }[];
    hexBySlug = new Map(data.map((icon) => [icon.slug, icon.hex]));
  }
  return hexBySlug;
}

export function getSimpleIconHex(slug: string): string | null {
  if (!SLUG_REGEX.test(slug)) {
    return null;
  }

  try {
    const hex = loadHexMap().get(slug);
    return hex ? `#${hex}` : null;
  } catch {
    return null;
  }
}
