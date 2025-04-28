'use client';
import { forwardRef } from 'react';
import { DisplayPost } from '@/types/ema';
import EmaItem from './EmaItem';

type Props = {
  posts: DisplayPost[];
  isLoading: boolean;
  error: unknown;
  backgroundImageUrl: string;
};

const EmaCarousel = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div
      className="overflow-hidden bg-cover bg-center rounded-lg border-4 border-[rgba(40,20,0,0.5)]"
      style={{ backgroundImage: props.backgroundImageUrl }}
    >
      {props.isLoading ? (
        <div className="p-4 text-center">読み込み中...</div>
      ) : props.error ? (
        <div className="p-4 text-center text-red-500">データの取得に失敗しました</div>
      ) : (
        <div
          ref={ref}
          className="flex whitespace-nowrap overflow-x-auto overflow-y-hidden no-scrollbar"
        >
          {props.posts.map((p) => (
            <EmaItem key={p.drawKey} post={p} />
          ))}
        </div>
      )}
    </div>
  );
});
EmaCarousel.displayName = 'EmaCarousel';
export default EmaCarousel;
