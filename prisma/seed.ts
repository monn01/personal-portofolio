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

  const profile = await prisma.profile.upsert({
    where: { id: "dummy-profile-1" },
    update: {},
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
