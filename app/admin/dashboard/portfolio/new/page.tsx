import Link from "next/link";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard/portfolio"
          className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-200"
        >
          ← Kembali ke Kelola Portofolio
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-100">
          Tambah Portofolio
        </h1>

        <div className="mt-8">
          <PortfolioForm mode="create" />
        </div>
      </div>
    </main>
  );
}
