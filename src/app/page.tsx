import App from '@/components/_shared/App';
import { User } from '@/types/user';
import SessionWrapper from '@/components/_shared/SessionWrapper';
import { prisma } from '@/server/prisma';
import { getJapanTodayMidnight } from '@/server/date';
import { TokuCounts } from '@/types/toku';
import { getSessionUser } from '@/server/userSession';
import { headers } from 'next/headers';

// ボット判定関数
const isBot = (userAgent: string): boolean => {
  return userAgent === '';
  // const botPatterns = [
  //   /googlebot/i,
  //   /bingbot/i,
  //   /slurp/i,
  //   /duckduckbot/i,
  //   /baiduspider/i,
  //   /yandexbot/i,
  //   /facebookexternalhit/i,
  //   /twitterbot/i,
  //   /linkedinbot/i,
  //   /discordbot/i,
  //   /uptimerobot/i,
  //   /pingdom/i,
  //   /crawler/i,
  //   /spider/i,
  //   /bot/i
  // ];

  // return botPatterns.some(pattern => pattern.test(userAgent));
};

export default async function Page() {
  // User-Agentを取得
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  // console.log(userAgent);

  if (isBot(userAgent)) {
    // クライアントで使用するユーザー情報を返す
    const dummyUser = {
      id: 'dummy',
      isGuest: true,
      email: '',
      name: '',
      coin: 0,
      tokuUpdatedAt: '',
      tokuCounts: {} as TokuCounts,
      permanentTokuCounts: {} as TokuCounts,
      fortunes: [],
    } as User;
    return (
      <App
        initialUser={dummyUser}
        guestSessionId={''}
        serverTime={new Date().toISOString()}
        memo={'bot'}
      />
    );
  }

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
      data: { isGuest: true, userAgent: userAgent },
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
    email: workUser.email ?? '',
    name: workUser.name ?? '',
    coin: workUser.coin,
    tokuUpdatedAt: tokuCounts.date.toISOString(),
    tokuCounts: tokuCounts.counts as TokuCounts,
    permanentTokuCounts: workUser.permanentTokuCounts as TokuCounts,
    fortunes: workUser.fortunes,
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
