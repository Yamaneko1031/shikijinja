'use client';

import { useRef, useEffect, useState } from 'react';
import { BackgroundManager, BackgroundManagerHandle } from '@/components/_shared/BackgroundManager';
import { Section, sections } from '@/config/sections';
import DebugLogDialog from '@/components/_shared/DebugLogDialog';
import SectionOverlayText from '@/components/_shared/SctionOverlayText';
import { useUser } from '@/hooks/useUser';
import { User } from '@/types/user';
import Header from '../Header/Header';
import { apiFetch } from '@/lib/api';
import { useDebugLog } from '@/hooks/useDebugLog';

interface Props {
  initialUser: User;
  memo: string;
}

const App = (props: Props) => {
  console.log('App');
  const { addLog } = useDebugLog();

  const user = useUser(props.initialUser);
  const [state, setState] = useState({ activeId: sections[0].id });
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const bgManagerRef = useRef<BackgroundManagerHandle>(null);
  const currentSectionRef = useRef<Section>(sections[0]);
  const allUrls = sections.map(({ bgUrl }) => bgUrl);
  const activeIndex = sections.findIndex((s) => s.id === state.activeId);

  // 初回のユーザーとクッキーに保存されたユーザーのidが違うケースがあるので必ず更新する
  useEffect(() => {
    addLog(`user init: ${props.memo}`);
    if (!props.initialUser.id) return;
    apiFetch('/api/user/init', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: props.initialUser.id }),
    });
  }, [props.initialUser.id, props.memo, addLog]);

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
          if (currentSectionRef.current.id === 'top' && nextSection.id !== 'top') {
            user.handleTokuGet('torii');
          }

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
  }, [user]);

  return (
    <>
      <Header user={user.user} handleAddCoin={user.handleAddCoin} />
      <main className="relative overflow-x-hidden z-0">
        <BackgroundManager
          ref={bgManagerRef}
          initialUrl={sections[0].bgUrl}
          allUrls={allUrls}
          scrollEffect={sections[0].scrollEffect}
        />

        {/* テロップ表示 */}
        {user.telop.currentText && (
          <div
            key={user.telop.currentId.current}
            className="fixed right-6 top-16 bg-black backdrop-blur-sm rounded-sm p-2 text-xl font-bold animate-telop-slide-in-out z-60"
          >
            {user.telop.currentText}
          </div>
        )}

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
                <SectionComponent
                  isActive={isActive}
                  isNeighbor={isNeighbor}
                  user={user.user}
                  handleAddCoin={user.handleAddCoin}
                  handleIsLimitOver={user.handleIsLimitOver}
                  handleTokuGet={user.handleTokuGet}
                  handleTokuUsed={user.handleTokuUsed}
                  handleIsEnoughCoin={user.handleIsEnoughCoin}
                />
              )}
            </section>
          );
        })}

        <SectionOverlayText text={currentSectionRef.current.name} />

        <DebugLogDialog />

        <div className="overlay-gradient" />
      </main>
    </>
  );
};

export default App;
