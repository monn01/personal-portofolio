import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificationForm } from "@/components/admin/CertificationForm";
import { getCertificationById } from "@/lib/queries";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certification = await getCertificationById(id);

  if (!certification) {
    notFound();
  }

  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard/certifications"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Kelola Certifications
        </Link>

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Edit Certification
        </h1>

        <div className="mt-8">
          <CertificationForm
            mode="edit"
            certificationId={certification.id}
            initial={{
              title: certification.title,
              issuer: certification.issuer,
              issueDate: certification.issueDate,
              credentialUrl: certification.credentialUrl,
              imageUrl: certification.imageUrl,
              tier: certification.tier,
              featuredOnHome: certification.featuredOnHome,
            }}
          />
        </div>
      </div>
    </main>
  );
}
