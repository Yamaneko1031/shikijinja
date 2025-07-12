// app/api/og/omikuji/route.tsx
import { ImageResponse } from 'next/og';
import { prisma } from '@/server/prisma';
import { omikujiMonthList } from '@/config/omikuji';
import { OmikujiDetail, OmikujiType } from '@/types/omikuji';
import { headers } from 'next/headers';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const omikujiId = searchParams.get('id');

    const headersList = await headers();
    // 複数のフォールバックを用意
    const host = headersList.get('host') || headersList.get('x-forwarded-host') || 'shiki-jinja.jp';

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    if (!omikujiId) {
      return new Response('ID is required', { status: 400 });
    }

    const omikuji = await prisma.omikujiResult.findUnique({
      where: { id: omikujiId },
      include: { user: true },
    });

    if (!omikuji) {
      return new Response('Omikuji not found', { status: 404 });
    }

    const omikujiType = omikuji.type as OmikujiType;
    // 運勢の表示内容を決定
    const getFortuneLabel = () => {
      switch (omikujiType) {
        case 'omikuji':
          return `${new Date(omikuji.createdAt).getFullYear()}年 運勢`;
        case 'hitohira':
          return `${omikujiMonthList[new Date(omikuji.createdAt).getMonth()]} 運勢`;
        case 'nekobiyori':
          return '明日の運勢';
        default:
          return '運勢';
      }
    };

    const details = omikuji.details as OmikujiDetail[];
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(135deg, #fef7f0 0%, #fed7aa 50%, #fde68a 100%)',
            display: 'flex',
            position: 'relative',
            fontFamily: 'system-ui',
            backgroundImage: `url(${baseUrl}/images/og/bg_omikuji.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* 左側: おみくじカード詳細 */}
          <div
            style={{
              width: '700px',
              height: '580px',
              margin: '25px',
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              padding: '30px',
              border: '4px solid #D44439',
            }}
          >
            {/* ヘッダー部分 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              {/* 運勢部分 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div
                  style={{
                    width: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      fontSize: '20px',
                      color: '#D44439',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {getFortuneLabel()}
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#D44439',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {omikuji.job ? `職業:${omikuji.job}` : ''}
                  </div>
                </div>
                <div
                  style={{
                    width: '300px',
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#D44439',
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  【{omikuji.fortune}】
                </div>
              </div>
            </div>

            {/* メッセージ */}
            <div
              style={{
                fontSize: '20px',
                // lineHeight: 1.5,
                color: 'rgba(0,0,0,0.8)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                height: '120px',
                overflow: 'hidden',
              }}
            >
              {omikuji.msg.length > 123 ? `${omikuji.msg.slice(0, 123)}...` : omikuji.msg}
            </div>

            {/* 詳細リスト */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                flex: 1,
              }}
            >
              {details.map((detail, index) => (
                <div
                  key={detail.type || index}
                  style={{
                    width: '310px',
                    height: '55px',
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    borderRadius: '8px',
                    padding: '8px',
                    border: '1px solid #e5e5e5',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {detail.type}:
                    {Array.from({ length: detail.rank }).map((_, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        alt=""
                        src={`${baseUrl}/images/og/icon_star.png`}
                        style={{
                          width: '16px',
                          height: '16px',
                          marginLeft: '2px',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#666',
                      marginLeft: '20px',
                      //   marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {detail.element.length > 18
                      ? `${detail.element.slice(0, 18)}...`
                      : detail.element}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
