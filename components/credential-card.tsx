'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Copy,
  Check,
  Download,
  ExternalLink,
  Award,
  Clock,
  Sparkles,
  FileBadge2,
} from 'lucide-react';
import { CredentialMetadata } from '@/lib/credentials';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface CredentialCardProps {
  meta: CredentialMetadata;
  showActions?: boolean;
}

export function CredentialCard({ meta, showActions = true }: CredentialCardProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedUuid, setCopiedUuid] = React.useState(false);

  const verificationUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/verify/${meta.uuid}`
      : `/verify/${meta.uuid}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyUuid = async () => {
    try {
      await navigator.clipboard.writeText(meta.uuid);
      setCopiedUuid(true);
      setTimeout(() => setCopiedUuid(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <Card className="overflow-hidden border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md">
      {/* Top Gold Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="rounded-md bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  WIOA TITLE I ACCREDITED
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] text-slate-400">OpenBadges v3.0</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-0.5">
                {meta.courseTitle}
              </CardTitle>
            </div>
          </div>

          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono text-[10px]"
          >
            <ShieldCheck className="mr-1 h-3 w-3 text-emerald-400" />
            VERIFIED
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        {/* Recipient & Military Branch */}
        <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Recipient</div>
              <div className="text-sm font-extrabold text-white">{meta.recipientName}</div>
            </div>
            <Badge
              variant="secondary"
              className="bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              {meta.militaryBranch.toUpperCase()} VETERAN
            </Badge>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-slate-950/40 p-2.5 border border-slate-800/60">
            <div className="flex items-center text-slate-400 text-[10px]">
              <Clock className="mr-1 h-3 w-3 text-emerald-400" />
              Verified Seat Time
            </div>
            <div className="mt-1 font-mono font-bold text-emerald-400 text-sm">
              {meta.contactHours.toFixed(1)} Clock Hours
            </div>
            <div className="text-[9px] text-slate-500">WIOA Mandate &ge; 36.0h</div>
          </div>

          <div className="rounded-md bg-slate-950/40 p-2.5 border border-slate-800/60">
            <div className="flex items-center text-slate-400 text-[10px]">
              <Sparkles className="mr-1 h-3 w-3 text-sky-400" />
              Capstone Score
            </div>
            <div className="mt-1 font-mono font-bold text-sky-400 text-sm">
              {meta.capstoneScore.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-500">Passing Grade &ge; 80.0%</div>
          </div>
        </div>

        {/* UUID Row */}
        <div className="flex items-center justify-between rounded-md bg-slate-950/80 px-3 py-1.5 border border-slate-800 font-mono text-xs">
          <span className="text-[11px] text-slate-400">UUID:</span>
          <span className="font-semibold text-slate-200">{meta.uuid}</span>
          <button
            onClick={handleCopyUuid}
            className="text-slate-400 hover:text-amber-400 transition-colors p-1"
            title="Copy UUID"
          >
            {copiedUuid ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="p-5 pt-0 flex flex-wrap gap-2 border-t border-slate-800/60 mt-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex-1 border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs"
          >
            {copiedLink ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                Copied Link!
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                Copy Link
              </>
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs"
          >
            <a href={`/api/credentials/verify/${meta.uuid}?format=svg`} download={`${meta.uuid}.svg`}>
              <Download className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              SVG Diploma
            </a>
          </Button>

          <Button
            asChild
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs"
          >
            <Link href={`/verify/${meta.uuid}`}>
              <FileBadge2 className="mr-1.5 h-3.5 w-3.5" />
              Public Terminal
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
