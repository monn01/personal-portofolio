import Link from "next/link";
import { notFound } from "next/navigation";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { getAchievementById } from "@/lib/queries";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const achievement = await getAchievementById(id);

  if (!achievement) {
    notFound();
  }

  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard/achievements"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Kelola Awards
        </Link>

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Edit Award
        </h1>

        <div className="mt-8">
          <AchievementForm
            mode="edit"
            achievementId={achievement.id}
            initial={{
              title: achievement.title,
              description: achievement.description,
              organizer: achievement.organizer,
              year: achievement.year,
              tier: achievement.tier,
              certificateUrl: achievement.certificateUrl,
              imageUrl: achievement.imageUrl,
            }}
          />
        </div>
      </div>
    </main>
  );
}
