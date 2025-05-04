export type OmikujiDetail = {
  type: string;
  rank: number;
  element: string;
};

export type OmikujiResult = {
  fortune: string;
  msg: string;
  details: OmikujiDetail[];
};
