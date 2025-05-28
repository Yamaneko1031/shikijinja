import { MotionValue } from 'framer-motion';
import { TokuId } from './toku';
import { User } from './user';

export type SectionData = {
  id: string;
  bgUrl: string;
  name: string;
  overlayText: string;
  component: React.ComponentType<SectionProps>;
  scrollEffect: { ratio: number; posX: number; posY: number; zoom: number }[];
  sectionClass: string;
};

export type SectionProps = {
  isActive: boolean;
  isNeighbor: boolean;
  user: User;
  scrollY: MotionValue<number>;
  handleAddCoin: (coin: number) => void;
  handleIsLimitOver: (tokuId: TokuId) => boolean;
  handleTokuGet: (tokuId: TokuId) => void;
  handleTokuUsed: (tokuId: TokuId) => void;
  handleIsEnoughCoin: (tokuId: TokuId) => boolean;
};
