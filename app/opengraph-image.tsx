import { ImageResponse } from 'next/og';

export const alt =
  'VAAI | Accredited Veteran AI Enablement Platform & Workforce Credential';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background:
            'linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e293b 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          border: '8px solid #f59e0b',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '20px',
              fontWeight: 800,
              color: '#f59e0b',
              letterSpacing: '2px',
            }}
          >
            TWC ETPL # TWC-ETPL-78752-VAAI
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#94a3b8',
              fontWeight: 700,
              letterSpacing: '1px',
            }}
          >
            WIOA TITLE I ACCREDITED
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '68px',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              color: '#ffffff',
            }}
          >
            VAAI WORKFORCE LMS
          </div>
          <div
            style={{
              fontSize: '34px',
              fontWeight: 700,
              color: '#fbbf24',
              letterSpacing: '0.5px',
            }}
          >
            Certified Applied AI Operator (Level 1)
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#cbd5e1',
              maxWidth: '960px',
              lineHeight: 1.4,
            }}
          >
            40-Clock-Hour Verifiable Workforce Credential for Transitioning Military &amp; Veterans
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid rgba(148, 163, 184, 0.25)',
            paddingTop: '24px',
            fontSize: '18px',
            color: '#94a3b8',
          }}
        >
          <div>
            Austin Community College Highland Campus · Workforce Solutions Capital Area
          </div>
          <div style={{ color: '#34d399', fontWeight: 700 }}>
            W3C OpenBadges v3.0 · Ed25519 Verified
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
