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
