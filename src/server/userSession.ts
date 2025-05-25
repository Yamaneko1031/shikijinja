import { getServerSession, User as NextAuthUser } from 'next-auth';
import { prisma } from './prisma';
import { authOptions } from '@/lib/authOptions';
import { cookies } from 'next/headers';

export const getSessionUser = async () => {
  const session = await getServerSession(authOptions);
  // session.user に sub プロパティが含まれるように型を拡張
  type UserWithSub = NextAuthUser & { sub?: string };
  let user = null;
  let guestSession = null;
  // 1. OAuthユーザーならセッションのIDを優先
  if (session?.user) {
    console.log(session.user);
    const providerAccountId = (session.user as UserWithSub).sub;
    const account = await prisma.account.findFirst({
      where: {
        providerUserId: providerAccountId,
      },
      include: { user: true },
    });
    user = account?.user;
  } else {
    // 2. ゲストはクッキーのsessionId
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('guestSessionId')?.value;
    if (sessionId) {
      guestSession = await prisma.guestSession.findFirst({
        where: {
          id: sessionId,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: { user: true },
      });
    }
    user = guestSession?.user;
  }
  return { user, guestSession, session };
};
