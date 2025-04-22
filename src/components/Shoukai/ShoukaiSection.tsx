'use client';

import TextReveal from '@/components/shared/TextReveal';

const ShoukaiSection = () => {
  const handlePostWish = () => {
    alert(`神様の紹介を見ました`);
  };

  return (
    <div className="relative w-full h-[1200px] items-center justify-center p-4">
      <div className="relative top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="式岐神社に祭られている神様の紹介"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <button className="bg-indigo-600 px-4 py-2 rounded" onClick={handlePostWish}>
          神様の紹介を見る
        </button>
      </div>
    </div>
  );
};

export default ShoukaiSection;
