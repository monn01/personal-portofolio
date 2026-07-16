import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const [, , email, password] = process.argv;

  if (!email || !password) {
    console.error("Usage: npm run set-admin -- <email> <password>");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password minimal 8 karakter.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Admin account ready: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
