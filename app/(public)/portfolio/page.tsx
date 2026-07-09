import { PortfolioCard } from "@/components/PortfolioCard";
import { getPortfolios } from "@/lib/queries";

export default async function PortfolioPage() {
  const portfolios = await getPortfolios();

  return (
    <main className="flex-1 bg-neutral-950 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-neutral-100">Portfolio</h1>
        <p className="mt-2 text-neutral-400">
          Kumpulan project website, aplikasi, dan desain yang pernah saya
          kerjakan.
        </p>

        {portfolios.length === 0 ? (
          <p className="mt-16 text-center text-neutral-500">
            Belum ada portofolio yang ditambahkan.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
