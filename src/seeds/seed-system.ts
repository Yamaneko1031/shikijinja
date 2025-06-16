import { prisma } from '@/server/prisma';
// npx tsx ./src/seeds/seed-system.ts

async function seedSystem() {
  console.log('🌱 System データを投入開始...');

  try {
    // 既存データを削除
    // await prisma.systemInfomations.deleteMany();
    // console.log('既存のSystemInfomationsデータを削除しました。');

    await prisma.systemInfomations.upsert({
      where: { id: 1 },
      create: {
        shintakuData: { shintakuKey: 'tenten', shikinekoCount: 0, irohaCount: 0, tentenCount: 0 },
      },
      update: {
        shintakuData: { shintakuKey: 'tenten', shikinekoCount: 0, irohaCount: 0, tentenCount: 0 },
      },
    });
    console.log(`✅ System データを作成しました`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 直接実行する場合
if (require.main === module) {
  seedSystem();
}

export { seedSystem };
