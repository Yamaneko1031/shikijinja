import { prisma } from '@/server/prisma';
import { jsonResponse } from '@/server/response';
import { getSessionUser } from '@/server/userSession';
import { NadenekoBantukeResponse } from '@/types/nadeneko';
export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return jsonResponse({ error: 'ログインしていません' }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const rankingData = await prisma.pettingLog.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        user: { select: { name: true, decision: true } },
      },
      orderBy: {
        points: 'desc',
      },
      take: 10,
    });

    const response: NadenekoBantukeResponse = {
      rankingData: rankingData.map((data) => ({
        pettingCount: data.pettingCount,
        points: data.points,
        userName: data.user?.decision == 'ALLOW' ? (data.user?.name ? data.user.name : '') : '',
      })),
    };

    return jsonResponse(response, { status: 200 });
  } catch (err) {
    console.error('POST /api/nadeneko/ranking error', err);
    return jsonResponse({ error: 'ランキングデータの追加に失敗しました' }, { status: 500 });
  }
}

// export async function POST() {
//   try {
//     await updateRankingCache('monthly', getCurrentMonth());
//     await updateRankingCache('monthly', getPreviousMonth());
//     await updateRankingCache('total', null);

//     return jsonResponse({ message: 'ランキングデータの更新に成功しました' }, { status: 200 });
//   } catch (err) {
//     console.error('POST /api/nadeneko/ranking error', err);
//     return jsonResponse({ error: 'ランキングデータの追加に失敗しました' }, { status: 500 });
//   }
// }
