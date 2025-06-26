import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  handleOutsideClick: () => void;
}

const MenuWindow: React.FC<ModalProps> = ({ isOpen, children, className, handleOutsideClick }) => {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const documentClickHandler = useRef<((e: Event) => void) | null>(null);

  // isOpen で body に追加・削除
  useEffect(() => {
    if (isOpen) {
      documentClickHandler.current = (e: Event) => {
        const mainElement = document.querySelector('main');
        if (!mainElement?.contains(e.target as Node)) {
          // ※main要素の外側 = Modalの想定
          return;
        }
        if (windowRef.current?.contains(e.target as Node)) {
          return;
        }
        handleOutsideClick();
      };
      requestAnimationFrame(() => {
        if (documentClickHandler.current) {
          document.addEventListener('click', documentClickHandler.current);
        }
      });
      return () => {
        if (documentClickHandler.current) {
          document.removeEventListener('click', documentClickHandler.current);
        }
      };
    }
  }, [isOpen, handleOutsideClick]);

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.scrollLeft =
        (windowRef.current.scrollWidth - windowRef.current.clientWidth) / 2;
    }
  }, [isOpen]);

  // windowの中身（本来描画したい要素）
  return isOpen ? (
    <div ref={windowRef} className={className}>
      <div className="relative">{children}</div>
    </div>
  ) : null;
};

export default React.memo(MenuWindow);
