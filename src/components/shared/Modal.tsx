// import { body } from 'framer-motion/client';
import React, { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  // const mainElement = document.querySelector('main');

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // ダイアログ外側のスクロールだけ止める
    // const stopScroll: EventListener = (e) => {
    //   // イベント経路に dialog が含まれるなら内部スクロールなので何もしない
    //   // const path = e.composedPath?.() ?? [];
    //   // if (path.includes(dialog)) return;
    //   // e.preventDefault();
    //   console.log(e);
    // };

    const scrollTop = window.scrollY;
    if (isOpen) {
      // document.body.addEventListener('wheel', stopScroll, { passive: false });
      // document.body.addEventListener('touchmove', stopScroll, { passive: false });
      // スクロール禁止
      document.body.style.top = scrollTop * -1 + 'px';
      document.body.classList.add('no_scroll');
      dialog.showModal();
    }

    return () => {
      if (dialog) {
        // スクロール開放
        document.body.style.top = '';
        document.body.classList.remove('no_scroll');
        window.scrollTo(0, scrollTop);
        // document.body.removeEventListener('wheel', stopScroll);
        // document.body.removeEventListener('touchmove', stopScroll);
        dialog.close();
      }
    };
  }, [isOpen]);

  // Portal で body 直下にレンダー
  return isOpen
    ? createPortal(
        <dialog
          ref={dialogRef}
          className="fixed top-[45lvh] left-1/2 translate-x-[-50%] translate-y-[-50%] z-100 bg-black/80 rounded-lg p-2 text-white"
        >
          {children}
        </dialog>,
        document.body
      )
    : null;
};

export default Modal;
