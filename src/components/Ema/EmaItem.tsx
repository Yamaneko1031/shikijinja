import { useState, useRef } from 'react';
import { DisplayPost, TextBlock } from '@/types/ema';
import { defaultTextRectSize } from '@/config/ema';
import { fontList, fontColorList } from '@/config/fonts';
import { emaList } from '@/config/ema';
import { getCssDuration } from '@/utils/getCssDuration';

interface EmaItemProps {
  post: DisplayPost;
}

export default function EmaItem({ post }: EmaItemProps) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleClick = () => {
    const popupDuration = getCssDuration('--ema-popup-duration');
    const bounceDuration = getCssDuration('--ema-bounce-duration');

    // ポップアップ表示
    setPopupVisible(true);
    clearTimeout(timerRef.current!);
    timerRef.current = setTimeout(() => setPopupVisible(false), popupDuration);

    // バウンス
    setBouncing(true);
    setTimeout(() => setBouncing(false), bounceDuration);
  };

  return (
    <div
      className="min-w-[240px] h-[240px] relative text-center"
      style={{ marginRight: post.marginRight }}
      onClick={handleClick}
    >
      {popupVisible && (
        <div className="absolute top-10 left-1/2 z-50 animate-ema-popup">
          <div className="w-[200px] bg-black/70 backdrop-blur-sm text-sm text-w-800 px-3 py-2 rounded shadow-lg text-center whitespace-pre-wrap select-none">
            {post.reply}
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
              className={`absolute ${fontList.find((f) => f.key === block.font)?.className} text-center whitespace-pre-wrap text-shadow select-none`}
              style={{
                maxWidth: `${block.textWidth}px`,
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
