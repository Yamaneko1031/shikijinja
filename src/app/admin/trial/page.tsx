'use client';

import NadenekoSeat from '@/components/Nadeneko/NadenekoSeat';
import { useState } from 'react';

export default function TrialPage() {
  const [classState1, setClassState1] = useState<string>('hidden');
  const [classState2, setClassState2] = useState<string>('hidden');
  const [classState3, setClassState3] = useState<string>('hidden');

  const handleClick = () => {
    setClassState1('hidden');
    setClassState2('hidden');
    setClassState3('hidden');
    requestAnimationFrame(() => {
      setClassState1('animate-nadeneko-coin-popup');
      setClassState2('animate-nadeneko-coin-popup2');
      setClassState3('animate-nadeneko-coin-popup3');
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">お試しページ</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleClick}>
        ボタン
      </button>
      <div className="absolute top-30 left-0 w-[30rem] h-[20rem] bg-amber-950">
        <div className="top-20 left-20 animate-nadeneko-coin-popup"></div>
        <div className="top-20 left-40 animate-nadeneko-coin-popup2"></div>
        <div className="top-20 left-60 animate-nadeneko-coin-popup3"></div>
        <div
          key={1}
          className="absolute"
          style={{
            left: `20%`,
            top: `20%`,
            transform: `scale(2)`,
          }}
        >
          <div className={classState1}>
            <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-3/5 text-3xl font-bold text-shadow-huchi">
              {10}
            </p>
          </div>
        </div>
        <div className={`top-40 left-20 ${classState1}`}>1</div>
        <div className={`top-40 left-40 ${classState2}`}>2</div>
        <div className={`top-40 left-60 ${classState3}`}>3</div>
      </div>
      <div className="absolute top-80 left-0 w-[30rem] h-[30rem]">
        <NadenekoSeat
          lotData={{
            totalAddCoin: 10,
            addCoins: [1, 2, 1, 2, 5, 10, 30, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
          }}
          handleFinished={() => {}}
        />
      </div>
    </div>
  );
}
