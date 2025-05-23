import { TokuMasterData } from '@/types/toku';

export const tokuMaster: TokuMasterData[] = [
  { tokuId: 'torii', label: '鳥居をくぐった', limit: 1, coin: 50 },
  { tokuId: 'ema_post', label: '絵馬を書いた', limit: 1, coin: 200 },
  { tokuId: 'ema_tap', label: '絵馬をタップした', limit: 5, coin: 10 },
  { tokuId: 'omikuji_nekobiyori', label: 'ねこ日和を引いた', limit: 3, coin: 100 },
  { tokuId: 'omikuji_hitohira', label: 'ひとひらくじを引いた', limit: 1, coin: 100 },
  { tokuId: 'omikuji_omikuji', label: 'おみくじを引いた', limit: 1, coin: 300 },
  { tokuId: 'nadeneko', label: 'なで猫をなでた', limit: 1, coin: 100 },
];
