import { jsonResponse } from '@/server/response';
import { prisma } from '@/server/prisma';
import { ShintakuImageKey, ShintakuResponse } from '@/types/shintaku';
import { ShintakuData } from '@/types/system';

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

export async function POST(request: Request) {
  try {
    const systemInfomations = await prisma.systemInfomations.findUnique({
      where: { id: 1 },
    });
    if (!systemInfomations) {
      return jsonResponse({ error: 'システム情報が存在しません' }, { status: 500 });
    }

    let count = 0;
    let nextKey = 'shikineko';
    const systemInfomationsData = systemInfomations?.shintakuData as ShintakuData;

    // 送信データを取得（部分的にどれが来てもOKなように）
    try {
      const body = await request.json();
      if (body.key !== undefined) {
        nextKey = body.key;
        console.log('key', body.key);
      } else {
        throw new Error('key none');
      }
    } catch {
      console.log('key none');
      switch (systemInfomationsData.shintakuKey) {
        case 'shikineko':
          nextKey = 'iroha';
          break;
        case 'iroha':
          nextKey = 'tenten';
          break;
        case 'tenten':
          nextKey = 'shikineko';
          break;
      }
    }

    switch (nextKey) {
      case 'shikineko':
        count = systemInfomationsData.shikinekoCount;
        systemInfomationsData.shikinekoCount = systemInfomationsData.shikinekoCount + 1;
        break;
      case 'iroha':
        count = systemInfomationsData.irohaCount;
        systemInfomationsData.irohaCount = systemInfomationsData.irohaCount + 1;
        break;
      case 'tenten':
        count = systemInfomationsData.tentenCount;
        systemInfomationsData.tentenCount = systemInfomationsData.tentenCount + 1;
        break;
      default:
        return jsonResponse({ error: '不正なキーです' }, { status: 400 });
    }
    systemInfomationsData.shintakuKey = nextKey;

    const shintakuMaster = await prisma.shintakuMessageMaster.findMany({
      where: { imageKey: nextKey },
    });

    const message = shintakuMaster[count % shintakuMaster.length].message;

    await prisma.systemInfomations.update({
      where: { id: 1 },
      data: { shintakuData: systemInfomationsData },
    });

    await prisma.shintakuMessage.create({
      data: {
        message: message,
        imageKey: nextKey,
        isReply: false,
      },
    });

    return jsonResponse({ message: 'ご神託の投稿に成功しました' });
  } catch (err) {
    console.error('POST /api/shintaku error', err);
    return jsonResponse({ error: 'ご神託の投稿に失敗しました' }, { status: 500 });
  }
}
