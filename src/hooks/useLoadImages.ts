import { useEffect, useRef } from 'react';

export const useLoadImages = () => {
  const loadedImages = useRef<HTMLImageElement[]>([]);
  useEffect(() => {
    setTimeout(() => {
      const images = [
        '/images/bg_hude/bg_kanteisho.webp',
        '/images/bg_hude/bg_shintaku.webp',
        '/images/bg_hude/bg_washi.webp',
        '/images/bg_hude/bg_map.webp',
        '/images/omikuji/hitohira.webp',
        '/images/omikuji/nekobiyori.webp',
        '/images/omikuji/omikuji.webp',
        '/images/illust/illust_iroha.webp',
        '/images/illust/illust_shikineko.webp',
        '/images/illust/illust_tenten.webp',
        '/images/illust/illust_nadeneko.webp',
        '/images/nadeneko/nadeneko_result.webp',
        '/images/nadeneko/nadeneko_action.webp',
      ];
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
        loadedImages.current.push(img);
      });
    }, 1000);
  }, []);

  return loadedImages.current;
};
