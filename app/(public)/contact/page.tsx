import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageIntro } from "@/components/ui/PageIntro";
import { buildPageMetadata } from "@/lib/seo";
import { getProfile } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteName = profile?.name ?? "Personal Portfolio";
  const description = `Hubungi ${siteName} untuk kerja sama, pertanyaan, atau sekadar say hi.`;

  return buildPageMetadata({ title: "Contact", siteName, description });
}

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-2xl">
        <PageIntro>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Contact <span className="text-accent-pink">Me</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Ada pertanyaan, tawaran kerja sama, atau cuma mau say hi? Kirim
            pesan lewat form di bawah.
          </p>
        </PageIntro>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>

        {profile?.email && (
          <p className="mt-6 text-center text-sm text-subtle-foreground">
            Atau email langsung ke{" "}
            <a
              href={`mailto:${profile.email}`}
              className="font-medium text-accent transition-colors hover:text-accent-hover"
            >
              {profile.email}
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
