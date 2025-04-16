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
    name: '',
    component: TopSection,
  },
  {
    id: 'sando',
    bgUrl: '/images/bg_anim/bg_sando.webp',
    bgCenterPosition: '75% center',
    name: '参道',
    component: SandoSection,
  },
  {
    id: 'ema',
    bgUrl: '/images/bg_anim/bg_ema.webp',
    bgCenterPosition: '55% center',
    name: '絵馬掛所',
    component: EmaSection,
  },
  {
    id: 'omamori',
    bgUrl: '/images/bg_anim/bg_omamori.webp',
    bgCenterPosition: '35% center',
    name: '授与所',
    component: OmamoriSection,
  },
  {
    id: 'omikuji',
    bgUrl: '/images/bg_anim/bg_omikuji.webp',
    bgCenterPosition: '50% center',
    name: 'おみくじ結び所',
    component: OmikujiSection,
  },
  {
    id: 'nadeneko',
    bgUrl: '/images/bg_anim/bg_nadeneko.webp',
    bgCenterPosition: 'center center',
    name: 'なで猫の社',
    component: NadenekoSection,
  },
  {
    id: 'shoukai',
    bgUrl: '/images/bg_anim/bg_shoukai.webp',
    bgCenterPosition: 'center center',
    name: '宝物殿',
    component: ShoukaiSection,
  },
  {
    id: 'haiden',
    bgUrl: '/images/bg_anim/bg_haiden.webp',
    bgCenterPosition: 'center center',
    name: '拝殿',
    component: HaidenSection,
  },
];
