import { TokuId, TokuMasterData } from '@/types/toku';
import { tokuMaster } from '@/config/toku';
// import { User } from '@/types/user';

/** idからマスタデータを取得 */
export function getTokuMaster(tokuId: TokuId): TokuMasterData | undefined {
  return tokuMaster.find((t) => t.tokuId === tokuId);
}

/** idからポイントを取得 */
export function getTokuPoint(tokuId: TokuId): number | undefined {
  return getTokuMaster(tokuId)?.point;
}

/** idからlimitを取得 */
export function getTokuLimit(tokuId: TokuId): number | undefined {
  return getTokuMaster(tokuId)?.limit;
}

/** idからラベルを取得 */
export function getTokuLabel(tokuId: TokuId): string | undefined {
  return getTokuMaster(tokuId)?.label;
}

// /** 徳のlimitを超えているか */
// export function isLimitOver(tokuId: TokuId, user: User): boolean {
//   const limit = getTokuLimit(tokuId);
//   const lastUpdate = new Date(user.tokuUpdatedAt);
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   const isYesterday = lastUpdate.toDateString() === yesterday.toDateString();
//   if (isYesterday) {
//     return true;
//   }
//   const currentTokuCount = user.tokuCounts[tokuId]?.count;
//   return limit !== undefined && currentTokuCount !== undefined && currentTokuCount >= limit;
// }

// /** 徳の回数カウンタの加算 */
// export function tokuCountUp(tokuId: TokuId, user: User): User {
//   const retUser = { ...user };
//   if (isLimitOver(tokuId, retUser)) {
//     return retUser;
//   }
//   const currentCount = retUser.tokuCounts[tokuId]?.count || 0;
//   retUser.tokuCounts[tokuId] = {
//     count: currentCount + 1,
//   };
//   retUser.tokuUpdatedAt = new Date().toISOString();
//   return retUser;
// }
