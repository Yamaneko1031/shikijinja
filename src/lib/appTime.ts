function getAppTime(): Date {
  const data = localStorage.getItem('serverTimeInfo');
  if (!data) {
    console.log('serverTimeInfo not found');
    return new Date();
  }

  try {
    const { serverTime, clientTime } = JSON.parse(data);
    // 経過ミリ秒
    const diff = Date.now() - clientTime;
    const serverBasedNow = new Date(new Date(serverTime).getTime() + diff);
    // サーバー基準の現在時刻を日本時間に変換
    return new Date(serverBasedNow.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  } catch {
    console.log('serverTimeInfo parse error');
    return new Date();
  }
}

export { getAppTime };
