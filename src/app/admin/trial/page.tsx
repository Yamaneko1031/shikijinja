'use client';

import { useState } from 'react';

export default function TrialPage() {
  const [classState, setClassState] = useState<string>('hidden');

  const handleClick = () => {
    setClassState('hidden');
    requestAnimationFrame(() => {
      setClassState('animate-nadeneko-coin-popup');
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
        <div className={`absolute top-40 left-20 ${classState}`}></div>
        <div className={`absolute top-40 left-40 ${classState}`}></div>
      </div>
    </div>
  );
}
