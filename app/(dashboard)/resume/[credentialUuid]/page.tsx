import React from 'react';
import { notFound } from 'next/navigation';
import { VeteranResumeDocument } from '@/components/veteran-resume-document';
import { ResumeActionToolbar } from '@/components/resume-action-toolbar';
import { getVeteranResumeData } from '@/lib/resume-data';

export default async function VeteranResumePage({
  params,
}: {
  params: Promise<{ credentialUuid: string }>;
}) {
  const { credentialUuid } = await params;
  const resumeData = await getVeteranResumeData(credentialUuid);

  if (!resumeData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 text-slate-100 print:bg-white print:py-0">
      {/* Non-Printable Management Toolbar */}
      <ResumeActionToolbar data={resumeData} />

      {/* The Printable 1-Page Resume */}
      <VeteranResumeDocument data={resumeData} />
    </div>
  );
}
