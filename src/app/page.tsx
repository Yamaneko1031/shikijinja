'use client';

import { useRef, useEffect, useState } from 'react';
import { BackgroundManager, BackgroundManagerHandle } from '@/components/shared/BackgroundManager';
import { Section, sections } from '@/config/sections';
import DebugLogDialog from '@/components/shared/DebugLogDialog';
import SectionOverlayText from '@/components/shared/SctionOverlayText';
import { DialogCountContext } from '@/contexts/DialogCountContext';

export default function App() {
  console.log('App');
  const [state, setState] = useState({ activeId: sections[0].id });
  const dialogState = useState<number>(0);
  const [dialogCount] = dialogState;
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const bgManagerRef = useRef<BackgroundManagerHandle>(null);
  const currentSectionRef = useRef<Section>(sections[0]);
  const allUrls = sections.map(({ bgUrl }) => bgUrl);
  const activeIndex = sections.findIndex((s) => s.id === state.activeId);
  const dialogCountRef = useRef(dialogCount);

  useEffect(() => {
    dialogCountRef.current = dialogCount;
  }, [dialogCount]);

  useEffect(() => {
    const checkScroll = () => {
      if (dialogCountRef.current > 0) {
        requestAnimationFrame(checkScroll);
        return;
      }

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
          bgManagerRef.current.setUrl(nextSection.bgUrl, nextSection.scrollEffect);
          currentSectionRef.current = nextSection;
          setState({ activeId: nextSection.id });
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
    <DialogCountContext.Provider value={dialogState}>
      <main className="relative z-10 overflow-x-hidden">
        <BackgroundManager
          ref={bgManagerRef}
          initialUrl={sections[0].bgUrl}
          allUrls={allUrls}
          scrollEffect={sections[0].scrollEffect}
        />

        {sections.map(({ id, component: SectionComponent }, idx) => {
          const isActive = id === state.activeId;
          const isNeighbor = Math.abs(idx - activeIndex) === 1;
          return (
            <section
              key={id}
              ref={(el) => {
                sectionRefs.current[id] = el;
              }}
              className={`${sections[idx].sectionClass}`}
            >
              {(isActive || isNeighbor) && SectionComponent && (
                <SectionComponent isActive={isActive} isNeighbor={isNeighbor} />
              )}
            </section>
          );
        })}

        <SectionOverlayText text={currentSectionRef.current.name} />

        <DebugLogDialog />

        <div className="overlay-gradient" />
      </main>
    </DialogCountContext.Provider>
  );
}
