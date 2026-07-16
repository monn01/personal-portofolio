import { cache } from "react";
import type { Portfolio } from "./generated/prisma/client";
import { prisma } from "./prisma";

export type ContactLink = { label: string; url: string };

function normalizePortfolio(portfolio: Portfolio) {
  return {
    ...portfolio,
    techStack: Array.isArray(portfolio.techStack)
      ? (portfolio.techStack as unknown as string[])
      : [],
  };
}

export const getProfile = cache(async () => {
  const profile = await prisma.profile.findFirst({
    include: { skills: true },
    orderBy: { createdAt: "asc" },
  });

  if (!profile) {
    return null;
  }

  return {
    ...profile,
    contactLinks: Array.isArray(profile.contactLinks)
      ? (profile.contactLinks as unknown as ContactLink[])
      : [],
    taglines: Array.isArray(profile.taglines)
      ? (profile.taglines as unknown as string[])
      : [],
    galleryPhotos: Array.isArray(profile.galleryPhotos)
      ? (profile.galleryPhotos as unknown as string[])
      : [],
  };
});

export const getPortfolios = cache(async (category?: string) => {
  const portfolios = await prisma.portfolio.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  return portfolios.map(normalizePortfolio);
});

export const getPortfolioById = cache(async (id: string) => {
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  return portfolio ? normalizePortfolio(portfolio) : null;
});

export const getExperiences = cache(async () => {
  return prisma.experience.findMany({
    orderBy: [{ startDate: "desc" }],
  });
});

export const getExperienceById = cache(async (id: string) => {
  return prisma.experience.findUnique({ where: { id } });
});

export const getCertifications = cache(async () => {
  return prisma.certification.findMany({
    orderBy: [{ issueDate: "desc" }],
  });
});

export const getCertificationById = cache(async (id: string) => {
  return prisma.certification.findUnique({ where: { id } });
});

export const getAchievements = cache(async () => {
  return prisma.achievement.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
});

export const getAchievementById = cache(async (id: string) => {
  return prisma.achievement.findUnique({ where: { id } });
});

export const getContactMessages = cache(async () => {
  return prisma.contactMessage.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
});

export const getUnreadMessageCount = cache(async () => {
  return prisma.contactMessage.count({ where: { isRead: false } });
});

export const getPosts = cache(async () => {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }],
  });
});

export const getPostBySlug = cache(async (slug: string) => {
  return prisma.post.findFirst({ where: { slug, published: true } });
});

export const getAdminPosts = cache(async () => {
  return prisma.post.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
});

export const getPostById = cache(async (id: string) => {
  return prisma.post.findUnique({ where: { id } });
});

export const getAdminOverviewCounts = cache(async () => {
  const [portfolio, experience, achievement, certification, post, unreadMessages] =
    await Promise.all([
      prisma.portfolio.count(),
      prisma.experience.count(),
      prisma.achievement.count(),
      prisma.certification.count(),
      prisma.post.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

  return { portfolio, experience, achievement, certification, post, unreadMessages };
});

export const getDailyVisitCounts = cache(async (days: number = 14) => {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const views = await prisma.pageView.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const counts = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const day = new Date(since);
    day.setDate(day.getDate() + i);
    counts.set(day.toISOString().slice(0, 10), 0);
  }

  for (const view of views) {
    const key = view.createdAt.toISOString().slice(0, 10);
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
});

export const getStats = cache(async () => {
  const [portfolioCount, certificationCount, skillCount, earliestExperience] =
    await Promise.all([
      prisma.portfolio.count(),
      prisma.certification.count(),
      prisma.skill.count(),
      prisma.experience.findFirst({ orderBy: { startDate: "asc" } }),
    ]);

  const yearsOfExperience = earliestExperience
    ? Math.max(
        1,
        Math.ceil(
          (Date.now() - earliestExperience.startDate.getTime()) /
            (1000 * 60 * 60 * 24 * 365),
        ),
      )
    : 0;

  return {
    yearsOfExperience,
    portfolioCount,
    certificationCount,
    skillCount,
  };
});
