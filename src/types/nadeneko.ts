export type NadenekoResponse = {
  totalAddCoin: number;
  addCoins: number[];
};

export type RankingData = {
  pettingCount: number;
  points: number;
  userName: string;
};

export type NadenekoBantukeResponse = {
  rankingData: RankingData[];
};
