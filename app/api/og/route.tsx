import type { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export async function GET(req: NextRequest): Promise<Response | ImageResponse> {
  try {
    const { searchParams } = new URL(req.url);
    
    const title = searchParams.has('title')
      ? searchParams.get('title')
      : 'Ratio Machina Starter';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #e0e0e0 0%, #f8f8f8 60%, #b0b0b0 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(180,180,180,0.10)',
                border: '3px solid #27272a',
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                }}
              >
                RM
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              background: 'linear-gradient(to bottom, #ffffff, #888888)',
              backgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '80%',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.error('Failed to generate OG image:', e);
    return new Response('Failed to generate the image', { status: 500 });
  }
}