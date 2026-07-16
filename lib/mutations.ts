import { PORTFOLIO_CATEGORIES, TIERS } from "./constants";
import type { ContactLink } from "./queries";
import { prisma } from "./prisma";

export function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2025"
  );
}

export type UpdateProfileInput = {
  name: string;
  bio: string;
  photoUrl: string | null;
  email: string;
  contactLinks: ContactLink[];
  taglines: string[];
  galleryPhotos: string[];
  cvUrl: string | null;
  heroPhotoUrl: string | null;
  heroBio: string | null;
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
        taglines: input.taglines,
        galleryPhotos: input.galleryPhotos,
        cvUrl: input.cvUrl?.trim() || null,
        heroPhotoUrl: input.heroPhotoUrl?.trim() || null,
        heroBio: input.heroBio?.trim() || null,
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
  if (!PORTFOLIO_CATEGORIES.includes(input.category as (typeof PORTFOLIO_CATEGORIES)[number])) {
    errors.push(`Kategori harus salah satu dari: ${PORTFOLIO_CATEGORIES.join(", ")}.`);
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

export type ExperienceInput = {
  title: string;
  organization: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  imageUrl: string | null;
};

export function parseExperienceInput(
  raw: Record<string, unknown>,
): ExperienceInput {
  return {
    title: typeof raw.title === "string" ? raw.title : "",
    organization: typeof raw.organization === "string" ? raw.organization : "",
    startDate:
      typeof raw.startDate === "string" && raw.startDate
        ? new Date(raw.startDate)
        : new Date(NaN),
    endDate:
      typeof raw.endDate === "string" && raw.endDate
        ? new Date(raw.endDate)
        : null,
    description: typeof raw.description === "string" ? raw.description : "",
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : null,
  };
}

export function validateExperienceInput(input: ExperienceInput): string[] {
  const errors: string[] = [];

  if (!input.title.trim()) errors.push("Judul wajib diisi.");
  if (!input.organization.trim()) errors.push("Organisasi wajib diisi.");
  if (!input.description.trim()) errors.push("Deskripsi wajib diisi.");
  if (Number.isNaN(input.startDate.getTime())) {
    errors.push("Tanggal mulai tidak valid.");
  }
  if (input.endDate && Number.isNaN(input.endDate.getTime())) {
    errors.push("Tanggal selesai tidak valid.");
  }
  if (
    input.endDate &&
    !Number.isNaN(input.startDate.getTime()) &&
    !Number.isNaN(input.endDate.getTime()) &&
    input.endDate < input.startDate
  ) {
    errors.push("Tanggal selesai tidak boleh sebelum tanggal mulai.");
  }

  return errors;
}

function toExperienceData(input: ExperienceInput) {
  return {
    title: input.title.trim(),
    organization: input.organization.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    description: input.description.trim(),
    imageUrl: input.imageUrl?.trim() || null,
  };
}

export async function createExperience(input: ExperienceInput) {
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    throw new Error("Profile belum ada di database.");
  }

  return prisma.experience.create({
    data: { ...toExperienceData(input), profileId: profile.id },
  });
}

export async function updateExperience(id: string, input: ExperienceInput) {
  return prisma.experience.update({
    where: { id },
    data: toExperienceData(input),
  });
}

export async function deleteExperience(id: string) {
  return prisma.experience.delete({ where: { id } });
}

export type CertificationInput = {
  title: string;
  issuer: string;
  issueDate: Date;
  credentialUrl: string | null;
  imageUrl: string;
  tier: string;
};

export function parseCertificationInput(
  raw: Record<string, unknown>,
): CertificationInput {
  return {
    title: typeof raw.title === "string" ? raw.title : "",
    issuer: typeof raw.issuer === "string" ? raw.issuer : "",
    issueDate:
      typeof raw.issueDate === "string" && raw.issueDate
        ? new Date(raw.issueDate)
        : new Date(NaN),
    credentialUrl:
      typeof raw.credentialUrl === "string" ? raw.credentialUrl : null,
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : "",
    tier: typeof raw.tier === "string" ? raw.tier : TIERS[0],
  };
}

export function validateCertificationInput(
  input: CertificationInput,
): string[] {
  const errors: string[] = [];

  if (!input.title.trim()) errors.push("Judul wajib diisi.");
  if (!input.issuer.trim()) errors.push("Issuer wajib diisi.");
  if (!input.imageUrl.trim()) errors.push("Gambar sertifikat wajib diupload.");
  if (Number.isNaN(input.issueDate.getTime())) {
    errors.push("Tanggal terbit tidak valid.");
  }
  if (!TIERS.includes(input.tier as (typeof TIERS)[number])) {
    errors.push(`Tier harus salah satu dari: ${TIERS.join(", ")}.`);
  }

  return errors;
}

function toCertificationData(input: CertificationInput) {
  return {
    title: input.title.trim(),
    issuer: input.issuer.trim(),
    issueDate: input.issueDate,
    credentialUrl: input.credentialUrl?.trim() || null,
    imageUrl: input.imageUrl.trim(),
    tier: input.tier,
  };
}

export async function createCertification(input: CertificationInput) {
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    throw new Error("Profile belum ada di database.");
  }

  return prisma.certification.create({
    data: { ...toCertificationData(input), profileId: profile.id },
  });
}

export async function updateCertification(
  id: string,
  input: CertificationInput,
) {
  return prisma.certification.update({
    where: { id },
    data: toCertificationData(input),
  });
}

export async function deleteCertification(id: string) {
  return prisma.certification.delete({ where: { id } });
}

export type AchievementInput = {
  title: string;
  description: string | null;
  organizer: string;
  year: number;
  tier: string;
  certificateUrl: string | null;
};

export function parseAchievementInput(
  raw: Record<string, unknown>,
): AchievementInput {
  return {
    title: typeof raw.title === "string" ? raw.title : "",
    description: typeof raw.description === "string" ? raw.description : null,
    organizer: typeof raw.organizer === "string" ? raw.organizer : "",
    year: typeof raw.year === "number" ? raw.year : Number(raw.year),
    tier: typeof raw.tier === "string" ? raw.tier : "",
    certificateUrl:
      typeof raw.certificateUrl === "string" ? raw.certificateUrl : null,
  };
}

export function validateAchievementInput(input: AchievementInput): string[] {
  const errors: string[] = [];

  if (!input.title.trim()) errors.push("Judul wajib diisi.");
  if (!input.organizer.trim()) errors.push("Penyelenggara wajib diisi.");
  if (!Number.isInteger(input.year) || input.year < 1900 || input.year > 2100) {
    errors.push("Tahun tidak valid.");
  }
  if (!TIERS.includes(input.tier as (typeof TIERS)[number])) {
    errors.push(`Tier harus salah satu dari: ${TIERS.join(", ")}.`);
  }

  return errors;
}

function toAchievementData(input: AchievementInput) {
  return {
    title: input.title.trim(),
    description: input.description?.trim() || null,
    organizer: input.organizer.trim(),
    year: input.year,
    tier: input.tier,
    certificateUrl: input.certificateUrl?.trim() || null,
  };
}

export async function createAchievement(input: AchievementInput) {
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    throw new Error("Profile belum ada di database.");
  }

  return prisma.achievement.create({
    data: { ...toAchievementData(input), profileId: profile.id },
  });
}

export async function updateAchievement(id: string, input: AchievementInput) {
  return prisma.achievement.update({
    where: { id },
    data: toAchievementData(input),
  });
}

export async function deleteAchievement(id: string) {
  return prisma.achievement.delete({ where: { id } });
}

export type ContactMessageInput = {
  name: string;
  email: string;
  message: string;
};

export function parseContactMessageInput(
  raw: Record<string, unknown>,
): ContactMessageInput {
  return {
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    message: typeof raw.message === "string" ? raw.message : "",
  };
}

export function validateContactMessageInput(
  input: ContactMessageInput,
): string[] {
  const errors: string[] = [];

  if (!input.name.trim()) errors.push("Nama wajib diisi.");
  if (!input.email.trim()) {
    errors.push("Email wajib diisi.");
  } else if (!EMAIL_REGEX.test(input.email.trim())) {
    errors.push("Format email tidak valid.");
  }
  if (!input.message.trim()) errors.push("Pesan wajib diisi.");

  return errors;
}

export async function createContactMessage(input: ContactMessageInput) {
  return prisma.contactMessage.create({
    data: {
      name: input.name.trim(),
      email: input.email.trim(),
      message: input.message.trim(),
    },
  });
}

export async function setMessageReadState(id: string, isRead: boolean) {
  return prisma.contactMessage.update({
    where: { id },
    data: { isRead },
  });
}

export async function deleteContactMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  published: boolean;
};

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parsePostInput(raw: Record<string, unknown>): PostInput {
  return {
    title: typeof raw.title === "string" ? raw.title : "",
    slug: typeof raw.slug === "string" ? raw.slug : "",
    excerpt: typeof raw.excerpt === "string" ? raw.excerpt : "",
    content: typeof raw.content === "string" ? raw.content : "",
    coverImageUrl:
      typeof raw.coverImageUrl === "string" ? raw.coverImageUrl : null,
    published: typeof raw.published === "boolean" ? raw.published : false,
  };
}

export function validatePostInput(input: PostInput): string[] {
  const errors: string[] = [];

  if (!input.title.trim()) errors.push("Judul wajib diisi.");
  if (!input.slug.trim()) {
    errors.push("Slug wajib diisi.");
  } else if (!SLUG_REGEX.test(input.slug.trim())) {
    errors.push(
      "Slug cuma boleh huruf kecil, angka, dan tanda hubung (mis. judul-artikel-saya).",
    );
  }
  if (!input.excerpt.trim()) errors.push("Ringkasan wajib diisi.");
  if (!input.content.trim()) errors.push("Konten wajib diisi.");

  return errors;
}

function toPostData(input: PostInput) {
  return {
    title: input.title.trim(),
    slug: input.slug.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    coverImageUrl: input.coverImageUrl?.trim() || null,
    published: input.published,
  };
}

export function isDuplicateSlugError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function createPost(input: PostInput) {
  const data = toPostData(input);
  return prisma.post.create({
    data: { ...data, publishedAt: data.published ? new Date() : null },
  });
}

export async function updatePost(id: string, input: PostInput) {
  const data = toPostData(input);
  const existing = await prisma.post.findUnique({ where: { id } });
  const publishedAt = data.published
    ? (existing?.publishedAt ?? new Date())
    : (existing?.publishedAt ?? null);

  return prisma.post.update({
    where: { id },
    data: { ...data, publishedAt },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
