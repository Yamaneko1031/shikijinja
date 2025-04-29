import React, { useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  // スクロール禁止
  useEffect(() => {
    const body = document.querySelector('body');
    if (!body) return;
    if (document.scrollingElement) {
      body.classList.add('overflow-hidden');
    }
    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, []);
  return <>{children}</>;
};

export default Modal;
