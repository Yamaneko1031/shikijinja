import { TokuMasterData } from '@/types/toku';

export const tokuMaster: TokuMasterData[] = [
  { tokuId: 'torii', label: '鳥居をくぐった', limit: 1, coin: 100, permanent: false },
  { tokuId: 'ema_post', label: '絵馬を書いた', limit: 1, coin: 300, permanent: false },
  { tokuId: 'ema_tap', label: '絵馬をタップした', limit: 5, coin: 20, permanent: false },
  {
    tokuId: 'omikuji_nekobiyori',
    label: 'ねこ日和を引いた',
    limit: 3,
    coin: 300,
    permanent: false,
  },
  {
    tokuId: 'omikuji_hitohira',
    label: 'ひとひらくじを引いた',
    limit: 3,
    coin: 300,
    permanent: false,
  },
  { tokuId: 'omikuji_omikuji', label: 'おみくじを引いた', limit: 3, coin: 300, permanent: false },
  { tokuId: 'nadeneko', label: 'なで猫をなでた', limit: 1, coin: 0, permanent: false }, // 特殊抽選
  { tokuId: 'omamori_buy', label: 'お守りを購入', limit: 10, coin: 500, permanent: false },
  {
    tokuId: 'regist_reward',
    label: 'アカウント登録をした',
    limit: 1,
    coin: 500,
    permanent: true,
  },
  { tokuId: 'saisen', label: '賽銭を投げた', limit: 1000, coin: 0, permanent: false }, // 特殊抽選
  { tokuId: 'saisen_50', label: '賽銭を50円投げた', limit: 1000, coin: 50, permanent: false },
  { tokuId: 'saisen_100', label: '賽銭を100円投げた', limit: 1000, coin: 100, permanent: false },
  { tokuId: 'saisen_500', label: '賽銭を500円投げた', limit: 1000, coin: 500, permanent: false },
  { tokuId: 'shoukai', label: '神様紹介を見た', limit: 1, coin: 100, permanent: true },
  { tokuId: 'jikkai', label: '十戒を見た', limit: 1, coin: 100, permanent: true },

  {
    tokuId: 'debug_add',
    label: 'デバッグ用：コイン追加',
    limit: 1000,
    coin: 100,
    permanent: false,
  },
  {
    tokuId: 'debug_sub',
    label: 'デバッグ用：コイン減算',
    limit: 1000,
    coin: 100,
    permanent: false,
  },
];
