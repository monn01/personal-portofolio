import { SkillBadge } from "@/components/SkillBadge";
import { getProfile } from "@/lib/queries";

export default async function SkillsPage() {
  const profile = await getProfile();
  const skills = profile?.skills ?? [];

  if (skills.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center bg-neutral-950 px-6 py-24">
        <p className="text-neutral-500">Belum ada skill yang ditambahkan.</p>
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
    <main className="flex-1 bg-neutral-950 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-neutral-100">Skills</h1>
        <p className="mt-2 text-neutral-400">
          Tools & teknologi yang saya kuasai.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-500 uppercase">
                {category}
              </h2>
              <div className="flex flex-wrap gap-3">
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
