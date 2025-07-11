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

  if (process.env.NODE_ENV === 'production') {
    if (pathname.startsWith('/admin')) {
      // あなたのIPアドレスを設定
      const allowedIP = process.env.ADMIN_IP;
      // IPアドレスをチェックする
      const clientIP =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip')?.trim() ||
        request.headers.get('cf-connecting-ip')?.trim();
      console.log('アクセス元IP:', clientIP, '許可IP:', allowedIP);
      if (!clientIP || clientIP !== allowedIP) {
        return NextResponse.rewrite(new URL('/404', request.url));
      }
    }
  }

  // それ以外は何もせずスルー
  return NextResponse.next();
}
