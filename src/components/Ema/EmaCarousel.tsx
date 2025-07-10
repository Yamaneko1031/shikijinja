'use client';
import { forwardRef, memo, useState, useRef, useImperativeHandle } from 'react';
import { DisplayPost } from '@/types/ema';
import EmaItem from './EmaItem';
import { useAutoCarouselScroll } from '@/hooks/useAutoCarouselScroll';
import { TokuId } from '@/types/toku';

type Props = {
  displayPosts: DisplayPost[];
  isLoading: boolean;
  error: unknown;
  backgroundImageUrl: string;
  setDisplayPosts: React.Dispatch<React.SetStateAction<DisplayPost[]>>;
  isActive: boolean;
  handleTokuGet: (tokuId: TokuId) => void;
};

const EmaCarousel = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const [isAutoScrollStop, setIsAutoScrollStop] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current!);
  useAutoCarouselScroll(
    innerRef,
    props.displayPosts,
    props.setDisplayPosts,
    props.isActive,
    isAutoScrollStop
  );

  return (
    <div
      className="h-[18.5rem] overflow-hidden bg-cover bg-center rounded-lg border-4 border-[rgba(40,20,0,0.5)]"
      style={{ backgroundImage: props.backgroundImageUrl }}
    >
      <div className="absolute top-0 left-0 text-white text-sm m-2">絵馬をタップすると…？</div>
      {props.isLoading ? (
        <div className="p-4 text-center">読み込み中...</div>
      ) : props.error ? (
        <div className="p-4 text-center text-red-500">データの取得に失敗しました</div>
      ) : (
        <div
          ref={innerRef}
          className="flex h-full items-end whitespace-nowrap overflow-x-auto overflow-y-hidden no-scrollbar pb-[1rem]"
        >
          {props.displayPosts.map((p) => (
            <EmaItem
              key={p.drawKey}
              post={p}
              setIsAutoScrollStop={setIsAutoScrollStop}
              handleTokuGet={props.handleTokuGet}
            />
          ))}
        </div>
      )}
    </div>
  );
});
EmaCarousel.displayName = 'EmaCarousel';

export default memo(EmaCarousel);
