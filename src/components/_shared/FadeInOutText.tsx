import { useEffect, useRef, useState } from 'react';

const FadeInOutText = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 下から表示するためのオブザーバー
    const showObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 1,
        rootMargin: '-120px 0px -120px 0px',
      }
    );

    if (ref.current) {
      showObserver.observe(ref.current);
      //   hideObserver.observe(ref.current);
    }
    return () => {
      showObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
};

export default FadeInOutText;
