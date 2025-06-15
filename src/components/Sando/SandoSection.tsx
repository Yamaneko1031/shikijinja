'use client';

import React, { useEffect, useRef } from 'react';
import { SectionProps } from '@/types/section';
import TextReveal from '../_shared/TextReveal';
import { ShintakuResponse } from '@/types/shintaku';
import ShintakuMessage from './ShintakuMessage';

const SandoSection = (props: SectionProps) => {
  // const scrollRatio = useMotionValue(props.scrollRatio);
  console.log('SandoSection', props.isActive, props.isNeighbor);
  // const handlePostWish = () => {
  //   alert(`参拝マナーを見ました`);
  // };

  const scrollRef = useRef(null);

  // メッセージが更新されるたびに一番下にスクロール
  const test: ShintakuResponse = {
    posts: [
      {
        id: '1',
        message:
          '完璧な最初のcommitなんて存在しないよ。まずは動くもの、そしてそれを愛でることから始めよう。美しさは後からついてくる。',
        isReply: false,
        createdAt: '2021-01-01 12:00:00',
        imageKey: 'shikineko',
      },
      {
        id: '2',
        message:
          '最も美しいさえずりは、沈黙の後に訪れるもの。言葉を紡ぐ前に、心の静けさを味わう時間を大切に。',
        isReply: false,
        createdAt: '2021-01-01 12:00:00',
        imageKey: 'iroha',
      },
      {
        id: '3',
        message: 'まず獲物（ゴール）を決めい！どこへ向かうか分からぬまま、森へ入る馬鹿がおるか。',
        isReply: false,
        createdAt: '2021-01-01 12:00:00',
        imageKey: 'tenten',
      },
    ],
  };

  useEffect(() => {
    if (scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollTop = (
        scrollRef.current as HTMLElement
      ).scrollHeight;
    }
  }, [test.posts]);

  return (
    <>
      <div className="relative max-w-2xl min-w-[20rem] top-[38rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 p-4">
          <div className="">
            <TextReveal
              text="神様が気まぐれで記す御神託帳が置かれています。"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
        </div>
        <div
          ref={scrollRef}
          className="h-[20rem] w-full flex flex-col gap-2 overflow-y-auto overflow-x-hidden bg-cover bg-center rounded-lg border-4 border-[rgba(40,20,0,0.5)] bg-[url('/images/bg_hude/bg_shintaku.webp')] scroll-smooth"
        >
          {test.posts.map((post) => (
            <ShintakuMessage key={post.id} message={post} />
          ))}
        </div>
      </div>

      {/* <div className="max-w-2xl min-w-[20rem] flex flex-col gap-20">
          <FadeInOutText>デジタルの海に浮かぶ祈りの社。</FadeInOutText>
          <FadeInOutText>
            IT業界にゆかり深き神々が祭られている、現代人のための神社です。
          </FadeInOutText>
          <FadeInOutText>エンジニアの神、デザイナーの神、ディレクターの神。</FadeInOutText>
          <FadeInOutText>
            技と知恵を授ける三柱の神が、それぞれの道を歩む者の背中を静かに押してくれるでしょう。
          </FadeInOutText>
          <FadeInOutText>今日も、どうか良きご縁とひらめきがありますように。</FadeInOutText>
        </div> */}
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
      {/* </div> */}
    </>
  );
};

export default React.memo(SandoSection);
