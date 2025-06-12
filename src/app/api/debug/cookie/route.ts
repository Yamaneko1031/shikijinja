import { jsonResponse } from '@/server/response';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('guestSessionId')?.value ?? '';

    return jsonResponse({ userId }, { status: 200 });
  } catch (err) {
    console.error('POST /api/debug/cookie error', err);
    return jsonResponse({ error: 'cookie取得に失敗しました' }, { status: 500 });
  }
}
