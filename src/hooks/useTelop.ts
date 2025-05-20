'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export const useTelop = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const currentId = useRef<string | null>(null);

  // ポップアップを追加
  const showPop = useCallback((pop: string) => {
    setQueue((q) => [...q, pop]);
  }, []);

  // キュー制御（1つだけ表示）
  useEffect(() => {
    if (!currentText && queue.length > 0) {
      setCurrentText(queue[0]);
      setQueue((q) => q.slice(1));
      currentId.current = 'id_' + Date.now().toString();
    }
  }, [queue, currentText]);

  useEffect(() => {
    if (currentText) {
      //   console.log('telop.current', currentText);
      const timer = setTimeout(() => setCurrentText(null), 3000); // 2.2秒表示
      return () => clearTimeout(timer);
    }
  }, [currentText]);

  return {
    currentText,
    currentId,
    showPop,
  } as const;
};
