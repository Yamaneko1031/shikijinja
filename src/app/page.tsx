'use client';

import { useRef, useEffect, useState } from 'react';
import { BackgroundManager, BackgroundManagerHandle } from '../components/BackgroundManager';
import { sections } from '../config/sections';
import { getCssDuration } from '../utils/getCssDuration';
export default function App() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const bgManagerRef = useRef<BackgroundManagerHandle>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSectionIndexRef = useRef(0);
  const allUrls = sections.map(({ bgUrl }) => bgUrl);
  const [showSectionOverlay, setShowSectionOverlay] = useState(false);
  const [visibleSectionId, setVisibleSectionId] = useState<string | null>(null);
  const [showSectionContent, setShowSectionContent] = useState(false);

  useEffect(() => {
    let lastSectionId = '';

    const checkScroll = () => {
      const centerY = window.innerHeight / 2;
      const sectionIndex = sections.findIndex(({ id }) => {
        const el = sectionRefs.current[id];
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= centerY && rect.bottom >= centerY;
      });

      const section = sectionIndex !== -1 ? sections[sectionIndex] : null;
      const sectionScrollDown = activeSectionIndexRef.current < sectionIndex;

      if (section && bgManagerRef.current) {
        if (section.id !== lastSectionId && bgManagerRef.current.isReadyForTransition()) {
          bgManagerRef.current.setUrl(section.bgUrl, section.bgCenterPosition);
          lastSectionId = section.id;

          setVisibleSectionId(section.id);
          activeSectionIndexRef.current = sectionIndex;

          if (section.name == '') {
            setShowSectionOverlay(false);
            setShowSectionContent(true);
          } else if (sectionScrollDown) {
            // オーバーレイ表示
            setShowSectionOverlay(true);
            setShowSectionContent(false);

            // 前のタイマーをキャンセル
            if (overlayTimerRef.current) {
              clearTimeout(overlayTimerRef.current);
            }

            const sectionOverlayFadeDuration = getCssDuration('--section-overlay-fade-duration');
            // 新しいタイマーを設定
            overlayTimerRef.current = setTimeout(() => {
              setShowSectionOverlay(false);
              overlayTimerRef.current = null;
            }, sectionOverlayFadeDuration);

            setTimeout(() => {
              setShowSectionContent(true);
            }, 200);
          } else {
            setShowSectionOverlay(false);
            setShowSectionContent(true);
          }
        }
      }

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
          className={`min-h-screen flex items-center justify-center transition-opacity duration-700 ${
            visibleSectionId === id && showSectionContent
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {SectionComponent && <SectionComponent />}
        </section>
      ))}
      {showSectionOverlay && visibleSectionId && (
        <div
          key={`${visibleSectionId}`}
          className="fixed inset-0 z-50 flex justify-center bg-white/10 animate-section-overlay-fade"
        >
          <h2 className="absolute top-2/5 text-white text-4xl font-bold">
            {sections.find((s) => s.id === visibleSectionId)?.name}
          </h2>
        </div>
      )}
    </main>
  );
}
