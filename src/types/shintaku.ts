export type ShintakuImageKey = 'shikineko' | 'iroha' | 'tenten';

export type ShintakuPost = {
  id: string;
  message: string;
  isReply: boolean;
  createdAt: string;
  imageKey: ShintakuImageKey;
};

export type ShintakuResponse = {
  posts: ShintakuPost[];
};

export type ShintakuTypeTable = {
  [key in ShintakuImageKey]: {
    label: string;
    illustname: string;
  };
};
