'use client';

import * as React from 'react';
import { Download, Copy, Check, ExternalLink, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerificationActionsToolbarProps {
  uuid: string;
}

export function VerificationActionsToolbar({ uuid }: VerificationActionsToolbarProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyPermalink = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : `https://vaai.mil/verify/${uuid}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
      <div className="text-xs text-slate-300">
        <span className="font-semibold text-white">Direct Verification Actions:</span> Export digital credentials or verify with external systems.
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyPermalink}
          className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs"
        >
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              Copied Permalink!
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
              Copy Public URL
            </>
          )}
        </Button>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs"
        >
          <a href={`/api/credentials/verify/${uuid}?format=svg`} download={`${uuid}-diploma.svg`}>
            <Download className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
            Download SVG
          </a>
        </Button>

        <Button
          asChild
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs"
        >
          <a href={`/api/credentials/verify/${uuid}`} target="_blank" rel="noopener noreferrer">
            <Wallet className="mr-1.5 h-3.5 w-3.5 text-slate-950" />
            OpenBadges v3.0 JSON-LD
            <ExternalLink className="ml-1 h-3 w-3 text-slate-950/70" />
          </a>
        </Button>
      </div>
    </div>
  );
}
