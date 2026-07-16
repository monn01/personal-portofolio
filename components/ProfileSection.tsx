import { AchievementCard } from "@/components/AchievementCard";
import { Button } from "@/components/ui/Button";
import { PageIntro } from "@/components/ui/PageIntro";
import { RipplePanel } from "@/components/ui/RipplePanel";
import { TiltPhotoCard } from "@/components/ui/TiltPhotoCard";
import type { ContactLink } from "@/lib/queries";
import { getSimpleIconMarkup } from "@/lib/simple-icon";
import { getSocialFallbackMarkup, resolveSocialSlug } from "@/lib/social";

type AchievementItem = {
  id: string;
  title: string;
  description: string | null;
  organizer: string;
  year: number;
  tier: string;
  certificateUrl: string | null;
};

type ProfileSectionProps = {
  name: string;
  bio: string;
  photoUrl?: string | null;
  email: string;
  contactLinks: ContactLink[];
  galleryPhotos: string[];
  cvUrl?: string | null;
  taglines: string[];
  achievements: AchievementItem[];
};

export function ProfileSection({
  name,
  bio,
  photoUrl,
  email,
  contactLinks,
  galleryPhotos,
  cvUrl,
  taglines,
  achievements,
}: ProfileSectionProps) {
  const role = taglines[0] ?? null;

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <div className="flex flex-col-reverse gap-10 md:flex-row md:items-center md:gap-14">
        <PageIntro className="flex-1 text-center md:text-left">
          <p className="text-xs font-black tracking-widest text-accent uppercase">
            About Me
          </p>
          <h1 className="mt-1 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            {name}
          </h1>
          {role && (
            <p className="mt-1 text-lg font-bold text-accent-secondary">
              {role}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              href={`mailto:${email}`}
              className="text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              {email}
            </a>
            {contactLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {contactLinks.map((link) => {
                  const slug = resolveSocialSlug(link.url);
                  const markup = slug
                    ? (getSimpleIconMarkup(slug) ?? getSocialFallbackMarkup(slug))
                    : null;

                  if (!markup) {
                    return (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground-secondary transition-colors hover:border-accent/50 hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    );
                  }

                  return (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground-secondary transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      <span
                        aria-hidden="true"
                        className="h-4 w-4"
                        dangerouslySetInnerHTML={{ __html: markup }}
                      />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <p className="mt-6 leading-relaxed whitespace-pre-line text-foreground-secondary">
            {bio}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
            {cvUrl && (
              <Button href={cvUrl} variant="primary" tone="bold">
                Download CV ↓
              </Button>
            )}
            <Button href="/contact" variant="secondary" tone="bold">
              Hubungi Saya
            </Button>
          </div>
        </PageIntro>

        {photoUrl && (
          <div className="flex flex-1 justify-center md:justify-end">
            <TiltPhotoCard
              name={name}
              subtitle={role}
              photoUrl={photoUrl}
              ctaHref="/contact"
              ctaLabel="Contact Me"
            />
          </div>
        )}
      </div>

      {achievements.length > 0 && (
        <PageIntro className="mt-16">
          <h2 className="text-xl font-black text-foreground">Achievements</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </PageIntro>
      )}

      {galleryPhotos.length > 0 && (
        <PageIntro className="mt-16">
          <h2 className="text-xl font-black text-foreground">Galeri Foto</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {galleryPhotos.map((photo, index) => (
              <RipplePanel
                key={photo + index}
                className="aspect-square rounded-2xl border border-border transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`Foto ${name} #${index + 1}`}
                  className="h-full w-full bg-surface-hover object-cover"
                />
              </RipplePanel>
            ))}
          </div>
        </PageIntro>
      )}
    </section>
  );
}
