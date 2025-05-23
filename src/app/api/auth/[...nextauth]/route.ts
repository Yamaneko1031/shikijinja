import NextAuth, { User, Account } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// import TwitterProvider from 'next-auth/providers/twitter';
import GithubProvider from 'next-auth/providers/github';
import { prisma } from '@/server/prisma';
import { cookies } from 'next/headers';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // TwitterProvider({
    //   clientId: process.env.X_CLIENT_ID!,
    //   clientSecret: process.env.X_CLIENT_SECRET!,
    // }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // 他プロバイダーもここに追加可能
  ],
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (!account) return false;

      // 1. SNSログイン済みのAccountを探す
      const existingAccount = await prisma.account.findUnique({
        where: {
          provider_providerUserId: {
            provider: account.provider,
            providerUserId: account.providerAccountId,
          },
        },
        include: { user: true },
      });

      if (existingAccount) {
        // すでに該当アカウントがある（一度ログイン済み）
        return true;
      }

      // --- ここから追加 ---
      // 2. email一致のUserが既に存在する場合、そのUserにSNSアカウントを紐付けてログインさせる
      if (user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (existingUser) {
          // SNS連携情報をAccountに登録
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerUserId: account.providerAccountId,
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
            },
          });
          // そのままログイン成功
          return true;
        }
      }

      // 3. ゲストuserIdで「SNS未連携のUser」を本アカウントに昇格
      const cookieStore = await cookies();
      const guestUserId = cookieStore.get('userId')?.value;
      if (!guestUserId) return true;

      // ゲストUserを本アカウント化
      await prisma.user.update({
        where: { id: guestUserId },
        data: {
          isGuest: false,
          email: user.email,
          name: user.name,
        },
      });

      // SNS連携情報をAccountに登録
      await prisma.account.create({
        data: {
          userId: guestUserId,
          provider: account.provider,
          providerUserId: account.providerAccountId,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
        },
      });

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
