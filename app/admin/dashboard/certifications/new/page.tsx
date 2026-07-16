import Link from "next/link";
import { CertificationForm } from "@/components/admin/CertificationForm";

export default function NewCertificationPage() {
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
          Tambah Certification
        </h1>

        <div className="mt-8">
          <CertificationForm mode="create" />
        </div>
      </div>
    </main>
  );
}
