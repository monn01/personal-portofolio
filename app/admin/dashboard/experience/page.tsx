import Link from "next/link";
import { AdminListRow } from "@/components/admin/AdminListRow";
import { BriefcaseIcon } from "@/components/admin/AdminNavIcons";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { getExperiences } from "@/lib/queries";

export default async function AdminExperienceListPage() {
  const experiences = await getExperiences();

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
            Kelola Experience
          </h1>
          <Button
            href="/admin/dashboard/experience/new"
            variant="primary"
            size="sm"
            tone="bold"
          >
            + Tambah Experience
          </Button>
        </div>

        {experiences.length === 0 ? (
          <p className="mt-10 text-subtle-foreground">Belum ada experience.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {experiences.map((experience) => (
              <AdminListRow
                key={experience.id}
                editHref={`/admin/dashboard/experience/${experience.id}/edit`}
                title={experience.title}
                subtitle={`${experience.organization} · ${formatDate(experience.startDate)} — ${
                  experience.endDate
                    ? formatDate(experience.endDate)
                    : "Sekarang"
                }`}
                imageUrl={experience.imageUrl}
                icon={<BriefcaseIcon />}
                deleteEndpoint={`/api/experience/${experience.id}`}
                deleteConfirmMessage={`Hapus experience "${experience.title}"? Tindakan ini tidak bisa dibatalkan.`}
                deleteErrorMessage="Gagal menghapus experience."
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
