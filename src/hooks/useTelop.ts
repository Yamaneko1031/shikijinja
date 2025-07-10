'use client';

import { useState, useCallback, useRef } from 'react';

export const useTelop = () => {
  const [currentText, setCurrentText] = useState<string | null>(null);
  const currentId = useRef<string | null>(null);

  // ポップアップを追加
  const showPop = useCallback((pop: string) => {
    setCurrentText(pop);
    currentId.current = 'id_' + Date.now().toString();
    // setQueue((q) => [...q, pop]);
  }, []);

  const clear = useCallback(() => {
    setCurrentText(null);
    currentId.current = null;
  }, []);

  return {
    currentText,
    currentId,
    showPop,
    clear,
  } as const;
};
