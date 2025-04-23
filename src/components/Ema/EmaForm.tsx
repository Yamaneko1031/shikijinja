import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { TextBlock, Post, EmaImageKey, TextRectSize } from '@/types/ema';
import { defaultOffsetPos, defaultTextRectSize } from '@/config/ema';
import EmaPreview from './EmaPreview';
import TextSettingsPanel from './TextSettingsPanel';
import { emaList } from '@/config/ema';
import { FontColorKey, FontKey } from '@/types/fonts';

export interface EmaFormProps {
  deityKey: EmaImageKey;
  onChangeDeity: (key: EmaImageKey) => void;
  initialTexts?: TextBlock[];
  onSubmit: (post: Post) => void;
  onClose: () => void;
}

export default function EmaForm({
  deityKey,
  onChangeDeity,
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
        font: initFont,
        fontSize: 24,
        fontColor: initFontColor,
        textRotate: '0',
        lineHeight: [1.0, 1.1, 1.2, 1.3, 1.4][Math.floor(Math.random() * 5)].toFixed(1),
        offsetX: 0,
        offsetY: 0,
        textWidth: defaultTextRectSize.width,
      },
      {
        text: '',
        font: initFont,
        fontSize: 16,
        fontColor: initFontColor,
        textRotate: '0',
        lineHeight: '1.4',
        offsetX: 0,
        offsetY: 35,
        textWidth: defaultTextRectSize.width,
      },
    ]
  );
  const [currentTextIndex, setCurrentTextIndex] = useState<0 | 1>(0);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  // プレビュー用 refs & state
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewTextRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [textRectStyle, setTextRectStyle] = useState<TextRectSize | null>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean[]>([false, false]);

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
      const dx = clientX - startPosRef.current.x;
      const dy = clientY - startPosRef.current.y;
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
  });

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
  }, [texts, currentTextIndex]);

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
    <div className="relative flex flex-col items-center gap-4">
      {/* 挿絵・説明 */}
      <div className="relative flex items-center gap-2 bg-black/10 p-2 rounded border border-white h-[90px] w-full ">
        <button
          onClick={() => onChangeDeity(prevKey)}
          className="w-[30px] h-[30px] bg-white/10 hover:bg-white/20 text-white text-sm rounded-full"
        >
          ←
        </button>
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
        <button
          onClick={() => onChangeDeity(nextKey)}
          className="w-[30px] h-[30px] bg-white/10 hover:bg-white/20 text-white text-sm rounded-full"
        >
          →
        </button>
      </div>

      <div className="relative w-full">
        {/* 文字のカスタムボタン */}
        <button
          onClick={() => setIsSettingOpen(!isSettingOpen)}
          className="relative left-0 top-0 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full shadow-md z-50 flex items-center"
        >
          <Image
            src="/images/icon/icon_hude.webp"
            alt="icon"
            width={24}
            height={24}
            className="mr-2"
          />
          {isSettingOpen ? '←' : '文字のカスタム'}
        </button>

        {/* 編集対象テキストの選択 */}
        <div className="absolute right-0 top-0 flex flex-col gap-2 z-20">
          {[0, 1].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentTextIndex(index as 0 | 1)}
              className={`px-2 py-1 rounded-full border ${
                currentTextIndex === index
                  ? 'bg-white/20 text-white border-white'
                  : 'bg-white/10 hover:bg-white/20 text-white/50 border-0'
              }`}
            >
              {index === 0 ? '本文' : 'ニックネーム'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {/* 設定パネル */}
          <div
            className={`
            top-0 left-0 z-50
            bg-black/90 text-white rounded-r-lg shadow-lg
            transition-all duration-300 ease-in-out
            ${isSettingOpen ? 'w-[100px] opacity-100' : 'w-[0px] opacity-60'}
        `}
          >
            <TextSettingsPanel
              textBlock={texts[currentTextIndex]}
              isOpen={isSettingOpen}
              onChange={updateCurrentText}
            />
          </div>
          <div
            className="relative flex flex-col items-center gap-2 transition-all duration-300 ease-in-out"
            style={{
              margin: '0 auto',
            }}
          >
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
              placeholder="ここに表示されます"
              defaultTextRectSize={defaultTextRectSize}
            />
            <textarea
              value={texts[currentTextIndex].text}
              onChange={(e) => updateCurrentText({ text: e.target.value })}
              maxLength={40}
              rows={3}
              className="w-[200px] p-2 border rounded"
              placeholder="願い事を入力..."
            />
          </div>
        </div>
      </div>

      {/* アクション */}
      <div className="flex space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-blue-500 rounded">
          閉じる
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 disabled:bg-gray-400 text-white rounded"
          disabled={isOverflowing.some((is) => is) || texts.every((text) => text.text.length === 0)}
        >
          投稿する
        </button>
        <button
          onClick={() => updateCurrentText(defaultOffsetPos[currentTextIndex])}
          className="px-4 py-2 bg-blue-500 rounded"
        >
          位置リセット
        </button>
      </div>
    </div>
  );
}
