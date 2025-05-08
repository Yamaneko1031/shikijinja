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
