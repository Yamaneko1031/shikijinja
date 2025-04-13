'use client';

import { getCssDuration } from '@/utils/getCssDuration';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
  textWidth: number;
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
    textWidth: defaultTextRectSize.width,
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
const emaList = {
  iroha: {
    label: 'いろは',
    filename: 'ema_iroha.webp',
    illustname: 'illust_iroha.webp',
    description: '健康に過ごせますように',
    grace: '主にデザイン業務において\nご利益があるとされている',
  },
  nadeneko: {
    label: 'なでねこ',
    filename: 'ema_nadeneko.webp',
    illustname: 'illust_nadeneko.webp',
    grace: '幸運を招くとされている',
  },
  shikineko: {
    label: 'しきねこ',
    filename: 'ema_shikineko.webp',
    illustname: 'illust_shikineko.webp',
    grace: '主にエンジニア業務において\nご利益があるとされている',
  },
  tenten: {
    label: 'てんてん',
    filename: 'ema_tenten.webp',
    illustname: 'illust_tenten.webp',
    grace: '主にPM業務において\nご利益があるとされている',
  },
} as const;

type EmaImageKey = keyof typeof emaList;

const fontSizeMap = {
  small: 'text-[17px]',
  medium: 'text-[24px]',
  large: 'text-[32px]',
} as const;

const defaultTextRectSize = {
  top: 110,
  left: 35,
  width: 170,
  height: 100,
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
  const [textWidth, setTextWidth] = useState(defaultTextRectSize.width);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showPostedMessage, setShowPostedMessage] = useState(false);

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

  const scrollToCarousel = () => {
    if (!carouselRef.current) return;

    const offsetTop =
      carouselRef.current.getBoundingClientRect().top +
      window.scrollY +
      carouselRef.current.offsetHeight / 2;
    const targetY = offsetTop - window.innerHeight / 2; // 端末の高さ/2分上に余白を空けたい

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

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
      textWidth,
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

    const insertDuration = getCssDuration('--ema-insert-duration');
    // 挿入アニメーションの付けはずし
    setTimeout(() => {
      setDisplayPosts((prev) =>
        prev.map((p) => (p.drawKey === newDisplayPost.drawKey ? { ...p, highlighted: false } : p))
      );
    }, insertDuration);

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
    setTextWidth(defaultTextRectSize.width);

    // 投稿メッセージ表示
    setShowPostedMessage(true);

    const fadeInOutDuration = getCssDuration('--ema-animate-fade-in-out-duration');
    setTimeout(() => setShowPostedMessage(false), fadeInOutDuration);

    // 絵馬投稿後にスクロール
    scrollToCarousel();
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

  // テキストのはみ出しをチェック
  const checkTextOverflowAndRect = () => {
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
  };

  // 表示位置の監視（wish, rotate, lineHeight が変わるたび）
  useEffect(() => {
    checkTextOverflowAndRect();
  }, [wish, textRotate, lineHeight, fontSize, font, textOffset, textWidth]);

  useEffect(() => {
    if (isPosting) {
      document.body.style.overflow = 'hidden';

      // 投稿フォームが開かれたタイミングでランダム初期化
      setFont(
        ['ackaisyo', 'aoyagi', 'otsutome', 'yusei'][Math.floor(Math.random() * 4)] as FontKey
      );
      setFontColor(
        ['black', 'red', 'blue', 'green'][Math.floor(Math.random() * 4)] as FontColorKey
      );
      setFontSize('medium');
      setTextRotate(0);
      setLineHeight([1.0, 1.1, 1.2, 1.3, 1.4][Math.floor(Math.random() * 5)]);
      setTextWidth(defaultTextRectSize.width);
      setTextOffset({ x: 0, y: 0 });

      // 投稿を開いた時に表示位置のチェック
      setTimeout(checkTextOverflowAndRect, 0);
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

      {/* 投稿メッセージ表示 */}
      {showPostedMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black/60 text-white text-lg px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
            絵馬を投稿しました！
          </div>
        </div>
      )}

      {/* 絵馬一覧カルーセル表示 */}
      <div className="overflow-hidden">
        <div ref={carouselRef} className="flex whitespace-nowrap overflow-x-auto no-scrollbar">
          {displayPosts.map((displayPost: DisplayPost) => {
            return (
              <div
                key={displayPost.drawKey}
                className={`
                  min-w-[240px] h-[240px] bg-cover bg-center bg-no-repeat 
                  text-center relative
                  ${displayPost.highlighted ? 'animate-ema-insert' : ''}
                `}
                style={
                  {
                    backgroundImage: `url(/images/ema/${emaList[displayPost.emaImage].filename})`,
                    '--rotate': `${displayPost.rotate}deg`,
                    '--ty': `${displayPost.translateY}px`,
                    transform: `rotate(var(--rotate)) translateY(var(--ty)) scale(1)`,
                    marginRight: displayPost.marginRight,
                  } as React.CSSProperties
                }
              >
                <div
                  className="absolute overflow-hidden flex items-center justify-center"
                  style={{
                    top: `${defaultTextRectSize.top}px`,
                    left: `${defaultTextRectSize.left}px`,
                    width: `${defaultTextRectSize.width}px`,
                    height: `${defaultTextRectSize.height}px`,
                  }}
                >
                  <p
                    className={`${fontList.find((f) => f.key === displayPost.font)?.className} ${fontSizeMap[displayPost.fontSize]} text-center break-all whitespace-pre-wrap text-shadow`}
                    style={{
                      top: `${defaultTextRectSize.top}px`,
                      left: `${defaultTextRectSize.left + (defaultTextRectSize.width - displayPost.textWidth) / 2}px`,
                      width: `${displayPost.textWidth}px`,
                      color: fontColorList.find((c) => c.key === displayPost.fontColor)?.value,
                      transform: `translate(${displayPost.offsetX}px, ${displayPost.offsetY}px) rotate(${displayPost.textRotate}deg)`,
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
            {/* 閉じるボタン */}
            <button
              onClick={() => setIsPosting(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <div className="grid grid-cols-2 gap-1 mb-1 bg-black border border-white p-4 rounded">
              <div className="col-span-2 text-center text-base font-semibold">文字選択</div>
              {/* 左カラム：ボタン・セレクト系 */}
              <div className="flex flex-col gap-5">
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

                {/* フォントカラー */}
                <div className="flex gap-2 items-center">
                  {fontColorList.map(({ key, value }) => (
                    <button
                      key={key}
                      className={`w-6 h-6 rounded-full border-2 ${
                        fontColor === key ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: value }}
                      onClick={() => setFontColor(key)}
                      title={key}
                    />
                  ))}
                </div>
              </div>

              {/* 右カラム：スライダー系 */}
              <div className="flex flex-col gap-1 text-white">
                {/* 角度 */}
                <div className="flex flex-col">
                  <label className="text-sm mb-1">文字の角度</label>
                  <input
                    type="range"
                    min={-10}
                    max={10}
                    step={1}
                    value={textRotate}
                    onChange={(e) => setTextRotate(Number(e.target.value))}
                  />
                </div>

                {/* 行間 */}
                <div className="flex flex-col">
                  <label className="text-sm mb-1">行間</label>
                  <input
                    type="range"
                    min={1.0}
                    max={2.0}
                    step={0.1}
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                  />
                </div>

                {/* 横幅 */}
                <div className="flex flex-col">
                  <label className="text-sm mb-1">横幅</label>
                  <input
                    type="range"
                    min={80}
                    max={defaultTextRectSize.width}
                    step={5}
                    value={textWidth}
                    onChange={(e) => setTextWidth(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* 挿絵・説明 */}
            <div className="flex items-center justify-between gap-1 bg-black p-2 rounded border border-white h-[90px]">
              <button
                onClick={() =>
                  setEmaImage((prev) => {
                    const keys = Object.keys(emaList);
                    const currentIndex = keys.indexOf(prev);
                    const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
                    return keys[prevIndex] as EmaImageKey;
                  })
                }
              >
                {'◀'}
              </button>
              <div className="flex-1 text-center">
                <div>
                  <label className="text-white">絵馬【{emaList[emaImage].label}】</label>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-white">
                    <Image
                      src={`/images/illust/${emaList[emaImage].illustname}`}
                      alt=""
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="text-xs text-gray-300 ml-2 whitespace-pre-line text-center flex-1">
                    {emaList[emaImage].grace}
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  setEmaImage((prev) => {
                    const keys = Object.keys(emaList);
                    const currentIndex = keys.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % keys.length;
                    return keys[nextIndex] as EmaImageKey;
                  })
                }
              >
                {'▶'}
              </button>
            </div>
            {/* 絵馬プレビュー */}
            <div className="flex flex-col items-center gap-1 mt-[-30px]">
              <div
                ref={previewWrapperRef}
                className="relative w-[240px] h-[240px] bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(/images/ema/${emaList[emaImage].filename})`,
                }}
              >
                <div
                  ref={previewContainerRef}
                  className="absolute overflow-hidden flex items-center justify-center"
                  style={{
                    top: `${defaultTextRectSize.top}px`,
                    left: `${defaultTextRectSize.left}px`,
                    width: `${defaultTextRectSize.width}px`,
                    height: `${defaultTextRectSize.height}px`,
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
                    className={`${fontList.find((f) => f.key === font)?.className} ${fontSizeMap[fontSize]} text-center break-all whitespace-pre-wrap text-shadow`}
                    style={{
                      top: `${defaultTextRectSize.top}px`,
                      left: `${defaultTextRectSize.left + (defaultTextRectSize.width - textWidth) / 2}px`,
                      width: `${textWidth}px`,
                      color: fontColorList.find((c) => c.key === fontColor)?.value,
                      transform: `translate(${textOffset.x}px, ${textOffset.y}px) rotate(${textRotate}deg)`,
                      touchAction: 'none',
                      lineHeight: lineHeight,
                    }}
                  >
                    {wish || 'ここに表示されます'}
                  </p>
                </div>
                {/* バリデーション用の境界線 */}
                <div
                  className="absolute border border-yellow-400 rounded"
                  style={{
                    top: `${defaultTextRectSize.top}px`,
                    left: `${defaultTextRectSize.left}px`,
                    width: `${defaultTextRectSize.width}px`,
                    height: `${defaultTextRectSize.height}px`,
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

              {/* テキストエリアは下に別で表示 */}
              <textarea
                maxLength={40} // ← これ！
                rows={4}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                className="w-[240px] max-w-md p-2 border rounded bg-black/90"
                placeholder="願い事を入力..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsPosting(false)}
                  className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  閉じる
                </button>
                <button
                  onClick={handlePostWish}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  投稿する
                </button>
                <button
                  onClick={() => setTextOffset({ x: 0, y: 0 })}
                  className="bg-gray-600 text-white text-sm px-2 py-1 rounded hover:bg-gray-700"
                >
                  位置リセット
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EmaSection;
