import type { ContactLink } from "./queries";
import { prisma } from "./prisma";

export type UpdateProfileInput = {
  name: string;
  bio: string;
  photoUrl: string | null;
  email: string;
  contactLinks: ContactLink[];
  skills: {
    name: string;
    iconSlug: string | null;
    iconUrl: string | null;
    category: string | null;
  }[];
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateProfileInput(input: UpdateProfileInput): string[] {
  const errors: string[] = [];

  if (!input.name.trim()) errors.push("Nama wajib diisi.");
  if (!input.bio.trim()) errors.push("Bio wajib diisi.");
  if (!input.email.trim()) {
    errors.push("Email wajib diisi.");
  } else if (!EMAIL_REGEX.test(input.email.trim())) {
    errors.push("Format email tidak valid.");
  }

  input.contactLinks.forEach((link, i) => {
    if (!link.label.trim() || !link.url.trim()) {
      errors.push(`Contact link #${i + 1} harus punya label dan url.`);
    }
  });

  input.skills.forEach((skill, i) => {
    if (!skill.name.trim()) {
      errors.push(`Skill #${i + 1} harus punya nama.`);
    }
  });

  return errors;
}

export async function updateProfile(input: UpdateProfileInput) {
  const existing = await prisma.profile.findFirst();
  if (!existing) {
    throw new Error("Profile belum ada di database.");
  }

  return prisma.$transaction(async (tx) => {
    await tx.profile.update({
      where: { id: existing.id },
      data: {
        name: input.name.trim(),
        bio: input.bio.trim(),
        photoUrl: input.photoUrl?.trim() || null,
        email: input.email.trim(),
        contactLinks: input.contactLinks,
      },
    });

    await tx.skill.deleteMany({ where: { profileId: existing.id } });

    if (input.skills.length > 0) {
      await tx.skill.createMany({
        data: input.skills.map((skill) => ({
          name: skill.name.trim(),
          iconSlug: skill.iconSlug?.trim() || null,
          iconUrl: skill.iconUrl?.trim() || null,
          category: skill.category?.trim() || null,
          profileId: existing.id,
        })),
      });
    }

    return tx.profile.findUniqueOrThrow({
      where: { id: existing.id },
      include: { skills: true },
    });
  });
}

export type PortfolioInput = {
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string | null;
  year: number;
  role: string;
  techStack: string[];
  externalUrl: string | null;
};

const VALID_CATEGORIES = ["web", "app", "design"];

export function parsePortfolioInput(raw: Record<string, unknown>): PortfolioInput {
  return {
    title: typeof raw.title === "string" ? raw.title : "",
    description: typeof raw.description === "string" ? raw.description : "",
    category: typeof raw.category === "string" ? raw.category : "",
    thumbnailUrl: typeof raw.thumbnailUrl === "string" ? raw.thumbnailUrl : null,
    year: typeof raw.year === "number" ? raw.year : Number(raw.year),
    role: typeof raw.role === "string" ? raw.role : "",
    techStack: Array.isArray(raw.techStack)
      ? raw.techStack.filter((t): t is string => typeof t === "string")
      : [],
    externalUrl: typeof raw.externalUrl === "string" ? raw.externalUrl : null,
  };
}

export function validatePortfolioInput(input: PortfolioInput): string[] {
  const errors: string[] = [];

  if (!input.title.trim()) errors.push("Judul wajib diisi.");
  if (!input.description.trim()) errors.push("Deskripsi wajib diisi.");
  if (!VALID_CATEGORIES.includes(input.category)) {
    errors.push(`Kategori harus salah satu dari: ${VALID_CATEGORIES.join(", ")}.`);
  }
  if (!input.role.trim()) errors.push("Peran wajib diisi.");
  if (!Number.isInteger(input.year) || input.year < 1900 || input.year > 2100) {
    errors.push("Tahun tidak valid.");
  }

  return errors;
}

function toPortfolioData(input: PortfolioInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    thumbnailUrl: input.thumbnailUrl?.trim() || null,
    year: input.year,
    role: input.role.trim(),
    techStack: input.techStack,
    externalUrl: input.externalUrl?.trim() || null,
  };
}

export async function createPortfolio(input: PortfolioInput) {
  return prisma.portfolio.create({ data: toPortfolioData(input) });
}

export async function updatePortfolio(id: string, input: PortfolioInput) {
  return prisma.portfolio.update({
    where: { id },
    data: toPortfolioData(input),
  });
}

export async function deletePortfolio(id: string) {
  return prisma.portfolio.delete({ where: { id } });
}
