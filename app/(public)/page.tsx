import type { Metadata } from "next";
import { CertAwardPreviewCard } from "@/components/CertAwardPreviewCard";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { HeroSection } from "@/components/HeroSection";
import { PortfolioCard } from "@/components/PortfolioCard";
import { SkillIcon } from "@/components/SkillIcon";
import { SkillsPreview } from "@/components/SkillsPreview";
import { StatsSection } from "@/components/StatsSection";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  getAchievements,
  getCertifications,
  getExperiences,
  getPortfolios,
  getProfile,
} from "@/lib/queries";
import { truncate } from "@/lib/format";

const HOME_CERT_AWARD_LIMIT = 6;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const description =
    profile?.bio ?? "Profil, skill, dan portofolio pribadi.";

  return { description };
}

type SectionAccent =
  | "accent"
  | "accent-secondary"
  | "accent-tertiary"
  | "accent-pink"
  | "accent-mint";

const ACCENT_TEXT: Record<SectionAccent, string> = {
  accent: "text-accent",
  "accent-secondary": "text-accent-secondary",
  "accent-tertiary": "text-accent-tertiary",
  "accent-pink": "text-accent-pink",
  "accent-mint": "text-accent-mint",
};

function SectionHeader({
  title,
  accent = "accent",
}: {
  title: string;
  accent?: SectionAccent;
}) {
  const words = title.trim().split(" ");
  const highlight = words.pop() ?? "";
  const prefix = words.join(" ");

  return (
    <div className="text-center">
      <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
        {prefix && `${prefix} `}
        <span className={ACCENT_TEXT[accent]}>{highlight}</span>
      </h2>
    </div>
  );
}

function ViewAllLink({ href }: { href: string }) {
  return (
    <div className="mt-6 flex justify-end">
      <Button href={href} variant="ghost" size="sm" tone="bold">
        Lihat semua →
      </Button>
    </div>
  );
}

export default async function HomePage() {
  const [profile, achievements, experiences, certifications, portfolios] =
    await Promise.all([
      getProfile(),
      getAchievements(),
      getExperiences(),
      getCertifications(),
      getPortfolios(),
    ]);

  const heroSkills = (profile?.skills ?? [])
    .filter((skill) => skill.iconSlug || skill.iconUrl)
    .map((skill) => ({
      name: skill.name,
      icon: (
        <SkillIcon
          name={skill.name}
          iconSlug={skill.iconSlug}
          iconUrl={skill.iconUrl}
          className="h-8 w-8"
          useBrandColor
        />
      ),
    }));

  const certAwardItems = [
    ...certifications
      .filter((certification) => certification.featuredOnHome)
      .map((certification) => ({
        type: "certification" as const,
        date: certification.issueDate,
        data: certification,
      })),
    ...achievements.map((achievement) => ({
      type: "achievement" as const,
      date: new Date(achievement.year, 0, 1),
      data: achievement,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
  const certAwardTotal = certAwardItems.length;
  const certAwardPreview = certAwardItems.slice(0, HOME_CERT_AWARD_LIMIT);

  return (
    <main className="relative flex-1 overflow-hidden">
      <section className="relative mx-auto w-full max-w-5xl px-6 pt-12 pb-24 sm:pt-16 sm:pb-28">
        {/*
          Pinned back to the pre-redesign font: the rest of the site moved to
          Plus Jakarta Sans, but Hero is intentionally kept as our own visual
          identity and untouched — see HeroSection.tsx, which is never edited.
        */}
        <div className="font-[family-name:var(--font-geist-sans)]">
          <HeroSection
            name={profile?.name ?? "Pemilik Portfolio"}
            shortBio={
              profile?.heroBio || truncate(profile?.bio ?? "Profil belum diisi.", 110)
            }
            photoUrl={profile?.heroPhotoUrl || profile?.photoUrl || null}
            taglines={profile?.taglines ?? []}
            skills={heroSkills}
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-6 pb-24">
        <StatsSection />

        {profile && profile.skills.length > 0 && (
          <ScrollReveal className="mt-16">
            <SectionHeader title="Work Skill" accent="accent-pink" />
            <div className="mt-8">
              <SkillsPreview />
            </div>
          </ScrollReveal>
        )}

        {certAwardPreview.length > 0 && (
          <ScrollReveal className="mt-16">
            <SectionHeader title="Certification & Award" accent="accent-mint" />
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {certAwardPreview.map((item) => (
                <CertAwardPreviewCard
                  key={item.data.id}
                  title={item.data.title}
                  imageUrl={item.data.imageUrl}
                  kind={item.type}
                />
              ))}
            </div>
            {certAwardTotal > HOME_CERT_AWARD_LIMIT && (
              <ViewAllLink href="/certifications" />
            )}
          </ScrollReveal>
        )}

        {experiences.length > 0 && (
          <ScrollReveal className="mt-16">
            <SectionHeader title="Work Experience" accent="accent-secondary" />
            <div className="mx-auto mt-6 max-w-3xl">
              <ExperienceTimeline
                experiences={experiences.slice(0, 3)}
                collapsibleDescription
              />
            </div>
            <ViewAllLink href="/experience" />
          </ScrollReveal>
        )}

        {portfolios.length > 0 && (
          <ScrollReveal className="mt-16">
            <SectionHeader title="Featured Works" accent="accent-tertiary" />
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {portfolios.slice(0, 3).map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  id={portfolio.id}
                  title={portfolio.title}
                  description={portfolio.description}
                  category={portfolio.category}
                  thumbnailUrl={portfolio.thumbnailUrl}
                  year={portfolio.year}
                  role={portfolio.role}
                  techStack={portfolio.techStack}
                  externalUrl={portfolio.externalUrl}
                  collapsibleDescription
                />
              ))}
            </div>
            <ViewAllLink href="/portfolio" />
          </ScrollReveal>
        )}
      </div>
    </main>
  );
}
