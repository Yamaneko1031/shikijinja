export type OmikujiDetail = {
  type: string;
  rank: number;
  element: string;
};

export type OmikujiResponse = {
  job: string;
  period: string;
  fortuneNumber: number;
  fortune: string;
  msg: string;
  details: OmikujiDetail[];
  createdAt: string;
};

export type OmikujiRequest = {
  job: string;
  period: string;
  fortuneNumber: number;
};

export type OmikujiFortuneResponse = {
  fortune: number;
  showType: number;
};

export type OmikujiType = '今年' | '今月' | '明日';
