'use client';

import { useState } from 'react';

const EmaSection = () => {
  const [wish, setWish] = useState('');

  const handlePostWish = () => {
    // 投稿ボタンの処理（例えば、APIに投稿する）
    alert(`絵馬を投稿しました: ${wish}`);
  };

  return (
    <section
      className="w-[300px] h-[400px] bg-black items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <h2 className="text-4xl font-bold mb-4">絵馬</h2>
      <p className="text-xl mb-4">絵馬投稿や他の人の投稿した絵馬をみるコンテンツ</p>

      <textarea
        placeholder="悩みやお願いを書く"
        rows={4}
        className="w-full p-2 mb-4"
        value={wish}
        onChange={(e) => setWish(e.target.value)}
      />
      <button className="bg-indigo-600 px-4 py-2 rounded" onClick={handlePostWish}>
        投稿する
      </button>
    </section>
  );
};

export default EmaSection;
