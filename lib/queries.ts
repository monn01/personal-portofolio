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
  };
});

export const getPortfolios = cache(async () => {
  const portfolios = await prisma.portfolio.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  return portfolios.map(normalizePortfolio);
});

export const getPortfolioById = cache(async (id: string) => {
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  return portfolio ? normalizePortfolio(portfolio) : null;
});
