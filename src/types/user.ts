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

export type UserUpdateInput = Partial<{
  name: string;
  email: string;
  coin: number;
  tokuCounts: object;
}>;
