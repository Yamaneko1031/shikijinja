'use client';

import React, { useState } from 'react';
import { Button } from '../_shared/Button';
import Modal from '../_shared/Modal';
import HelpIntroduction from './HelpIntroduction';
import HelpToku from './HelpToku';
import HelpPolicy from './HelpPolicy';
import Modal2 from '../_shared/Modal2';

interface Props {
  handleCloseMenu: () => void;
}

const HelpMenu: React.FC<Props> = (props) => {
  const [isIntroductionOpen, setIsIntroductionOpen] = useState(false);
  const [isTokuOpen, setIsTokuOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2 items-center">
      <Button variant="subNatural" onClick={() => setIsIntroductionOpen(true)}>
        式岐神社について
      </Button>
      <Button variant="subNatural" onClick={() => setIsTokuOpen(true)}>
        徳コインについて
      </Button>
      <Button variant="subNatural" onClick={() => setIsPolicyOpen(true)}>
        プライバシーポリシー
      </Button>
      <Button variant="negative" onClick={props.handleCloseMenu}>
        閉じる
      </Button>

      <Modal isOpen={isIntroductionOpen}>
        <HelpIntroduction onClose={() => setIsIntroductionOpen(false)} />
      </Modal>
      <Modal isOpen={isTokuOpen}>
        <HelpToku onClose={() => setIsTokuOpen(false)} />
      </Modal>
      <Modal2 isOpen={isPolicyOpen} handleOutsideClick={() => setIsPolicyOpen(false)}>
        <HelpPolicy onClose={() => setIsPolicyOpen(false)} />
      </Modal2>
    </div>
  );
};

export default HelpMenu;
