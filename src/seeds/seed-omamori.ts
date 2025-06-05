import { prisma } from '@/server/prisma';
import { OmamoriBase } from '@/types/omamori';
// npx tsx ./src/seeds/seed-omamori.ts

export const omamoriSeeds: OmamoriBase[] = [
  {
    id: '01',
    name: '納期守',
    hurigana: 'のうきまもり',
    description:
      '納期を守り、心の余裕を持たせるお守り。\n締め切り前の焦りやプレッシャーをやわらげ、落ち着きを与えます。時間を味方にして、安心して仕事に取り組みましょう。',
    imageUrl: '/images/omamori/omamori_nouki.webp',
    price: 500,
    effects: [
      {
        name: '成功運',
        power: 60,
      },
      {
        name: '仕事運',
        power: 40,
      },
    ],
  },
  {
    id: '02',
    name: '不具合守',
    hurigana: 'ふぐあいまもり',
    description:
      '予期せぬ不具合やバグから守ってくれる、頼れるお守り。\nトラブル発生時にも冷静な対処ができる力を与えてくれます。穏やかな心で、不具合を素早く解決しましょう。',
    imageUrl: '/images/omamori/omamori_huguai.webp',
    price: 500,
    effects: [
      {
        name: 'デバッグ運',
        power: 60,
      },
      {
        name: '厄除け運',
        power: 40,
      },
    ],
  },
  {
    id: '03',
    name: '平癒守',
    hurigana: 'へいゆまもり',
    description:
      '心身の健康を回復させ、病気や疲れから守るお守り。\n不調を感じたとき、優しく癒して回復を促します。日々の健康を支え、元気な毎日を送る力となります。',
    imageUrl: '/images/omamori/omamori_heiyu.webp',
    price: 500,
    effects: [
      {
        name: '健康運',
        power: 60,
      },
      {
        name: '美容運',
        power: 40,
      },
    ],
  },
  {
    id: '04',
    name: '金運守',
    hurigana: 'きんうんまもり',
    description:
      '収入や貯蓄など、お金にまつわる運気を上げるお守り。\n無駄遣いを防ぎ、豊かな暮らしへの道を示します。毎日を豊かに暮らすためのお守りとして身近に置いてください。',
    imageUrl: '/images/omamori/omamori_kinun.webp',
    price: 500,
    effects: [
      {
        name: '金運',
        power: 60,
      },
      {
        name: '商売運',
        power: 40,
      },
    ],
  },
  {
    id: '05',
    name: '厄除守',
    hurigana: 'やくよけまもり',
    description:
      '厄災やトラブルから身を守ってくれる強力なお守り。\n悪い運気や邪気を跳ね返し、平穏な日々を保ちます。穏やかで安心できる日常を手に入れましょう。',
    imageUrl: '/images/omamori/omamori_yakuyoke.webp',
    price: 500,
    effects: [
      {
        name: '厄除け運',
        power: 60,
      },
      {
        name: '家内安全運',
        power: 20,
      },
      {
        name: '交通安全運',
        power: 20,
      },
    ],
  },
  {
    id: '06',
    name: '勝守',
    hurigana: 'かちまもり',
    description:
      '勝負事や競争、プレッシャーのかかる状況で力を発揮するお守り。\nここぞという場面で勇気と自信を与えてくれます。大事な勝負に臨むとき、あなたの力強い味方になります。',
    imageUrl: '/images/omamori/omamori_kachi.webp',
    price: 500,
    effects: [
      {
        name: '勝負運',
        power: 60,
      },
      {
        name: '成功運',
        power: 40,
      },
    ],
  },
  {
    id: '07',
    name: '情報守',
    hurigana: 'じょうほうまもり',
    description:
      '情報漏えいやデータのトラブルから守るIT時代のお守り。\n大切な情報を安全に保ち、秘密をしっかり守ります。情報管理に携わるすべての人のための心強い存在です。',
    imageUrl: '/images/omamori/omamori_jouhou.webp',
    price: 500,
    effects: [
      {
        name: 'セキュリティ運',
        power: 60,
      },
      {
        name: 'インフラ運',
        power: 40,
      },
    ],
  },
  {
    id: '08',
    name: '合格守',
    hurigana: 'ごうかくまもり',
    description:
      '試験や資格取得、受験での成功を願うお守り。\n日頃の勉強の成果を発揮し、合格を後押しします。努力が実を結び、未来の扉を開く力を与えます。',
    imageUrl: '/images/omamori/omamori_goukaku.webp',
    price: 500,
    effects: [
      {
        name: '勉強運',
        power: 60,
      },
      {
        name: '学業運',
        power: 40,
      },
    ],
  },
  {
    id: '09',
    name: '余白守',
    hurigana: 'よはくまもり',
    description:
      '心に、暮らしに、ちょうどいい余白を与えてくれるお守り。\n日々の慌ただしさの中で、心の余裕、時間のゆとり、人との程よい距離感を保てるようになるでしょう。',
    imageUrl: '/images/omamori/omamori_yohaku.webp',
    price: 500,
    effects: [
      {
        name: '対人運',
        power: 60,
      },
      {
        name: '健康運',
        power: 40,
      },
    ],
  },
  {
    id: '10',
    name: '閃守',
    hurigana: 'ひらめきまもり',
    description:
      'あなたのもとへ、ひらめきが舞い降りてくるお守り。\nアイデアに困った時や、新しい発想を求める場面で、天啓のようなひらめきで乗り越えていけるでしょう。',
    imageUrl: '/images/omamori/omamori_hirameki.webp',
    price: 500,
    effects: [
      {
        name: '開運',
        power: 60,
      },
      {
        name: '商売運',
        power: 40,
      },
    ],
  },
];

async function seedOmamoriBase() {
  console.log('🌱 OmamoriBase データを投入開始...');

  try {
    // 既存データを削除（任意）
    // await prisma.omamoriBase.deleteMany();
    // console.log('既存のOmamoriBaseデータを削除しました。');

    // データを一つずつ投入（同じidの場合は上書き）
    for (const omamori of omamoriSeeds) {
      const created = await prisma.omamoriBase.upsert({
        where: {
          id: omamori.id,
        },
        update: {
          name: omamori.name,
          hurigana: omamori.hurigana,
          description: omamori.description,
          effects: omamori.effects,
          imageUrl: omamori.imageUrl,
          price: omamori.price,
        },
        create: {
          id: omamori.id,
          name: omamori.name,
          hurigana: omamori.hurigana,
          description: omamori.description,
          effects: omamori.effects,
          imageUrl: omamori.imageUrl,
          price: omamori.price,
        },
      });
      console.log(
        `✅ ${created.name} を${created.id === omamori.id ? '作成' : '更新'}しました (ID: ${created.id})`
      );
    }

    console.log('🎉 OmamoriBase データの投入が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 直接実行する場合
if (require.main === module) {
  seedOmamoriBase();
}

export { seedOmamoriBase };
