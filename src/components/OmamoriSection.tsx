'use client';

import { useState } from 'react';
import TextReveal from './TextReveal';

const OmamoriSection = () => {
  const [selectedOmamori, setSelectedOmamori] = useState('love');

  const handlePurchase = () => {
    // 購入処理（例えば、APIに購入リクエストを送る）
    alert('御守りを受け取りました！');
  };

  return (
    <div className="relative w-full h-[1200px] items-center justify-center p-4">
      <div className="relative top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="ご利益を得たい御守りを選択して受け取るコンテンツ"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <select
          className="p-2 mb-4"
          value={selectedOmamori}
          onChange={(e) => setSelectedOmamori(e.target.value)}
        >
          <option value="project">プロジェクト運</option>
          <option value="health">健康運</option>
          <option value="money">金運</option>
        </select>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={handlePurchase}>
          受け取る
        </button>
      </div>
    </div>
  );
};

export default OmamoriSection;
