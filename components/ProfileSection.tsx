import type { ContactLink } from "@/lib/queries";

type ProfileSectionProps = {
  name: string;
  bio: string;
  photoUrl?: string | null;
  email: string;
  contactLinks: ContactLink[];
};

export function ProfileSection({
  name,
  bio,
  photoUrl,
  email,
  contactLinks,
}: ProfileSectionProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center gap-4">
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-neutral-100">{name}</h1>
          <a
            href={`mailto:${email}`}
            className="text-sm text-neutral-400 transition-colors hover:text-blue-400"
          >
            {email}
          </a>
        </div>
      </div>

      <p className="mt-6 max-w-2xl leading-relaxed whitespace-pre-line text-neutral-300">
        {bio}
      </p>

      {contactLinks.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          {contactLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-blue-500/50 hover:text-neutral-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
