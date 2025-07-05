type NadenekoRank = {
  name: string;
  description: string;
  image: string;
  coin: number;
};

export const nadenekoRank: NadenekoRank[] = [
  {
    name: '毛玉見習い',
    description: '猫に触らせてもらえる',
    image: '/images/nadeneko/nadeneko_rank_1.webp',
    coin: 50,
  },
  {
    name: 'にゃんこビギナー',
    description: 'ぎこちない手つきだが嫌じゃない',
    image: '/images/nadeneko/nadeneko_rank_2.webp',
    coin: 100,
  },
  {
    name: '肉球タッチャー',
    description: '肉球をそっとタッチできる',
    image: '/images/nadeneko/nadeneko_rank_3.webp',
    coin: 150,
  },
  {
    name: 'しっぽスイーパー',
    description: 'しっぽをなでても怒られない',
    image: '/images/nadeneko/nadeneko_rank_4.webp',
    coin: 200,
  },
  {
    name: 'ねこだまり入門',
    description: '２匹同時になでられる実力者',
    image: '/images/nadeneko/nadeneko_rank_5.webp',
    coin: 250,
  },
  {
    name: 'おひざ公認',
    description: '膝上で爆睡してくれる',
    image: '/images/nadeneko/nadeneko_rank_6.webp',
    coin: 300,
  },
  {
    name: 'ゴロゴロ職人',
    description: '喉ゴロ率ほぼ100%',
    image: '/images/nadeneko/nadeneko_rank_7.webp',
    coin: 350,
  },
  {
    name: 'ねこまねき',
    description: '道端の猫が寄って来る',
    image: '/images/nadeneko/nadeneko_rank_8.webp',
    coin: 400,
  },
  {
    name: 'にゃんこ仙人',
    description: '猫が群がり肩に乗るレベル',
    image: '/images/nadeneko/nadeneko_rank_9.webp',
    coin: 100000,
  },
];

export const subMessageTable = [
  'そこにゃ！',
  'イイ感じにゃ！',
  'その調子にゃ！',
  'もっとにゃ！',
  'うにゃー。',
  'ごろごろ。',
  'にゃんー！',
  'にゃにゃーん！',
  'ふにゃー。',
  'にゃにゃ！',
];
