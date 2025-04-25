import EmaSection from '@/components/Ema/EmaSection';
import OmamoriSection from '@/components/Omamori/OmamoriSection';
import OmikujiSection from '@/components/Omikuji/OmikujiSection';
import TopSection from '@/components/Top/TopSection';
import ShoukaiSection from '@/components/Shoukai/ShoukaiSection';
import HaidenSection from '@/components/Haiden/HaidenSection';
import NadenekoSection from '@/components/Nadeneko/NadenekoSection';
import SandoSection from '@/components/Sando/SandoSection';

export type Section = {
  id: string;
  bgUrl: string;
  name: string;
  component: React.ComponentType<{ isActive: boolean; isNeighbor: boolean }>;
  scrollEffect: { ratio: number; posX: number; posY: number; zoom: number }[];
  sectionClass: string;
};

export const sections: Section[] = [
  {
    id: 'top',
    bgUrl: '/images/bg_hude/bg_top.webp',
    name: '',
    component: TopSection,
    scrollEffect: [
      { ratio: 0.0, posX: 60, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 60, posY: 50, zoom: 1.1 },
      { ratio: 0.6, posX: 60, posY: 50, zoom: 1.2 },
      { ratio: 1.0, posX: 60, posY: 50, zoom: 1.3 },
    ],
    sectionClass: 'relative w-full h-[1200px] items-center justify-center p-4',
  },
  {
    id: 'sando',
    bgUrl: '/images/bg_hude/bg_sando.webp',
    name: '参道',
    component: SandoSection,
    scrollEffect: [
      { ratio: 0.0, posX: 45, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 60, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 70, posY: 50, zoom: 1.2 },
    ],
    sectionClass: 'relative w-full h-[1200px] items-center justify-center p-4',
  },
  {
    id: 'ema',
    bgUrl: '/images/bg_hude/bg_ema.webp',
    name: '絵馬掛所',
    component: EmaSection,
    scrollEffect: [
      { ratio: 0.0, posX: 30, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 50, posY: 50, zoom: 1.1 },
      { ratio: 0.7, posX: 50, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 60, posY: 50, zoom: 1.0 },
    ],
    sectionClass: 'relative w-full h-[1200px] items-center justify-center p-4',
  },
  {
    id: 'omamori',
    bgUrl: '/images/bg_hude/bg_omamori.webp',
    name: '授与所',
    component: OmamoriSection,
    scrollEffect: [
      { ratio: 0.0, posX: 30, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 68, posY: 50, zoom: 1.0 },
    ],
    sectionClass: 'relative w-full h-[1200px] items-center justify-center p-4',
  },
  {
    id: 'omikuji',
    bgUrl: '/images/bg_hude/bg_omikuji.webp',
    name: 'おみくじ結び所',
    component: OmikujiSection,
    scrollEffect: [
      { ratio: 0.0, posX: 40, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 60, posY: 50, zoom: 1.0 },
    ],
    sectionClass: 'relative w-full h-[1200px] items-center justify-center p-4',
  },
  {
    id: 'nadeneko',
    bgUrl: '/images/bg_hude/bg_nadeneko.webp',
    name: 'なで猫の社',
    component: NadenekoSection,
    scrollEffect: [
      { ratio: 0.0, posX: 45, posY: 50, zoom: 1.0 },
      { ratio: 0.4, posX: 52, posY: 50, zoom: 1.15 },
      { ratio: 0.5, posX: 55, posY: 50, zoom: 1.2 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.2 },
      { ratio: 1.0, posX: 60, posY: 50, zoom: 1.1 },
    ],
    sectionClass: 'relative w-full h-[1200px] items-center justify-center p-4',
  },
  {
    id: 'shoukai',
    bgUrl: '/images/bg_hude/bg_shoukai.webp',
    name: '宝物殿',
    component: ShoukaiSection,
    scrollEffect: [
      { ratio: 0.0, posX: 30, posY: 50, zoom: 1.0 },
      { ratio: 0.4, posX: 50, posY: 50, zoom: 1.0 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.0 },
      { ratio: 1.0, posX: 65, posY: 50, zoom: 1.0 },
    ],
    sectionClass: 'relative w-full h-[1200px] items-center justify-center p-4',
  },
  {
    id: 'haiden',
    bgUrl: '/images/bg_hude/bg_haiden.webp',
    name: '拝殿',
    component: HaidenSection,
    scrollEffect: [
      { ratio: 0.0, posX: 50, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 50, posY: 50, zoom: 1.3 },
      { ratio: 0.6, posX: 50, posY: 50, zoom: 1.3 },
      { ratio: 1.0, posX: 50, posY: 50, zoom: 1.3 },
    ],
    sectionClass: 'relative w-full h-[1200px] items-center justify-center p-4',
  },
];
