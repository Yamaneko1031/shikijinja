import { Fortune } from './user';

export type OmamoriBase = {
  id: string;
  name: string;
  hurigana: string;
  description: string;
  imageUrl: string;
  price: number;
  fortunes: Fortune[];
};

export type OmamoriDataResponse = {
  id: string;
  baseId: string;
  name: string;
  hurigana: string;
  description: string;
  imageUrl: string;
  price: number;
  fortunes: Fortune[];
  additionalDescription: string;
  createdAt: string;
};

export type OmamoriCommentUserPrompt = {
  name: string;
  description: string;
  fortunes: Fortune[];
};

export type OmamoriLoadingState = 'none' | 'shuffle' | 'stop' | 'fortune';
