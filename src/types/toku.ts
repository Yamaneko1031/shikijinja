export const tokuIds = [
  'torii',
  'ema_post',
  'ema_tap',
  'omikuji_nekobiyori',
  'omikuji_hitohira',
  'omikuji_omikuji',
  'nadeneko',
  'omamori_buy',
  'regist_reward',
  'saisen_50',
  'saisen_100',
  'saisen_500',
  'debug_add',
  'debug_sub',
] as const;

export type TokuId = (typeof tokuIds)[number];

export type TokuMasterData = {
  tokuId: TokuId;
  label: string;
  limit: number;
  coin: number;
};

export type TokuCounts = {
  [tokuId in TokuId]?: {
    count: number;
  };
};
