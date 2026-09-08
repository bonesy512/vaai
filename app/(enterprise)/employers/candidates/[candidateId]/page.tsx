import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  Lock,
  Clock,
  Sparkles,
  Building,
  CheckCircle2,
  ExternalLink,
  FileBadge2,
} from 'lucide-react';
import { VETERAN_CANDIDATES } from '@/lib/candidates';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CandidatePortfolioViewer } from '@/components/candidate-portfolio-viewer';
import { HireActionDialog } from '@/components/hire-action-dialog';

interface CandidateDetailPageProps {
  params: Promise<{ candidateId: string }>;
}

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const { candidateId } = await params;
  const candidate = VETERAN_CANDIDATES.find((c) => c.id === candidateId);

  if (!candidate) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
      {/* Back link */}
      <div>
        <Link
          href="/employers"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Candidate Directory
        </Link>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                {candidate.anonymizedId}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{candidate.branch} Veteran</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {candidate.name}
            </h1>

            <div className="text-sm font-medium text-slate-300">
              {candidate.rank} • <span className="text-amber-400">MOS {candidate.mosCode}: {candidate.mosTitle}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono text-xs px-3 py-1"
            >
              <ShieldCheck className="mr-1.5 h-4 w-4 text-emerald-400" />
              WIOA ACCREDITED GRADUATE
            </Badge>

            <Badge
              variant="secondary"
              className="border-amber-500/40 bg-amber-950/40 text-amber-300 font-mono text-xs px-3 py-1"
            >
              <Lock className="mr-1.5 h-3.5 w-3.5" />
              {candidate.securityClearance}
            </Badge>

            <HireActionDialog
              candidateId={candidate.id}
              candidateName={candidate.name}
              candidateUuid={candidate.credentialUuid}
            />
          </div>
        </div>

        {/* Overview & Military Translation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Civilian Career Profile &amp; Applied AI Competency
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {candidate.civilianCareerSummary}
              </p>
            </div>

            <div className="rounded-lg bg-slate-950/60 p-4 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-slate-200">
                Military Service &amp; Leadership Highlight:
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {candidate.militaryExperienceHighlight}
              </p>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Certified AI &amp; Enterprise Competencies:
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.topAiCompetencies.map((c) => (
                  <Badge
                    key={c}
                    className="bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs px-2.5 py-1 border border-slate-700"
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Metrics Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              State Workforce Audit Metrics
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Verified Contact Hours:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {candidate.contactHours.toFixed(1)} Clock Hours
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Capstone Exam Grade:</span>
                <span className="font-mono font-bold text-sky-400">
                  {candidate.capstoneGrade.toFixed(1)}% (Passed)
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Regulatory Standard:</span>
                <span className="font-semibold text-amber-400">
                  Title 38 Safe Harbor
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Digital Wallet Standard:</span>
                <span className="font-semibold text-slate-200">
                  OpenBadges v3.0
                </span>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs mt-2"
            >
              <Link href={`/verify/${candidate.credentialUuid}`} target="_blank">
                <FileBadge2 className="mr-2 h-4 w-4 text-amber-400" />
                View Public Verifiable Credential
                <ExternalLink className="ml-1.5 h-3 w-3 text-slate-400" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Capstone Artifact Sandbox Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Vetted Capstone Workflow Artifacts
            </h2>
            <p className="text-xs text-slate-400">
              Interactive review of sanitized enterprise blueprints constructed and tested during the 40-hour program
            </p>
          </div>
        </div>

        <CandidatePortfolioViewer artifacts={candidate.artifacts} />
      </section>
    </div>
  );
}
