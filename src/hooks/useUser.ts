import { User } from '@/types/user';
import { TokuId } from '@/types/toku';
import { getTokuLimit, getTokuMaster } from '@/utils/toku';
import { useState } from 'react';
import { useTelop } from './useTelop';
import { apiFetch } from '@/lib/api';
import { getAppTime } from '@/lib/appTime';

export const useUser = (initialUser: User) => {
  const [user, setUser] = useState<User>(initialUser);
  const telop = useTelop();

  // const updateUser = async (input: UserUpdateInput) => {
  //   try {
  //     const res = await apiFetch('/api/user', {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(input),
  //     });
  //     // 更新後のユーザー情報を返す
  //     return await res;
  //   } catch (err) {
  //     console.error('更新に失敗しました:', err);
  //   }
  // };

  const resetTokuCounts = () => {
    setUser({ ...user, tokuUpdatedAt: new Date().toISOString(), tokuCounts: {} });
  };

  const checkDate = (date: string) => {
    const appTime = getAppTime();
    const dateObj = new Date(date);
    return appTime.toDateString() === dateObj.toDateString();
  };

  const handleAddCoin = (coin: number) => {
    setUser({ ...user, coin: user.coin + coin });
  };

  const handleIsLimitOver = (tokuId: TokuId): boolean => {
    const limit = getTokuLimit(tokuId);
    if (!checkDate(user.tokuUpdatedAt)) {
      resetTokuCounts();
    }
    const currentTokuCount = user.tokuCounts[tokuId]?.count;
    return limit !== undefined && currentTokuCount !== undefined && currentTokuCount >= limit;
  };

  const handleTokuGet = async (tokuId: TokuId): Promise<boolean> => {
    try {
      if (handleIsLimitOver(tokuId)) {
        return false;
      }
      const count = user.tokuCounts[tokuId]?.count ?? 0;
      // 上限を超えてなければローカルは更新
      const tokuMaster = getTokuMaster(tokuId);
      if (tokuMaster) {
        // 先にテロップ表示
        const text = `${tokuMaster.label} [${count + 1}/${tokuMaster.limit}]`;
        telop.showPop(text);

        setUser((prevUser) => ({
          ...prevUser,
          coin: prevUser.coin + tokuMaster.coin,
          tokuCounts: {
            ...prevUser.tokuCounts,
            [tokuId]: {
              count: count + 1,
            },
          },
        }));
      }
      // DBの更新は非同期で行う
      apiFetch<User>('/api/toku/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokuId }),
      });
    } catch (err) {
      console.error('徳カウント更新失敗', err);
      return false;
    }
    return true;
  };

  const handleIsEnoughCoin = (tokuId: TokuId): boolean => {
    const tokuMaster = getTokuMaster(tokuId);
    if (tokuMaster) {
      return user.coin >= tokuMaster.coin;
    }
    return false;
  };

  const handleTokuUsed = async (tokuId: TokuId): Promise<boolean> => {
    if (!handleIsEnoughCoin(tokuId)) {
      return false;
    }

    try {
      if (handleIsLimitOver(tokuId)) {
        return false;
      }
      const count = user.tokuCounts[tokuId]?.count ?? 0;
      // 上限を超えてなければローカルは更新
      const tokuMaster = getTokuMaster(tokuId);
      if (tokuMaster) {
        setUser((prevUser) => ({
          ...prevUser,
          coin: prevUser.coin + tokuMaster.coin,
          tokuCounts: {
            ...prevUser.tokuCounts,
            [tokuId]: {
              count: count + 1,
            },
          },
        }));
      }
      // DBの更新は非同期で行う
      apiFetch<User>('/api/toku/used', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokuId }),
      });
    } catch (err) {
      console.error('徳カウント更新失敗', err);
      return false;
    }
    return true;
  };

  return {
    user,
    telop,
    handleAddCoin,
    handleIsLimitOver,
    handleTokuGet,
    handleTokuUsed,
    handleIsEnoughCoin,
  };
};
