import Link from "next/link";
import { AdminListRow } from "@/components/admin/AdminListRow";
import { FolderIcon } from "@/components/admin/AdminNavIcons";
import { Button } from "@/components/ui/Button";
import { getPortfolios } from "@/lib/queries";

export default async function AdminPortfolioListPage() {
  const portfolios = await getPortfolios();

  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Dashboard
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground">
            Kelola Portofolio
          </h1>
          <Button href="/admin/dashboard/portfolio/new" variant="primary" size="sm" tone="bold">
            + Tambah Portofolio
          </Button>
        </div>

        {portfolios.length === 0 ? (
          <p className="mt-10 text-subtle-foreground">Belum ada portofolio.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {portfolios.map((portfolio) => (
              <AdminListRow
                key={portfolio.id}
                editHref={`/admin/dashboard/portfolio/${portfolio.id}/edit`}
                title={portfolio.title}
                subtitle={`${portfolio.category} · ${portfolio.year}`}
                imageUrl={portfolio.thumbnailUrl}
                icon={<FolderIcon />}
                deleteEndpoint={`/api/portfolio/${portfolio.id}`}
                deleteConfirmMessage={`Hapus portofolio "${portfolio.title}"? Tindakan ini tidak bisa dibatalkan.`}
                deleteErrorMessage="Gagal menghapus portofolio."
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
