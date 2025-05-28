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
    <footer className="fixed bottom-0 w-full h-[50px] z-1 flex items-center justify-center gap-4">
      <Modal isOpen={isMapOpen}>
        <FooterMap
          handleCloseMenu={() => setIsMapOpen(false)}
          handleScrollToSection={props.handleScrollToSection}
        />
      </Modal>

      <Button
        variant="subNatural"
        size="sm"
        disabled={!props.handleGetPrevSectionId()}
        onClick={() => {
          const prevSectionId = props.handleGetPrevSectionId();
          if (prevSectionId) {
            props.handleScrollToSection(prevSectionId);
          }
        }}
      >
        ＜
      </Button>
      <Button variant="subNatural" size="sm" onClick={() => setIsMapOpen(true)}>
        地図
      </Button>
      <Button
        variant="subNatural"
        size="sm"
        disabled={!props.handleGetNextSectionId()}
        onClick={() => {
          const nextSectionId = props.handleGetNextSectionId();
          if (nextSectionId) {
            props.handleScrollToSection(nextSectionId);
          }
        }}
      >
        ＞
      </Button>
    </footer>
  );
};

export default Footer;
