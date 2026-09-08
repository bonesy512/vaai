import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TWC State ETPL & WIOA Institutional Dossier',
  description:
    'Official accreditation package and institutional capacity filing for the Texas Workforce Commission (TWC ETPL Provider ID: TWC-ETPL-78752-VAAI) and Workforce Solutions Capital Area.',
};

export default function EtplDossierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
