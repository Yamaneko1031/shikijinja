import EmaSection from '../components/EmaSection';
import OmamoriSection from '../components/OmamoriSection';
import OmikujiSection from '../components/OmikujiSection';
import TopSection from '../components/TopSection';
import ShoukaiSection from '../components/ShoukaiSection';
import HaidenSection from '../components/HaidenSection';
import NadenekoSection from '../components/NadenekoSection';
import SandoSection from '../components/SandoSection';

export const sections = [
  {
    id: 'top',
    bgUrl: '/images/bg_anim/bg_top.webp',
    bgCenterPosition: '50% center',
    component: TopSection,
  },
  {
    id: 'sando',
    bgUrl: '/images/bg_anim/bg_sando.webp',
    bgCenterPosition: '75% center',
    component: SandoSection,
  },
  {
    id: 'ema',
    bgUrl: '/images/bg_anim/bg_ema.webp',
    bgCenterPosition: '55% center',
    component: EmaSection,
  },
  {
    id: 'omamori',
    bgUrl: '/images/bg_anim/bg_omamori.webp',
    bgCenterPosition: '35% center',
    component: OmamoriSection,
  },
  {
    id: 'omikuji',
    bgUrl: '/images/bg_anim/bg_omikuji.webp',
    bgCenterPosition: '50% center',
    component: OmikujiSection,
  },
  {
    id: 'nadeneko',
    bgUrl: '/images/bg_anim/bg_nadeneko.webp',
    bgCenterPosition: 'center center',
    component: NadenekoSection,
  },
  {
    id: 'shoukai',
    bgUrl: '/images/bg_anim/bg_shoukai.webp',
    bgCenterPosition: 'center center',
    component: ShoukaiSection,
  },
  {
    id: 'haiden',
    bgUrl: '/images/bg_anim/bg_haiden.webp',
    bgCenterPosition: 'center center',
    component: HaidenSection,
  },
];
