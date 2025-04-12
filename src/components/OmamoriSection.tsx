'use client';

import { useState } from 'react';

const OmamoriSection = () => {
  const [selectedOmamori, setSelectedOmamori] = useState('love');

  const handlePurchase = () => {
    // 購入処理（例えば、APIに購入リクエストを送る）
    alert('御守りを受け取りました！');
  };

  return (
    <section
      className="w-[300px] h-[300px] bg-black items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <h2 className="text-4xl font-bold mb-4">御守り</h2>
      <p className="text-xl mb-4">ご利益を得たい御守りを選択して受け取るコンテンツ</p>

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
    </section>
  );
};

export default OmamoriSection;
