import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VAAI - Veteran AI Enablement Platform',
    short_name: 'VAAI',
    description:
      'Texas Workforce Commission ETPL Accredited 40-Clock-Hour Veteran AI Credential & Hiring Clearinghouse',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
