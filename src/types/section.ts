import { MotionValue } from 'framer-motion';
import { TokuId } from './toku';
import { User } from './user';

export type SectionData = {
  id: string;
  bgUrl: string;
  name: string;
  overlayText: string;
  jumpOffset: number;
  component: React.ComponentType<SectionProps>;
  scrollEffect: { ratio: number; posX: number; posY: number; zoom: number }[];
  sectionClass: string;
  offset: { top: number; left: number };
};

export type SectionProps = {
  isActive: boolean;
  isNeighbor: boolean;
  user: User;
  scrollY: MotionValue<number>;
  scrollRatio: MotionValue<number>;
  handleSetUser: (user: User) => void;
  handleAddCoin: (coin: number) => void;
  handleIsLimitOver: (tokuId: TokuId) => boolean;
  handleTokuGet: (tokuId: TokuId, dbUpdate?: boolean) => void;
  handleTokuUsed: (tokuId: TokuId, dbUpdate?: boolean) => void;
  handleIsEnoughCoin: (tokuId: TokuId) => boolean;
};
