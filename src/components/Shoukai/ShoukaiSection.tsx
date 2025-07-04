'use client';

import React, { useEffect, useRef, useState } from 'react';
import TextReveal from '@/components/_shared/TextReveal';
import { SectionProps } from '@/types/section';
import Modal from '../_shared/Modal';
import ShoukaiModal from './ShoukaiModal';
import { Button } from '../_shared/Button';
import Image from 'next/image';
import DecalogueModal from './DecalogueModal';
import { getTokuCoin } from '@/utils/toku';
import useSWR from 'swr';
import { ShintakuResponse } from '@/types/shintaku';
import { apiFetch } from '@/lib/api';
import ShintakuMessage from '../Sando/ShintakuMessage';
const ShoukaiSection = (props: SectionProps) => {
  console.log('ShoukaiSection', props.isActive, props.isNeighbor);

  const [shoukaiModalOpen, setShoukaiModalOpen] = useState(false);
  const [decalogueModalOpen, setDecalogueModalOpen] = useState(false);
  const scrollRef = useRef(null);

  const fetcher = (url: string) => apiFetch<ShintakuResponse>(url).then((res) => res);
  const { data, isLoading, error } = useSWR('/api/shintaku', fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    // if (scrollRef.current) {
    //   (scrollRef.current as HTMLElement).scrollTop = (
    //     scrollRef.current as HTMLElement
    //   ).scrollHeight;
    // }

    if (scrollRef.current && data?.posts) {
      const element = scrollRef.current as HTMLElement;
      const posts = data.posts.slice().reverse();
      if (posts.length >= 2) {
        const todayElement = element.querySelector(`#shintaku_today`);
        if (todayElement) {
          const elementRect = todayElement.getBoundingClientRect();
          const containerRect = element.getBoundingClientRect();
          const scrollTop = element.scrollTop + (elementRect.top - containerRect.top);
          (scrollRef.current as HTMLElement).scrollTop = scrollTop;
        }
      }
    }
  }, [data?.posts]);

  const handleShoukaiModalClose = () => {
    if (!props.handleIsLimitOver('shoukai')) {
      props.handleTokuGet('shoukai');
    }
    setShoukaiModalOpen(false);
  };

  const handleDecalogueModalClose = () => {
    if (!props.handleIsLimitOver('jikkai')) {
      props.handleTokuGet('jikkai');
    }
    setDecalogueModalOpen(false);
  };

  return (
    <>
      <div className="relative max-w-2xl min-w-[20rem] top-[45rem] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative h-full w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[11.25rem]">
          <div className="">
            <TextReveal
              text="資料があるにゃ！"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[12.5rem]">
            <Image
              src="/images/shoukai/neko_shoukai.webp"
              alt="neko_omamori"
              width={400}
              height={300}
            />
          </div>
        </div>

        <div className="relative w-full bg-black/50 rounded-lg flex flex-col items-center gap-2 p-4">
          <div className="w-full text-xl flex flex-col gap-4 items-start">
            式岐神社に祭られている神様の文献が置かれています。
          </div>
          <Button
            variant="positive"
            size="lg"
            onClick={() => setShoukaiModalOpen(true)}
            className="w-full max-w-md flex flex-col pt-2 pb-2"
          >
            <div className="text-xl font-bold">神様の紹介を見る</div>
            {!props.handleIsLimitOver('shoukai') && (
              <div className="flex flex-row items-center">
                <Image
                  src="/images/icon/icon_coin.webp"
                  alt="omikuji_button"
                  width={24}
                  height={24}
                />
                <div className="text-sm text-yellow-400 font-bold">
                  {getTokuCoin('shoukai')}獲得（初回）
                </div>
              </div>
            )}
          </Button>
          <Button
            variant="positive"
            size="lg"
            onClick={() => setDecalogueModalOpen(true)}
            className="w-full max-w-md flex flex-col pt-2 pb-2"
          >
            <div className="text-xl font-bold">十戒を見る</div>
            {!props.handleIsLimitOver('jikkai') && (
              <div className="flex flex-row items-center">
                <Image
                  src="/images/icon/icon_coin.webp"
                  alt="omikuji_button"
                  width={24}
                  height={24}
                />
                <div className="text-sm text-yellow-400 font-bold">
                  {getTokuCoin('jikkai')}獲得（初回）
                </div>
              </div>
            )}
          </Button>
        </div>
        <div className="h-full w-full overflow-x-hidden bg-cover bg-center rounded-lg border-4 border-[rgba(40,20,0,0.5)] bg-[url('/images/bg_hude/bg_shintaku.webp')]">
          <div className="h-[3.5rem] text-orange-950 flex flex-col items-center justify-center bg-[rgba(255,244,235,0.5)] shadow-lg">
            <p className="text-xl font-bold">御神託帳</p>
            <p className="text-xs font-bold">毎日新しい御神託が記されます</p>
          </div>
          <div
            ref={scrollRef}
            className="h-[20rem] w-full flex flex-col gap-2 overflow-y-auto scroll-smooth"
          >
            {isLoading ? (
              <div className="p-4 text-center text-black">読み込み中...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">データの取得に失敗しました</div>
            ) : (
              data?.posts
                .slice()
                .reverse()
                .map((post, index, array) => {
                  const element = <ShintakuMessage key={post.id} message={post} />;

                  // 下から2個目と3個目の間に要素を挿入
                  if (index === array.length - 3) {
                    return (
                      <React.Fragment key={`fragment-${post.id}`}>
                        {element}
                        <div
                          id="shintaku_today"
                          className="px-4 text-center text-black flex items-center"
                        >
                          <div className="flex-1 border-t-1 border-black/50"></div>
                          <span className="px-4 text-sm text-black/50">本日の御神託</span>
                          <div className="flex-1 border-t-1 border-black/50"></div>
                        </div>
                      </React.Fragment>
                    );
                  }

                  return element;
                })
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={shoukaiModalOpen}
        className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
      >
        <ShoukaiModal shoukaiIndex={0} onClose={handleShoukaiModalClose} />
      </Modal>

      <Modal
        isOpen={decalogueModalOpen}
        className="absolute top-0 left-0 min-h-[100lvh] min-w-[100vw] bg-transparent overscroll-contain"
      >
        <DecalogueModal onClose={handleDecalogueModalClose} />
      </Modal>
    </>
  );
};

export default React.memo(ShoukaiSection);
