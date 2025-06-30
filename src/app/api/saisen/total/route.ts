import { prisma } from '@/server/prisma';
import { jsonResponse } from '@/server/response';

export async function GET() {
  try {
    const systemInfo = await prisma.systemInfomations.findFirst({
      where: { id: 1 },
    });
    const res = {
      totalSaisen: systemInfo?.totalSaisen || 0,
    };
    return jsonResponse(res);
  } catch (err) {
    console.error(`GET /api/saisen/total error`, err);
    return jsonResponse({ error: '総徳の取得に失敗しました' }, { status: 500 });
  }
}
