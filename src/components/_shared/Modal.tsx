import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, className }) => {
  // body 直下に挿入するコンテナ
  const portalRoot = useRef<HTMLDivElement | null>(null);

  if (!portalRoot.current && typeof document !== 'undefined') {
    portalRoot.current = document.createElement('div');
  }

  // mount / unmount で body に追加・削除
  useEffect(() => {
    const el = portalRoot.current!;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [isOpen]);

  // モーダルの中身（本来描画したい要素）
  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-2 bg-black/50 overscroll-contain flex justify-center items-center">
      {/* <div className="absolute top-0 left-0 w-full h-[calc(100%+1px)]" /> */}
      <div
        className={
          className ??
          'relative min-w-[340px] w-[500px] bg-black/90 rounded-lg p-4 mx-2 text-white overscroll-contain'
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
