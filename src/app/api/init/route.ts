import { cookies } from 'next/headers';
import { jsonResponse } from '@/server/response';

export async function POST(request: Request) {
  const { guestSessionId } = await request.json();
  const cookieStore = await cookies();
  // クッキーに保存
  if (guestSessionId === '') {
    cookieStore.set('guestSessionId', '', { path: '/', httpOnly: true, maxAge: 0 });
  } else {
    cookieStore.set('guestSessionId', guestSessionId, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return jsonResponse({ result: true }, { status: 200 });
}
