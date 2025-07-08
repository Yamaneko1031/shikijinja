import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  handleOutsideClick?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  className,
  handleOutsideClick = null,
}) => {
  // body 直下に挿入するコンテナ
  const portalRoot = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const isMouseDown = useRef(false);

  if (!portalRoot.current && typeof document !== 'undefined') {
    portalRoot.current = document.createElement('div');
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (windowRef.current?.contains(e.target as Node)) {
      return;
    }
    isMouseDown.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const failed = !isMouseDown.current;
    isMouseDown.current = false;
    if (failed) return;

    if (windowRef.current?.contains(e.target as Node)) {
      return;
    }
    if (modalRef.current?.contains(e.target as Node)) {
      handleOutsideClick?.();
    }
  };

  // mount / unmount で body に追加・削除
  useEffect(() => {
    if (isOpen) {
      const el = portalRoot.current!;
      document.body.appendChild(el);
      return () => {
        document.body.removeChild(el);
      };
    }
  }, [isOpen]);

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
      className="fixed inset-0 z-2 bg-black/80 overflow-scroll overscroll-contain flex justify-center items-center"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="absolute top-0 left-0 w-full h-[calc(100%+1px)]" />
      <div
        ref={windowRef}
        className={
          className ??
          'relative min-w-[20rem] w-[30rem] bg-black/90 rounded-lg p-4 mx-2 text-white overscroll-contain'
        }
      >
        {children}
      </div>
    </div>
  ) : null;

  // createPortal で body 直下の div に描画
  return portalRoot.current ? createPortal(modalContent, portalRoot.current) : null;
};

export default React.memo(Modal);
