'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Printer,
  Download,
  ShieldCheck,
  Award,
  ExternalLink,
  Users,
  CheckCircle2,
  FileText,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  VeteranResumeDocument,
  VeteranResumeData,
} from '@/components/veteran-resume-document';
import { getAllResumeCandidates } from '@/lib/resume-data';

export default function ResumeGeneratorHubPage() {
  const candidates = React.useMemo(() => getAllResumeCandidates(), []);
  const [selectedUuid, setSelectedUuid] = React.useState<string>(candidates[0]?.credentialUuid || 'VAAI-2026-A1B2');
  const [branchFilter, setBranchFilter] = React.useState<string>('all');

  const activeCandidate = React.useMemo(() => {
    return candidates.find((c) => c.credentialUuid === selectedUuid) || candidates[0];
  }, [candidates, selectedUuid]);

  const filteredCandidates = React.useMemo(() => {
    if (branchFilter === 'all') return candidates;
    return candidates.filter((c) => c.branch === branchFilter);
  }, [candidates, branchFilter]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadJson = () => {
    if (!activeCandidate) return;
    const jsonStr = JSON.stringify(activeCandidate, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `VAAI_Resume_${activeCandidate.fullName.replace(/\s+/g, '_')}_${activeCandidate.credentialUuid}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const bulletCount = activeCandidate.militaryExperience.reduce(
    (acc, exp) => acc + exp.bullets.length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
        
        {/* Header & Controls Strip (Screen Only) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4 print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase">
                  ATS Optimized &bull; 8.5&times;11 Letter Budget
                </Badge>
                <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-400 font-mono text-[10px] uppercase">
                  SOC 15-1299.08
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1">
                Defense Candidate 1-Page Resume Generator
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch between certified military veterans, inspect ATS data structures, and generate print-ready single-page resumes without overflow spills.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/resume/${activeCandidate.credentialUuid}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 h-8"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Candidate Permalink
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadJson}
                className="border-slate-700 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 h-8"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export JSON
              </Button>

              <Button
                size="sm"
                onClick={handlePrint}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs h-8 shadow-md"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                Print / Save 1-Page PDF
              </Button>
            </div>
          </div>

          {/* Candidate Switcher Bar */}
          <div className="border-t border-slate-800/80 pt-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-sky-400" />
                Select Certified Candidate:
              </span>

              {/* Branch Filter Chips */}
              <div className="flex items-center gap-1">
                {['all', 'Army', 'Navy', 'Air Force', 'Marine Corps'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBranchFilter(b)}
                    className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                      branchFilter === b
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {b === 'all' ? 'All Branches' : b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {filteredCandidates.map((c) => (
                <button
                  key={c.credentialUuid}
                  onClick={() => setSelectedUuid(c.credentialUuid)}
                  className={`rounded-lg border p-2.5 text-left transition-all ${
                    selectedUuid === c.credentialUuid
                      ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{c.fullName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{c.branch}</span>
                  </div>
                  <div className="text-[11px] text-sky-400 font-mono mt-0.5">
                    MOS {c.mosCode} &bull; {c.securityClearance}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate">
                    {c.targetRole}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 1-Page Layout Budget HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 pt-3 text-[11px] font-mono">
            <div className="rounded bg-slate-950/60 border border-slate-800 p-2">
              <span className="text-slate-500 block text-[10px]">SUMMARY BUDGET</span>
              <span className={activeCandidate.summary.length <= 450 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                {activeCandidate.summary.length} / 450 chars &#10003;
              </span>
            </div>
            <div className="rounded bg-slate-950/60 border border-slate-800 p-2">
              <span className="text-slate-500 block text-[10px]">BULLET BUDGET</span>
              <span className={bulletCount <= 6 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                {bulletCount} / 6 bullets &#10003;
              </span>
            </div>
            <div className="rounded bg-slate-950/60 border border-slate-800 p-2">
              <span className="text-slate-500 block text-[10px]">SEAT TIME</span>
              <span className="text-emerald-400 font-bold">
                {activeCandidate.verifiedSeatHours}h (&ge; 36.0h) &#10003;
              </span>
            </div>
            <div className="rounded bg-slate-950/60 border border-slate-800 p-2">
              <span className="text-slate-500 block text-[10px]">CAPSTONE SCORE</span>
              <span className="text-emerald-400 font-bold">
                {activeCandidate.capstoneScore}% (&ge; 80%) &#10003;
              </span>
            </div>
          </div>
        </div>

        {/* The Printable Resume Component */}
        <div className="space-y-4">
          <VeteranResumeDocument data={activeCandidate} />
        </div>

      </div>
    </div>
  );
}
