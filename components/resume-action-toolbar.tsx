'use client';

import * as React from 'react';
import Link from 'next/link';
import { Printer, Download, Copy, Check, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VeteranResumeData } from '@/components/veteran-resume-document';

interface ResumeActionToolbarProps {
  data: VeteranResumeData;
}

export function ResumeActionToolbar({ data }: ResumeActionToolbarProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedJson, setCopiedJson] = React.useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VAAI_Resume_${data.fullName.replace(/\s+/g, '_')}_${data.credentialUuid}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/verify/${data.credentialUuid}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="no-print mx-auto mb-6 flex max-w-[850px] flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl backdrop-blur">
      <div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-wide text-white uppercase">
            Defense Candidate 1-Page Resume
          </h2>
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-amber-400 border border-slate-700">
            {data.credentialUuid}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Validated against O*NET SOC <strong className="text-slate-200">{data.socCode}</strong> &amp; NIST SP 800-171 Rev. 3 &bull; 8.5&times;11 Letter Budget
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/resume">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 h-8"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Candidate Switcher
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="border-slate-700 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 h-8"
        >
          {copiedLink ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              Copied Link
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
              Verify Link
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadJson}
          className="border-slate-700 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 h-8"
        >
          <Download className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
          JSON
        </Button>

        <Button
          size="sm"
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs h-8 shadow-md"
        >
          <Printer className="mr-1.5 h-3.5 w-3.5" />
          Print / Save 1-Page PDF
        </Button>
      </div>
    </div>
  );
}
