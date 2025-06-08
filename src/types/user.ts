import { EmaPostResponse } from './ema';
import { OmamoriDataResponse } from './omamori';
import { OmikujiResponse } from './omikuji';
import { TokuCounts } from './toku';

// ユーザーデータ
export type User = {
  id: string;
  isGuest: boolean;
  email: string;
  name: string;
  coin: number;
  tokuUpdatedAt: string;
  tokuCounts: TokuCounts;
};

export type UserItems = {
  omikuji: OmikujiResponse[];
  omamori: OmamoriDataResponse[];
  ema: EmaPostResponse[];
};

export type UserUpdateInput = Partial<{
  name: string;
  email: string;
  coin: number;
  tokuCounts: object;
}>;
