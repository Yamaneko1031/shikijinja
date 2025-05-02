import React, { useContext, useLayoutEffect } from 'react';
import { DialogCountContext } from '@/app/page';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  const [, setDialogCount] = useContext(DialogCountContext);
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const scrollTop = window.scrollY;
    if (isOpen) {
      dialog.showModal();
      setDialogCount((prev) => prev + 1);

      setTimeout(() => {
        // スクロール禁止
        document.body.style.top = scrollTop * -1 + 'px';
        document.body.classList.add('no_scroll');
      }, 1000);
    }

    return () => {
      if (dialog) {
        // スクロール許可
        document.body.style.top = '';
        document.body.classList.remove('no_scroll');
        window.scrollTo(0, scrollTop);

        dialog.close();
        setDialogCount((prev) => prev - 1);
      }
    };
  }, [isOpen, setDialogCount]);

  return isOpen ? (
    <dialog
      ref={dialogRef}
      className="fixed top-[45lvh] left-1/2 translate-x-[-50%] translate-y-[-50%] z-100 bg-black/80 rounded-lg p-2 text-white"
    >
      {children}
    </dialog>
  ) : null;
};

export default Modal;
