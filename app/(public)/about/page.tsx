import type { Metadata } from "next";
import { ProfileSection } from "@/components/ProfileSection";
import { buildPageMetadata } from "@/lib/seo";
import { getProfile } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteName = profile?.name ?? "Personal Portfolio";
  const description = profile
    ? `Kenalan lebih dekat dengan ${profile.name} — bio dan kontak.`
    : "Kenalan lebih dekat dengan pemilik portfolio ini.";

  return buildPageMetadata({ title: "About", siteName, description });
}

export default async function AboutPage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <p className="text-subtle-foreground">Profil belum tersedia.</p>
      </main>
    );
  }

  return (
    <main className="relative flex-1 overflow-hidden">
      <ProfileSection
        name={profile.name}
        bio={profile.bio}
        photoUrl={profile.photoUrl}
        email={profile.email}
        contactLinks={profile.contactLinks}
        galleryPhotos={profile.galleryPhotos}
        cvUrl={profile.cvUrl}
        taglines={profile.taglines}
      />
    </main>
  );
}
