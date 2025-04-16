'use client';

import TextReveal from './TextReveal';

const SandoSection = () => {
  const handlePostWish = () => {
    alert(`参拝マナーを見ました`);
  };

  return (
    <div className="relative w-full h-[1200px] items-center justify-center p-4">
      <div className="relative top-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] p-10 bg-black/50 rounded-lg">
        <TextReveal
          text="── ようこそ、式岐神社へ。"
          delayPerChar={0.1}
          className="text-2xl font-bold mb-4"
        />
        <button className="bg-black/50 text-white px-4 py-2 rounded" onClick={handlePostWish}>
          参拝マナーを見る
        </button>
        {/* <TextReveal
          text="/
            デジタルの海に浮かぶ祈りの社。\n/
            \n/
            式岐神社（しきじんじゃ）は、IT業界にゆかり深き神々をお祀りする、現代人のための神社です。\n/
            \n/
            エンジニア、デザイナー、ディレクター。\n/
            技と知恵を授ける三柱の神が、それぞれの道を歩む者の背中を静かに押してくれるでしょう。\n/
            \n/
            今日も、どうか良きご縁とひらめきがありますように。/
          "
          className="text-lg mb-2"
        /> */}

        {/* <h2 className="text-2xl font-bold mb-4">── ようこそ、式岐神社へ。</h2>
        <div className="space-y-4">
          <p>デジタルの海に浮かぶ祈りの社。</p>
          <p>
            式岐神社（しきじんじゃ）は、IT業界にゆかり深き神々をお祀りする、現代人のための神社です。
          </p>
          <p>
            エンジニア、デザイナー、ディレクター。
            <br />
            技と知恵を授ける三柱の神が、それぞれの道を歩む者の背中を静かに押してくれるでしょう。
          </p>
          <p>今日も、どうか良きご縁とひらめきがありますように。</p>
        </div>
        <button className="bg-black/50 text-white px-4 py-2 rounded" onClick={handlePostWish}>
          参拝マナーを見る
        </button> */}
      </div>
    </div>
  );
};

export default SandoSection;
