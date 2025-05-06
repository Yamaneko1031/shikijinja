import React, { useLayoutEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, className }) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // const no_scroll = (e: Event) => {
    //   e.preventDefault();
    // };

    if (isOpen) {
      // document.body.addEventListener('wheel', no_scroll, { passive: false });
      // document.body.addEventListener('touchmove', no_scroll, { passive: false });
      dialog.showModal();
      // 次フレームでスクロール位置を中央に
      requestAnimationFrame(() => {
        // dialog 自身をスクロールコンテナにしている場合
        const scrollContainer = dialog;
        // const centerH = (scrollContainer.scrollHeight - scrollContainer.clientHeight) / 2;
        // scrollContainer.scrollTop = centerH;
        const centerW = (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2;
        scrollContainer.scrollLeft = centerW;
      });
    }

    return () => {
      if (dialog) {
        // document.body.removeEventListener('wheel', no_scroll);
        // document.body.removeEventListener('touchmove', no_scroll);
        dialog.close();
      }
    };
  }, [isOpen]);

  return isOpen ? (
    <dialog
      ref={dialogRef}
      className={
        className ||
        'fixed top-[45lvh] left-1/2 translate-x-[-50%] translate-y-[-50%] bg-black/80 rounded-lg p-2 text-white overscroll-contain'
      }
    >
      {children}
    </dialog>
  ) : null;
};

export default React.memo(Modal);
