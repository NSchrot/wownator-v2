import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "wownator",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // Create demo user (matching DEMO_USER_ID)
  const user = await prisma.user.upsert({
    where: { email: "demo@wownator.dev" },
    update: {},
    create: {
      id: "demo",
      name: "Demo Player",
      email: "demo@wownator.dev",
      password: "$2a$12$placeholder", // not a real login
      faction: "ALLIANCE",
    },
  });
  console.log(`✓ User: ${user.name} (${user.id})`);

  // Create characters
  const characters = [
    {
      name: "Arthas Menethil",
      faction: "ALLIANCE",
      race: "Humano",
      class: "Paladino",
      expansion: "Wrath of the Lich King",
      zone: "Coroa de Gelo",
      role: "Tank",
    },
    {
      name: "Thrall",
      faction: "HORDE",
      race: "Orc",
      class: "Xamã",
      expansion: "Classic",
      zone: "Orgrimmar",
      role: "Caster",
    },
    {
      name: "Sylvanas Windrunner",
      faction: "HORDE",
      race: "Morto-vivo",
      class: "Caçador",
      expansion: "Battle for Azeroth",
      zone: "Undercity",
      role: "Ranged",
    },
    {
      name: "Jaina Proudmoore",
      faction: "ALLIANCE",
      race: "Humano",
      class: "Mago",
      expansion: "Battle for Azeroth",
      zone: "Theramore",
      role: "Caster",
    },
    {
      name: "Illidan Stormrage",
      faction: null,
      race: "Elfo Noturno",
      class: "Demon Hunter",
      expansion: "The Burning Crusade",
      zone: "Templo Negro",
      role: "Melee",
    },
    {
      name: "Vol'jin",
      faction: "HORDE",
      race: "Troll",
      class: "Caçador de Sombras",
      expansion: "Mists of Pandaria",
      zone: "Orgrimmar",
      role: "Melee",
    },
    {
      name: "Anduin Wrynn",
      faction: "ALLIANCE",
      race: "Humano",
      class: "Sacerdote",
      expansion: "Legion",
      zone: "Stormwind",
      role: "Healer",
    },
    {
      name: "Garrosh Hellscream",
      faction: "HORDE",
      race: "Orc",
      class: "Guerreiro",
      expansion: "Mists of Pandaria",
      zone: "Orgrimmar",
      role: "Tank",
    },
  ];

  for (const charData of characters) {
    const char = await prisma.character.upsert({
      where: { name: charData.name },
      update: charData,
      create: charData,
    });
    console.log(`  ✓ Character: ${char.name}`);
  }

  // Create today's daily challenge (Arthas as target)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const arthas = await prisma.character.findUnique({
    where: { name: "Arthas Menethil" },
  });

  if (arthas) {
    await prisma.dailyChallenge.upsert({
      where: { date: today },
      update: { category: "CHARACTER", characterId: arthas.id },
      create: {
        date: today,
        category: "CHARACTER",
        characterId: arthas.id,
      },
    });
    console.log(`\n✓ Daily Challenge created for ${today.toLocaleDateString("pt-BR")}`);
    console.log(`  Target: ${arthas.name} (id=${arthas.id})`);
  }

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
