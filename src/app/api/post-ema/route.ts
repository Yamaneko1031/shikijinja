import { prisma } from '@/server/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const { texts, reply, emaImage } = body;

  try {
    const post = await prisma.emaPost.create({
      data: {
        texts, // JSONとして保存
        reply,
        emaImage,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: '保存に失敗しました' }, { status: 500 });
  }
}
