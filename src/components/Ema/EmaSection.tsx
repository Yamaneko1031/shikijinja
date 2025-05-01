'use client';
import React, { useRef, useState } from 'react';
import { EmaPost, DisplayPost, EmaImageKey, EmaPostResponse } from '@/types/ema';
import { getCssDuration } from '@/utils/getCssDuration';
import TextReveal from '@/components/shared/TextReveal';
import DeitySelector from './EmaForm/DeitySelector';
import EmaForm from './EmaForm/EmaForm';
import EmaCarousel from './EmaCarousel';
import { useEmaPosts, createDisplayPost } from '@/hooks/useEmaPosts';
import { useAutoCarouselScroll } from '@/hooks/useAutoCarouselScroll';
import { Button } from '../shared/Button';
import Modal from '../shared/Modal';
import { apiFetch } from '@/lib/api';

type Props = {
  isActive: boolean;
  isNeighbor: boolean;
};

const EmaSection = ({ isActive, isNeighbor }: Props) => {
  console.log('EmaSection', isActive, isNeighbor);
  /* ----------------- data ----------------- */
  const {
    displayPosts,
    setDisplayPosts,
    error: emaGetError,
    isLoading: isEmaLoading,
  } = useEmaPosts();

  /* ----------------- refs ----------------- */
  const carouselRef = useRef<HTMLDivElement>(null);

  /* ----------------- auto scroll hook ----- */
  useAutoCarouselScroll(carouselRef, displayPosts, setDisplayPosts, isActive);

  /* ----------------- local UI state ------- */
  const [selectedDeity, setSelectedDeity] = useState<EmaImageKey | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // const [showPostedMessage, setShowPostedMessage] = useState(false);

  /* ----------------- helpers -------------- */
  const scrollToEmaSection = () => {
    if (!carouselRef.current) return;
    const offsetTop =
      carouselRef.current.getBoundingClientRect().top +
      window.scrollY +
      carouselRef.current.offsetHeight / 2;
    window.scrollTo({ top: offsetTop - window.innerHeight / 2, behavior: 'smooth' });
  };

  const getInsertIndex = () => {
    if (!carouselRef.current) return displayPosts.length;
    const { scrollLeft, offsetWidth, children } = carouselRef.current;
    const center = scrollLeft + offsetWidth / 2;
    let total = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      total += child.offsetWidth + parseFloat(getComputedStyle(child).marginRight);
      if (total > center) return i;
    }
    return displayPosts.length;
  };

  /* ----------------- submit -------------- */
  const handlePostWish = async (post: EmaPost) => {
    // モーダルは閉じるけど、ローディングは開始
    setIsPosting(false);
    setIsSaving(true);

    // スクロールは閉じたあとに
    requestAnimationFrame(() => {
      scrollToEmaSection();
    });

    try {
      const data = await apiFetch<EmaPostResponse>('/api/ema', {
        method: 'POST',
        body: JSON.stringify(post),
      });

      const insertIndex = getInsertIndex();
      const newDisplayPost: DisplayPost = {
        ...createDisplayPost(data),
        highlighted: true,
      };

      setDisplayPosts((prev) => {
        const next = [...prev];
        next.splice(insertIndex, 0, newDisplayPost);
        return next;
      });

      // ハイライト解除のタイマー
      setTimeout(() => {
        setDisplayPosts((prev) =>
          prev.map((p) => (p.drawKey === newDisplayPost.drawKey ? { ...p, highlighted: false } : p))
        );
      }, getCssDuration('--ema-insert-duration'));

      // 投稿完了メッセージ
      // setShowPostedMessage(true);
      // setTimeout(
      //   () => setShowPostedMessage(false),
      //   getCssDuration('--ema-animate-fade-in-out-duration')
      // );
    } catch (err) {
      console.error('保存に失敗しました:', err);
      alert('投稿に失敗しました。再度お試しください。');
    } finally {
      // いずれにせよローディングをオフ
      setIsSaving(false);
    }
  };

  /* ----------------- render -------------- */
  return (
    <>
      <div className="relative top-[400px] w-full max-w-3xl mx-auto p-4 bg-black/50 bg-opacity-80 rounded shadow-lg">
        <TextReveal text="みんなの願い事" delayPerChar={0.1} className="text-2xl font-bold" />

        {/* {showPostedMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-100 pointer-events-none">
            <div className="bg-black/60 text-white text-lg px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
              絵馬を投稿しました！
            </div>
          </div>
        )} */}

        {/* ------------------ Carousel ------------------ */}
        <EmaCarousel
          ref={carouselRef}
          posts={displayPosts}
          isLoading={isEmaLoading}
          error={emaGetError}
          backgroundImageUrl="url(/images/ema/bg_ema_view.webp)"
        />

        {/* ------------------ CTA ---------------------- */}
        <Button
          variant="positive"
          onClick={() => {
            setSelectedDeity(null);
            setIsPosting(true);
          }}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 mb-4"
        >
          絵馬に願いを書く
        </Button>

        {/* 画面全体にスピナーオーバーレイ */}
        {isSaving && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="loader text-shadow-2">絵馬を投稿中...</div>
          </div>
        )}

        {/* ------------------ modal -------------------- */}
        <Modal isOpen={isPosting}>
          {selectedDeity === null ? (
            <DeitySelector
              onSelect={(key) => {
                setSelectedDeity(key);
                setIsPosting(true);
              }}
              onCancel={() => {
                setSelectedDeity(null);
                setIsPosting(false);
              }}
            />
          ) : (
            <EmaForm
              initialDeityKey={selectedDeity}
              onSubmit={handlePostWish}
              onClose={() => setIsPosting(false)}
            />
          )}
        </Modal>
      </div>
    </>
  );
};

export default React.memo(EmaSection);
