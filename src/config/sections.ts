import EmaSection from '@/components/Ema/EmaSection';
import OmamoriSection from '@/components/Omamori/OmamoriSection';
import OmikujiSection from '@/components/Omikuji/OmikujiSection';
import TopSection from '@/components/Top/TopSection';
import ShoukaiSection from '@/components/Shoukai/ShoukaiSection';
import HaidenSection from '@/components/Haiden/HaidenSection';
import NadenekoSection from '@/components/Nadeneko/NadenekoSection';
// import SandoSection from '@/components/Sando/SandoSection';
import { SectionData } from '@/types/section';

export const sections: SectionData[] = [
  {
    id: 'top',
    bgUrl: '/images/bg_hude/bg_top.webp',
    name: '大鳥居',
    overlayText: '',
    component: TopSection,
    jumpOffset: 0,
    scrollEffect: [
      { ratio: 0.0, posX: 50, posY: 50, zoom: 1.0 },
      // { ratio: 0.5, posX: 50, posY: 50, zoom: 1.1 },
      // { ratio: 0.6, posX: 50, posY: 50, zoom: 1.2 },
      { ratio: 1.0, posX: 50, posY: 50, zoom: 1.3 },
    ],
    sectionClass: 'relative w-full h-[75rem] items-center justify-center p-4',
    offset: { top: 26, left: 7 },
  },
  {
    id: 'nadeneko',
    bgUrl: '/images/bg_hude/bg_nadeneko.webp',
    name: 'なで猫の社',
    overlayText: 'なで猫の社',
    component: NadenekoSection,
    jumpOffset: 12,
    scrollEffect: [
      { ratio: 0.0, posX: 45, posY: 50, zoom: 1.0 },
      { ratio: 0.4, posX: 52, posY: 50, zoom: 1.15 },
      { ratio: 0.5, posX: 55, posY: 50, zoom: 1.2 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.2 },
      { ratio: 1.0, posX: 60, posY: 50, zoom: 1.1 },
    ],
    sectionClass: 'relative w-full h-[75rem] items-center justify-center p-4',
    offset: { top: 19, left: 5 },
  },
  {
    id: 'ema',
    bgUrl: '/images/bg_hude/bg_ema.webp',
    name: '絵馬掛所',
    overlayText: '絵馬掛所',
    component: EmaSection,
    jumpOffset: 12,
    scrollEffect: [
      { ratio: 0.0, posX: 30, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 50, posY: 50, zoom: 1.1 },
      { ratio: 0.7, posX: 50, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 60, posY: 50, zoom: 1.0 },
    ],
    sectionClass: 'relative w-full h-[75rem] items-center justify-center p-4',
    offset: { top: 20.5, left: 14 },
  },
  {
    id: 'omamori',
    bgUrl: '/images/bg_hude/bg_omamori.webp',
    name: '授与所',
    overlayText: '授与所',
    component: OmamoriSection,
    jumpOffset: 12,
    scrollEffect: [
      { ratio: 0.0, posX: 30, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 68, posY: 50, zoom: 1.0 },
    ],
    sectionClass: 'relative w-full h-[75rem] items-center justify-center p-4',
    offset: { top: 16.5, left: 15.5 },
  },
  {
    id: 'omikuji',
    bgUrl: '/images/bg_hude/bg_omikuji.webp',
    name: 'おみくじ結び所',
    overlayText: 'おみくじ結び所',
    component: OmikujiSection,
    jumpOffset: 12,
    scrollEffect: [
      { ratio: 0.0, posX: 40, posY: 50, zoom: 1.0 },
      { ratio: 0.4, posX: 52, posY: 50, zoom: 1.2 },
      { ratio: 0.6, posX: 52, posY: 50, zoom: 1.2 },
      { ratio: 1.0, posX: 60, posY: 50, zoom: 1.0 },
    ],
    sectionClass: 'relative w-full h-[75rem] items-center justify-center p-4',
    offset: { top: 14, left: 4.5 },
  },
  {
    id: 'shoukai',
    bgUrl: '/images/bg_hude/bg_shoukai.webp',
    name: '宝物殿',
    overlayText: '宝物殿',
    component: ShoukaiSection,
    jumpOffset: 12,
    scrollEffect: [
      { ratio: 0.0, posX: 30, posY: 50, zoom: 1.0 },
      { ratio: 0.4, posX: 50, posY: 50, zoom: 1.0 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.0 },
      { ratio: 1.0, posX: 65, posY: 50, zoom: 1.0 },
    ],
    sectionClass: 'relative w-full h-[90rem] items-center justify-center p-4',
    offset: { top: 11.5, left: 15 },
  },
  {
    id: 'haiden',
    bgUrl: '/images/bg_hude/bg_haiden.webp',
    name: '拝殿',
    overlayText: '拝殿',
    component: HaidenSection,
    jumpOffset: 12,
    scrollEffect: [
      { ratio: 0.0, posX: 50, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 50, posY: 50, zoom: 1.5 },
      { ratio: 0.6, posX: 50, posY: 50, zoom: 1.5 },
      { ratio: 1.0, posX: 50, posY: 50, zoom: 1.5 },
    ],
    sectionClass: 'relative w-full h-[75rem] items-center justify-center p-4',
    offset: { top: 7, left: 11.5 },
  },
];
