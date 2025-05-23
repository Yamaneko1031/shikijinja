import App from '@/components/_shared/App';
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import SessionWrapper from '@/components/_shared/SessionWrapper';
import { authOptions } from '@/lib/authOptions';
import { getServerSession, User as NextAuthUser } from 'next-auth';
import { prisma } from '@/server/prisma';
import { getJapanTodayMidnight } from '@/server/date';
import { TokuCounts } from '@/types/toku';

export default async function Page() {
  let userData: User | null = null;
  let memo = '';
  const session = await getServerSession(authOptions);

  // session.user に sub プロパティが含まれるように型を拡張
  type UserWithSub = NextAuthUser & { sub?: string };

  // 1. OAuthユーザーならセッションのIDを優先
  let userId: string | undefined;
  if (session?.user) {
    const providerAccountId = (session.user as UserWithSub).sub;
    const account = await prisma.account.findFirst({
      where: {
        providerUserId: providerAccountId,
      },
    });
    userId = account?.userId;
    memo += `user account: ${userId}`;
    console.log('user account', userId);
  } else {
    // 2. ゲストはクッキーのuserId
    const cookieStore = await cookies();
    userId = cookieStore.get('userId')?.value;
    memo += `user guest: ${userId}`;
    console.log('user guest', userId);
  }

  let user = null;
  // DBのユーザー情報を取得
  if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId } });
  }

  // DB上のユーザー情報が取れなかった場合は新規作成
  if (!user) {
    user = await prisma.user.create({
      data: { isGuest: true },
    });
    memo += `user create: ${user.id}`;
    console.log('user create', user.id);
  }

  // 今日の徳カウント情報を取得
  const today = getJapanTodayMidnight();
  let tokuCounts = null;
  tokuCounts = await prisma.tokuCount.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  // 今日の徳カウント情報が無い場合は新規作成
  if (!tokuCounts) {
    tokuCounts = await prisma.tokuCount.create({
      data: { userId: user.id, date: today, counts: {} },
    });
  }

  // クライアントで使用するユーザー情報を返す
  userData = {
    id: user.id,
    isGuest: user.isGuest,
    email: user.email ?? '',
    name: user.name ?? '',
    coin: user.coin,
    tokuUpdatedAt: tokuCounts.date.toISOString(),
    tokuCounts: tokuCounts.counts as TokuCounts,
  };

  console.log('userData', userData);

  return (
    <SessionWrapper session={session}>
      <App initialUser={userData} memo={memo} />
    </SessionWrapper>
  );
}
