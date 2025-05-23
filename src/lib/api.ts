export interface ErrorResponse {
  error: string;
}
// ① JSON をパースして返す
export async function apiFetch<T extends object>(
  input: RequestInfo,
  init?: RequestInit & { raw?: false }
): Promise<T>;

// ② Response をそのまま返す（ストリーム用）
export async function apiFetch(
  input: RequestInfo,
  init: RequestInit & { raw: true }
): Promise<Response>;

// 汎用型付きフェッチヘルパー
export async function apiFetch(
  input: RequestInfo,
  init: RequestInit & { raw?: boolean } = {}
): Promise<unknown> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  // raw=true なら Response そのまま返す
  if (init.raw) {
    if (!res.ok) {
      // Body をテキストで読んでエラーメッセージに使う
      const msg = await res.text();
      throw new Error(msg || res.statusText);
    }
    return res;
  }

  const json = (await res.json()) as ErrorResponse | object;

  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = '/';
      throw new Error('未認証');
    }
    // JSON に error プロパティがあればそれを使い、
    // なければステータス文言を投げる
    const msg =
      'error' in json && typeof (json as ErrorResponse).error === 'string'
        ? (json as ErrorResponse).error
        : res.statusText;
    throw new Error(msg);
  }

  return json;
}
