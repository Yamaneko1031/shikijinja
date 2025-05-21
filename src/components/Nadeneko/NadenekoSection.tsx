'use client';

import React from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { User } from '@/types/user';
import { TokuId } from '@/types/toku';
type Props = {
  isActive: boolean;
  isNeighbor: boolean;
  user: User;
  handleAddCoin: (coin: number) => void;
  handleIsLimitOver: (tokuId: TokuId) => boolean;
  handleTokuGet: (tokuId: TokuId) => void;
  handleTokuUsed: (tokuId: TokuId) => void;
  handleIsEnoughCoin: (tokuId: TokuId) => boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NadenekoSection = (props: Props) => {
  const handlePostWish = () => {
    // 投稿ボタンの処理（例えば、APIに投稿する）
    alert(`撫でました`);
  };

  return (
    <>
      <div className="relative top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="猫を撫でるコンテンツ"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <button className="bg-indigo-600 px-4 py-2 rounded" onClick={handlePostWish}>
          撫でる
        </button>
      </div>
    </>
  );
};

export default React.memo(NadenekoSection);
