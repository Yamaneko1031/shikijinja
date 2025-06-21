'use client';

import NadenekoSeat from '@/components/Nadeneko/NadenekoSeat';
import { useState } from 'react';

export default function TrialPage() {
  const [classState1, setClassState1] = useState<string>('hidden');
  const [classState2, setClassState2] = useState<string>('hidden');
  const [classState3, setClassState3] = useState<string>('hidden');
  const [classState4, setClassState4] = useState<string>('hidden');

  const handleClick1 = () => {
    setClassState1('hidden');
    requestAnimationFrame(() => {
      setClassState1('animate-nadeneko-coin-popup');
    });
  };
  const handleClick2 = () => {
    setClassState2('hidden');
    requestAnimationFrame(() => {
      setClassState2('animate-nadeneko-coin-popup');
    });
  };
  const handleClick3 = () => {
    setClassState3('hidden');
    requestAnimationFrame(() => {
      setClassState3('animate-nadeneko-coin-popup');
    });
  };
  const handleClick4 = () => {
    setClassState4('hidden');
    requestAnimationFrame(() => {
      setClassState4('animate-nadeneko-coin-popup');
    });
  };

  // const table = [10, 30, 50, 70];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">お試しページ</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleClick1}>
        ボタン
      </button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleClick2}>
        ボタン
      </button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleClick3}>
        ボタン
      </button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleClick4}>
        ボタン
      </button>
      <div className="absolute top-30 left-0 w-[30rem] h-[20rem] bg-amber-950">
        <div className="top-5 left-20 animate-nadeneko-coin-popup"></div>
        <div className="top-5 left-40 animate-nadeneko-coin-popup2"></div>
        <div className="top-5 left-60 animate-nadeneko-coin-popup3"></div>

        {/* <div
          key={1}
          className="absolute"
          style={{
            left: `20%`,
            top: `20%`,
            transform: `scale(2)`,
          }}
        >
          <div className={classState1}></div>
        </div> */}
        {/* {table.map((value, index) => (
          <div
            key={index}
            className={`top-40 left-${value} ${index === 0 ? classState1 : index === 1 ? classState2 : index === 2 ? classState3 : classState4}`}
          >
            <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-3/5 text-3xl font-bold text-shadow-huchi">
              {10}
            </p>
          </div>
        ))} */}
        <div className={`top-20 left-10 ${classState1}`}>1</div>
        <div className={`top-20 left-30 ${classState2}`}>2</div>
        <div className={`top-20 left-50 ${classState3}`}>3</div>
        <div className={`top-20 left-70 ${classState4}`}>4</div>
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
