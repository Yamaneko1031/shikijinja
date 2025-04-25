'use client';
import { forwardRef } from 'react';
import { DisplayPost } from '@/types/ema';
import EmaItem from './EmaItem';

type Props = {
  posts: DisplayPost[];
  isLoading: boolean;
  error: unknown;
  backgroundImageUrl: string;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
};

const EmaCarousel = forwardRef<HTMLDivElement, Props>(
  ({ posts, isLoading, error, backgroundImageUrl, onTouchStart, onTouchEnd }, ref) => {
    return (
      <div
        className="overflow-hidden bg-cover bg-center rounded-lg border-4 border-[rgba(40,20,0,0.5)]"
        style={{ backgroundImage: backgroundImageUrl }}
      >
        {isLoading ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">データの取得に失敗しました</div>
        ) : (
          <div
            ref={ref}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
            className="flex whitespace-nowrap overflow-x-auto overflow-y-hidden no-scrollbar"
          >
            {posts.map((p) => (
              <EmaItem key={p.drawKey} post={p} />
            ))}
          </div>
        )}
      </div>
    );
  }
);
EmaCarousel.displayName = 'EmaCarousel';
export default EmaCarousel;
