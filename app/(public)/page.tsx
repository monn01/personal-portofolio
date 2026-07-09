import Link from "next/link";
import { getProfile } from "@/lib/queries";

export default async function HomePage() {
  const profile = await getProfile();

  return (
    <main className="flex flex-1 items-center bg-neutral-950">
      <section className="mx-auto w-full max-w-3xl px-6 py-24">
        {profile?.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="mb-6 h-16 w-16 rounded-full object-cover"
          />
        )}

        <p className="text-sm font-medium text-blue-500">Halo, saya</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-neutral-100 sm:text-5xl">
          {profile?.name ?? "Pemilik Portfolio"}
        </h1>
        <p className="mt-4 max-w-xl text-neutral-400">
          {profile?.bio ?? "Profil belum diisi."}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/portfolio"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Lihat Projects
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-500"
          >
            Tentang Saya
          </Link>
        </div>
      </section>
    </main>
  );
}
