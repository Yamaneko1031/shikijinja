export const omikujiDefaultJob = ['エンジニア', 'デザイナー', 'PM'] as const;

export const omikujiFortuneTable = {
  今年: [5, 10, 20, 20, 20, 20, 5],
  今月: [5, 10, 20, 20, 20, 20, 5],
  明日: [10, 10, 20, 25, 25, 10],
} as const;

export const omikujiNameList = {
  今年: 'おみくじ',
  今月: 'ひとひらくじ',
  明日: 'ねこ日和',
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
