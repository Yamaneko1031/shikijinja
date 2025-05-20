import { TokuCounts } from './toku';

// ユーザーデータ
export type User = {
  id: string;
  isGuest: boolean;
  name: string;
  coin: number;
  tokuUpdatedAt: string;
  tokuCounts: TokuCounts;
};
