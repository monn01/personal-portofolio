import Link from "next/link";
import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { getPortfolioById } from "@/lib/queries";

export default async function EditPortfolioPage({
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
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard/portfolio"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Kelola Portofolio
        </Link>

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Edit Portofolio
        </h1>

        <div className="mt-8">
          <PortfolioForm
            mode="edit"
            portfolioId={portfolio.id}
            initial={{
              title: portfolio.title,
              description: portfolio.description,
              category: portfolio.category,
              thumbnailUrl: portfolio.thumbnailUrl,
              year: portfolio.year,
              role: portfolio.role,
              techStack: portfolio.techStack,
              externalUrl: portfolio.externalUrl,
            }}
          />
        </div>
      </div>
    </main>
  );
}
