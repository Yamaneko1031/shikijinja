import { useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { TokuId } from '@/types/toku';

type RequestItem = { uri: string; tokuId: TokuId; count: number };

export const useRequestQueue = () => {
  const queueRef = useRef<RequestItem[]>([]);
  const isProcessingRef = useRef(false);

  const mergeOrPush = (req: RequestItem) => {
    // 同じリクエストがあればキューに追加ではなくcountを加算
    const existingIndex = queueRef.current.findIndex(
      (item) => item.tokuId === req.tokuId && item.uri === req.uri
    );
    if (existingIndex !== -1) {
      queueRef.current[existingIndex].count += req.count;
    } else {
      queueRef.current.push(req);
    }
  };

  const pushRequest = useCallback((req: RequestItem) => {
    mergeOrPush(req);
  }, []);

  const processQueue = async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;

    const req = queueRef.current.shift();
    if (!req) return;

    isProcessingRef.current = true;

    try {
      await apiFetch(req.uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokuId: req.tokuId, count: req.count }),
      });
    } catch {
      // 通信失敗したらキューに戻す
      queueRef.current.unshift(req);
    } finally {
      isProcessingRef.current = false;
    }
  };

  useEffect(() => {
    const interval = setInterval(processQueue, 500);
    return () => clearInterval(interval);
  }, []);

  return { pushRequest };
};
