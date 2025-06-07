import { jsonResponse } from '@/server/response';
import { getSessionUser } from '@/server/userSession';
import { prisma } from '@/server/prisma';
export async function GET() {
  try {
    const { user } = await getSessionUser();
    if (!user) return jsonResponse({ error: 'ユーザー情報が見つかりません' }, { status: 404 });
    const allBases = await prisma.omamoriBase.findMany();
    return jsonResponse(allBases, { status: 200 });
  } catch (err) {
    console.error('GET /api/omamori/master error', err);
    return jsonResponse({ error: 'お守りマスタ取得に失敗しました' + err }, { status: 500 });
  }
}
