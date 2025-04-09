'use client';

import { useRef, useEffect } from 'react';
import { BackgroundManager, BackgroundManagerHandle } from './components/BackgroundManager';
import EmaSection from './components/EmaSection';
import OmamoriSection from './components/OmamoriSection';
import OmikujiSection from './components/OmikujiSection';
import TopSection from './components/TopSection';

// セクション毎の識別id（背景画像はidから判定）、背景画像の中心位置、コンポーネント
const sections = [
  {
    id: 'top',
    bgCenterPosition: 'center center',
    component: TopSection,
  },
  {
    id: 'sando',
    bgCenterPosition: 'center center',
    component: null,
  },
  {
    id: 'ema',
    bgCenterPosition: '40% center',
    component: EmaSection,
  },
  {
    id: 'omamori',
    bgCenterPosition: '35% center',
    component: OmamoriSection,
  },
  {
    id: 'omikuji',
    bgCenterPosition: '35% center',
    component: OmikujiSection,
  },
];

export default function App() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const bgManagerRef = useRef<BackgroundManagerHandle>(null);

  useEffect(() => {
    let lastSectionId = '';

    const checkScroll = () => {
      // スクロール位置から今いるセクションを取得
      const scrollY = window.scrollY;
      const section = sections.find(({ id }) => {
        const el = sectionRefs.current[id];
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + el.offsetHeight;
        const offset = 350;
        return scrollY >= top - offset && scrollY < bottom - offset;
      });

      // セクションが切り替わっていたら背景切り替え
      if (section && bgManagerRef.current) {
        if (section.id !== lastSectionId) {
          const url = `/images/bg_${section.id}.webp`;
          // 背景切り替えが可能なら切り替え
          if (bgManagerRef.current.isReadyForTransition()) {
            bgManagerRef.current.setUrl(url, section.bgCenterPosition);
            lastSectionId = section.id;
          }
        }
      }
      // フレームの更新でもスクロール位置の判定による判定行う
      requestAnimationFrame(checkScroll);
    };

    requestAnimationFrame(checkScroll);
  }, []);

  return (
    <main className="relative z-10">
      <BackgroundManager
        ref={bgManagerRef}
        initialUrl={`/images/bg_${sections[0].id}.webp`}
        initialBgPosition={sections[0].bgCenterPosition}
      />

      {sections.map(({ id, component: SectionComponent }) => (
        <section
          key={id}
          ref={(el) => {
            sectionRefs.current[id] = el;
          }}
          className="min-h-screen flex items-center justify-center"
        >
          {SectionComponent && <SectionComponent />}
        </section>
      ))}
    </main>
  );
}
