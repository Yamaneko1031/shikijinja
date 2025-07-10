'use client';

import React from 'react';
import { Button } from '../_shared/Button';
import { User } from '@/types/user';

type Props = {
  user: User;
  onClose: () => void;
};

export default function MyFortuneView({ user, onClose }: Props) {
  const totalCount = user.fortunes.length;
  const totalPower = user.fortunes.reduce((sum, fortune) => sum + fortune.power, 0);
  return (
    <div className="w-full h-full flex flex-col items-center text-black">
      <div className="flex flex-col justify-center items-center">
        <p className="">運パラメータ</p>
        <p className="text-sm">
          （{totalCount}種 合計+{totalPower}）
        </p>
      </div>
      <div className="max-h-[60vh] w-full overflow-scroll m-1 pt-2 pb-2 px-4 flex flex-col gap-2 border-2 border-gray-100">
        {user.fortunes.map((fortune) => {
          // powerに応じて色を決定
          const getColorClass = (power: number) => {
            if (power <= 29) return 'border-b-blue-100';
            if (power <= 49) return 'border-b-yellow-100';
            if (power <= 69) return 'border-b-green-100';
            return 'border-b-red-100';
          };

          return (
            <div key={fortune.name} className="flex flex-col">
              <div className="flex flex-row justify-between">
                <p className="">{fortune.name}</p>
                <p className="">+{fortune.power}</p>
              </div>
              <div
                className={`-mt-1.5 border-b-4 -z-1 ${getColorClass(fortune.power)}`}
                style={{ width: `${Math.min(fortune.power, 100)}%` }}
              ></div>
            </div>
          );
        })}
      </div>
      <div className="min-h-[3rem] flex justify-center items-center">
        <Button variant="negative" size="md" onClick={onClose} aria-label="閉じる">
          閉じる
        </Button>
      </div>
    </div>
  );
}
