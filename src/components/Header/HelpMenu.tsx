'use client';

import React from 'react';
import { Button } from '../_shared/Button';

interface Props {
  handleCloseMenu: () => void;
}

const HelpMenu: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <Button variant="subNatural" onClick={() => {}}>
        式岐神社について
      </Button>
      <Button variant="subNatural" onClick={() => {}}>
        徳コインについて
      </Button>
      <Button variant="subNatural" onClick={() => {}}>
        プライバシーポリシー
      </Button>
      <Button variant="negative" onClick={props.handleCloseMenu}>
        閉じる
      </Button>
    </div>
  );
};

export default HelpMenu;
