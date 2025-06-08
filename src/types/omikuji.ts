export type OmikujiDetail = {
  type: string;
  rank: number;
  element: string;
};

export type OmikujiResponse = {
  id: string;
  job: string;
  type: string;
  period: string;
  fortuneNumber: number;
  fortune: string;
  msg: string;
  details: OmikujiDetail[];
  createdAt: string;
};

export type OmikujiRequest = {
  job: string;
  period: OmikujiPeriod;
  fortuneNumber: number;
  type: OmikujiType;
};

export type OmikujiFortuneResponse = {
  fortune: number;
  showType: number;
};

export type OmikujiPeriod = '今年' | '今月' | '明日';
export type OmikujiType = 'omikuji' | 'hitohira' | 'nekobiyori';
