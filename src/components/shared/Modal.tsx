import React, { useLayoutEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  useLayoutEffect(() => {
    if (!isOpen) return;
    // const scrollY = window.scrollY;
    // document.documentElement.style.overscrollBehaviorY = 'none';
    // document.body.style.position = 'fixed';
    // document.body.style.top = `-${scrollY}px`;
    // document.body.style.left = '0';
    // document.body.style.right = '0';

    // return () => {
    //   document.documentElement.style.overscrollBehaviorY = '';
    //   document.body.style.position = '';
    //   document.body.style.top = '';
    //   document.body.style.left = '';
    //   document.body.style.right = '';
    //   window.scrollTo(0, scrollY);
    // };

    // 仮処理 iosでは上手くいかない
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  return isOpen ? (
    <div className="fixed top-[50lvh] left-1/2 translate-x-[-50%] translate-y-[-50%] z-100 bg-black/80 rounded-lg p-4 text-white">
      {children}
    </div>
  ) : undefined;
};

export default Modal;
