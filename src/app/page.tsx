'use client';

import { useRef, useEffect, useState } from 'react';
import { BackgroundManager, BackgroundManagerHandle } from '../components/BackgroundManager';
import { Section, sections } from '../config/sections';
import { getCssDuration } from '../utils/getCssDuration';
import DebugLogDialog from '@/components/DebugLogDialog';

export default function App() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const bgManagerRef = useRef<BackgroundManagerHandle>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allUrls = sections.map(({ bgUrl }) => bgUrl);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const currentSectionRef = useRef<Section>(sections[0]);

  useEffect(() => {
    const checkScroll = () => {
      const centerY = window.innerHeight / 2;

      const nextSection = sections.find(({ id }) => {
        const el = sectionRefs.current[id];
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= centerY && rect.bottom >= centerY;
      });

      if (nextSection && bgManagerRef.current) {
        if (
          currentSectionRef.current.id != nextSection.id &&
          bgManagerRef.current.isReadyForTransition()
        ) {
          const currentSctionIndex = sections.findIndex(
            (s) => s.id === currentSectionRef.current.id
          );
          const nextSctionIndex = sections.findIndex((s) => s.id === nextSection.id);

          if (nextSctionIndex > currentSctionIndex && nextSection.name !== '') {
            if (overlayTimerRef.current) {
              clearTimeout(overlayTimerRef.current);
              setOverlayText(null);
              setIsOverlayActive(false);
            }

            requestAnimationFrame(() => {
              setOverlayText(currentSectionRef.current.name);
              setIsOverlayActive(true);
              const sectionOverlayFadeDuration = getCssDuration('--section-overlay-fade-duration');
              overlayTimerRef.current = setTimeout(() => {
                setOverlayText(null);
                overlayTimerRef.current = null;
              }, sectionOverlayFadeDuration);
            });
          } else {
            setOverlayText(null);
            setIsOverlayActive(false);
          }
          bgManagerRef.current.setUrl(nextSection.bgUrl, nextSection.scrollEffect);
          currentSectionRef.current = nextSection;
        }

        const el = sectionRefs.current[currentSectionRef.current.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          const scrollRatio = Math.min(
            Math.max((window.innerHeight / 2 - rect.top) / rect.height, 0),
            1
          );
          bgManagerRef.current.setScrollRatio(scrollRatio);
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
        allUrls={allUrls}
        scrollEffect={sections[0].scrollEffect}
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
      <DebugLogDialog />
    </main>
  );
}
