import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StatCard } from "@/components/ui/StatCard";
import { getStats } from "@/lib/queries";

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path strokeLinecap="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 12.5L7 21l5-3 5 3-1.5-8.5"
      />
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.7 6.3a4 4 0 10-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4z"
      />
    </svg>
  );
}

export async function StatsSection() {
  const stats = await getStats();

  const items = [
    {
      icon: <BriefcaseIcon />,
      value: `${stats.yearsOfExperience}+`,
      label: "Tahun Pengalaman",
      color: "accent" as const,
    },
    {
      icon: <FolderIcon />,
      value: `${stats.portfolioCount}`,
      label: "Project Selesai",
      color: "accent-secondary" as const,
    },
    {
      icon: <AwardIcon />,
      value: `${stats.certificationCount}`,
      label: "Sertifikat",
      color: "accent-tertiary" as const,
    },
    {
      icon: <ToolIcon />,
      value: `${stats.skillCount}`,
      label: "Skill Dikuasai",
      color: "accent-mint" as const,
    },
  ];

  return (
    <ScrollReveal>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <StatCard
            key={item.label}
            icon={item.icon}
            value={item.value}
            label={item.label}
            color={item.color}
          />
        ))}
      </div>
    </ScrollReveal>
  );
}
