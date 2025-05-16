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
    <div className="fixed inset-0 bg-black/50 overflow-scroll overscroll-contain z-100">
      {/* 強制でスクロールバー背景にするためのダミー要素 */}
      <div className="h-[calc(100%+1px)]"></div>
      {/* <div className="absolute top-0 left-[200px] h-[101lvh] w-[100px] bg-white"></div> */}
      <div
        // ref={dialogRef}
        className={
          className ||
          'absolute top-[45lvh] left-1/2 translate-x-[-50%] translate-y-[-50%] bg-black/80 rounded-lg p-2 text-white overscroll-contain'
        }
      >
        {children}
      </div>
    </div>
  ) : null;
};

export default React.memo(Modal);
