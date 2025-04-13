// 指定されたCSSプロパティの値を取得し、その値をミリ秒単位で返す関数
export const getCssDuration = (name: string): number => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const match = raw.match(/^([\d.]+)(ms|s)$/);
  if (!match) return 0;
  const [, num, unit] = match;
  return unit === 's' ? parseFloat(num) * 1000 : parseFloat(num);
};
