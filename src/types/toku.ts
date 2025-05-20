export const tokuIds = [
  'visit',
  'torii',
  'ema',
  'ema_tap',
  'nekobiyori',
  'hitohira',
  'omikuji',
] as const;

export type TokuId = (typeof tokuIds)[number];

export type TokuMasterData = {
  tokuId: TokuId;
  label: string;
  limit: number;
  point: number;
};

export type TokuCounts = {
  [tokuId in TokuId]?: {
    count: number;
  };
};
