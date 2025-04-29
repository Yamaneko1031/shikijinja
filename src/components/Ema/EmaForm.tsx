import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { TextBlock, Post, EmaImageKey, TextRectSize } from '@/types/ema';
import { defaultOffsetPos, defaultTextRectSize } from '@/config/ema';
import EmaPreview from './EmaPreview';
import TextSettingsPanel from './TextSettingsPanel';
import { emaList } from '@/config/ema';
import { FontColorKey, FontKey } from '@/types/fonts';
import { Button } from '../shared/Button';
import TextReveal from '../shared/TextReveal';

export interface EmaFormProps {
  initialDeityKey: EmaImageKey;
  initialTexts?: TextBlock[];
  onSubmit: (post: Post) => void;
  onClose: () => void;
}

export default function EmaForm({
  initialDeityKey,
  initialTexts,
  onSubmit,
  onClose,
}: EmaFormProps) {
  const initFont = ['ackaisyo', 'aoyagi', 'otsutome', 'yusei'][
    Math.floor(Math.random() * 4)
  ] as FontKey;
  const initFontColor = ['black', 'red', 'blue', 'green'][
    Math.floor(Math.random() * 4)
  ] as FontColorKey;

  // テキストブロック状態
  const [texts, setTexts] = useState<TextBlock[]>(
    initialTexts ?? [
      {
        text: '',
        isVertical: false,
        font: initFont,
        fontSize: 24,
        fontColor: initFontColor,
        textRotate: '0',
        lineHeight: [1.0, 1.1, 1.2, 1.3, 1.4][Math.floor(Math.random() * 5)].toFixed(1),
        offsetX: defaultOffsetPos[0].offsetX,
        offsetY: defaultOffsetPos[0].offsetY,
        textWidth: defaultTextRectSize.width,
        textHeight: defaultTextRectSize.height,
      },
      {
        text: '',
        isVertical: false,
        font: initFont,
        fontSize: 16,
        fontColor: initFontColor,
        textRotate: '0',
        lineHeight: '1.4',
        offsetX: defaultOffsetPos[1].offsetX,
        offsetY: defaultOffsetPos[1].offsetY,
        textWidth: defaultTextRectSize.width,
        textHeight: defaultTextRectSize.height,
      },
    ]
  );
  const [currentTextIndex, setCurrentTextIndex] = useState<0 | 1>(0);
  // const [isSettingOpen, setIsSettingOpen] = useState(false);

  // プレビュー用 refs & state
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewTextRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [textRectStyle, setTextRectStyle] = useState<TextRectSize | null>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean[]>([false, false]);
  const [deityKey, setDeityKey] = useState<EmaImageKey>(initialDeityKey);

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
      //   const i = draggingRef.current;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      let dx = clientX - startPosRef.current.x;
      let dy = clientY - startPosRef.current.y;

      // ドラッグ領域の外に出ないようにする
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
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [currentTextIndex]);

  // オーバーフロー測定
  useEffect(() => {
    const el = previewTextRefs.current[currentTextIndex];
    const wrap = previewWrapperRef.current;
    const cont = previewContainerRef.current;
    if (el && wrap && cont) {
      const t = el.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      const c = cont.getBoundingClientRect();
      setTextRectStyle({
        top: t.top - w.top,
        left: t.left - w.left,
        width: t.width,
        height: t.height,
      });
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
  }, [texts, currentTextIndex, deityKey]);

  // Submit
  const handleSubmit = () => {
    // 投稿ボタンをdisableにしているが念のため
    if (texts.every((text) => text.text.length === 0)) {
      alert('文字が入力されていません。');
      return;
    }
    // 投稿ボタンをdisableにしているが念のため
    if (isOverflowing.some((is) => is)) {
      alert('文字が絵馬からはみ出しています。位置や角度、行間を調整してください。');
      return;
    }
    onSubmit({ texts, reply: '返信待ち', emaImage: deityKey });
    onClose();
  };

  // Deity navigation
  const keys = Object.keys(emaList) as EmaImageKey[];
  const idx = keys.indexOf(deityKey);
  const prevKey = keys[(idx - 1 + keys.length) % keys.length];
  const nextKey = keys[(idx + 1) % keys.length];

  return (
    <div>
      <div className="relative flex flex-col items-center gap-4">
        {/* 神様の説明 */}
        <div className="relative flex items-center gap-2 bg-white/20 rounded-sm p-2 h-[90px] w-full">
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => setDeityKey(prevKey)}
            className="w-[30px] h-[30px] bg-white/10 hover:bg-white/20 text-white text-sm rounded-full"
          >
            ←
          </Button>
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <div className="w-[80px] h-[80px] rounded-md overflow-hidden">
              <Image
                src={`/images/illust/${emaList[deityKey].illustname}`}
                alt={emaList[deityKey].label}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-white">【{emaList[deityKey].label}】</div>
              <div className="text-xs text-gray-300 ml-1 whitespace-pre-line text-center">
                {emaList[deityKey].grace}
              </div>
            </div>
          </div>
          <Button
            variant="subNatural"
            size="sm"
            onClick={() => setDeityKey(nextKey)}
            className="w-[30px] h-[30px] bg-white/10 hover:bg-white/20 text-white text-sm rounded-full"
          >
            →
          </Button>
        </div>
        {/* 説明文 */}
        <div className="relative w-full ml-4">
          <TextReveal
            text={`自由に願い事を書いて投稿しよう。\nお祈りした神様から一言もらえるかもしません。`}
            delayPerChar={0.1}
            className="text-[14px]"
          />
        </div>
        {/* プレビューエリア */}
        <div className="relative w-full">
          <div className="flex gap-2">
            <div className="relative border border-white rounded-sm flex flex-col items-center overflow-hidden">
              <div className="-mt-16">
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
                  textRectStyle={textRectStyle}
                  isOverflowing={isOverflowing[currentTextIndex]}
                  placeholders={[emaList[deityKey].sampleText, emaList[deityKey].label]}
                  defaultTextRectSize={defaultTextRectSize}
                />
              </div>
              <div>
                <nav className="flex">
                  {['本文', 'ニックネーム'].map((label, idx) => {
                    const selected = currentTextIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentTextIndex(idx as 0 | 1)}
                        className={`flex-1 px-4 py-2 mb-2 font-medium text-sm text-center whitespace-nowrap ${
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

                {/* ② 下に textarea をそのまま */}
                <textarea
                  value={texts[currentTextIndex].text}
                  onChange={(e) => updateCurrentText({ text: e.target.value })}
                  maxLength={40}
                  rows={3}
                  className="w-[200px] p-2 bg-black/70 rounded-sm text-[16px] text-white resize-none"
                  placeholder={currentTextIndex === 0 ? '願い事を入力...' : 'ニックネームを入力...'}
                />
              </div>
            </div>
            <div>
              <TextSettingsPanel
                textBlock={texts[currentTextIndex]}
                isOpen={true}
                onChange={updateCurrentText}
              />
            </div>
          </div>
        </div>

        {/* アクション */}
        <div className="flex space-x-2">
          <Button onClick={onClose} variant="negative" size="md">
            やめる
          </Button>
          <Button
            onClick={handleSubmit}
            variant="positive"
            size="md"
            disabled={
              isOverflowing.some((is) => is) || texts.every((text) => text.text.length === 0)
            }
          >
            投稿する
          </Button>
        </div>
      </div>
    </div>
  );
}
