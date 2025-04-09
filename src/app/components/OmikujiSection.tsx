'use client';

import { useState } from 'react';

const OmikujiSection = () => {
  const [loading, setLoading] = useState(false);

  const fetchOmikuji = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/omikuji', { method: 'POST' });
      const data = await res.json();
      alert(`お告げ: ${data.result}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="w-[300px] h-[300px] bg-black items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <h2 className="text-4xl font-bold mb-4">おみくじ</h2>
      <p className="text-xl mb-4">おみくじを引けるコンテンツ</p>

      <button
        onClick={fetchOmikuji}
        className={`px-4 py-2 rounded ${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        disabled={loading}
      >
        {loading ? '神様と交信中…' : 'おみくじを引く'}
      </button>
    </section>
  );
};

export default OmikujiSection;
