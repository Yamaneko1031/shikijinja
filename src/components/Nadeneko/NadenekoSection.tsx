'use client';

import React from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { User } from '@/types/user';
import { TokuId } from '@/types/toku';
import { getTokuCoin } from '@/utils/toku';
import { Button } from '../_shared/Button';
import Image from 'next/image';

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

const NadenekoSection = (props: Props) => {
  const handlePostWish = () => {
    props.handleTokuGet('nadeneko');
  };

  return (
    <>
      <div className="relative top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="猫を撫でるコンテンツ"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <Button
          variant="positive"
          size="lg"
          onClick={() => {
            handlePostWish();
          }}
          className="w-full max-w-md flex flex-col pt-2 pb-2"
        >
          <div className="text-xl font-bold">なでる</div>
          <div className="flex flex-row items-center">
            <Image src="/images/icon/icon_coin.webp" alt="omikuji_button" width={24} height={24} />
            <div className="text-sm font-bold">{getTokuCoin('nadeneko')}獲得（1日1回）</div>
          </div>
        </Button>
      </div>
    </>
  );
};

export default React.memo(NadenekoSection);
