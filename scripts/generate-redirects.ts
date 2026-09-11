import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    fs.writeFileSync(
      path.join(process.cwd(), "redirects.generated.json"),
      JSON.stringify([], null, 2)
    );
    console.log("DATABASE_URL missing. Generated empty redirects file.");
    return;
  }

  let redirects: Array<{
    source: string;
    destination: string;
    permanent: boolean;
  }> = [];

  try {
    redirects = await prisma.redirect.findMany({
      where: { active: true },
      select: { source: true, destination: true, permanent: true },
    });
  } catch {
    console.warn("Redirect source unavailable. Writing empty redirects file.");
  }

  fs.writeFileSync(
    path.join(process.cwd(), "redirects.generated.json"),
    JSON.stringify(redirects, null, 2)
  );

  console.log(`Generated ${redirects.length} redirect rules.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
