import React from 'react';
import Image from 'next/image';
import NekoInori from './NekoInori';

const OmikujiLoding: React.FC = () => {
  return (
    <div className="relative w-[400px] h-[300px]">
      <div className="absolute w-full top-0 left-1/2 -translate-x-1/2 text-center text-white text-2xl font-bold">
        おみくじ抽選中...
      </div>
      <div className="absolute bottom-10 left-10">
        <NekoInori />
      </div>
      <Image
        src="/images/omikuji/omikuji_box.webp"
        alt="omikuji_box"
        width={150}
        height={150}
        className="absolute bottom-30 right-5 object-contain animate-omikuji-shuffle"
      />
    </div>
  );
};

export default OmikujiLoding;
