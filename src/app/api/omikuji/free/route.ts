import { json } from '@/server/response';
import { openaiTemplateRequestStream } from '@/server/openaiTemplateRequest';
import { prisma } from '@/server/prisma';

export async function POST(request: Request) {
  try {
    const { job, fortuneNumber, period } = (await request.json()) as {
      job: string;
      fortuneNumber: number;
      period: string;
    };

    const user = `\n職業：${job}\n運勢：${fortuneNumber}\n対象期間：${period}`;

    // 1) OpenAI から AsyncIterable ストリーム取得
    const aiStream = await openaiTemplateRequestStream('omikuji_free', user);

    // 2) 文字列を貯めながらブラウザへ送る
    let full = '';
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiStream) {
            const token = chunk.choices[0]?.delta?.content ?? '';
            full += token;
            controller.enqueue(encoder.encode(token)); // ← ここで即ブラウザへ
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        } finally {
          // 3) 完了後にパースして DB 保存
          try {
            const { fortune, msg, details } = JSON.parse(full);
            await prisma.omikujiResult.create({
              data: {
                job,
                period,
                fortuneNumber,
                fortune,
                msg,
                details,
              },
            });
          } catch {
            /* JSON.parse エラーや DB エラーはログだけ */
          }
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('POST /api/omikuji error', err);
    return json({ error: 'おみくじ生成に失敗しました' + err }, { status: 500 });
  }
}
