import React from 'react';
import { TextBlock, EmaImageKey } from '@/types/ema';
import { fontList, fontColorList } from '@/config/fonts';
import { defaultTextRectSize, emaList } from '@/config/ema';

export interface EmaPreviewProps {
  texts: TextBlock[];
  placeholders: string[];
  emaImageKey: EmaImageKey;
  currentTextIndex: number;
  previewWrapperRef: React.Ref<HTMLDivElement>;
  previewContainerRef: React.Ref<HTMLDivElement>;
  previewTextRefs: React.RefObject<(HTMLParagraphElement | null)[]>;
  onTextMouseDown: (index: number, e: React.MouseEvent) => void;
  onTextTouchStart: (index: number, e: React.TouchEvent) => void;
  isOverflowing: boolean;
}

export default function EmaPreview({
  texts,
  placeholders,
  emaImageKey,
  currentTextIndex,
  previewWrapperRef,
  previewContainerRef,
  previewTextRefs,
  onTextMouseDown,
  onTextTouchStart,
  isOverflowing,
}: EmaPreviewProps) {
  const allTextsEmpty = texts.every((block) => block.text === '');
  return (
    <div
      ref={previewWrapperRef}
      className="relative w-[15rem] h-[15rem] bg-cover bg-center select-none"
      style={{ backgroundImage: `url(/images/ema/${emaList[emaImageKey].filename})` }}
    >
      {/* テキスト表示領域 */}
      <div
        ref={previewContainerRef}
        className="absolute flex items-center justify-center"
        style={{
          top: `${defaultTextRectSize.top}rem`,
          left: `${defaultTextRectSize.left}rem`,
          width: `${defaultTextRectSize.width}rem`,
          height: `${defaultTextRectSize.height}rem`,
        }}
      >
        {texts.map((block, index) => {
          const isCurrent = currentTextIndex === index;
          const isEmpty = block.text === '';
          if (!allTextsEmpty && isEmpty && !isCurrent) return null;
          return (
            <p
              key={index}
              ref={(el) => {
                previewTextRefs.current[index] = el;
              }}
              onMouseDown={(e) => onTextMouseDown(index, e)}
              onTouchStart={(e) => onTextTouchStart(index, e)}
              className={`absolute ${
                fontList.find((f) => f.key === block.font)?.className
              } text-center box-border whitespace-pre-wrap text-shadow ${block.isVertical ? 'vertical' : ''}`}
              style={{
                maxWidth: block.isVertical ? undefined : `${block.textWidth}rem`,
                maxHeight: block.isVertical ? `${block.textHeight}rem` : undefined,
                color: fontColorList.find((c) => c.key === block.fontColor)?.value,
                transform: `translate(${block.offsetX}rem, ${block.offsetY}rem) rotate(${block.textRotate}deg)`,
                lineHeight: block.lineHeight,
                fontSize: `${block.fontSize}rem`,
                border: `${isCurrent ? `0.125rem dashed ${isOverflowing ? 'red' : 'lime'}` : 'none'}`,
                borderRadius: '0.25rem',
              }}
            >
              {isEmpty ? placeholders[index] + ' (例' : block.text}
            </p>
          );
        })}
      </div>

      {/* バリデーション用の境界線 */}
      <div
        className="absolute border-2 border-yellow-300 rounded pointer-events-none"
        style={{
          top: `${defaultTextRectSize.top}rem`,
          left: `${defaultTextRectSize.left}rem`,
          width: `${defaultTextRectSize.width}rem`,
          height: `${defaultTextRectSize.height}rem`,
        }}
      />
    </div>
  );
}
