'use client';

import TextReveal from './TextReveal';

const HaidenSection = () => {
  const handlePostWish = () => {
    alert(`賽銭を投げました`);
  };

  return (
    <div className="relative w-full h-[1500px] items-center justify-center p-4">
      <div className="relative top-[800px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="拝殿のコンテンツ"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <button className="bg-indigo-600 px-4 py-2 rounded" onClick={handlePostWish}>
          賽銭を投げる
        </button>
      </div>
    </div>
  );
};

export default HaidenSection;
