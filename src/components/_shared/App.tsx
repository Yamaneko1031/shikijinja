'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { BackgroundManager, BackgroundManagerHandle } from '@/components/_shared/BackgroundManager';
import DebugLogDialog from '@/components/_shared/DebugLogDialog';
import SectionOverlayText from '@/components/_shared/SctionOverlayText';
import { useUser } from '@/hooks/useUser';
import { User } from '@/types/user';
import { SectionData } from '@/types/section';
import { sections } from '@/config/sections';
import Header from '../Header/Header';
import { apiFetch } from '@/lib/api';
import { useDebugLog } from '@/hooks/useDebugLog';
import { useScroll } from 'framer-motion';
import Footer from '../Footer/Footer';

interface Props {
  initialUser: User;
  guestSessionId: string;
  serverTime: string;
  memo: string;
}

const App = (props: Props) => {
  console.log('App');
  const { addLog } = useDebugLog();

  const user = useUser(props.initialUser);
  const [state, setState] = useState({ activeId: sections[0].id });
  const userRef = useRef(user);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const bgManagerRef = useRef<BackgroundManagerHandle>(null);
  const currentSectionRef = useRef<SectionData>(sections[0]);
  const allUrls = sections.map(({ bgUrl }) => bgUrl);
  const activeIndex = sections.findIndex((s) => s.id === state.activeId);
  const { scrollY } = useScroll({ container: containerRef });

  const getNextSectionId = useCallback((): string | null => {
    console.log('getNextSectionId');
    const currentIndex = sections.findIndex((s) => s.id === state.activeId);
    if (currentIndex === -1 || currentIndex === sections.length - 1) {
      return null;
    }
    return sections[currentIndex + 1].id;
  }, [state.activeId]);

  const getPrevSectionId = useCallback((): string | null => {
    console.log('getPrevSectionId');
    const currentIndex = sections.findIndex((s) => s.id === state.activeId);
    if (currentIndex <= 0) {
      return null;
    }
    return sections[currentIndex - 1].id;
  }, [state.activeId]);

  const scrollToSection = useCallback((sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (section && containerRef.current) {
      const jumpOffset = sections.find((s) => s.id === sectionId)?.jumpOffset;
      containerRef.current.scrollTo({
        top: section.offsetTop - window.innerHeight / 2 + (jumpOffset || 0),
        behavior: 'smooth',
      });
    }
  }, []);

  // Appコンポーネントで参照するユーザー情報の更新
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // セクション切り替え時のコールバック
  const onSectionChange = useCallback((prevSection: SectionData, nextSection: SectionData) => {
    console.log('セクション切り替え:', prevSection.id, '→', nextSection.id);
    if (prevSection.id === 'top' && nextSection.id !== 'top') {
      userRef.current.handleTokuGet('torii');
    }
  }, []);

  // 初期処理
  useEffect(() => {
    addLog(`user init: ${props.memo}`);
    // サーバー時刻情報更新
    localStorage.setItem(
      'serverTimeInfo',
      JSON.stringify({
        serverTime: props.serverTime,
        clientTime: Date.now(),
      })
    );

    // クッキーの更新
    apiFetch<{ serverTime: string }>('/api/init', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestSessionId: props.guestSessionId }),
    });
  }, [props.guestSessionId, props.serverTime, props.memo, addLog]);

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
          // セクション切り替え時のコールバックを呼び出し
          onSectionChange(currentSectionRef.current, nextSection);

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
  }, [onSectionChange]);

  return (
    <>
      <main
        className="fixed inset-0 overflow-scroll overscroll-contain overflow-x-hidden z-0"
        ref={containerRef}
      >
        <Header user={user.user} handleAddCoin={user.handleAddCoin} />
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
                  scrollY={scrollY}
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

        <SectionOverlayText text={currentSectionRef.current.overlayText} />

        <DebugLogDialog handleTokuGet={user.handleTokuGet} handleTokuUsed={user.handleTokuUsed} />

        <div className="overlay-gradient" />
        <Footer
          user={user.user}
          handleGetNextSectionId={getNextSectionId}
          handleGetPrevSectionId={getPrevSectionId}
          handleScrollToSection={scrollToSection}
        />
      </main>
    </>
  );
};

export default App;
