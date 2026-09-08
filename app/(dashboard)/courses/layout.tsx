import * as React from 'react';
import type { Metadata } from 'next';
import { SecurityClassificationBanner } from '@/components/security-classification-banner';

export const metadata: Metadata = {
  title: 'VAAI LMS Curriculum Workspace',
  description:
    'Applied AI Operator 40-hour military veteran upskilling coursework accredited under Texas Workforce Commission ETPL # TWC-ETPL-78752-VAAI.',
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <SecurityClassificationBanner position="top" />
      <div className="flex-1">{children}</div>
      <SecurityClassificationBanner position="bottom" compact />
    </div>
  );
}
