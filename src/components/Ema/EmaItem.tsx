import { useState, useRef, useEffect, useCallback } from 'react';
import { DisplayPost, TextBlock } from '@/types/ema';
import { defaultTextRectSize } from '@/config/ema';
import { fontList, fontColorList } from '@/config/fonts';
import { emaList } from '@/config/ema';
import { getCssDuration } from '@/utils/getCssDuration';
import { TokuId } from '@/types/toku';

interface EmaItemProps {
  post: DisplayPost;
  setIsAutoScrollStop: React.Dispatch<React.SetStateAction<boolean>>;
  handleTokuGet: (tokuId: TokuId) => void;
}

export default function EmaItem({ post, setIsAutoScrollStop, handleTokuGet }: EmaItemProps) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleClick = useCallback(() => {
    console.log('ema handleClick');
    const popupDuration = getCssDuration('--ema-popup-duration');
    const bounceDuration = getCssDuration('--ema-bounce-duration');

    setPopupVisible(false);
    clearTimeout(timerRef.current!);
    setBouncing(false);
    clearTimeout(bounceTimerRef.current!);

    requestAnimationFrame(() => {
      // ポップアップ表示
      setPopupVisible(true);
      setIsAutoScrollStop(true);
      timerRef.current = setTimeout(() => {
        setPopupVisible(false);
        setIsAutoScrollStop(false);
      }, popupDuration);

      // バウンス
      setBouncing(true);
      bounceTimerRef.current = setTimeout(() => setBouncing(false), bounceDuration);
    });
  }, [setIsAutoScrollStop]);

  useEffect(() => {
    if (post.highlighted) {
      handleClick();
    }
  }, [post.highlighted, handleClick]);

  return (
    <div
      className="min-w-[240px] h-[240px] relative text-center cursor-pointer"
      style={{ marginRight: post.marginRight }}
      onClick={() => {
        handleClick();
        handleTokuGet('ema_tap');
      }}
    >
      {popupVisible && (
        <div
          className={`absolute bottom-17 left-1/2 z-50 ${popupVisible ? 'animate-ema-popup' : ''}`}
        >
          <div className="relative max-h-[200px] w-[200px] bg-black/70 backdrop-blur-sm text-[14px] text-white px-3 py-2 rounded-lg shadow-lg text-center whitespace-pre-wrap select-none">
            {post.reply}

            {/* 吹き出しの出てる部分 */}
            <div
              className="
                absolute
                bottom-[-5px]
                left-8
                transform -translate-x-1/2
                w-0 h-0
                border-l-[6px] border-l-transparent
                border-r-[6px] border-r-transparent
                border-t-[6px] border-t-black/70
              "
            />
          </div>
        </div>
      )}
      <div
        className={`w-full h-full bg-cover bg-center bg-no-repeat transition-transform ${post.highlighted ? 'animate-ema-insert' : ''} ${bouncing ? 'animate-ema-bounce' : ''}`}
        style={
          {
            backgroundImage: `url(/images/ema/${emaList[post.emaImage].filename})`,
            '--rotate': `${post.rotate}deg`,
            '--ty': `${post.translateY}px`,
            transform: `rotate(var(--rotate)) translateY(var(--ty)) scale(1)`,
          } as React.CSSProperties
        }
      >
        <div
          className="absolute flex items-center justify-center overflow-hidden"
          style={{ ...defaultTextRectSize }}
        >
          {post.texts.map((block: TextBlock, i) => (
            <p
              key={i}
              className={`absolute ${fontList.find((f) => f.key === block.font)?.className} text-center whitespace-pre-wrap text-shadow select-none ${
                block.isVertical ? 'vertical' : ''
              }`}
              style={{
                maxWidth: block.isVertical ? undefined : `${block.textWidth}px`,
                maxHeight: block.isVertical ? `${block.textHeight}px` : undefined,
                color: fontColorList.find((c) => c.key === block.fontColor)?.value,
                transform: `translate(${block.offsetX}px, ${block.offsetY}px) rotate(${block.textRotate}deg)`,
                lineHeight: block.lineHeight,
                fontSize: `${block.fontSize}px`,
              }}
            >
              {block.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
