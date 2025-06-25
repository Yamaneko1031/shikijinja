'use client';

import React, { useEffect, useRef } from 'react';
import { SectionProps } from '@/types/section';
import TextReveal from '../_shared/TextReveal';
import { ShintakuResponse } from '@/types/shintaku';
import ShintakuMessage from './ShintakuMessage';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';

const SandoSection = (props: SectionProps) => {
  console.log('SandoSection', props.isActive, props.isNeighbor);

  const fetcher = (url: string) => apiFetch<ShintakuResponse>(url).then((res) => res);
  const { data, isLoading, error } = useSWR('/api/shintaku', fetcher, {
    revalidateOnFocus: false,
  });

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollTop = (
        scrollRef.current as HTMLElement
      ).scrollHeight;
    }
  }, [data?.posts]);

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
          {isLoading ? (
            <div className="p-4 text-center text-black">読み込み中...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">データの取得に失敗しました</div>
          ) : (
            data?.posts
              .slice()
              .reverse()
              .map((post) => <ShintakuMessage key={post.id} message={post} />)
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(SandoSection);
