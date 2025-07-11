'use client';

import { useCallback } from 'react';

export const useGtag = () => {
  const event = useCallback(
    ({
      action,
      category,
      label,
      value,
    }: {
      action: string;
      category: string;
      label?: string;
      value?: number;
    }) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
    },
    []
  );

  return { event };
};
