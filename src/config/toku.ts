import { TokuMasterData } from '@/types/toku';

export const tokuMaster: TokuMasterData[] = [
  { tokuId: 'visit', label: 'サイトを訪れた', limit: 1, point: 50 },
  { tokuId: 'torii', label: '鳥居をくぐった', limit: 1, point: 50 },
  { tokuId: 'ema', label: '絵馬を書いた', limit: 1, point: 200 },
  { tokuId: 'ema_tap', label: '絵馬をタップした', limit: 5, point: 10 },
  { tokuId: 'nekobiyori', label: 'ねこ日和を引いた', limit: 3, point: -100 },
  { tokuId: 'hitohira', label: 'ひとひらくじを引いた', limit: 1, point: -100 },
  { tokuId: 'omikuji', label: 'おみくじを引いた', limit: 1, point: -300 },
];
