export type OmikujiKey = 'shikineko' | 'iroha' | 'tenten';
// export type OmikujiKey = 'shikineko' | 'iroha' | 'tenten' | 'nadeneko';

export type OmikujiList = {
  [key in OmikujiKey]: {
    label: string;
    illustname: string;
    grace: string;
  };
};

export type OmikujiDetail = {
  type: string;
  rank: number;
  element: string;
};

export type OmikujiResponse = {
  id: string;
  type: string;
  period: string;
  fortune: string;
  msg: string;
  details: OmikujiDetail[];
  createdAt: string;
};
