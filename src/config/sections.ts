import EmaSection from '../components/EmaSection';
import OmamoriSection from '../components/OmamoriSection';
import OmikujiSection from '../components/OmikujiSection';
import TopSection from '../components/TopSection';
import ShoukaiSection from '../components/ShoukaiSection';
import HaidenSection from '../components/HaidenSection';
import NadenekoSection from '../components/NadenekoSection';
import SandoSection from '../components/SandoSection';

export type Section = {
  id: string;
  bgUrl: string;
  name: string;
  component: React.ComponentType;
  scrollEffect: { ratio: number; posX: number; posY: number; zoom: number }[];
};

export const sections: Section[] = [
  {
    id: 'top',
    bgUrl: '/images/bg_anim/bg_top.webp',
    name: '',
    component: TopSection,
    scrollEffect: [
      { ratio: 0.0, posX: 50, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 50, posY: 50, zoom: 1.0 },
      { ratio: 0.6, posX: 50, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 50, posY: 50, zoom: 1.3 },
    ],
  },
  {
    id: 'sando',
    bgUrl: '/images/bg_anim/bg_sando.webp',
    name: '参道',
    component: SandoSection,
    scrollEffect: [
      { ratio: 0.0, posX: 45, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 60, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 70, posY: 50, zoom: 1.2 },
    ],
  },
  {
    id: 'ema',
    bgUrl: '/images/bg_anim/bg_ema.webp',
    name: '絵馬掛所',
    component: EmaSection,
    scrollEffect: [
      { ratio: 0.0, posX: 30, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 50, posY: 50, zoom: 1.1 },
      { ratio: 0.7, posX: 50, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 60, posY: 50, zoom: 1.0 },
    ],
  },
  {
    id: 'omamori',
    bgUrl: '/images/bg_anim/bg_omamori.webp',
    name: '授与所',
    component: OmamoriSection,
    scrollEffect: [
      { ratio: 0.0, posX: 30, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 68, posY: 50, zoom: 1.0 },
    ],
  },
  {
    id: 'omikuji',
    bgUrl: '/images/bg_anim/bg_omikuji.webp',
    name: 'おみくじ結び所',
    component: OmikujiSection,
    scrollEffect: [
      { ratio: 0.0, posX: 40, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.1 },
      { ratio: 1.0, posX: 60, posY: 50, zoom: 1.0 },
    ],
  },
  {
    id: 'nadeneko',
    bgUrl: '/images/bg_anim/bg_nadeneko.webp',
    name: 'なで猫の社',
    component: NadenekoSection,
    scrollEffect: [
      { ratio: 0.0, posX: 45, posY: 50, zoom: 1.0 },
      { ratio: 0.4, posX: 60, posY: 50, zoom: 1.15 },
      { ratio: 0.5, posX: 60, posY: 50, zoom: 1.2 },
      { ratio: 0.7, posX: 60, posY: 50, zoom: 1.2 },
      { ratio: 1.0, posX: 65, posY: 50, zoom: 1.1 },
    ],
  },
  {
    id: 'shoukai',
    bgUrl: '/images/bg_anim/bg_shoukai.webp',
    name: '宝物殿',
    component: ShoukaiSection,
    scrollEffect: [
      { ratio: 0.0, posX: 30, posY: 50, zoom: 1.0 },
      { ratio: 0.4, posX: 50, posY: 50, zoom: 1.0 },
      { ratio: 0.7, posX: 55, posY: 50, zoom: 1.0 },
      { ratio: 1.0, posX: 65, posY: 50, zoom: 1.0 },
    ],
  },
  {
    id: 'haiden',
    bgUrl: '/images/bg_anim/bg_haiden.webp',
    name: '拝殿',
    component: HaidenSection,
    scrollEffect: [
      { ratio: 0.0, posX: 50, posY: 50, zoom: 1.0 },
      { ratio: 0.5, posX: 50, posY: 50, zoom: 1.3 },
      { ratio: 0.6, posX: 50, posY: 50, zoom: 1.3 },
      { ratio: 1.0, posX: 50, posY: 50, zoom: 1.3 },
    ],
  },
];
