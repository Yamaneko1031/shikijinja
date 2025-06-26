import App from '@/components/_shared/App';
import { User } from '@/types/user';
import SessionWrapper from '@/components/_shared/SessionWrapper';
import { prisma } from '@/server/prisma';
import { getJapanTodayMidnight } from '@/server/date';
import { TokuCounts } from '@/types/toku';
import { getSessionUser } from '@/server/userSession';

export default async function Page() {
  let memo = '';
  const { user, guestSession, session } = await getSessionUser();
  let workUser = user;
  let guestSessionId = '';

  if (guestSession) {
    // ゲストセッションの有効期限を30日間延長
    await prisma.guestSession.update({
      where: { id: guestSession.id },
      data: { expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });
    guestSessionId = guestSession.id;
  }

  // DB上のユーザー情報が取れなかった場合は新規作成
  if (!workUser) {
    workUser = await prisma.user.create({
      data: { isGuest: true },
    });
    memo += `user create: ${workUser.id}`;

    const guestSession = await prisma.guestSession.create({
      data: {
        userId: workUser.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    guestSessionId = guestSession.id;
  }

  // 今日の徳カウント情報を取得
  const today = getJapanTodayMidnight();
  let tokuCounts = null;
  tokuCounts = await prisma.tokuCount.findFirst({
    where: {
      userId: workUser.id,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  // 今日の徳カウント情報が無い場合は新規作成
  if (!tokuCounts) {
    tokuCounts = await prisma.tokuCount.create({
      data: { userId: workUser.id, date: today, counts: {} },
    });
  }

  // クライアントで使用するユーザー情報を返す
  const userData = {
    id: workUser.id,
    isGuest: workUser.isGuest,
    registReward: workUser.registReward,
    email: workUser.email ?? '',
    name: workUser.name ?? '',
    coin: workUser.coin,
    tokuUpdatedAt: tokuCounts.date.toISOString(),
    tokuCounts: tokuCounts.counts as TokuCounts,
  } as User;

  return (
    <SessionWrapper session={session}>
      <App
        initialUser={userData}
        guestSessionId={guestSessionId}
        serverTime={new Date().toISOString()}
        memo={memo}
      />
    </SessionWrapper>
  );
}
