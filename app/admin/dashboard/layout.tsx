import {
  AwardIcon,
  BriefcaseIcon,
  DashboardIcon,
  DocumentIcon,
  FolderIcon,
  MailIcon,
  TrophyIcon,
  UserIcon,
} from "@/components/admin/AdminNavIcons";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { Button } from "@/components/ui/Button";
import { auth, signOut } from "@/lib/auth";
import { getUnreadMessageCount } from "@/lib/queries";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, unreadCount] = await Promise.all([
    auth(),
    getUnreadMessageCount(),
  ]);

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    {
      href: "/admin/dashboard/profile",
      label: "Profile & Skills",
      icon: <UserIcon />,
    },
    {
      href: "/admin/dashboard/portfolio",
      label: "Portfolio",
      icon: <FolderIcon />,
    },
    {
      href: "/admin/dashboard/experience",
      label: "Experience",
      icon: <BriefcaseIcon />,
    },
    {
      href: "/admin/dashboard/achievements",
      label: "Achievements",
      icon: <TrophyIcon />,
    },
    {
      href: "/admin/dashboard/certifications",
      label: "Certifications",
      icon: <AwardIcon />,
    },
    { href: "/admin/dashboard/blog", label: "Blog", icon: <DocumentIcon /> },
    {
      href: "/admin/dashboard/messages",
      label: "Messages",
      icon: <MailIcon />,
      badge: unreadCount,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <aside className="flex flex-col gap-1 border-b border-border bg-surface p-4 md:min-h-screen md:w-64 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex items-center gap-2 px-2 pb-4">
          <span className="text-lg font-black tracking-tighter text-foreground">
            Admin<span className="text-accent-pink">.</span>
          </span>
        </div>

        <AdminSidebarNav items={navItems} />

        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 md:mt-auto">
          <p className="truncate px-2 text-xs font-medium text-subtle-foreground">
            {session?.user?.email}
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button
              type="submit"
              variant="danger"
              size="sm"
              tone="bold"
              className="w-full"
            >
              Logout
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
