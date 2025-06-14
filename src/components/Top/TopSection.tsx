'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import Image from 'next/image';
import TextReveal from '../_shared/TextReveal';
import ReafParticles from '../_shared/ReafParticles';
import { SectionProps } from '@/types/section';

const TopSection = (props: SectionProps) => {
  console.log('TopSection', props.isActive, props.isNeighbor);

  const toriiScale = useTransform(props.scrollY, [0, 400], [1, 3.5]);
  const toriiOpacity = useTransform(props.scrollY, [100, 500], [1, 0]);
  const titleOpacity = useTransform(props.scrollY, [150, 400], [1, 0]);
  const suzumeScale = useTransform(props.scrollY, [0, 1200], [1, 1.2]);

  const [suzumeAnimationClass1, setSuzumeAnimationClass1] = useState('hidden');
  const [suzumeAnimationClass2, setSuzumeAnimationClass2] = useState('hidden');
  const inAnimationSetting = useRef(false);
  const inAnimationFinished = useRef(false);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    if (props.isActive) {
      timeouts[0] = setInterval(() => {
        if (inAnimationSetting.current === false) {
          if (props.scrollY.get() < 10) {
            inAnimationSetting.current = true;
            timeouts[1] = setTimeout(() => {
              setSuzumeAnimationClass1('animate-suzume-in');
            }, 200);

            timeouts[2] = setTimeout(() => {
              setSuzumeAnimationClass2('animate-suzume-in');
            }, 500);

            timeouts[3] = setTimeout(() => {
              setSuzumeAnimationClass1('');
              setSuzumeAnimationClass2('');
              inAnimationFinished.current = true;
            }, 2500);
          }
        }
        if (inAnimationFinished.current && props.scrollY.get() > 10) {
          inAnimationFinished.current = false;
          setSuzumeAnimationClass1('animate-suzume-out');
          timeouts[4] = setTimeout(() => {
            setSuzumeAnimationClass2('animate-suzume-out');
          }, 200);
        }
      }, 60);
    } else {
      inAnimationSetting.current = false;
      setSuzumeAnimationClass1('hidden');
      setSuzumeAnimationClass2('hidden');
      timeouts.forEach((timeout) => clearTimeout(timeout));
    }

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [props.scrollY, props.isActive]);

  return (
    <div className="pointer-events-none">
      {/* 鳥居 */}
      {props.isActive && (
        <motion.div
          className="fixed z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 gpu-layer"
          style={{
            top: 'calc(50lvh)',
            left: '50%',
            scale: toriiScale,
            opacity: toriiOpacity,
            // width: '80vw',
            // height: 'calc(80vw * 1)',
            width: '80vw',
            height: '50lvh',
            maxHeight: '80vh',
            transformOrigin: '50% 70%',
          }}
        >
          <Image
            src="/images/bg_hude/torii.webp"
            alt="式岐神社の鳥居"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      )}
      <motion.h1
        className="absolute left-1/2 translate-x-20 -translate-y-20 vertical text-shadow-3 z-32"
        style={{ top: '30lvh', opacity: titleOpacity }}
      >
        式岐神社
      </motion.h1>
      <motion.div
        className="absolute left-1/2 -translate-x-25 -translate-y-35 vertical text-shadow-2 z-32"
        style={{ top: '50lvh', opacity: titleOpacity }}
      >
        <TextReveal
          text={`IT業界に関わる\n全ての人に\nご利益をもたらすと\n言い伝えられている`}
          delayPerChar={0.1}
        />
      </motion.div>

      {/* 落ち葉 */}
      {props.isActive && <ReafParticles />}

      {props.isActive && (
        <motion.div
          className="fixed inset-0 w-[100%] h-[100lvh] z-31"
          style={{ scale: suzumeScale }}
        >
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-[100%] translate-y-[100%] w-[12lvh] h-[12lvh] suzume ${suzumeAnimationClass1}`}
          ></div>
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-[150%] translate-y-[150%] w-[11lvh] h-[11lvh] suzume ${suzumeAnimationClass2}`}
          ></div>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(TopSection);
