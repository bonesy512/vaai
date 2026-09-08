import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          border: '6px solid #f59e0b',
          borderRadius: '36px',
          color: '#f59e0b',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: '72px', fontWeight: 900, letterSpacing: '-2px' }}>
          VAAI
        </div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#94a3b8',
            letterSpacing: '2px',
            marginTop: '4px',
          }}
        >
          ETPL 78752
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
