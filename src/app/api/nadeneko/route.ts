import { prisma } from '@/server/prisma';
import { getTokuMaster } from '@/utils/toku';
import { jsonResponse } from '@/server/response';
import { getJapanTodayMidnight } from '@/server/date';
import { TokuCounts } from '@/types/toku';
import { getSessionUser } from '@/server/userSession';
import { NadenekoResponse } from '@/types/nadeneko';

export async function POST() {
  //   const { tokuId, count }: { tokuId: TokuId; count: number } = await req.json();
  const tokuId = 'nadeneko';
  const tokuMaster = getTokuMaster(tokuId);
  let { user } = await getSessionUser();

  try {
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });
    if (!tokuMaster) return jsonResponse({ error: 'マスタが見つかりません' }, { status: 404 });

    // 今日の徳カウント情報を取得
    const today = getJapanTodayMidnight();
    let tokuCounts = await prisma.tokuCount.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    // 今日の徳カウント情報が無い場合は新規作成
    const tokuCountsUpdateData = { counts: {} as TokuCounts };
    if (tokuCounts) {
      tokuCountsUpdateData.counts = tokuCounts.counts as TokuCounts;
    } else {
      tokuCountsUpdateData.counts = {} as TokuCounts;
    }

    const prevCount =
      tokuCountsUpdateData.counts[tokuId] === undefined
        ? 0
        : tokuCountsUpdateData.counts[tokuId]!.count;

    if (prevCount >= tokuMaster.limit) {
      return jsonResponse({ error: '回数制限に達しています' }, { status: 400 });
    }

    // 加算値
    // 98%のループ抽選
    const addCoins: number[] = [];
    let totalAddCoin = 0;
    do {
      const random = Math.floor(Math.random() * 1000);
      if (random <= 5) {
        addCoins.push(30);
        totalAddCoin += 30;
      } else if (random <= 20) {
        addCoins.push(10);
        totalAddCoin += 10;
      } else if (random <= 100) {
        addCoins.push(5);
        totalAddCoin += 5;
      } else if (random <= 400) {
        addCoins.push(3);
        totalAddCoin += 3;
      } else {
        addCoins.push(2);
        totalAddCoin += 2;
      }
    } while (Math.floor(Math.random() * 100) >= 3 || addCoins.length < 20);

    // ユーザーデータ更新
    const userUpdateData: Record<string, string | number> = {};
    userUpdateData.coin = user.coin + totalAddCoin;
    user = await prisma.user.update({
      where: { id: user.id },
      data: userUpdateData,
    });

    // 徳カウントデータ更新
    tokuCountsUpdateData.counts[tokuId] = {
      count: prevCount + 1,
    };
    // 今日のデータがなければ作る、あれば更新
    tokuCounts = await prisma.tokuCount.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      update: { counts: tokuCountsUpdateData.counts },
      create: {
        userId: user.id,
        date: today,
        counts: tokuCountsUpdateData.counts,
      },
    });

    const lotData: NadenekoResponse = {
      totalAddCoin: totalAddCoin,
      addCoins: addCoins,
    };

    return jsonResponse(lotData, { status: 200 });
  } catch (err) {
    console.error('POST /api/toku/get error', err);
    return jsonResponse({ error: '徳カウント取得に失敗しました' }, { status: 500 });
  }
}
