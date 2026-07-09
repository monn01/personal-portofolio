import { readFileSync } from "node:fs";
import path from "node:path";

const ICONS_DIR = path.join(process.cwd(), "node_modules/simple-icons/icons");

export function getSimpleIconMarkup(slug: string): string | null {
  if (!/^[a-z0-9]+$/.test(slug)) {
    return null;
  }

  try {
    const raw = readFileSync(path.join(ICONS_DIR, `${slug}.svg`), "utf-8");
    return raw.replace("<svg ", '<svg fill="currentColor" ');
  } catch {
    return null;
  }
}
