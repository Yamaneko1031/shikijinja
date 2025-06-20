'use client';

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
      <div className="absolute top-100 left-0 w-[30rem] h-[30rem] bg-amber-950">
        <div className="absolute top-20 left-20 animate-nadeneko-coin-popup"></div>
        <div className={`absolute top-40 left-20 ${classState1}`}></div>
        <div className={`absolute top-40 left-40 ${classState2}`}></div>
        <div className={`absolute top-40 left-60 ${classState3}`}></div>
      </div>
    </div>
  );
}
