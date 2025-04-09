'use client';

import { ReactNode, useEffect, useRef } from 'react';

export const SectionWithRef = ({
  id,
  onVisible,
  children,
}: {
  id: string;
  onVisible: (id: string) => void;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(id);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id, onVisible]);

  return (
    <section ref={ref} className="relative min-h-screen z-10 flex items-center justify-center">
      {children}
    </section>
  );
};
