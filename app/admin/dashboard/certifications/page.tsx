import Link from "next/link";
import { AdminListRow } from "@/components/admin/AdminListRow";
import { AwardIcon } from "@/components/admin/AdminNavIcons";
import { CertificationFeaturedToggle } from "@/components/admin/CertificationFeaturedToggle";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { getCertifications } from "@/lib/queries";

export default async function AdminCertificationsListPage() {
  const certifications = await getCertifications();

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
            Kelola Certifications
          </h1>
          <Button
            href="/admin/dashboard/certifications/new"
            variant="primary"
            size="sm"
            tone="bold"
          >
            + Tambah Certification
          </Button>
        </div>

        {certifications.length === 0 ? (
          <p className="mt-10 text-subtle-foreground">Belum ada certification.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {certifications.map((certification) => (
              <AdminListRow
                key={certification.id}
                editHref={`/admin/dashboard/certifications/${certification.id}/edit`}
                title={certification.title}
                subtitle={`${certification.issuer} · ${formatDate(certification.issueDate)}`}
                imageUrl={certification.imageUrl}
                icon={<AwardIcon />}
                extraAction={
                  <CertificationFeaturedToggle
                    id={certification.id}
                    title={certification.title}
                    issuer={certification.issuer}
                    issueDate={certification.issueDate.toISOString()}
                    credentialUrl={certification.credentialUrl}
                    imageUrl={certification.imageUrl}
                    tier={certification.tier}
                    featuredOnHome={certification.featuredOnHome}
                  />
                }
                deleteEndpoint={`/api/certification/${certification.id}`}
                deleteConfirmMessage={`Hapus certification "${certification.title}"? Tindakan ini tidak bisa dibatalkan.`}
                deleteErrorMessage="Gagal menghapus certification."
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
