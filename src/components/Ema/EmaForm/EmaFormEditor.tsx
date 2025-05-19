import React, { useEffect, useRef, useState } from 'react';
import { emaList, initialTexts } from '@/config/ema';
import { EmaImageKey, TextBlock } from '@/types/ema';
import { FontKey, FontColorKey } from '@/types/fonts';
import EmaPreview from './EmaPreview';
import TextSettingsPanel from './TextSettingsPanel';
import { fontList } from '@/config/fonts';

interface EmaFormEditorProps {
  deityKey: EmaImageKey;
  textsRef: React.RefObject<TextBlock[]>;
  setIsOverFlowError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMainTextEmptyError: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmaFormEditor: React.FC<EmaFormEditorProps> = ({
  deityKey,
  textsRef,
  setIsOverFlowError,
  setIsMainTextEmptyError,
}) => {
  const initFont = ['ackaisyo', 'aoyagi', 'otsutome', 'yusei'][
    Math.floor(Math.random() * 4)
  ] as FontKey;
  const initFontColor = ['black', 'red', 'blue', 'green'][
    Math.floor(Math.random() * 4)
  ] as FontColorKey;
  const initLineHeight = [1.1, 1.2, 1.3][Math.floor(Math.random() * 3)].toFixed(1);
  // 初期のテキストは一部ランダム
  const [texts, setTexts] = useState<TextBlock[]>(
    initialTexts.map((text) => ({
      ...text,
      font: initFont,
      fontColor: initFontColor,
      lineHeight: initLineHeight,
    }))
  );
  const [currentTextIndex, setCurrentTextIndex] = useState<0 | 1>(0);
  const [isOverflowing, setIsOverflowing] = useState<boolean[]>([false, false]);

  // オーバーフロー判定に必要なプレビュー内のref
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewTextRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // ドラッグ状態管理
  const draggingRef = useRef<number | false>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // テキスト更新 helper
  const updateCurrentText = (patch: Partial<TextBlock> | ((prev: TextBlock) => TextBlock)) => {
    setTexts((prev) => {
      const copy = [...prev];
      const cur = copy[currentTextIndex];
      copy[currentTextIndex] = typeof patch === 'function' ? patch(cur) : { ...cur, ...patch };
      return copy;
    });
  };

  const eventStop = (e: WheelEvent | TouchEvent) => {
    e.preventDefault();
  };

  // ドラッグ開始イベント
  const handleTextMouseDown = (index: number, e: React.MouseEvent) => {
    setCurrentTextIndex(index as 0 | 1);
    draggingRef.current = index;
    startPosRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleTextTouchStart = (index: number, e: React.TouchEvent) => {
    setCurrentTextIndex(index as 0 | 1);
    const touch = e.touches[0];
    draggingRef.current = index;
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // ドラッグ中の移動処理
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (draggingRef.current === false) return;
      // ドラッグした移動量を取得
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      let dx = clientX - startPosRef.current.x;
      let dy = clientY - startPosRef.current.y;

      // ドラッグ領域から一定以上外に出ないように移動量を補正
      const el = previewTextRefs.current[currentTextIndex];
      const cont = previewContainerRef.current;
      if (el && cont) {
        const t = el.getBoundingClientRect();
        const c = cont.getBoundingClientRect();
        const dragAreaMarginHeight = el.clientHeight / 2;
        const dragAreaMarginWidth = el.clientWidth / 2;
        if (t.left + dx < c.left - dragAreaMarginWidth) {
          dx = c.left - dragAreaMarginWidth - t.left;
        }
        if (t.top + dy < c.top - dragAreaMarginHeight) {
          dy = c.top - dragAreaMarginHeight - t.top;
        }
        if (t.right + dx > c.right + dragAreaMarginWidth) {
          dx = c.right + dragAreaMarginWidth - t.right;
        }
        if (t.bottom + dy > c.bottom + dragAreaMarginHeight) {
          dy = c.bottom + dragAreaMarginHeight - t.bottom;
        }
      }

      setTexts((prev) => {
        const copy = [...prev];
        const cur = { ...copy[draggingRef.current as number] };
        cur.offsetX += dx;
        cur.offsetY += dy;
        copy[draggingRef.current as number] = cur;
        return copy;
      });
      startPosRef.current = { x: clientX, y: clientY };
    };
    const handleEnd = () => {
      draggingRef.current = false;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    window.addEventListener('wheel', eventStop, { passive: false });
    window.addEventListener('touchmove', eventStop, { passive: false });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);

      window.removeEventListener('wheel', eventStop);
      window.removeEventListener('touchmove', eventStop);
    };
  }, [currentTextIndex]);

  useEffect(() => {
    // オーバーフロー測定
    const el = previewTextRefs.current[currentTextIndex];
    const wrap = previewWrapperRef.current;
    const cont = previewContainerRef.current;
    if (el && wrap && cont) {
      const t = el.getBoundingClientRect();
      const c = cont.getBoundingClientRect();
      const m = 5;

      setIsOverflowing((prev) => {
        const updated = [...prev];
        updated[currentTextIndex] =
          t.left < c.left - m ||
          t.top < c.top - m ||
          t.right > c.right + m ||
          t.bottom > c.bottom + m;
        return updated;
      });
    }
  }, [texts, deityKey, currentTextIndex]);

  useEffect(() => {
    textsRef.current = texts;

    // 入力あり且つオーバーフローしている場合
    if (
      texts.some((text, index) => {
        if (text.text.length > 0 && isOverflowing[index]) {
          return true;
        }
      })
    ) {
      setIsOverFlowError(true);
    } else {
      setIsOverFlowError(false);
    }

    // 本文が空の場合
    if (texts[0].text.length == 0) {
      setIsMainTextEmptyError(true);
    } else {
      setIsMainTextEmptyError(false);
    }
  }, [texts, textsRef, isOverflowing, setIsMainTextEmptyError, setIsOverFlowError]);

  return (
    <div>
      {/* プレビューエリア */}
      <div className="relative w-full">
        <div className="flex gap-4">
          <div className="relative w-full min-w-[220px] border border-white rounded-sm flex flex-col items-center overflow-hidden">
            {/* フォント選択 */}
            <div className="absolute top-2 left-2 z-1 flex justify-between gap-2 w-full select-none">
              <select
                value={texts[currentTextIndex].font}
                onChange={(e) => updateCurrentText({ font: e.target.value as TextBlock['font'] })}
                className="max-w-[170px] w-full h-8 bg-black border border-white rounded px-1 py-1 text-[14px] cursor-pointer"
              >
                {fontList.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>
              {/* 縦書き切替 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={texts[currentTextIndex].isVertical}
                  onChange={(e) => updateCurrentText({ isVertical: e.target.checked })}
                  className="w-5 h-5 text-black rounded"
                />
                <span className="text-sm text-left w-[60px]">縦書き</span>
              </label>
            </div>

            <div className="-mt-10">
              {/* プレビュー & テキスト入力 */}
              <EmaPreview
                texts={texts}
                emaImageKey={deityKey}
                currentTextIndex={currentTextIndex}
                previewWrapperRef={previewWrapperRef}
                previewContainerRef={previewContainerRef}
                previewTextRefs={previewTextRefs}
                onTextMouseDown={handleTextMouseDown}
                onTextTouchStart={handleTextTouchStart}
                isOverflowing={isOverflowing[currentTextIndex]}
                placeholders={[emaList[deityKey].sampleText, emaList[deityKey].label]}
              />
            </div>
            {/* <span className="text-[10px] mt-[-6px] text-gray-300">
              文字の位置は自由に動かせるよ
            </span> */}
            <div className="w-full p-2 mt-[-10px]">
              {/* 対象テキスト選択 */}
              <nav className="flex">
                {['本文', 'ニックネーム'].map((label, idx) => {
                  const selected = currentTextIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentTextIndex(idx as 0 | 1)}
                      className={`flex-1 px-4 py-2 mb-2 font-medium text-sm text-center whitespace-nowrap cursor-pointer ${
                        selected
                          ? 'border-b border-white text-white'
                          : 'border-b border-white/50 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </nav>
              {/* テキスト入力 */}
              <textarea
                value={texts[currentTextIndex].text}
                onChange={(e) => updateCurrentText({ text: e.target.value })}
                maxLength={40}
                rows={3}
                autoFocus
                className="relative w-full p-2 bg-black/90 rounded-sm text-[16px] text-white resize-none"
                placeholder={currentTextIndex === 0 ? '願い事を入力...' : 'ニックネームを入力...'}
              />
            </div>
          </div>
          <TextSettingsPanel textBlock={texts[currentTextIndex]} onChange={updateCurrentText} />
        </div>
      </div>
    </div>
  );
};

export default EmaFormEditor;
