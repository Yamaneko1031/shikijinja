import { Fortune } from './user';

// 投稿時のレスポンス
export interface SaisenResponse {
  isNew: boolean;
  fortune: Fortune;
}
