import { notFound } from "next/navigation";
import { PortfolioDetail } from "@/components/PortfolioDetail";
import { getPortfolioById } from "@/lib/queries";

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const portfolio = await getPortfolioById(id);

  if (!portfolio) {
    notFound();
  }

  return (
    <main className="flex-1 bg-neutral-950">
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
