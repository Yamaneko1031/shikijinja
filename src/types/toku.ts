export const tokuIds = [
  'torii',
  'torii_first',
  'ema_post',
  'ema_tap',
  'omikuji_nekobiyori',
  'omikuji_hitohira',
  'omikuji_omikuji',
  'nadeneko',
  'omamori_buy',
  'regist_reward',
  'saisen',
  'saisen_50',
  'saisen_100',
  'saisen_500',
  'shoukai',
  'jikkai',
  'omikuji_share',
  'omamori_share',
  'debug_add',
  'debug_sub',
] as const;

export type TokuId = (typeof tokuIds)[number];

export type TokuMasterData = {
  tokuId: TokuId;
  label: string;
  limit: number;
  coin: number;
  permanent: boolean;
  someId?: TokuId;
};

export type TokuCounts = {
  [tokuId in TokuId]?: {
    count: number;
  };
};
