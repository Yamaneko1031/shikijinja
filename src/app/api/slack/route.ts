import { json } from '@/server/response';

export async function POST(req: Request) {
  const { message } = await req.json();
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return json({ error: 'Webhook URL not set' }, { status: 500 });
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });

  return json({ ok: true }, { status: 200 });
}
