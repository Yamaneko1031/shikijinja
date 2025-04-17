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
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [overlayText, setOverlayText] = useState<string | null>(null);

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

          activeSectionIndexRef.current = sectionIndex;

          const shouldShowOverlay = sectionScrollDown && section.name !== '';

          if (shouldShowOverlay) {
            // キャンセル前のタイマー
            if (overlayTimerRef.current) {
              clearTimeout(overlayTimerRef.current);
              setOverlayText(null);
              setIsOverlayActive(false);
            }

            requestAnimationFrame(() => {
              setOverlayText(section.name);
              setIsOverlayActive(true);
              const sectionOverlayFadeDuration = getCssDuration('--section-overlay-fade-duration');
              overlayTimerRef.current = setTimeout(() => {
                setOverlayText(null);
                overlayTimerRef.current = null;
                console.log('overlayTimerRef.current');
              }, sectionOverlayFadeDuration);
            });
          } else {
            setOverlayText(null);
            setIsOverlayActive(false);
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
        >
          {SectionComponent && <SectionComponent />}
        </section>
      ))}

      {overlayText && (
        <div
          className={`fixed inset-0 z-50 flex justify-center bg-white/10 pointer-events-none ${
            isOverlayActive ? 'animate-section-overlay-fade' : ''
          }`}
          style={{ transform: 'translateZ(0.01px)', height: '100lvh' }}
        >
          <h2 className="absolute top-2/5 text-white text-4xl font-bold">{overlayText}</h2>
        </div>
      )}
    </main>
  );
}
