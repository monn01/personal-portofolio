import Link from "next/link";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard/experience"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Kelola Experience
        </Link>

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Tambah Experience
        </h1>

        <div className="mt-8">
          <ExperienceForm mode="create" />
        </div>
      </div>
    </main>
  );
}
