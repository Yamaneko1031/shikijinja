export function getJapanTodayMidnight(): Date {
  const now = new Date();
  // 日本時間で今日の0時
  const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  jst.setHours(0, 0, 0, 0);
  return jst;
}
