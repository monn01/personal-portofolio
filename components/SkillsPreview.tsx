import { SkillIcon } from "./SkillIcon";
import { SkillOrb } from "./SkillOrb";
import { SkillMarquee } from "./ui/SkillMarquee";
import { getProfile } from "@/lib/queries";

export async function SkillsPreview() {
  const profile = await getProfile();
  const skills = profile?.skills ?? [];

  if (skills.length === 0) return null;

  const toolSkills = skills.filter((skill) => skill.iconSlug || skill.iconUrl);
  const otherSkills = skills.filter((skill) => !skill.iconSlug && !skill.iconUrl);

  const marqueeSkills = toolSkills.map((skill) => ({
    name: skill.name,
    icon: (
      <SkillIcon
        name={skill.name}
        iconSlug={skill.iconSlug}
        iconUrl={skill.iconUrl}
        className="h-7 w-7"
        useBrandColor
      />
    ),
  }));

  // Enough skills to make a two-row, opposite-direction marquee feel
  // intentional rather than two near-empty rows.
  const splitIndex = Math.ceil(marqueeSkills.length / 2);
  const topRow = marqueeSkills.slice(0, splitIndex);
  const bottomRow = marqueeSkills.slice(splitIndex);
  const useTwoRows = marqueeSkills.length >= 6 && bottomRow.length > 0;

  return (
    <div className="flex flex-col items-center gap-8">
      {marqueeSkills.length > 0 && (
        <div className="flex w-full flex-col gap-4">
          <SkillMarquee skills={useTwoRows ? topRow : marqueeSkills} />
          {useTwoRows && <SkillMarquee skills={bottomRow} direction="right" />}
        </div>
      )}

      {otherSkills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {otherSkills.map((skill) => (
            <SkillOrb key={skill.id} name={skill.name} />
          ))}
        </div>
      )}
    </div>
  );
}
