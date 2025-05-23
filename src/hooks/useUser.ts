import { User, UserUpdateInput } from '@/types/user';
import { TokuId } from '@/types/toku';
import { getTokuLimit, getTokuMaster } from '@/utils/toku';
import { useState } from 'react';
import { useTelop } from './useTelop';
import { apiFetch } from '@/lib/api';

export const useUser = (initialUser: User) => {
  const [user, setUser] = useState<User>(initialUser);
  const telop = useTelop();

  const updateUser = async (input: UserUpdateInput) => {
    try {
      const res = await apiFetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      // 更新後のユーザー情報を返す
      return await res;
    } catch (err) {
      console.error('更新に失敗しました:', err);
    }
  };

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
    setUser({ ...user, coin: user.coin + coin });
    updateUser({ coin: user.coin + coin });
  };

  const handleIsLimitOver = (tokuId: TokuId): boolean => {
    const limit = getTokuLimit(tokuId);
    if (checkDate(user.tokuUpdatedAt)) {
      resetTokuCounts();
    }
    const currentTokuCount = user.tokuCounts[tokuId]?.count;
    return limit !== undefined && currentTokuCount !== undefined && currentTokuCount >= limit;
  };

  const handleTokuGet = async (tokuId: TokuId): Promise<boolean> => {
    console.log('handleTokuGet', tokuId);
    try {
      // 先に回数上限だけチェック
      const checkRes = await apiFetch<{ result: boolean; count: number }>('/api/toku/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokuId }),
      });

      if (checkRes.result === false) {
        return false;
      }

      // 上限を超えてなければローカルは更新
      const tokuMaster = getTokuMaster(tokuId);
      if (tokuMaster) {
        // 先にテロップ表示
        const text = `${tokuMaster.label} [${checkRes.count + 1}/${tokuMaster.limit}]`;
        telop.showPop(text);
        // ローカル上のコイン加算
        setUser({ ...user, coin: user.coin + tokuMaster.coin });
      }

      // DBの更新はテロップ出してから
      const res = await apiFetch<User>('/api/toku/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokuId }),
      });
      // ここでサーバーのユーザーデータと同期
      setUser(res);
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
      // 先に回数上限だけチェック
      const checkRes = await apiFetch<{ result: boolean; count: number }>('/api/toku/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokuId }),
      });

      if (checkRes.result === false) {
        return false;
      }

      // 上限を超えてなければローカルは更新
      const tokuMaster = getTokuMaster(tokuId);
      if (tokuMaster) {
        // ローカル上のコイン加算
        setUser({ ...user, coin: user.coin - tokuMaster.coin });
      }

      const res = await apiFetch<User>('/api/toku/used', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokuId }),
      });
      setUser(res);
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
