import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { getExperienceById } from "@/lib/queries";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperienceById(id);

  if (!experience) {
    notFound();
  }

  return (
    <main className="flex-1 bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/dashboard/experience"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-secondary"
        >
          ← Kembali ke Kelola Experience
        </Link>

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Edit Experience
        </h1>

        <div className="mt-8">
          <ExperienceForm
            mode="edit"
            experienceId={experience.id}
            initial={{
              title: experience.title,
              organization: experience.organization,
              startDate: experience.startDate,
              endDate: experience.endDate,
              description: experience.description,
              imageUrl: experience.imageUrl,
            }}
          />
        </div>
      </div>
    </main>
  );
}
