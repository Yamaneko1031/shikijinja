'use client';

import { useRef, useEffect, useState } from 'react';
import { BackgroundManager, BackgroundManagerHandle } from '@/components/_shared/BackgroundManager';
import { Section, sections } from '@/config/sections';
import DebugLogDialog from '@/components/_shared/DebugLogDialog';
import SectionOverlayText from '@/components/_shared/SctionOverlayText';
import Header from '@/components/Header/Header';
import { User } from '@/types/user';
import { useTelop } from '@/hooks/useTelop';
import { TokuId } from '@/types/toku';
import { getTokuLimit, getTokuMaster } from '@/utils/toku';

const useUser = () => {
  const [user, setUser] = useState<User>({
    id: '1',
    isGuest: true,
    name: 'ゲスト',
    coin: 150,
    tokuUpdatedAt: new Date().toISOString(),
    tokuCounts: {},
  });
  const telop = useTelop();

  // const handleTelop = (telopText: string) => {
  //   telop.showPop(telopText);
  // };

  const resetTokuCounts = () => {
    setUser({ ...user, tokuUpdatedAt: new Date().toISOString(), tokuCounts: {} });
  };

  const checkDate = (date: string) => {
    const lastUpdate = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastUpdate.toDateString() === yesterday.toDateString();
  };

  const handleAddCoin = (coin: number) => {
    console.log('AddCoin', user.coin + coin);
    setUser({ ...user, coin: user.coin + coin });
  };

  const handleIsLimitOver = (tokuId: TokuId): boolean => {
    const limit = getTokuLimit(tokuId);
    if (checkDate(user.tokuUpdatedAt)) {
      resetTokuCounts();
    }
    const currentTokuCount = user.tokuCounts[tokuId]?.count;
    return limit !== undefined && currentTokuCount !== undefined && currentTokuCount >= limit;
  };

  const handleTokuCountUp = (tokuId: TokuId) => {
    if (checkDate(user.tokuUpdatedAt)) {
      resetTokuCounts();
    }
    const setUserData = { ...user };
    const currentCount = (setUserData.tokuCounts[tokuId]?.count || 0) + 1;
    setUserData.tokuCounts[tokuId] = {
      count: currentCount,
    };
    setUserData.tokuUpdatedAt = new Date().toISOString();

    const tokuMaster = getTokuMaster(tokuId);
    if (tokuMaster) {
      setUserData.coin += tokuMaster.point;
      const text = `${tokuMaster.label} [${currentCount}/${tokuMaster.limit}]`;
      telop.showPop(text);
    }
    setUser(setUserData);
  };

  return { user, telop, handleAddCoin, handleIsLimitOver, handleTokuCountUp };
};

export default function App() {
  console.log('App');

  const user = useUser();

  const [state, setState] = useState({ activeId: sections[0].id });
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const bgManagerRef = useRef<BackgroundManagerHandle>(null);
  const currentSectionRef = useRef<Section>(sections[0]);
  const allUrls = sections.map(({ bgUrl }) => bgUrl);
  const activeIndex = sections.findIndex((s) => s.id === state.activeId);

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
    <>
      <Header {...user} />
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
                  handleTokuCountUp={user.handleTokuCountUp}
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
}
