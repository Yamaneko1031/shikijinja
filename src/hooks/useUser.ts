import { User } from '@/types/user';
import { TokuId } from '@/types/toku';
import { getTokuLimit, getTokuMaster } from '@/utils/toku';
import { useState } from 'react';
import { useTelop } from './useTelop';

export const useUser = () => {
  const [user, setUser] = useState<User>({
    id: '1',
    isGuest: true,
    name: 'ゲスト',
    coin: 150,
    tokuUpdatedAt: new Date().toISOString(),
    tokuCounts: {},
  });
  const telop = useTelop();

  const resetTokuCounts = () => {
    setUser({ ...user, tokuUpdatedAt: new Date().toISOString(), tokuCounts: {} });
  };

  const checkDate = (date: string) => {
    const lastUpdate = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastUpdate.toDateString() === yesterday.toDateString();
  };

  const handleAddCoin = (coin: number) => {
    console.log('AddCoin', user.coin + coin);
    setUser({ ...user, coin: user.coin + coin });
  };

  const handleIsLimitOver = (tokuId: TokuId): boolean => {
    const limit = getTokuLimit(tokuId);
    if (checkDate(user.tokuUpdatedAt)) {
      resetTokuCounts();
    }
    const currentTokuCount = user.tokuCounts[tokuId]?.count;
    return limit !== undefined && currentTokuCount !== undefined && currentTokuCount >= limit;
  };

  const handleTokuGet = (tokuId: TokuId): boolean => {
    if (handleIsLimitOver(tokuId)) {
      return false;
    }
    const setUserData = { ...user };
    const currentCount = (setUserData.tokuCounts[tokuId]?.count || 0) + 1;
    setUserData.tokuCounts[tokuId] = {
      count: currentCount,
    };
    setUserData.tokuUpdatedAt = new Date().toISOString();

    const tokuMaster = getTokuMaster(tokuId);
    if (tokuMaster) {
      setUserData.coin += tokuMaster.coin;
      const text = `${tokuMaster.label} [${currentCount}/${tokuMaster.limit}]`;
      if (tokuMaster.coin > 0) {
        telop.showPop(text);
      }
    }
    setUser(setUserData);
    return true;
  };

  const handleIsEnoughCoin = (tokuId: TokuId): boolean => {
    const tokuMaster = getTokuMaster(tokuId);
    if (tokuMaster) {
      return user.coin >= tokuMaster.coin;
    }
    return false;
  };

  const handleTokuUsed = (tokuId: TokuId): boolean => {
    if (handleIsLimitOver(tokuId)) {
      return false;
    }
    const setUserData = { ...user };
    const currentCount = (setUserData.tokuCounts[tokuId]?.count || 0) + 1;
    setUserData.tokuCounts[tokuId] = {
      count: currentCount,
    };
    setUserData.tokuUpdatedAt = new Date().toISOString();

    const tokuMaster = getTokuMaster(tokuId);
    if (tokuMaster) {
      setUserData.coin -= tokuMaster.coin;
    }
    setUser(setUserData);
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
