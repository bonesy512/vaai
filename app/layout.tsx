import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '@/components/site-footer';
import { CookieBanner } from '@/components/cookie-banner';
import { MobileStickyCta } from '@/components/mobile-sticky-cta';
import { Analytics } from '@/components/analytics';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vaai.edu'),
  title: {
    default: 'VAAI | Certified Applied AI Operator for Military Veterans',
    template: '%s | VAAI - Veteran AI Enablement',
  },
  description:
    'Accredited 40-hour AI workforce credentialing program empowering transitioning military service members and veterans with high-demand digital skills. Texas Workforce Commission ETPL Approved.',
  keywords: [
    'Veteran AI Training',
    'Applied AI Operator',
    'Texas Workforce Commission ETPL',
    'WIOA Title I',
    'Defense Contractor Veteran Hiring',
    'VEVRAA Affirmative Action',
    'Military MOS Translation',
    'OpenBadges v3.0',
    'Title 38 Safe Harbor',
  ],
  authors: [{ name: 'Veteran AI Enablement Initiative LLC' }],
  creator: 'Veteran AI Enablement Initiative LLC',
  openGraph: {
    title: 'VAAI | Certified Applied AI Operator for Military Veterans',
    description:
      'Accredited 40-hour AI workforce credentialing program empowering transitioning military service members and veterans. TWC ETPL Provider # TWC-ETPL-78752-VAAI.',
    url: 'https://vaai.edu',
    siteName: 'VAAI Workforce LMS',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VAAI | Certified Applied AI Operator for Military Veterans',
    description:
      'Accredited 40-hour AI workforce credentialing program empowering transitioning military service members and veterans.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col">
        <Analytics />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <SiteFooter />
        <MobileStickyCta />
        <CookieBanner />
      </body>
    </html>
  );
}

