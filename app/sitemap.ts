import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPortfolios, getPosts } from "@/lib/queries";

const STATIC_ROUTES = [
  "",
  "/about",
  "/skills",
  "/portfolio",
  "/experience",
  "/certifications",
  "/contact",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [portfolios, posts] = await Promise.all([getPortfolios(), getPosts()]);

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const portfolioEntries = portfolios.map((portfolio) => ({
    url: `${SITE_URL}/portfolio/${portfolio.id}`,
    lastModified: portfolio.updatedAt,
  }));

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...staticEntries, ...portfolioEntries, ...postEntries];
}
