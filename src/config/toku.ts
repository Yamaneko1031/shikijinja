import { TokuMasterData } from '@/types/toku';

export const tokuMaster: TokuMasterData[] = [
  { tokuId: 'torii', label: '鳥居をくぐった', limit: 1, coin: 100 },
  { tokuId: 'ema_post', label: '絵馬を書いた', limit: 1, coin: 300 },
  { tokuId: 'ema_tap', label: '絵馬をタップした', limit: 5, coin: 20 },
  { tokuId: 'omikuji_nekobiyori', label: 'ねこ日和を引いた', limit: 3, coin: 300 },
  { tokuId: 'omikuji_hitohira', label: 'ひとひらくじを引いた', limit: 3, coin: 300 },
  { tokuId: 'omikuji_omikuji', label: 'おみくじを引いた', limit: 3, coin: 300 },
  { tokuId: 'nadeneko', label: 'なで猫をなでた', limit: 100, coin: 0 }, // 特殊抽選
  { tokuId: 'omamori_buy', label: 'お守りを購入', limit: 10, coin: 500 },
  { tokuId: 'regist_reward', label: 'アカウント登録をした', limit: 1, coin: 500 },

  { tokuId: 'debug_add', label: 'デバッグ用：コイン追加', limit: 1000, coin: 100 },
  { tokuId: 'debug_sub', label: 'デバッグ用：コイン減算', limit: 1000, coin: 100 },
];
