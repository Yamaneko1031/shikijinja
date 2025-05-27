export const omikujiDefaultJob = ['エンジニア', 'デザイナー', 'PM'] as const;

export const omikujiConfig = {
  今年: {
    id: 'omikuji_omikuji',
    name: 'おみくじ',
    needsSelector: true,
    fortune: [5, 10, 20, 20, 20, 20, 5],
    fortuneName: ['大凶', '凶', '末吉', '小吉', '吉', '大吉', '猫'],
  },
  今月: {
    id: 'omikuji_hitohira',
    name: 'ひとひらくじ',
    needsSelector: true,
    fortune: [5, 10, 20, 20, 20, 20, 5],
    fortuneName: ['大凶', '凶', '末吉', '小吉', '吉', '大吉', '猫'],
  },
  明日: {
    id: 'omikuji_nekobiyori',
    name: 'ねこ日和',
    needsSelector: false,
    fortune: [10, 10, 20, 25, 25, 10],
    fortuneName: ['毛玉', '尻尾', '子猫', '中猫', '大猫', '虎'],
  },
} as const;

export const omikujiMonthList = [
  '睦月/1月',
  '如月/2月',
  '弥生/3月',
  '卯月/4月',
  '皐月/5月',
  '水無月/6月',
  '文月/7月',
  '葉月/8月',
  '長月/9月',
  '神無月/10月',
  '霜月/11月',
  '師走/12月',
] as const;
