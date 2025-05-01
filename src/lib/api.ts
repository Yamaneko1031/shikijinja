export interface ErrorResponse {
  error: string;
}

// 汎用型付きフェッチヘルパー
export async function apiFetch<T extends object>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const json = (await res.json()) as T | ErrorResponse;

  if (!res.ok) {
    // JSON に error プロパティがあればそれを使い、
    // なければステータス文言を投げる
    const msg =
      'error' in json && typeof (json as ErrorResponse).error === 'string'
        ? (json as ErrorResponse).error
        : res.statusText;
    throw new Error(msg);
  }

  return json as T;
}
