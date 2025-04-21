import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.emaPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // 最新50件だけ取得（必要に応じて変更）
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('[get-ema] error:', error);
    return NextResponse.json({ success: false, error: '取得に失敗しました' }, { status: 500 });
  }
}
