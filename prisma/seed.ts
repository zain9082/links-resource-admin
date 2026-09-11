import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail || !adminPassword) {
    throw new Error("Set ADMIN_EMAIL and SEED_ADMIN_PASSWORD before seeding an admin.");
  }
  if (adminPassword.length < 16) {
    throw new Error("SEED_ADMIN_PASSWORD must contain at least 16 characters.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN, passwordHash, name: "LR Admin" },
    create: {
      email: adminEmail,
      role: Role.ADMIN,
      passwordHash,
      name: "LR Admin",
    },
  });

  console.log(`Admin user ready: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
