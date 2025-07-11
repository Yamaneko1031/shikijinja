import { PrismaClient } from '@/generated/prisma';
// npx tsx ./src/seeds/seed-dbcopy.ts

const dev = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
const prod = new PrismaClient({ datasources: { db: { url: process.env.PROD_DATABASE_URL } } });

// const data = await dev.promptTemplate.findMany();
// await prod.promptTemplate.createMany({ data, skipDuplicates: true });

(async () => {
  const data = await dev.promptTemplate.findMany();
  if (data.length) {
    await prod.promptTemplate.createMany({ data, skipDuplicates: true });
  }
})()
  .catch(console.error)
  .finally(async () => {
    await dev.$disconnect();
    await prod.$disconnect();
  });
