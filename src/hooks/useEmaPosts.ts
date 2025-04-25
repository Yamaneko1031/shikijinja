'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Post, DisplayPost } from '@/types/ema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const createDisplayPost = (post: Post): DisplayPost => ({
  ...post,
  drawKey: crypto.randomUUID(),
  rotate: (Math.random() * 10 - 5).toFixed(2),
  translateY: (Math.random() * 10 - 5).toFixed(2),
  marginRight: `${-25 - Math.floor(Math.random() * 20)}px`,
});

export const useEmaPosts = () => {
  const { data, error, isLoading } = useSWR('/api/get-ema', fetcher);
  const [displayPosts, setDisplayPosts] = useState<DisplayPost[]>([]);

  useEffect(() => {
    if (data?.success && data.posts) {
      setDisplayPosts(data.posts.map(createDisplayPost));
    }
  }, [data]);

  return { displayPosts, setDisplayPosts, error, isLoading } as const;
};
