import Link from "next/link";
import { DeletePortfolioButton } from "@/components/admin/DeletePortfolioButton";
import { getPortfolios } from "@/lib/queries";

export default async function AdminPortfolioListPage() {
  const portfolios = await getPortfolios();

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-200"
        >
          ← Kembali ke Dashboard
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-100">
            Kelola Portofolio
          </h1>
          <Link
            href="/admin/dashboard/portfolio/new"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            + Tambah Portofolio
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <p className="mt-10 text-neutral-500">Belum ada portofolio.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-neutral-100">
                    {portfolio.title}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {portfolio.category} · {portfolio.year}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/dashboard/portfolio/${portfolio.id}/edit`}
                    className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Edit
                  </Link>
                  <DeletePortfolioButton
                    id={portfolio.id}
                    title={portfolio.title}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
