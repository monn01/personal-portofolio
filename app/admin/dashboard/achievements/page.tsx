import Link from "next/link";
import { AdminListRow } from "@/components/admin/AdminListRow";
import { TrophyIcon } from "@/components/admin/AdminNavIcons";
import { Button } from "@/components/ui/Button";
import { getAchievements } from "@/lib/queries";

export default async function AdminAchievementsListPage() {
  const achievements = await getAchievements();

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
            Kelola Achievements
          </h1>
          <Button
            href="/admin/dashboard/achievements/new"
            variant="primary"
            size="sm"
            tone="bold"
          >
            + Tambah Achievement
          </Button>
        </div>

        {achievements.length === 0 ? (
          <p className="mt-10 text-subtle-foreground">
            Belum ada achievement.
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {achievements.map((achievement) => (
              <AdminListRow
                key={achievement.id}
                editHref={`/admin/dashboard/achievements/${achievement.id}/edit`}
                title={achievement.title}
                subtitle={`${achievement.organizer} · ${achievement.year} · ${achievement.tier}`}
                icon={<TrophyIcon />}
                deleteEndpoint={`/api/achievement/${achievement.id}`}
                deleteConfirmMessage={`Hapus achievement "${achievement.title}"? Tindakan ini tidak bisa dibatalkan.`}
                deleteErrorMessage="Gagal menghapus achievement."
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
