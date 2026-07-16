import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
    },
  });

  const taglines = [
    "Mahasiswa Informatika UAD",
    "Full-Stack Developer",
    "UI/UX Enthusiast",
  ];

  const profile = await prisma.profile.upsert({
    where: { id: "dummy-profile-1" },
    update: { taglines },
    create: {
      id: "dummy-profile-1",
      name: "Zaky Prayata",
      bio: "Full-stack developer yang suka membangun produk web dari nol, dari desain sampai deploy.",
      photoUrl: null,
      email: "zakyprayata490@gmail.com",
      contactLinks: [
        { label: "GitHub", url: "https://github.com/zakyprayata" },
        { label: "LinkedIn", url: "https://linkedin.com/in/zakyprayata" },
      ],
      taglines,
    },
  });

  const skills = [
    { name: "React", iconSlug: "react", category: "frontend" },
    { name: "Next.js", iconSlug: "nextdotjs", category: "frontend" },
    { name: "TypeScript", iconSlug: "typescript", category: "language" },
    { name: "Tailwind CSS", iconSlug: "tailwindcss", category: "frontend" },
    { name: "Node.js", iconSlug: "nodedotjs", category: "backend" },
    { name: "Prisma", iconSlug: "prisma", category: "backend" },
    { name: "Figma", iconSlug: "figma", category: "design" },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({
      where: { name: skill.name, profileId: profile.id },
    });
    if (!existing) {
      await prisma.skill.create({
        data: { ...skill, profileId: profile.id },
      });
    }
  }

  const portfolios = [
    {
      title: "Personal Portfolio Website",
      description:
        "Website portofolio pribadi dengan dashboard admin untuk mengelola konten tanpa sentuh kode.",
      category: "web",
      thumbnailUrl: null,
      year: 2026,
      role: "Full-stack Developer",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
      externalUrl: "https://github.com/zakyprayata/personal-portofolio",
    },
    {
      title: "Task Manager App",
      description:
        "Aplikasi manajemen tugas dengan fitur drag-and-drop dan realtime sync antar device.",
      category: "app",
      thumbnailUrl: null,
      year: 2025,
      role: "Frontend Developer",
      techStack: ["React", "Zustand", "Tailwind CSS"],
      externalUrl: "https://github.com/zakyprayata/task-manager",
    },
    {
      title: "E-commerce UI Kit",
      description:
        "Desain sistem komponen UI untuk platform e-commerce, lengkap dengan design tokens.",
      category: "design",
      thumbnailUrl: null,
      year: 2025,
      role: "UI/UX Designer",
      techStack: ["Figma", "Design System"],
      externalUrl: "https://figma.com/@zakyprayata",
    },
  ];

  for (const portfolio of portfolios) {
    const existing = await prisma.portfolio.findFirst({
      where: { title: portfolio.title },
    });
    if (!existing) {
      await prisma.portfolio.create({ data: portfolio });
    }
  }

  const experiences = [
    {
      title: "Freelance Web Developer",
      organization: "Mandiri",
      startDate: new Date("2023-01-01"),
      endDate: null,
      description:
        "Mengerjakan project website untuk UMKM dan personal branding klien, dari desain sampai deploy.",
      profileId: profile.id,
    },
    {
      title: "Ketua Divisi Pengembangan",
      organization: "Himpunan Mahasiswa Informatika UAD",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-08-01"),
      description:
        "Memimpin tim pengembangan website organisasi dan sistem informasi kegiatan mahasiswa.",
      profileId: profile.id,
    },
    {
      title: "Software Engineer Intern",
      organization: "PT Teknologi Nusantara",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-09-01"),
      description:
        "Membangun fitur dashboard internal pakai Next.js dan Prisma, kolaborasi dengan tim produk untuk requirement gathering.",
      profileId: profile.id,
    },
  ];

  for (const experience of experiences) {
    const existing = await prisma.experience.findFirst({
      where: { title: experience.title, organization: experience.organization },
    });
    if (!existing) {
      await prisma.experience.create({ data: experience });
    }
  }

  const certifications = [
    {
      title: "Belajar Dasar Pemrograman Web",
      issuer: "Dicoding Indonesia",
      issueDate: new Date("2024-03-15"),
      credentialUrl: "https://www.dicoding.com/certificates/example1",
      imageUrl: "/certificates/dicoding-dasar-web.png",
      profileId: profile.id,
    },
    {
      title: "Next.js Fundamentals",
      issuer: "Vercel",
      issueDate: new Date("2025-01-20"),
      credentialUrl: null,
      imageUrl: "/certificates/nextjs-fundamentals.png",
      profileId: profile.id,
    },
  ];

  for (const certification of certifications) {
    const existing = await prisma.certification.findFirst({
      where: { title: certification.title, issuer: certification.issuer },
    });
    if (!existing) {
      await prisma.certification.create({ data: certification });
    }
  }

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
