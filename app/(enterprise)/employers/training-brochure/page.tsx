import type { Metadata } from 'next';
import { TrainingBrochureView } from '@/components/enterprise/training-brochure-view';

export const metadata: Metadata = {
  title: 'B2B Defense Enterprise Training Brochure & Catalog | VAAI',
  description:
    'Institutional, print-ready B2B Defense Enterprise Training Brochure detailing cohort pricing ($12,500/seat), SkillBridge alignment, MOS crosswalks, zero-overhead WASM sandboxes, and cleared veteran talent pipeline guarantees across 10 accredited programs.',
  openGraph: {
    title: 'VAAI B2B Defense Enterprise Training Brochure & Catalog',
    description:
      '425 Clock Hours across Engineering, Cyber Defense, and GovCon Operations for defense contractors. Fixed cohort pricing ($12,500/seat) and DoD SkillBridge corporate partner alignment.',
    url: 'https://vaai.edu/employers/training-brochure',
    siteName: 'VAAI - Veteran AI Enablement Platform',
    locale: 'en_US',
    type: 'article',
  },
};

export default function TrainingBrochurePage() {
  return <TrainingBrochureView />;
}
