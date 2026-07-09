import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-neutral-100">
          Dashboard Admin
        </h1>
        <p className="mt-2 text-neutral-400">
          Login sebagai{" "}
          <span className="text-neutral-200">{session?.user?.email}</span>
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/dashboard/profile"
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-5 py-4 text-sm font-medium text-neutral-200 transition-colors hover:border-blue-500/50"
          >
            Edit Profil
            <p className="mt-1 text-xs font-normal text-neutral-500">
              Ubah bio, foto, kontak, dan skill.
            </p>
          </Link>
          <Link
            href="/admin/dashboard/portfolio"
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-5 py-4 text-sm font-medium text-neutral-200 transition-colors hover:border-blue-500/50"
          >
            Kelola Portofolio
            <p className="mt-1 text-xs font-normal text-neutral-500">
              Tambah, edit, atau hapus project.
            </p>
          </Link>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-red-500 hover:text-red-400"
          >
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}
