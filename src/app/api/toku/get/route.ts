import { cookies } from 'next/headers';
import { prisma } from '@/server/prisma';
import { getTokuMaster } from '@/utils/toku';
import { json } from '@/server/response';
import { getJapanTodayMidnight } from '@/server/date';
import { TokuCounts, TokuId } from '@/types/toku';
import { User } from '@/types/user';

export async function POST(req: Request) {
  const { tokuId, count }: { tokuId: TokuId; count: number } = await req.json();
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  const tokuMaster = getTokuMaster(tokuId);
  let addCount = count;

  try {
    if (!userId) return json({ error: '未認証' }, { status: 401 });
    if (!tokuMaster) return json({ error: 'マスタが見つかりません' }, { status: 404 });

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return json({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

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

    if (prevCount + count > tokuMaster.limit) {
      addCount = tokuMaster.limit - prevCount;
    }

    if (addCount <= 0) {
      return json({ error: '回数制限に達しています' }, { status: 400 });
    }

    // ユーザーデータ更新
    const userUpdateData: Record<string, string | number> = {};
    userUpdateData.coin = user.coin + tokuMaster.coin * addCount;
    user = await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
    });

    // 徳カウントデータ更新
    tokuCountsUpdateData.counts[tokuId] = {
      count: prevCount + addCount,
    };
    // 今日のデータがなければ作る、あれば更新
    tokuCounts = await prisma.tokuCount.upsert({
      where: { userId_date: { userId, date: today } },
      update: { counts: tokuCountsUpdateData.counts },
      create: {
        userId,
        date: today,
        counts: tokuCountsUpdateData.counts,
      },
    });

    // クライアントで使用するユーザー情報を返す
    const userData: User = {
      id: user.id,
      isGuest: user.isGuest,
      email: user.email ?? '',
      name: user.name ?? '',
      coin: user.coin,
      tokuUpdatedAt: tokuCounts.date.toISOString(),
      tokuCounts: tokuCounts.counts as TokuCounts,
    };

    return json(userData, { status: 200 });
  } catch (err) {
    console.error('POST /api/toku/get error', err);
    return json({ error: '徳カウント取得に失敗しました' }, { status: 500 });
  }
}
