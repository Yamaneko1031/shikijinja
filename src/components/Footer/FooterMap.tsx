import React from 'react';
import { Button } from '../_shared/Button';
import { sections } from '@/config/sections';
interface Props {
  handleCloseMenu: () => void;
  handleScrollToSection: (sectionId: string) => void;
  handleGetCurrentSectionId: () => string | null;
}

const FooterMap: React.FC<Props> = (props) => {
  return (
    <div className="select-none">
      <div className="min-h-[100lvh] flex flex-col items-center justify-center">
        <div className="relative w-[25rem] h-[36rem] flex flex-col gap-2 items-center bg-[url('/images/bg_hude/bg_map.webp')] bg-[length:100%_100%]">
          {sections.map((section) => (
            <div
              key={section.id}
              className="absolute w-40 h-10"
              style={{
                top: `${section.offset.top}rem`,
                left: `${section.offset.left}rem`,
              }}
            >
              <Button
                key={section.id}
                variant="subNatural"
                onClick={() => {
                  props.handleScrollToSection(section.id);
                  props.handleCloseMenu();
                }}
                disabled={section.id === props.handleGetCurrentSectionId()}
              >
                {section.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed w-full bottom-6 m-auto flex flex-row justify-center gap-2">
        {/* 閉じるボタン */}

        <Button variant="negative" size="md" onClick={props.handleCloseMenu} aria-label="閉じる">
          閉じる
        </Button>
      </div>
    </div>
  );
};

export default FooterMap;
