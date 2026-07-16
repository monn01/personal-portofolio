import type { Metadata } from "next";
import { ExperienceShowcase } from "@/components/ExperienceShowcase";
import { PageIntro } from "@/components/ui/PageIntro";
import { buildPageMetadata } from "@/lib/seo";
import { getExperiences, getProfile } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteName = profile?.name ?? "Personal Portfolio";
  const description = `Riwayat pengalaman kerja dan organisasi ${siteName}.`;

  return buildPageMetadata({ title: "Experience", siteName, description });
}

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-4xl">
        <PageIntro className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            My <span className="text-accent-secondary">Experience</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A summary of my professional and organizational experience, highlighting my contributions, technical skills, and collaborative work.
          </p>
        </PageIntro>

        {experiences.length === 0 ? (
          <p className="mt-16 text-center text-subtle-foreground">
            Belum ada pengalaman yang ditambahkan.
          </p>
        ) : (
          <div className="mt-12">
            <ExperienceShowcase experiences={experiences} />
          </div>
        )}
      </div>
    </main>
  );
}
