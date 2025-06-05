import { json } from '@/server/response';
import { getSessionUser } from '@/server/userSession';
import { prisma } from '@/server/prisma';
export async function GET() {
  try {
    const { user } = await getSessionUser();
    if (!user) return json({ error: 'ユーザー情報が見つかりません' }, { status: 404 });
    const allBases = await prisma.omamoriBase.findMany();
    return json(allBases, { status: 200 });
  } catch (err) {
    console.error('GET /api/omamori/master error', err);
    return json({ error: 'お守りマスタ取得に失敗しました' + err }, { status: 500 });
  }
}
