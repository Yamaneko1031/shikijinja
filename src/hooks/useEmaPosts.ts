'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';
import { DisplayPost, EmaPostResponse } from '@/types/ema';
import { remToPx } from '@/lib/size';

const fetcher = (url: string) => apiFetch<EmaPostResponse[]>(url);

export const createDisplayPost = (post: EmaPostResponse): DisplayPost => {
  // pxの方が都合がいいのでpxに変換
  const translateY = remToPx(Math.random() * 0.5).toFixed(2);
  const marginRight = Math.floor(remToPx(-1.5 - Math.random())).toString() + 'px';

  const displayPost: DisplayPost = {
    texts: post.texts,
    reply: post.reply,
    decision: post.decision,
    reasons: post.reasons,
    emaImage: post.emaImage,
    drawKey: crypto.randomUUID(),
    rotate: (Math.random() * 10 - 5).toFixed(2),
    translateY: translateY,
    marginRight: marginRight,
  };
  return displayPost;
};

export const useEmaPosts = () => {
  const { data, error, isLoading } = useSWR<EmaPostResponse[]>('/api/ema', fetcher);
  const [displayPosts, setDisplayPosts] = useState<DisplayPost[]>([]);
  useEffect(() => {
    if (data) {
      setDisplayPosts(data.map(createDisplayPost));
    }
  }, [data]);

  return { displayPosts, setDisplayPosts, error, isLoading } as const;
};
