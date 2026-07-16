function withProtocol(url: string) {
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? withProtocol(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const DEFAULT_OG_IMAGE = "/opengraph-image";
