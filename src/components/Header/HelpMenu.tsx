'use client';

import React, { useState } from 'react';
import Modal from '../_shared/Modal';
import HelpIntroduction from './HelpIntroduction';
import HelpToku from './HelpToku';
import HelpPolicy from './HelpPolicy';
import { MenuButton } from '../_shared/MenuButton';

const HelpMenu: React.FC = () => {
  const [isIntroductionOpen, setIsIntroductionOpen] = useState(false);
  const [isTokuOpen, setIsTokuOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  return (
    <div className="min-w-[18rem] text-lg text-black flex flex-col items-start p-2">
      <MenuButton onClick={() => setIsIntroductionOpen(true)}>式岐神社について</MenuButton>
      <MenuButton onClick={() => setIsTokuOpen(true)}>徳コインについて</MenuButton>
      <MenuButton onClick={() => setIsPolicyOpen(true)}>プライバシーポリシー</MenuButton>

      <Modal
        isOpen={isIntroductionOpen}
        className="absolute max-w-2xl w-[80vw] min-w-[20rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border-2 border-gray-200 overscroll-contain"
      >
        <HelpIntroduction onClose={() => setIsIntroductionOpen(false)} />
      </Modal>
      <Modal
        isOpen={isTokuOpen}
        className="absolute max-w-2xl w-[80vw] min-w-[20rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border-2 border-gray-200 overscroll-contain"
      >
        <HelpToku onClose={() => setIsTokuOpen(false)} />
      </Modal>
      <Modal
        isOpen={isPolicyOpen}
        className="absolute max-w-2xl w-[80vw] min-w-[20rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border-2 border-gray-200 overscroll-contain"
      >
        <HelpPolicy onClose={() => setIsPolicyOpen(false)} />
      </Modal>
    </div>
  );
};

export default HelpMenu;
