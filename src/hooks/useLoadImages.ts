import { useEffect, useRef } from 'react';

export const useLoadImages = (isActive: boolean, images: string[]) => {
  const loadedImages = useRef<HTMLImageElement[]>([]);
  useEffect(() => {
    if (!isActive) return;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      loadedImages.current.push(img);
    });
  }, [images, isActive]);

  return loadedImages.current;
};
