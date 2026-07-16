import Link from "next/link";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export default function NewPortfolioPage() {
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
          Tambah Portofolio
        </h1>

        <div className="mt-8">
          <PortfolioForm mode="create" />
        </div>
      </div>
    </main>
  );
}
