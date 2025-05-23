import { cookies } from 'next/headers';
import { prisma } from '@/server/prisma';
import { getTokuMaster } from '@/utils/toku';
import { json } from '@/server/response';
import { getJapanTodayMidnight } from '@/server/date';
import { TokuCounts, TokuId } from '@/types/toku';

export async function POST(req: Request) {
  const { tokuId }: { tokuId: TokuId } = await req.json();
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  const tokuMaster = getTokuMaster(tokuId);

  try {
    if (!userId) return json({ error: '未認証' }, { status: 401 });
    if (!tokuMaster) return json({ error: 'マスタが見つかりません' }, { status: 404 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return json({ error: 'ユーザー情報が見つかりません' }, { status: 404 });

    // 今日の徳カウント情報を取得
    const today = getJapanTodayMidnight();
    const tokuCounts = await prisma.tokuCount.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });
    let count = 0;
    if (tokuCounts && tokuCounts.counts) {
      const counts = tokuCounts.counts as TokuCounts;
      if (counts[tokuId] !== undefined) {
        count = counts[tokuId].count;
        if (count >= tokuMaster.limit) {
          return json({ result: false, count: count }, { status: 200 });
        }
      }
    }

    return json({ result: true, count: count }, { status: 200 });
  } catch (err) {
    console.error('POST /api/toku/get error', err);
    return json({ error: '徳カウント取得に失敗しました' }, { status: 500 });
  }
}
