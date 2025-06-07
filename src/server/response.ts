import { NextResponse } from 'next/server';

/**
 * - Date を toISOString() に変換
 * - Json フィールドはそのまま
 * - ネストも深く自動で変換
 */
function serializeDates(obj: unknown): unknown {
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeDates);
  }
  if (obj && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const k in obj) {
      out[k] = serializeDates((obj as Record<string, unknown>)[k]);
    }
    return out;
  }
  return obj;
}

/**
 * NextResponse.json のラッパー。
 * Prisma から返ってきたオブジェクトをそのまま渡せば
 * Date→string の変換を自動でやってくれる。
 */
export function jsonResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(serializeDates(data), init);
}
