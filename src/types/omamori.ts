export type OmamoriEffect = {
  name: string;
  power: number;
};

export type OmamoriBase = {
  id: string;
  name: string;
  hurigana: string;
  description: string;
  imageUrl: string;
  price: number;
  effects: OmamoriEffect[];
};

export type OmamoriDataResponse = OmamoriBase & {
  id: string;
  additionalDescription: string;
  createdAt: string;
};

export type OmamoriCommentUserPrompt = {
  name: string;
  description: string;
  effects: OmamoriEffect[];
};
