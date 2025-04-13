'use client';

import { useState, useEffect, useRef } from 'react';

// 絵馬投稿データ
type Post = {
  text: string;
  font: FontKey;
  fontSize: FontSize;
  fontColor: FontColorKey;
  emaImage: EmaImageKey;
  textRotate: string;
  lineHeight: string;
  offsetX: number;
  offsetY: number;
};

// 絵馬表示用データ
type DisplayPost = Post & {
  drawKey: string;
  rotate: string;
  translateY: string;
  marginRight: string;
  highlighted?: boolean; // ← 追加
};

// 絵馬表示用データを生成
const createDisplayPost = (post: Post): DisplayPost => ({
  ...post,
  drawKey: crypto.randomUUID(),
  rotate: (Math.random() * 10 - 5).toFixed(2),
  translateY: (Math.random() * 10 - 5).toFixed(2),
  marginRight: `${-25 - Math.floor(Math.random() * 20)}px`,
});

// モックデータ作成
const generateMockPosts = (): Post[] => {
  const texts = [
    '健康に過ごせますように',
    '試験に合格しますように',
    '推しがずっと輝いてますように',
    '仕事がうまくいきますように',
    '世界が平和になりますように',
    '友達ができますように',
    'ゲームがうまくなりますように',
    '猫と仲良くなれますように',
    '美味しいご飯が食べられますように',
    '宝くじ当たりますように',
  ];

  return texts.map((text) => ({
    text,
    font: ['ackaisyo', 'aoyagi', 'otsutome', 'yusei'][Math.floor(Math.random() * 4)] as FontKey,
    fontSize:
      text.length >= 11
        ? (['small', 'medium'][Math.floor(Math.random() * 2)] as FontSize)
        : (['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as FontSize),
    fontColor: ['black', 'red', 'blue', 'green'][Math.floor(Math.random() * 4)] as FontColorKey,
    emaImage: ['iroha', 'nadeneko', 'shikineko', 'tenten'][
      Math.floor(Math.random() * 4)
    ] as EmaImageKey,
    textRotate: (Math.random() * 6 - 3).toFixed(1),
    lineHeight: (Math.random() * 0.2 + 1.2).toFixed(1),
    offsetX: 0,
    offsetY: 0,
  }));
};

// フォントテーブル
const fontList = [
  { key: 'ackaisyo', label: '英椎楷書', className: 'font-ackaisyo' },
  { key: 'aoyagi', label: '青柳衡山', className: 'font-aoyagi' },
  { key: 'otsutome', label: 'おつとめフォント', className: 'font-otsutome' },
  { key: 'yusei', label: 'Yusei Magic', className: 'font-yusei' },
] as const;

type FontListItem = (typeof fontList)[number];
type FontKey = FontListItem['key'];

// フォントカラーテーブル
const fontColorList = [
  { key: 'black', label: '黒', value: '#0c0c0c' },
  { key: 'red', label: '赤', value: '#B90000' },
  { key: 'blue', label: '青', value: '#183B80' },
  { key: 'green', label: '緑', value: '#0A672C' },
] as const;

type FontColorListItem = (typeof fontColorList)[number];
type FontColorKey = FontColorListItem['key'];

// フォントサイズテーブル
const fontSizeList = [
  { key: 'small', label: '小' },
  { key: 'medium', label: '中' },
  { key: 'large', label: '大' },
] as const;

type FontSizeListItem = (typeof fontSizeList)[number];
type FontSize = FontSizeListItem['key'];

// 絵馬背景テーブル
const emaList = [
  { key: 'iroha', label: 'いろは', filename: 'ema_iroha.webp' },
  { key: 'nadeneko', label: 'なでねこ', filename: 'ema_nadeneko.webp' },
  { key: 'shikineko', label: 'しきねこ', filename: 'ema_shikineko.webp' },
  { key: 'tenten', label: 'てんてん', filename: 'ema_tenten.webp' },
] as const;

type EmaListItem = (typeof emaList)[number];
type EmaImageKey = EmaListItem['key'];

type FontSizeStyle = {
  className: string;
  top: string;
  left: string;
  width: string;
  height: string;
};

// フォントサイズに応じた絵馬上のスタイルテーブル
const fontSizeMap: Record<FontSize, FontSizeStyle> = {
  small: {
    className: 'text-[17px]',
    top: '110px',
    left: '35px',
    width: '170px',
    height: '100px',
  },
  medium: {
    className: 'text-[24px]',
    top: '110px',
    left: '35px',
    width: '170px',
    height: '100px',
  },
  large: {
    className: 'text-[32px]',
    top: '110px',
    left: '35px',
    width: '170px',
    height: '100px',
  },
};

const EmaSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewTextRef = useRef<HTMLParagraphElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  const [wish, setWish] = useState('');
  const [displayPosts, setDisplayPosts] = useState<DisplayPost[]>([]);
  const [emaImage, setEmaImage] = useState<EmaImageKey>('iroha');
  const [font, setFont] = useState<FontKey>('ackaisyo');
  const [fontColor, setFontColor] = useState<FontColorKey>('black');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [textRotate, setTextRotate] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.4);
  const [textOffset, setTextOffset] = useState({ x: 0, y: 0 });
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const [textRectStyle, setTextRectStyle] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const draggingRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const dx = clientX - startPosRef.current.x;
      const dy = clientY - startPosRef.current.y;

      setTextOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

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
  }, []);

  // 絵馬投稿位置を取得
  const getInsertIndex = () => {
    if (!carouselRef.current) return displayPosts.length;

    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;

    // 中央位置
    const center = scrollLeft + containerWidth / 2;

    let total = 0;
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i] as HTMLElement;
      const width = child.offsetWidth;
      const margin = parseFloat(getComputedStyle(child).marginRight);
      total += width + margin;
      if (total > center) return i;
    }

    return displayPosts.length;
  };

  // 絵馬投稿処理
  const handlePostWish = () => {
    if (!wish.trim()) return;

    const container = previewContainerRef.current;
    const text = previewTextRef.current;

    if (container && text) {
      if (isOverflowing) {
        alert('文字が絵馬からはみ出しています。位置や角度、行間を調整してください。');
        return;
      }
    }

    const newPost: Post = {
      text: wish,
      font,
      fontSize,
      fontColor,
      emaImage,
      textRotate: textRotate.toFixed(1),
      lineHeight: lineHeight.toFixed(1),
      offsetX: textOffset.x,
      offsetY: textOffset.y,
    };

    const insertIndex = getInsertIndex();
    const newDisplayPost = {
      ...createDisplayPost(newPost),
      highlighted: true,
    };

    setDisplayPosts((prev) => {
      const next = [...prev];
      next.splice(insertIndex, 0, newDisplayPost);
      return next;
    });

    // アニメーション終了後にhighlightedをfalseに
    setTimeout(() => {
      setDisplayPosts((prev) =>
        prev.map((p) => (p.drawKey === newDisplayPost.drawKey ? { ...p, highlighted: false } : p))
      );
    }, 1); // アニメーション時間と同じ

    // 入力内容リセット
    setWish('');
    setFont('ackaisyo');
    setFontColor('black');
    setFontSize('medium');
    setEmaImage('iroha');
    setTextRotate(0);
    setLineHeight(1.4);
    setTextOffset({ x: 0, y: 0 });
    setIsPosting(false);
  };

  // 初期データをセット（モック）
  useEffect(() => {
    const mockPosts = generateMockPosts().map(createDisplayPost);
    setDisplayPosts(mockPosts);
  }, []);

  // 自動スクロール処理
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        // scrollByだとiOSで表示が再描画されないことがあるので、scrollToを使用
        carouselRef.current.scrollTo({
          left: carouselRef.current.scrollLeft + 2,
          behavior: 'auto',
        });

        const container = carouselRef.current;
        if (!container) return;

        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const middleX = scrollWidth / 2;

        if (scrollLeft > middleX) {
          const shiftWidth = Array.from(container.children)
            .slice(0, 3)
            .reduce((acc, child) => {
              const childElement = child as HTMLElement;
              const width = childElement.offsetWidth;
              const margin = parseFloat(getComputedStyle(childElement).marginRight);
              return acc + width + margin;
            }, 0);

          setDisplayPosts((prev) => {
            const moved = prev.slice(0, 3);
            const rest = prev.slice(3);
            return [...rest, ...moved];
          });

          // requestAnimationFrameでDOM更新の次のフレームでスクロール補正
          requestAnimationFrame(() => {
            container.scrollLeft -= shiftWidth;
          });
        }
      }
    }, 60); // ゆっくり流れる

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!previewContainerRef.current || !previewTextRef.current) return;

    const containerRect = previewContainerRef.current.getBoundingClientRect();
    const textRect = previewTextRef.current.getBoundingClientRect();

    const margin = 5; // 許容範囲（px）

    const isOver =
      textRect.left < containerRect.left - margin ||
      textRect.top < containerRect.top - margin ||
      textRect.right > containerRect.right + margin ||
      textRect.bottom > containerRect.bottom + margin;

    setIsOverflowing(isOver);
  }, [wish, textRotate, lineHeight, fontSize, font]);

  // 表示位置の監視（wish, rotate, lineHeight が変わるたび）
  useEffect(() => {
    if (!previewTextRef.current || !previewWrapperRef.current || !previewContainerRef.current)
      return;

    const textRect = previewTextRef.current.getBoundingClientRect();
    const wrapperRect = previewWrapperRef.current.getBoundingClientRect();
    const containerRect = previewContainerRef.current.getBoundingClientRect();

    setTextRectStyle({
      top: textRect.top - wrapperRect.top,
      left: textRect.left - wrapperRect.left,
      width: textRect.width,
      height: textRect.height,
    });

    const margin = 5;
    const isOver =
      textRect.left < containerRect.left - margin ||
      textRect.top < containerRect.top - margin ||
      textRect.right > containerRect.right + margin ||
      textRect.bottom > containerRect.bottom + margin;

    setIsOverflowing(isOver);
  }, [wish, textRotate, lineHeight, fontSize, font, textOffset]);

  useEffect(() => {
    if (isPosting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // クリーンアップ（万が一の保険）
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPosting]);

  return (
    <section className="w-full max-w-3xl mx-auto p-4 bg-black/50 bg-opacity-80 rounded shadow-lg">
      <h2 className="text-4xl font-bold mb-2">絵馬</h2>
      <p className="text-lg mb-4">絵馬投稿や他の人の投稿した絵馬をみるコンテンツ</p>

      {/* 絵馬一覧カルーセル表示 */}
      <div className="overflow-hidden">
        <div ref={carouselRef} className="flex whitespace-nowrap overflow-x-auto no-scrollbar">
          {displayPosts.map((displayPost: DisplayPost) => {
            return (
              <div
                key={displayPost.drawKey}
                className={`
                  min-w-[240px] h-[240px] bg-cover bg-center bg-no-repeat 
                  rounded text-center px-4 py-2 relative
                  transition-all duration-700 ease-in-out
                `}
                style={{
                  backgroundImage: `url(/images/ema/${emaList.find((e) => e.key === displayPost.emaImage)?.filename})`,
                  transform: `
                    rotate(${displayPost.rotate}deg)
                    translateY(${displayPost.translateY}px)
                    scale(${displayPost.highlighted ? 1.3 : 1})
                  `,
                  opacity: displayPost.highlighted ? 0.3 : 1.0,
                  marginRight: displayPost.marginRight,
                }}
              >
                <div
                  className="absolute overflow-hidden flex items-center justify-center"
                  style={{
                    top: fontSizeMap[displayPost.fontSize].top,
                    left: fontSizeMap[displayPost.fontSize].left,
                    width: fontSizeMap[displayPost.fontSize].width,
                    height: fontSizeMap[displayPost.fontSize].height,
                  }}
                >
                  <p
                    className={`${fontList.find((f) => f.key === displayPost.font)?.className} ${fontSizeMap[displayPost.fontSize].className} text-center break-all whitespace-pre-wrap text-shadow`}
                    style={{
                      color: fontColorList.find((c) => c.key === displayPost.fontColor)?.value,
                      transform: `rotate(${displayPost.textRotate}deg) translate(${displayPost.offsetX}px, ${displayPost.offsetY}px)`,
                      lineHeight: displayPost.lineHeight,
                    }}
                  >
                    {displayPost.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isPosting && (
        <button
          onClick={() => setIsPosting(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 mb-4"
        >
          絵馬に願いを書く
        </button>
      )}

      {isPosting && (
        <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4">
          <div className="bg-black/80 rounded-lg p-6 max-w-sm w-full shadow-xl relative text-white">
            {/* ✨閉じるボタン */}
            <button
              onClick={() => setIsPosting(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            {/* 絵馬投稿フォーム */}
            <div className="flex gap-4 mb-4">
              {/* 絵馬選択 */}
              <div className="flex gap-2 items-center">
                {emaList.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`px-2 py-1 rounded ${
                      emaImage === key ? 'bg-white text-black' : 'bg-gray-800 text-white'
                    }`}
                    onClick={() => setEmaImage(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-4 mb-4">
                {/* フォント選択 */}
                <select value={font} onChange={(e) => setFont(e.target.value as FontKey)}>
                  {fontList.map(({ key, label }) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                {/* フォントサイズ選択 */}
                <div className="flex gap-2 items-center">
                  {fontSizeList.map(({ key, label }) => (
                    <button
                      key={key}
                      className={`px-2 py-1 rounded border ${
                        fontSize === key ? 'bg-white text-black' : 'bg-gray-800 text-white'
                      }`}
                      onClick={() => setFontSize(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* カラー選択 */}
                <div className="flex gap-2 items-center">
                  {fontColorList.map(({ key, label, value }) => (
                    <button
                      key={key}
                      className={`w-6 h-6 rounded-full border-2 ${fontColor === key ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: value }}
                      onClick={() => setFontColor(key)}
                      title={label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 絵馬プレビュー */}
            <div className="flex flex-col items-center gap-4">
              <div
                ref={previewWrapperRef}
                className="relative w-[240px] h-[240px] bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(/images/ema/${emaList.find((e) => e.key === emaImage)?.filename})`,
                }}
              >
                <div
                  ref={previewContainerRef}
                  className="absolute overflow-hidden flex items-center justify-center"
                  style={{
                    top: fontSizeMap[fontSize].top,
                    left: fontSizeMap[fontSize].left,
                    width: fontSizeMap[fontSize].width,
                    height: fontSizeMap[fontSize].height,
                  }}
                >
                  <p
                    ref={previewTextRef}
                    onMouseDown={(e) => {
                      draggingRef.current = true;
                      startPosRef.current = { x: e.clientX, y: e.clientY };
                    }}
                    onTouchStart={(e) => {
                      draggingRef.current = true;
                      const touch = e.touches[0];
                      startPosRef.current = { x: touch.clientX, y: touch.clientY };
                    }}
                    className={`${fontList.find((f) => f.key === font)?.className} ${fontSizeMap[fontSize].className} text-center break-all whitespace-pre-wrap text-shadow`}
                    style={{
                      color: fontColorList.find((c) => c.key === fontColor)?.value,
                      transform: `rotate(${textRotate}deg) translate(${textOffset.x}px, ${textOffset.y}px)`,
                      touchAction: 'none', // ← これでスマホのスクロールと干渉しない
                      lineHeight: lineHeight,
                      // outline: isOverflowing ? '1px solid red' : '1px solid lime',
                      // outlineOffset: '-2px', // 内側に表示
                      // boxSizing: 'border-box',
                    }}
                  >
                    {wish || 'ここに表示されます'}
                  </p>
                </div>
                {/* バリデーション用の境界線 */}
                <div
                  className="absolute border border-yellow-400 rounded"
                  style={{
                    top: fontSizeMap[fontSize].top,
                    left: fontSizeMap[fontSize].left,
                    width: fontSizeMap[fontSize].width,
                    height: fontSizeMap[fontSize].height,
                    pointerEvents: 'none',
                  }}
                ></div>
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

              {/* 文字の角度 */}
              <div className="flex flex-col items-center w-[240px] text-white">
                <label htmlFor="rotateRange" className="text-sm mb-1">
                  文字の角度
                </label>
                <input
                  id="rotateRange"
                  type="range"
                  min={-10}
                  max={10}
                  step={1}
                  value={textRotate}
                  onChange={(e) => setTextRotate(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 行間 */}
              <div className="flex flex-col items-center w-[240px] text-white">
                <label htmlFor="lineHeightRange" className="text-sm mb-1">
                  行間: {lineHeight}
                </label>
                <input
                  id="lineHeightRange"
                  type="range"
                  min={1.0}
                  max={2.0}
                  step={0.1}
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* テキストエリアは下に別で表示 */}
              <textarea
                maxLength={40} // ← これ！
                rows={4}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                className="w-[240px] max-w-md p-2 border rounded bg-black/90"
                placeholder="願い事を入力..."
              />
              <button
                onClick={handlePostWish}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                投稿する
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EmaSection;
