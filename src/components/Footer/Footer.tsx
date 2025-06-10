import React, { useState } from 'react';
import { User } from '@/types/user';
import Modal from '../_shared/Modal';
import { Button } from '../_shared/Button';
import FooterMap from './FooterMap';

interface FooterProps {
  user: User;
  handleGetNextSectionId: () => string | null;
  handleGetPrevSectionId: () => string | null;
  handleScrollToSection: (sectionId: string) => void;
}

const Footer: React.FC<FooterProps> = (props) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <footer className="fixed bottom-2 w-full h-[3.125rem] z-60 flex items-center justify-center gap-4 overscroll-contain">
      <Modal isOpen={isMapOpen}>
        <FooterMap
          handleCloseMenu={() => setIsMapOpen(false)}
          handleScrollToSection={props.handleScrollToSection}
        />
      </Modal>

      <Button variant="subNatural" size="md" onClick={() => setIsMapOpen(true)}>
        全体図
      </Button>
      <Button
        variant="subNatural"
        size="md"
        disabled={!props.handleGetPrevSectionId()}
        onClick={() => {
          const prevSectionId = props.handleGetPrevSectionId();
          if (prevSectionId) {
            props.handleScrollToSection(prevSectionId);
          }
        }}
      >
        戻る
      </Button>
      <Button
        variant="subNatural"
        size="md"
        disabled={!props.handleGetNextSectionId()}
        onClick={() => {
          const nextSectionId = props.handleGetNextSectionId();
          if (nextSectionId) {
            props.handleScrollToSection(nextSectionId);
          }
        }}
      >
        進む
      </Button>
    </footer>
  );
};

export default Footer;
