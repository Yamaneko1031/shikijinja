import { MotionValue } from 'framer-motion';
import { TokuId } from './toku';
import { User } from './user';

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
