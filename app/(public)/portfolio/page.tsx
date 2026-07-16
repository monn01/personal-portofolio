import type { Metadata } from "next";
import { PortfolioCard } from "@/components/PortfolioCard";
import { PortfolioFilterTabs } from "@/components/PortfolioFilterTabs";
import { PageIntro } from "@/components/ui/PageIntro";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import { getPortfolios, getProfile } from "@/lib/queries";

type PortfolioPageProps = {
  searchParams: Promise<{ category?: string }>;
};

function resolveCategory(rawCategory: string | undefined) {
  return PORTFOLIO_CATEGORIES.includes(
    rawCategory as (typeof PORTFOLIO_CATEGORIES)[number],
  )
    ? (rawCategory as string)
    : null;
}

export async function generateMetadata({
  searchParams,
}: PortfolioPageProps): Promise<Metadata> {
  const [profile, { category: rawCategory }] = await Promise.all([
    getProfile(),
    searchParams,
  ]);
  const siteName = profile?.name ?? "Personal Portfolio";
  const category = resolveCategory(rawCategory);
  const label = category ? category.charAt(0).toUpperCase() + category.slice(1) : null;
  const description = label
    ? `Kumpulan project kategori ${label} yang pernah saya kerjakan.`
    : "Kumpulan project website, aplikasi, dan desain yang pernah saya kerjakan.";

  return buildPageMetadata({
    title: label ? `Portfolio — ${label}` : "Portfolio",
    siteName,
    description,
  });
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const { category: rawCategory } = await searchParams;
  const category = resolveCategory(rawCategory);

  const portfolios = await getPortfolios(category ?? undefined);

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-5xl">
        <PageIntro className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            My <span className="text-accent-tertiary">Portfolio</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A collection of web, application, and design projects that I have worked on.
          </p>
        </PageIntro>

        <div className="mt-8">
          <PortfolioFilterTabs active={category} />
        </div>

        {portfolios.length === 0 ? (
          <p className="mt-16 text-center text-subtle-foreground">
            {category
              ? `Belum ada portofolio kategori "${category}".`
              : "Belum ada portofolio yang ditambahkan."}
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                id={portfolio.id}
                title={portfolio.title}
                description={portfolio.description}
                category={portfolio.category}
                thumbnailUrl={portfolio.thumbnailUrl}
                year={portfolio.year}
                role={portfolio.role}
                techStack={portfolio.techStack}
                externalUrl={portfolio.externalUrl}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
