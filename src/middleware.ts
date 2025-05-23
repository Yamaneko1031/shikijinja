import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // "/"（トップページ）か "/api/..." の時だけ実行
  if (pathname === '/' || pathname.startsWith('/api/')) {
    const response = NextResponse.next();

    const userId = request.cookies.get('userId')?.value;
    if (userId) {
      response.cookies.set('userId', userId, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return response;
  }

  // それ以外は何もせずスルー
  return NextResponse.next();
}
