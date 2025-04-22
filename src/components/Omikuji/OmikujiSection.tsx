'use client';

import { useState } from 'react';
import TextReveal from '@/components/shared/TextReveal';

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
    <div className="relative w-full h-[1200px] items-center justify-center p-4">
      <div className="relative top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="おみくじを引けるコンテンツ"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <button
          onClick={fetchOmikuji}
          className={`px-4 py-2 rounded ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          disabled={loading}
        >
          {loading ? '神様と交信中…' : 'おみくじを引く'}
        </button>
      </div>
    </div>
  );
};

export default OmikujiSection;
