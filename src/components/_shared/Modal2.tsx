import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  handleOutsideClick: () => void;
}

const Modal2: React.FC<ModalProps> = ({ isOpen, children, className, handleOutsideClick }) => {
  // body 直下に挿入するコンテナ
  const portalRoot = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);

  const documentClickHandler = useRef<((e: Event) => void) | null>(null);

  if (!portalRoot.current && typeof document !== 'undefined') {
    portalRoot.current = document.createElement('div');
  }

  // isOpen で body に追加・削除
  useEffect(() => {
    if (isOpen) {
      documentClickHandler.current = (e: Event) => {
        if (windowRef.current?.contains(e.target as Node)) {
          return;
        }
        handleOutsideClick();
      };
      const el = portalRoot.current!;
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        if (documentClickHandler.current) {
          document.addEventListener('click', documentClickHandler.current);
        }
      });
      return () => {
        document.body.removeChild(el);
        if (documentClickHandler.current) {
          document.removeEventListener('click', documentClickHandler.current);
        }
      };
    }
  }, [isOpen, handleOutsideClick]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollLeft =
        (modalRef.current.scrollWidth - modalRef.current.clientWidth) / 2;
    }
  }, [isOpen]);

  // モーダルの中身（本来描画したい要素）
  const modalContent = isOpen ? (
    <div
      ref={modalRef}
      className="fixed inset-0 z-2 overflow-scroll overscroll-contain flex justify-center items-center"
    >
      <div className="absolute top-0 left-0 w-full h-[calc(100%+1px)]" />
      <div ref={windowRef} className={className}>
        {children}
      </div>
    </div>
  ) : null;

  // createPortal で body 直下の div に描画
  return portalRoot.current ? createPortal(modalContent, portalRoot.current) : null;
};

export default React.memo(Modal2);
