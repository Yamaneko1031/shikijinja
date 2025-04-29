import React, { useLayoutEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  // スクロール禁止
  // useEffect(() => {
  //   const body = document.querySelector('body');
  //   if (!body) return;
  //   if (document.scrollingElement) {
  //     body.classList.add('overflow-hidden');
  //   }
  //   return () => {
  //     body.classList.remove('overflow-hidden');
  //   };
  // }, []);
  useLayoutEffect(() => {
    const scrollY = window.scrollY;
    document.documentElement.style.overscrollBehaviorY = 'none';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    return () => {
      document.documentElement.style.overscrollBehaviorY = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollY);
    };
  }, []);
  return <>{children}</>;
};

export default Modal;
