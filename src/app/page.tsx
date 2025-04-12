'use client';

import { useRef, useEffect } from 'react';
import { BackgroundManager, BackgroundManagerHandle } from '../components/BackgroundManager';
import { sections } from '../config/sections';

export default function App() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const bgManagerRef = useRef<BackgroundManagerHandle>(null);
  const allUrls = sections.map(({ bgUrl }) => bgUrl);

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
          // 背景切り替えが可能なら切り替え
          if (bgManagerRef.current.isReadyForTransition()) {
            bgManagerRef.current.setUrl(section.bgUrl, section.bgCenterPosition);
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
        initialUrl={sections[0].bgUrl}
        initialBgPosition={sections[0].bgCenterPosition}
        allUrls={allUrls}
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
