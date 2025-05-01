'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/lib/api';
import { DisplayPost, EmaPostResponse } from '@/types/ema';

const fetcher = (url: string) => apiFetch<EmaPostResponse[]>(url);

export const createDisplayPost = (post: EmaPostResponse): DisplayPost => {
  const displayPost: DisplayPost = {
    texts: post.texts,
    reply: post.reply,
    emaImage: post.emaImage,
    drawKey: crypto.randomUUID(),
    rotate: (Math.random() * 10 - 5).toFixed(2),
    translateY: (Math.random() * 10 - 5).toFixed(2),
    marginRight: `${-25 - Math.floor(Math.random() * 20)}px`,
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
