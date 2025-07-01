import { User } from '@/types/user';
import { TokuId } from '@/types/toku';
import { getTokuMaster } from '@/utils/toku';
import { useState } from 'react';
import { useTelop } from './useTelop';
import { getAppTime } from '@/lib/appTime';
import { useRequestQueue } from './useReqestQueue';

export const useUser = (initialUser: User) => {
  const [user, setUser] = useState<User>(initialUser);
  const telop = useTelop();
  const { pushRequest } = useRequestQueue();

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
    const tokuMaster = getTokuMaster(tokuId);
    const limit = tokuMaster?.limit ?? 0;
    if (tokuMaster?.permanent) {
      const tokuCount = user.permanentTokuCounts[tokuId]?.count ?? 0;
      return tokuCount >= limit;
    }
    if (!checkDate(user.tokuUpdatedAt)) {
      resetTokuCounts();
    }
    const tokuCount = user.tokuCounts[tokuId]?.count ?? 0;
    return tokuCount >= limit;
  };

  const handleTokuGet = async (tokuId: TokuId, dbUpdate: boolean = true): Promise<boolean> => {
    try {
      if (handleIsLimitOver(tokuId)) {
        return false;
      }
      const tokuMaster = getTokuMaster(tokuId);
      let count = 0;
      if (tokuMaster) {
        if (tokuMaster.permanent) {
          count = user.permanentTokuCounts[tokuId]?.count ?? 0;
          setUser((prevUser) => ({
            ...prevUser,
            coin: prevUser.coin + tokuMaster.coin,
            permanentTokuCounts: {
              ...prevUser.permanentTokuCounts,
              [tokuId]: {
                count: count + 1,
              },
            },
            tokuCounts: {
              ...prevUser.tokuCounts,
              [tokuId]: {
                count: count + 1,
              },
              ...(tokuMaster.someId && {
                [tokuMaster.someId]: {
                  count: (prevUser.tokuCounts[tokuMaster.someId]?.count ?? 0) + 1,
                },
              }),
            },
          }));
        } else {
          count = user.tokuCounts[tokuId]?.count ?? 0;
          setUser((prevUser) => ({
            ...prevUser,
            coin: prevUser.coin + tokuMaster.coin,
            tokuCounts: {
              ...prevUser.tokuCounts,
              [tokuId]: {
                count: count + 1,
              },
              ...(tokuMaster.someId && {
                [tokuMaster.someId]: {
                  count: (prevUser.tokuCounts[tokuMaster.someId]?.count ?? 0) + 1,
                },
              }),
            },
          }));
        }
        if (tokuMaster.coin > 0) {
          const text = `${tokuMaster.label} [${count + 1}/${tokuMaster.limit}]`;
          telop.showPop(text);
        }
      }
      // DBの更新は非同期で行う
      if (dbUpdate) {
        pushRequest({ uri: '/api/toku/get', tokuId, count: 1 });
      }
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

  const handleTokuUsed = async (tokuId: TokuId, dbUpdate: boolean = true): Promise<boolean> => {
    if (!handleIsEnoughCoin(tokuId)) {
      return false;
    }

    try {
      if (handleIsLimitOver(tokuId)) {
        return false;
      }

      const tokuMaster = getTokuMaster(tokuId);
      let count = 0;
      if (tokuMaster) {
        if (tokuMaster.permanent) {
          count = user.permanentTokuCounts[tokuId]?.count ?? 0;
          setUser((prevUser) => ({
            ...prevUser,
            coin: prevUser.coin - tokuMaster.coin,
            permanentTokuCounts: {
              ...prevUser.permanentTokuCounts,
              [tokuId]: {
                count: count + 1,
              },
            },
            tokuCounts: {
              ...prevUser.tokuCounts,
              [tokuId]: {
                count: count + 1,
              },
            },
          }));
        } else {
          count = user.tokuCounts[tokuId]?.count ?? 0;
          setUser((prevUser) => ({
            ...prevUser,
            coin: prevUser.coin - tokuMaster.coin,
            tokuCounts: {
              ...prevUser.tokuCounts,
              [tokuId]: {
                count: count + 1,
              },
            },
          }));
        }
      }

      // DBの更新は非同期で行う
      if (dbUpdate) {
        pushRequest({ uri: '/api/toku/used', tokuId, count: 1 });
      }
    } catch (err) {
      console.error('徳カウント更新失敗', err);
      return false;
    }
    return true;
  };

  return {
    user,
    telop,
    setUser,
    handleAddCoin,
    handleIsLimitOver,
    handleTokuGet,
    handleTokuUsed,
    handleIsEnoughCoin,
  };
};
