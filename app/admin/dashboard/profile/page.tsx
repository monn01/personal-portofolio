import Link from "next/link";
import { EditProfileForm } from "@/components/admin/EditProfileForm";
import { getProfile } from "@/lib/queries";

export default async function EditProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <main className="flex-1 bg-background px-6 py-10">
        <p className="text-subtle-foreground">
          Profil belum ada di database. Jalankan seed terlebih dahulu.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Dashboard
        </Link>

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Edit Profil
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
              taglines: profile.taglines,
              galleryPhotos: profile.galleryPhotos,
              cvUrl: profile.cvUrl,
              heroPhotoUrl: profile.heroPhotoUrl,
              heroBio: profile.heroBio,
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
