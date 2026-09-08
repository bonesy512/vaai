import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'B2B Employer Partnership Agreements (MOU)',
  description:
    'Formalize non-exclusive veteran hiring partnerships with VAAI. Guaranteed interview commitments, zero placement fees, and VEVRAA/OFCCP affirmative action compliance.',
};

export default function PartnershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
