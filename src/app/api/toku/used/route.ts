import { prisma } from '@/server/prisma';
import { getTokuMaster } from '@/utils/toku';
import { jsonResponse } from '@/server/response';
import { getJapanTodayMidnight } from '@/server/date';
import { TokuCounts, TokuId } from '@/types/toku';
import { User } from '@/types/user';
import { getSessionUser } from '@/server/userSession';

export async function POST(req: Request) {
  const { tokuId, count }: { tokuId: TokuId; count: number } = await req.json();
  const tokuMaster = getTokuMaster(tokuId);
  let { user } = await getSessionUser();
  let addCount = count;

  try {
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });
    if (!tokuMaster) return jsonResponse({ error: 'マスタが見つかりません' }, { status: 404 });

    if (user.coin < tokuMaster.coin) {
      return jsonResponse({ error: 'コインが不足しています' }, { status: 400 });
    }

    if (tokuMaster.permanent) {
      const permanentTokuCounts = user.permanentTokuCounts as TokuCounts;
      permanentTokuCounts[tokuId] = {
        count: (permanentTokuCounts[tokuId]?.count ?? 0) + addCount,
      };
      user.permanentTokuCounts = permanentTokuCounts;
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
      addCount = tokuMaster.limit - prevCount;
    }

    if (addCount <= 0) {
      return jsonResponse({ error: '回数制限に達しています' }, { status: 400 });
    }

    // 徳カウントデータ更新
    tokuCountsUpdateData.counts[tokuId] = {
      count: prevCount + addCount,
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

    // ユーザーデータ更新
    const userUpdateData: Record<string, string | number | TokuCounts> = {};
    userUpdateData.coin = user.coin - tokuMaster.coin * addCount;
    if (tokuMaster.permanent) {
      userUpdateData.permanentTokuCounts = user.permanentTokuCounts as TokuCounts;
    }
    user = await prisma.user.update({
      where: { id: user.id },
      data: userUpdateData,
    });

    // クライアントで使用するユーザー情報を返す
    const userData: User = {
      id: user.id,
      isGuest: user.isGuest,
      email: user.email ?? '',
      name: user.name ?? '',
      coin: user.coin,
      tokuUpdatedAt: tokuCounts?.date.toISOString() ?? '',
      tokuCounts: tokuCounts?.counts as TokuCounts,
      permanentTokuCounts: user.permanentTokuCounts as TokuCounts,
    };

    return jsonResponse(userData, { status: 200 });
  } catch (err) {
    console.error('POST /api/toku/used error', err);
    return jsonResponse({ error: '徳カウント使用に失敗しました' }, { status: 500 });
  }
}
