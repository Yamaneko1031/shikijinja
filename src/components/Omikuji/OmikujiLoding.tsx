import React from 'react';
import Image from 'next/image';

const OmikujiLoding: React.FC = () => {
  console.log('OmikujiLoding');
  return (
    <div className="relative min-w-[340px] w-[400px] h-[300px] border-2 border-white/50 rounded-lg bg-white/10">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[240px] text-left text-white text-2xl font-bold omikuji-lot">
        おみくじ抽選中
      </div>
      <div className="absolute bottom-0 left-0 omikuji-inori" aria-hidden="true"></div>
      <Image
        src="/images/omikuji/omikuji_box.webp"
        alt="omikuji_box"
        width={128}
        height={128}
        className="absolute bottom-30 right-5 object-contain animate-omikuji-shuffle"
        aria-hidden="true"
      />
    </div>
  );
};

export default OmikujiLoding;
