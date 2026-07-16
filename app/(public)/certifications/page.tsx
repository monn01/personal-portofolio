import type { Metadata } from "next";
import { AchievementCard } from "@/components/AchievementCard";
import { CertificationCard } from "@/components/CertificationCard";
import { PageIntro } from "@/components/ui/PageIntro";
import { buildPageMetadata } from "@/lib/seo";
import { getAchievements, getCertifications, getProfile } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteName = profile?.name ?? "Personal Portfolio";
  const description = `Sertifikat dan penghargaan yang pernah diraih ${siteName}.`;

  return buildPageMetadata({ title: "Certifications & Awards", siteName, description });
}

function CertificationGroup({
  title,
  certifications,
}: {
  title: string;
  certifications: Awaited<ReturnType<typeof getCertifications>>;
}) {
  if (certifications.length === 0) return null;

  return (
    <div>
      <h2 className="text-center text-xl font-black text-foreground">
        {title}
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((certification) => (
          <CertificationCard
            key={certification.id}
            title={certification.title}
            issuer={certification.issuer}
            issueDate={certification.issueDate}
            credentialUrl={certification.credentialUrl}
            imageUrl={certification.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default async function CertificationsPage() {
  const [certifications, achievements] = await Promise.all([
    getCertifications(),
    getAchievements(),
  ]);
  const local = certifications.filter((c) => c.tier === "local");
  const international = certifications.filter((c) => c.tier === "international");
  const isEmpty = certifications.length === 0 && achievements.length === 0;

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-5xl">
        <PageIntro className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Certifications <span className="text-accent-mint">&amp; Awards</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A collection of certifications and achievements that reflect my continuous learning and professional development.
          </p>
        </PageIntro>

        {isEmpty ? (
          <p className="mt-16 text-center text-subtle-foreground">
            Belum ada sertifikat atau penghargaan yang ditambahkan.
          </p>
        ) : (
          <div className="mt-12 flex flex-col gap-12">
            <CertificationGroup title="Internasional" certifications={international} />
            <CertificationGroup title="Lokal" certifications={local} />

            {achievements.length > 0 && (
              <div>
                <h2 className="text-center text-xl font-black text-foreground">
                  Awards
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      title={achievement.title}
                      description={achievement.description}
                      organizer={achievement.organizer}
                      year={achievement.year}
                      tier={achievement.tier}
                      certificateUrl={achievement.certificateUrl}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
