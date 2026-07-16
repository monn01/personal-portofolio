import type { Metadata } from "next";
import { SkillBadge } from "@/components/SkillBadge";
import { PageIntro } from "@/components/ui/PageIntro";
import { buildPageMetadata } from "@/lib/seo";
import { getProfile } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteName = profile?.name ?? "Personal Portfolio";
  const description = `Tools & teknologi yang dikuasai ${siteName}.`;

  return buildPageMetadata({ title: "Skills", siteName, description });
}

export default async function SkillsPage() {
  const profile = await getProfile();
  const skills = profile?.skills ?? [];

  if (skills.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <p className="text-subtle-foreground">Belum ada skill yang ditambahkan.</p>
      </main>
    );
  }

  const grouped = skills.reduce<Record<string, typeof skills>>(
    (acc, skill) => {
      const key = skill.category ?? "Lainnya";
      acc[key] = acc[key] ? [...acc[key], skill] : [skill];
      return acc;
    },
    {},
  );

  return (
    <main className="relative flex-1 px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-3xl text-center">
        <PageIntro>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            My <span className="text-accent-pink">Skills</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Tools, technologies, and soft skills I leverage to craft modern, responsive, and engaging web experiences.
          </p>
        </PageIntro>

        <div className="mt-12 flex flex-col items-center gap-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="w-full">
              <h2 className="mb-3 text-sm font-black tracking-wide text-subtle-foreground uppercase">
                {category}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {items.map((skill) => (
                  <SkillBadge
                    key={skill.id}
                    name={skill.name}
                    iconSlug={skill.iconSlug}
                    iconUrl={skill.iconUrl}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
