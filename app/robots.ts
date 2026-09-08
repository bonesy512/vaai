import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaai.edu';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/courses/',
          '/employers',
          '/employers/partnership',
          '/etpl-dossier',
          '/verify/',
          '/privacy',
          '/terms',
          '/thank-you',
        ],
        disallow: [
          '/api/attendance/',
          '/api/sandbox/',
          '/api/enterprise/hire',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
