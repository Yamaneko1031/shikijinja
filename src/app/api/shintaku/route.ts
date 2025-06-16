import { jsonResponse } from '@/server/response';
import { prisma } from '@/server/prisma';
import { ShintakuImageKey, ShintakuResponse } from '@/types/shintaku';

export async function GET() {
  try {
    const posts = await prisma.shintakuMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const response: ShintakuResponse = {
      posts: posts.map((post) => ({
        id: post.id,
        message: post.message,
        isReply: post.isReply,
        createdAt: post.createdAt.toISOString(),
        imageKey: post.imageKey as ShintakuImageKey,
      })),
    };

    return jsonResponse(response);
  } catch (err) {
    console.error('GET /api/shintaku error', err);
    return jsonResponse({ error: 'ご神託の取得に失敗しました' }, { status: 500 });
  }
}
