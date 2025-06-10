import React from 'react';
import { Button } from '../_shared/Button';
import { sections } from '@/config/sections';

interface Props {
  handleCloseMenu: () => void;
  handleScrollToSection: (sectionId: string) => void;
}

const FooterMap: React.FC<Props> = (props) => {
  //   const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 items-center">
      ※ここに全体図の画像が入る予定
      {sections.map((section) => (
        <Button
          key={section.id}
          variant="subNatural"
          onClick={() => {
            props.handleScrollToSection(section.id);
            props.handleCloseMenu();
          }}
        >
          {section.name}
        </Button>
      ))}
      <Button variant="negative" onClick={props.handleCloseMenu}>
        閉じる
      </Button>
    </div>
  );
};

export default FooterMap;
