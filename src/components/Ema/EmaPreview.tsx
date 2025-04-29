import React from 'react';
import { TextBlock, EmaImageKey, TextRectSize } from '@/types/ema';
import { fontList, fontColorList } from '@/config/fonts';
import { emaList } from '@/config/ema';

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
  defaultTextRectSize: TextRectSize;
  textRectStyle: TextRectSize | null;
  isOverflowing?: boolean;
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
  defaultTextRectSize,
  textRectStyle,
  isOverflowing = false,
}: EmaPreviewProps) {
  const allTextsEmpty = texts.every((block) => block.text === '');
  return (
    <div
      ref={previewWrapperRef}
      className="relative w-[240px] h-[240px] bg-cover bg-center"
      style={{ backgroundImage: `url(/images/ema/${emaList[emaImageKey].filename})` }}
    >
      {/* テキスト表示領域 */}
      <div
        ref={previewContainerRef}
        className="absolute flex items-center justify-center"
        style={{
          top: `${defaultTextRectSize.top}px`,
          left: `${defaultTextRectSize.left}px`,
          width: `${defaultTextRectSize.width}px`,
          height: `${defaultTextRectSize.height}px`,
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
              } text-center whitespace-pre-wrap text-shadow select-none ${
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
              {isEmpty ? placeholders[index] : block.text}
            </p>
          );
        })}
      </div>

      {/* バリデーション用の境界線 */}
      <div
        className="absolute border border-yellow-400 rounded pointer-events-none"
        style={{
          top: `${defaultTextRectSize.top}px`,
          left: `${defaultTextRectSize.left}px`,
          width: `${defaultTextRectSize.width}px`,
          height: `${defaultTextRectSize.height}px`,
        }}
      />

      {/* ガイド枠（はみ出しチェック用） */}
      {textRectStyle && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            top: `${textRectStyle.top}px`,
            left: `${textRectStyle.left}px`,
            width: `${textRectStyle.width}px`,
            height: `${textRectStyle.height}px`,
            border: `2px dashed ${isOverflowing ? 'red' : 'lime'}`,
            borderRadius: '4px',
          }}
        />
      )}
    </div>
  );
}
