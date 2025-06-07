import { cookies } from 'next/headers';
import { prisma } from '@/server/prisma';
import { jsonResponse } from '@/server/response';
import { TokuCounts } from '@/types/toku';
import { User } from '@/types/user';
import { getJapanTodayMidnight } from '@/server/date';

// export async function POST() {
//   try {
//     // クッキーからuserIdを取得
//     const cookieStore = await cookies();
//     let userId = cookieStore.get('userId')?.value;
//     console.log('cookie userId', userId);

//     // userIdが無い、またはDBに存在しない場合は新規ゲストを作成
//     let user = null;
//     if (userId) {
//       user = await prisma.user.findUnique({ where: { id: userId } });
//     }
//     if (!user) {
//       user = await prisma.user.create({
//         data: { isGuest: true },
//       });
//       userId = user.id;
//       console.log('userId', userId);
//       // クッキーに保存
//       cookieStore.set('userId', userId, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 365 });
//       console.log('cookieStore.set2 userId', userId);
//     }

//     // 今日の徳カウント情報を取得
//     const today = getJapanTodayMidnight();
//     let tokuCounts = null;
//     tokuCounts = await prisma.tokuCount.findFirst({
//       where: {
//         userId: user.id,
//         date: {
//           gte: today,
//           lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
//         },
//       },
//     });

//     // 今日の徳カウント情報が無い場合は新規作成
//     if (!tokuCounts) {
//       tokuCounts = await prisma.tokuCount.create({
//         data: { userId: user.id, date: today, counts: {} },
//       });
//     }

//     // クライアントで使用するユーザー情報を返す
//     const userData: User = {
//       id: user.id,
//       isGuest: user.isGuest,
//       email: user.email ?? '',
//       name: user.name ?? '',
//       coin: user.coin,
//       tokuUpdatedAt: tokuCounts.date.toISOString(),
//       tokuCounts: tokuCounts.counts as TokuCounts,
//     };

//     return json(userData, { status: 200 });
//   } catch (err) {
//     console.error('POST /api/user error', err);
//     return json({ error: 'ユーザー情報取得に失敗しました' }, { status: 500 });
//   }
// }

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return jsonResponse({ error: '未認証' }, { status: 401 });
    }

    // 送信データを取得（部分的にどれが来てもOKなように）
    const body = await req.json();
    console.log('PATCH', body);

    // 更新するフィールドのみ組み立て
    const userUpdateData: Record<string, string | number> = {};
    if (body.name !== undefined) userUpdateData.name = body.name;
    if (body.email !== undefined) userUpdateData.email = body.email;
    if (body.coin !== undefined) userUpdateData.coin = body.coin;

    const tokuCountsUpdateData: Record<string, object> = {};
    if (body.tokuCounts !== undefined) tokuCountsUpdateData.counts = body.tokuCounts;

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // 新規作成やエラー返却など適切に
      return jsonResponse({ error: 'ユーザー情報が見つかりません' + userId }, { status: 404 });
    }

    if (Object.keys(userUpdateData).length !== 0) {
      console.log('userUpdateData', userUpdateData);

      user = await prisma.user.update({
        where: { id: userId },
        data: userUpdateData,
      });
    }

    let tokuCounts = null;
    if (Object.keys(tokuCountsUpdateData).length !== 0) {
      // 今日の0時
      const today = getJapanTodayMidnight();

      // 今日のデータがなければ作る、あれば更新
      tokuCounts = await prisma.tokuCount.upsert({
        where: { userId_date: { userId, date: today } },
        update: tokuCountsUpdateData,
        create: {
          userId,
          date: today,
          ...tokuCountsUpdateData,
        },
      });
    }
    if (!tokuCounts) {
      return jsonResponse({ error: '徳カウント情報が見つかりません' }, { status: 404 });
    }

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

    return jsonResponse(userData, { status: 200 });
  } catch (err) {
    console.error('PATCH /api/user error', err);
    return jsonResponse({ error: 'ユーザー情報の更新に失敗しました' }, { status: 500 });
  }
}
