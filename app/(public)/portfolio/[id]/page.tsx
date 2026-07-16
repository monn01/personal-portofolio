import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioDetail } from "@/components/PortfolioDetail";
import { buildPageMetadata } from "@/lib/seo";
import { getPortfolioById, getProfile } from "@/lib/queries";

type PortfolioDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const [portfolio, profile] = await Promise.all([
    getPortfolioById(id),
    getProfile(),
  ]);

  if (!portfolio) {
    return { title: "Portfolio" };
  }

  return buildPageMetadata({
    title: portfolio.title,
    siteName: profile?.name ?? "Personal Portfolio",
    description: portfolio.description,
    image: portfolio.thumbnailUrl ?? undefined,
  });
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { id } = await params;
  const portfolio = await getPortfolioById(id);

  if (!portfolio) {
    notFound();
  }

  return (
    <main className="flex-1">
      <PortfolioDetail
        title={portfolio.title}
        description={portfolio.description}
        category={portfolio.category}
        thumbnailUrl={portfolio.thumbnailUrl}
        year={portfolio.year}
        role={portfolio.role}
        techStack={portfolio.techStack}
        externalUrl={portfolio.externalUrl}
      />
    </main>
  );
}
