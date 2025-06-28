import { prisma } from '@/server/prisma';
import { getTokuMaster } from '@/utils/toku';
import { jsonResponse } from '@/server/response';
import { getJapanTodayMidnight } from '@/server/date';
import { TokuCounts } from '@/types/toku';
import { getSessionUser } from '@/server/userSession';
import { fortuneNames } from '@/config/fortune';
import { Fortune } from '@/types/user';

export async function POST(req: Request) {
  const { value }: { value: number } = await req.json();
  const tokuId = 'saisen';
  const tokuMaster = getTokuMaster(tokuId);
  let { user } = await getSessionUser();

  try {
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });
    if (!tokuMaster) return jsonResponse({ error: 'マスタが見つかりません' }, { status: 404 });

    if (user.coin < tokuMaster.coin) {
      return jsonResponse({ error: 'コインが不足しています' }, { status: 400 });
    }

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

    const randomFortune = fortuneNames[Math.floor(Math.random() * fortuneNames.length)];
    let addPower = 0;
    let percent = 0;
    if (value <= 50) {
      addPower = 5;
      percent = 90;
    } else if (value <= 100) {
      addPower = 10;
      percent = 95;
    } else {
      addPower = 20;
      percent = 98;
    }

    while (Math.floor(Math.random() * 100) < percent) {
      addPower += 1;
    }

    const fortune: Fortune = {
      name: randomFortune,
      power: addPower,
    };

    // ユーザーデータ更新
    const userUpdateData: Record<string, string | number | Fortune[]> = {};
    userUpdateData.coin = user.coin - value;
    userUpdateData.fortunes = [...(user.fortunes as Fortune[]), fortune];
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

    return jsonResponse(fortune, { status: 200 });
  } catch (err) {
    console.error('POST /api/toku/get error', err);
    return jsonResponse({ error: '徳カウント取得に失敗しました' }, { status: 500 });
  }
}
