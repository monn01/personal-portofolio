import Link from "next/link";
import { AchievementForm } from "@/components/admin/AchievementForm";

export default function NewAchievementPage() {
  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard/achievements"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Kelola Achievements
        </Link>

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Tambah Achievement
        </h1>

        <div className="mt-8">
          <AchievementForm mode="create" />
        </div>
      </div>
    </main>
  );
}
