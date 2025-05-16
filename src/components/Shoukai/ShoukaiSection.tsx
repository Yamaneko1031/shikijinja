'use client';

import React from 'react';
import TextReveal from '@/components/_shared/TextReveal';

type Props = {
  isActive: boolean;
  isNeighbor: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ShoukaiSection = ({ isActive, isNeighbor }: Props) => {
  const handlePostWish = () => {
    alert(`神様の紹介を見ました`);
  };

  return (
    <>
      <div className="relative top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="式岐神社に祭られている神様の紹介"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <button className="bg-indigo-600 px-4 py-2 rounded" onClick={handlePostWish}>
          神様の紹介を見る
        </button>
      </div>
    </>
  );
};

export default React.memo(ShoukaiSection);
