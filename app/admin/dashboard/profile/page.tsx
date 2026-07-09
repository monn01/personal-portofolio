import Link from "next/link";
import { EditProfileForm } from "@/components/admin/EditProfileForm";
import { getProfile } from "@/lib/queries";

export default async function EditProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-10">
        <p className="text-neutral-500">
          Profil belum ada di database. Jalankan seed terlebih dahulu.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-200"
        >
          ← Kembali ke Dashboard
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-neutral-100">
          Edit Profil
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Perubahan langsung terlihat di halaman publik setelah disimpan.
        </p>

        <div className="mt-8">
          <EditProfileForm
            initial={{
              name: profile.name,
              bio: profile.bio,
              photoUrl: profile.photoUrl,
              email: profile.email,
              contactLinks: profile.contactLinks,
              skills: profile.skills.map((skill) => ({
                name: skill.name,
                iconSlug: skill.iconSlug,
                iconUrl: skill.iconUrl,
                category: skill.category,
              })),
            }}
          />
        </div>
      </div>
    </main>
  );
}
