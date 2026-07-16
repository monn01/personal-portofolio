import Link from "next/link";
import {
  AwardIcon,
  BriefcaseIcon,
  DocumentIcon,
  FolderIcon,
  MailIcon,
  TrophyIcon,
  UserIcon,
} from "@/components/admin/AdminNavIcons";
import { VisitorChart } from "@/components/admin/VisitorChart";
import { NetworkBackground } from "@/components/effects/NetworkBackground";
import { auth } from "@/lib/auth";
import { getAdminOverviewCounts, getDailyVisitCounts } from "@/lib/queries";

export default async function AdminDashboardPage() {
  const [session, counts, visits] = await Promise.all([
    auth(),
    getAdminOverviewCounts(),
    getDailyVisitCounts(14),
  ]);

  const tiles = [
    {
      href: "/admin/dashboard/profile",
      title: "Edit Profil",
      description: "Ubah bio, foto, kontak, taglines, dan skill.",
      icon: <UserIcon />,
    },
    {
      href: "/admin/dashboard/portfolio",
      title: "Kelola Portofolio",
      description: "Tambah, edit, atau hapus project.",
      icon: <FolderIcon />,
      count: counts.portfolio,
    },
    {
      href: "/admin/dashboard/experience",
      title: "Kelola Experience",
      description: "Tambah, edit, atau hapus riwayat pengalaman.",
      icon: <BriefcaseIcon />,
      count: counts.experience,
    },
    {
      href: "/admin/dashboard/achievements",
      title: "Kelola Achievements",
      description: "Tambah, edit, atau hapus pencapaian/penghargaan.",
      icon: <TrophyIcon />,
      count: counts.achievement,
    },
    {
      href: "/admin/dashboard/certifications",
      title: "Kelola Certifications",
      description: "Tambah, edit, atau hapus sertifikat.",
      icon: <AwardIcon />,
      count: counts.certification,
    },
    {
      href: "/admin/dashboard/blog",
      title: "Kelola Blog",
      description: "Tulis, edit, atau hapus artikel.",
      icon: <DocumentIcon />,
      count: counts.post,
    },
    {
      href: "/admin/dashboard/messages",
      title: "Pesan Masuk",
      description: "Lihat dan kelola pesan dari form contact.",
      icon: <MailIcon />,
      count: counts.unreadMessages,
      countLabel: "belum dibaca",
    },
  ];

  return (
    <main className="relative flex-1 overflow-hidden bg-background px-6 py-10">
      <NetworkBackground />

      <div className="relative mx-auto max-w-4xl">
        <div className="rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-md sm:p-8">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Halo, <span className="text-accent">Admin</span> 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Login sebagai{" "}
            <span className="text-foreground-secondary">{session?.user?.email}</span>
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-md sm:p-8">
          <VisitorChart data={visits} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:bg-surface-hover hover:shadow-lg hover:shadow-accent/10"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110">
                <span className="h-5 w-5">{tile.icon}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black text-foreground">
                    {tile.title}
                  </span>
                  {tile.count != null && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-black ${
                        tile.countLabel && tile.count > 0
                          ? "bg-accent text-white"
                          : "bg-surface-hover text-muted-foreground"
                      }`}
                    >
                      {tile.count} {tile.countLabel ?? ""}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-xs text-subtle-foreground">
                  {tile.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
