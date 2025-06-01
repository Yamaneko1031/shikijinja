'use client';

import React, { useEffect } from 'react';
import { SectionProps } from '@/types/section';
import FadeInOutText from '../_shared/FadeInOutText';

const SandoSection = (props: SectionProps) => {
  // const scrollRatio = useMotionValue(props.scrollRatio);
  console.log('SandoSection', props.isActive, props.isNeighbor);
  // const handlePostWish = () => {
  //   alert(`参拝マナーを見ました`);
  // };

  useEffect(() => {
    if (!props.scrollRatio) return;
    const interval = setInterval(() => {
      console.log(props.scrollRatio?.get());
    }, 1000);
    return () => clearInterval(interval);
  }, [props.scrollRatio]);

  return (
    <>
      <div className="relative h-full text-shadow-2 flex flex-col justify-center items-center">
        <div className="max-w-2xl min-w-[20rem] flex flex-col gap-20">
          <FadeInOutText>デジタルの海に浮かぶ祈りの社。</FadeInOutText>
          <FadeInOutText>
            IT業界にゆかり深き神々が祭られている、現代人のための神社です。
          </FadeInOutText>
          <FadeInOutText>エンジニアの神、デザイナーの神、ディレクターの神。</FadeInOutText>
          <FadeInOutText>
            技と知恵を授ける三柱の神が、それぞれの道を歩む者の背中を静かに押してくれるでしょう。
          </FadeInOutText>
          <FadeInOutText>今日も、どうか良きご縁とひらめきがありますように。</FadeInOutText>
        </div>
        {/* <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[11.25rem]">
          <div className="">
            <TextReveal
              text="（じー・・・）"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[12.5rem]">
            <Image
              src="/images/nadeneko/neko_nadeneko.webp"
              alt="neko_nadeneko"
              width={400}
              height={300}
            />
          </div>
        </div> */}
        {/* <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-row p-8"> */}
        {/* <div className="flex flex-col gap-20 text-shadow-2">
          <p>デジタルの海に浮かぶ祈りの社。</p>
          <p>IT業界にゆかり深き神々が祭られている、現代人のための神社です。</p>
          <p>エンジニアの神、デザイナーの神、ディレクターの神。</p>
          <p>
            技と知恵を授ける三柱の神が、それぞれの道を歩む者の背中を静かに押してくれるでしょう。
          </p>
          <p>今日も、どうか良きご縁とひらめきがありますように。</p>
        </div> */}
        {/* <div>aaa</div> */}
        {/* 
          <motion.div
            className="text-shadow-2 z-30 flex flex-col gap-20"
            style={{ top: '50lvh', opacity: textOpacity }}
        >
          <p>デジタルの海に浮かぶ祈りの社。</p>
          <p>IT業界にゆかり深き神々が祭られている、現代人のための神社です。</p>
          <p>エンジニアの神、デザイナーの神、ディレクターの神。</p>
          <p>
            技と知恵を授ける三柱の神が、それぞれの道を歩む者の背中を静かに押してくれるでしょう。
          </p>
          <p>今日も、どうか良きご縁とひらめきがありますように。</p>
          </motion.div> */}
        {/* <TextReveal
          text={`IT業界に関わる\n全ての人に\nご利益をもたらすと\n言い伝えられている`}
          delayPerChar={0.1}
        /> */}
        {/* </div> */}
        {/* <Button
          variant="positive"
          size="lg"
          onClick={() => {
            handlePostWish();
          }}
          className="w-full max-w-md flex flex-col pt-2 pb-2"
        >
          <div className="text-xl font-bold">参拝マナーを見る</div>
        </Button> */}
      </div>
    </>
  );
};

export default React.memo(SandoSection);
