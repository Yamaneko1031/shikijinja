'use client';
import React, { useRef, useState } from 'react';
import { EmaPost, DisplayPost, EmaImageKey, EmaPostResponse } from '@/types/ema';
import { getCssDuration } from '@/utils/getCssDuration';
import TextReveal from '@/components/_shared/TextReveal';
import DeitySelector from './EmaForm/DeitySelector';
import EmaForm from './EmaForm/EmaForm';
import EmaCarousel from './EmaCarousel';
import { useEmaPosts, createDisplayPost } from '@/hooks/useEmaPosts';
import { Button } from '../_shared/Button';
import Modal from '../_shared/Modal';
import { apiFetch } from '@/lib/api';
import Image from 'next/image';
import { User } from '@/types/user';
import { TokuId } from '@/types/toku';

type Props = {
  isActive: boolean;
  isNeighbor: boolean;
  user: User;
  handleAddCoin: (coin: number) => void;
  handleIsLimitOver: (tokuId: TokuId) => boolean;
  handleTokuCountUp: (tokuId: TokuId) => void;
};

const EmaSection = (props: Props) => {
  console.log('EmaSection', props.isActive, props.isNeighbor);
  /* ----------------- data ----------------- */
  const {
    displayPosts,
    setDisplayPosts,
    error: emaGetError,
    isLoading: isEmaLoading,
  } = useEmaPosts();

  /* ----------------- refs ----------------- */
  const carouselRef = useRef<HTMLDivElement>(null);

  /* ----------------- local UI state ------- */
  const [selectedDeity, setSelectedDeity] = useState<EmaImageKey | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    } catch (err) {
      console.error('保存に失敗しました:', err);
      alert('投稿に失敗しました。再度お試しください。');
    } finally {
      // いずれにせよローディングをオフ
      setIsSaving(false);

      if (props.handleIsLimitOver('ema') === false) {
        props.handleTokuCountUp('ema');
      }
    }
  };

  /* ----------------- render -------------- */
  return (
    <>
      <div className="relative top-[600px] max-w-2xl min-w-[320px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-2">
        <div className="relative w-full bg-black/50 rounded-lg flex flex-col gap-2 pt-4 pl-4 pb-4 pr-[200px]">
          <div className="">
            <TextReveal
              text="願い事を書いていくにゃ！"
              delayPerChar={0.1}
              className="text-xl md:text-2xl font-bold"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[200px]">
            <Image src="/images/ema/neko_ema.webp" alt="neko_ema" width={400} height={300} />
          </div>
        </div>

        <div className="relative w-full">
          {/* ------------------ Carousel ------------------ */}
          <EmaCarousel
            ref={carouselRef}
            displayPosts={displayPosts}
            isLoading={isEmaLoading}
            error={emaGetError}
            backgroundImageUrl="url(/images/ema/bg_ema_view.webp)"
            setDisplayPosts={setDisplayPosts}
            isActive={props.isActive}
          />

          {/* 画面全体にスピナーオーバーレイ */}
          {isSaving && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="loader text-shadow-2">絵馬を投稿中...</div>
            </div>
          )}
        </div>

        <Button
          variant="positive"
          size="lg"
          onClick={() => {
            setSelectedDeity(null);
            setIsPosting(true);
          }}
          className="w-full max-w-md"
        >
          絵馬に願いを書く
        </Button>
      </div>
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
    </>
  );
};

export default React.memo(EmaSection);
