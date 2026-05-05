import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create the hardcoded user
  const user = await prisma.user.upsert({
    where: { id: "danilo-main-user" },
    update: {},
    create: {
      id: "danilo-main-user",
      email: "danilo@personal.com",
      name: "Danilo",
      password: null, // No password needed in DB
    },
  });

  console.log("✅ User created:", user);
  console.log("🌱 Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
