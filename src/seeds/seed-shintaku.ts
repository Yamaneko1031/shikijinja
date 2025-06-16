import { prisma } from '@/server/prisma';
// npx tsx ./src/seeds/seed-shintaku.ts

export const shintakuSeeds_Shikineko: string[] = [
  '今日書いた一行が、明日のあなたを支える。焦らず心静かにコードと語り合いなさい。',
  'エラーの森に迷ったときは、立ち止まり深呼吸を。静寂の中で出口はそっと姿を現す。',
];

export const shintakuSeeds_Iroha: string[] = [
  'コードは音楽のようにリズムを刻む。整った拍子が読みやすさを生む。',
  '速さより安定を選びなさい。揺るぎない基盤が成果を守る。',
  '行き詰まったら空を見上げよう。視点が変われば、道も変わる。',
];

export const shintakuSeeds_Tenten: string[] = [
  '今日の小さな勝利を胸に、また明日。',
  'コミットは時を刻む鐘。響きが細部を記憶する。',
  '朝に書いたテストは夕暮れを守る。明日への橋を掛けるために。',
];

async function seedShintakuMaster() {
  console.log('🌱 Shintaku データを投入開始...');

  try {
    // 既存データを削除
    await prisma.shintakuMessageMaster.deleteMany();
    console.log('既存のShintakuMasterデータを削除しました。');

    // データを一つずつ投入
    for (const msg of shintakuSeeds_Shikineko) {
      await prisma.shintakuMessageMaster.create({
        data: {
          imageKey: 'shikineko',
          message: msg,
        },
      });
    }
    for (const msg of shintakuSeeds_Iroha) {
      await prisma.shintakuMessageMaster.create({
        data: {
          imageKey: 'iroha',
          message: msg,
        },
      });
    }
    for (const msg of shintakuSeeds_Tenten) {
      await prisma.shintakuMessageMaster.create({
        data: {
          imageKey: 'tenten',
          message: msg,
        },
      });
    }

    console.log('🎉 ShintakuMaster データの投入が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 直接実行する場合
if (require.main === module) {
  seedShintakuMaster();
}

export { seedShintakuMaster };
