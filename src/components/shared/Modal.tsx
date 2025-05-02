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
    // const mainElement = document.querySelector('main');

    const dialog = document.querySelector('dialog');
    if (dialog) {
      // document.body.inert = true;
      // if (mainElement) {
      //   mainElement.inert = true;
      // }
      // 仮処理 iosでは上手くいかない
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    }

    // 仮処理 iosでは上手くいかない
    // document.body.style.overflow = 'hidden';
    return () => {
      if (dialog) {
        document.body.style.overflow = '';
        // document.body.inert = false;
        // if (mainElement) {
        //   mainElement.inert = false;
        // }
        dialog.close();
      }
    };
  }, [isOpen]);
  return isOpen ? (
    <dialog className="fixed top-[45lvh] left-1/2 translate-x-[-50%] translate-y-[-50%] z-100 bg-black/80 rounded-lg p-2 text-white">
      {children}
    </dialog>
  ) : undefined;
};

export default Modal;
