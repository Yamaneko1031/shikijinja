'use client';

import NadenekoSeat from '@/components/Nadeneko/NadenekoSeat';
import { useState } from 'react';

export default function TrialPage() {
  const [classState1, setClassState1] = useState<string>('');
  const [classState2, setClassState2] = useState<string>('');
  const [classState3, setClassState3] = useState<string>('');
  const [classState4, setClassState4] = useState<string>('');

  const handleClick1 = () => {
    setClassState1('');
    setTimeout(() => {
      setClassState1('coin--popup');
    }, 10);
  };
  const handleClick2 = () => {
    setClassState2('');
    setTimeout(() => {
      setClassState2('coin--popup');
    }, 10);
  };
  const handleClick3 = () => {
    setClassState3('');
    setTimeout(() => {
      setClassState3('coin--popup');
    }, 10);
  };
  const handleClick4 = () => {
    setClassState4('');
    setTimeout(() => {
      setClassState4('coin--popup');
    }, 10);
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
        {/* <div className="top-5 left-20 animate-nadeneko-coin-popup"></div>
        <div className="top-5 left-40 animate-nadeneko-coin-popup2"></div>
        <div className="top-5 left-60 animate-nadeneko-coin-popup3"></div> */}

        <div className={`top-20 left-10 coin ${classState1}`}>1</div>
        <div className={`top-20 left-30 coin ${classState2}`}>2</div>
        <div className={`top-20 left-50 coin ${classState3}`}>3</div>
        <div className={`top-20 left-70 coin ${classState4}`}>4</div>
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
