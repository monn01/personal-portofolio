import { ProfileSection } from "@/components/ProfileSection";
import { getProfile } from "@/lib/queries";

export default async function AboutPage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <main className="flex flex-1 items-center justify-center bg-neutral-950 px-6 py-24">
        <p className="text-neutral-500">Profil belum tersedia.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-neutral-950">
      <ProfileSection
        name={profile.name}
        bio={profile.bio}
        photoUrl={profile.photoUrl}
        email={profile.email}
        contactLinks={profile.contactLinks}
      />
    </main>
  );
}
