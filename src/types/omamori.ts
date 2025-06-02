export type OmamoriEffect = {
  name: string;
  power: number;
};

export type OmamoriData = {
  name: string;
  description: string;
  additionalDescription: string;
  imageUrl: string;
  price: number;
  effects: OmamoriEffect[];
};

export type OmamoriCommentUserPrompt = {
  name: string;
  description: string;
  effects: OmamoriEffect[];
};
