import { cookies } from 'next/headers';
import { json } from '@/server/response';

export async function POST(request: Request) {
  const { userId } = await request.json();
  const cookieStore = await cookies();
  // クッキーに保存
  if (!userId) {
    cookieStore.set('userId', '', { path: '/', httpOnly: true, maxAge: 0 });
  } else {
    cookieStore.set('userId', userId, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
  }
  console.log('cookieStore.set userId', userId);

  return json({ msg: 'cookie更新' }, { status: 200 });
}
