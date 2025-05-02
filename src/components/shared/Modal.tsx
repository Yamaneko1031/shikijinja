import React, { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const wheelStop = (e: WheelEvent) => {
    e.preventDefault();
  };
  const touchStop = (e: TouchEvent) => {
    e.preventDefault();
  };

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      document.body.addEventListener('wheel', wheelStop, { passive: false });
      document.body.addEventListener('touchmove', touchStop, { passive: false });
      dialog.showModal();
    }

    return () => {
      if (dialog) {
        document.body.removeEventListener('wheel', wheelStop);
        document.body.removeEventListener('touchmove', touchStop);
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
