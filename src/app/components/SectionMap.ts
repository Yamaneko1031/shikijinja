export const sectionMap = [
  { id: 'top', start: 0, end: 1000 },
  { id: 'ema', start: 1000, end: 2000 },
  { id: 'omikuji', start: 2000, end: 3000 },
];

export const findSectionByScroll = (scrollY: number) => {
  return sectionMap.find((sec) => scrollY >= sec.start && scrollY < sec.end)?.id ?? 'top';
};
