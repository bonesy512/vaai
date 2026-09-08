'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react';
import { VETERAN_CANDIDATES, VeteranCandidate } from '@/lib/candidates';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { HireActionDialog } from '@/components/hire-action-dialog';

export default function EmployerCandidateDirectoryPage() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = React.useState<string>('All');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [selectedClearance, setSelectedClearance] = React.useState<string>('All');
  const [minGrade, setMinGrade] = React.useState<number>(80);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [hiringCandidate, setHiringCandidate] = React.useState<VeteranCandidate | null>(null);

  const handleOpenSandbox = (candidate: VeteranCandidate) => {
    router.push(`/employers/candidates/${candidate.id}#sandbox`);
  };

  const handleInitiateHire = (candidate: VeteranCandidate) => {
    setHiringCandidate(candidate);
  };

  const filteredCandidates = React.useMemo(() => {
    return VETERAN_CANDIDATES.filter((candidate) => {
      if (selectedBranch !== 'All' && candidate.branch !== selectedBranch) {
        return false;
      }
      if (selectedCategory !== 'All' && candidate.mosCategory !== selectedCategory) {
        return false;
      }
      if (selectedClearance !== 'All' && candidate.securityClearance !== selectedClearance) {
        return false;
      }
      if (candidate.capstoneGrade < minGrade) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = candidate.name.toLowerCase().includes(q);
        const matchMos = candidate.mosTitle.toLowerCase().includes(q) || candidate.mosCode.toLowerCase().includes(q);
        const matchComp = candidate.topAiCompetencies.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchMos && !matchComp) {
          return false;
        }
      }
      return true;
    });
  }, [selectedBranch, selectedCategory, selectedClearance, minGrade, searchQuery]);

  const resetFilters = () => {
    setSelectedBranch('All');
    setSelectedCategory('All');
    setSelectedClearance('All');
    setMinGrade(80);
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Hero Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Building className="h-64 w-64 text-amber-400" />
        </div>

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 rounded-md bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-mono font-semibold text-amber-400">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-amber-400" />
            DEFENSE CONTRACTOR &amp; ENTERPRISE RECRUITING CLEARINGHOUSE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Vetted Veteran AI Specialists
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Directly source state-accredited military veterans certified in enterprise automation,
            zero-retention NLP workflows, and Title 38 safe harbor data handling. All candidates hold audited WIOA
            credentials and verified security clearances.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>36.0+ WIOA Contact Hours Audited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>80.0%+ Passing Capstone Lab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>OpenBadges v3.0 Verifiable Diplomas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Candidate Filters</h2>
            <Badge variant="outline" className="border-slate-700 text-[11px] text-slate-400">
              {filteredCandidates.length} Available
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search skills, MOS, names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none w-48 sm:w-64"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-white"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Military Branch */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Military Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="All">All Branches</option>
              <option value="Army">U.S. Army</option>
              <option value="Marine Corps">U.S. Marine Corps</option>
              <option value="Navy">U.S. Navy</option>
              <option value="Air Force">U.S. Air Force</option>
              <option value="Space Force">U.S. Space Force</option>
            </select>
          </div>

          {/* MOS Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              MOS Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Cyber/IT">Cyber / Information Technology</option>
              <option value="Intel">All-Source Intelligence</option>
              <option value="Logistics">Supply Chain &amp; Logistics</option>
              <option value="Combat Arms">Combat Arms &amp; Operations</option>
            </select>
          </div>

          {/* Security Clearance */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Clearance Level
            </label>
            <select
              value={selectedClearance}
              onChange={(e) => setSelectedClearance(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="All">All Clearances</option>
              <option value="Top Secret / SCI">Top Secret / SCI</option>
              <option value="Secret">Secret</option>
              <option value="Clearance Eligible">Clearance Eligible</option>
            </select>
          </div>

          {/* Minimum Capstone Score */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Min Capstone Grade: {minGrade}%
            </label>
            <select
              value={minGrade}
              onChange={(e) => setMinGrade(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value={80}>&ge; 80% (Passing Standard)</option>
              <option value={85}>&ge; 85% (High Competency)</option>
              <option value={90}>&ge; 90% (Distinguished Honor)</option>
              <option value={95}>&ge; 95% (Top 5% Cohort)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="flex flex-col justify-between border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all duration-200 shadow-xl group"
          >
            <div>
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {candidate.anonymizedId}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {candidate.name}
                    </h3>
                    <div className="text-xs text-slate-400">
                      {candidate.rank} • {candidate.branch}
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-mono ${
                      candidate.securityClearance.includes('Top Secret')
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                    } border`}
                  >
                    <Lock className="mr-1 h-3 w-3" />
                    {candidate.securityClearance}
                  </Badge>
                </div>

                <div className="mt-2 rounded bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 border border-slate-800/80">
                  <span className="font-semibold text-amber-400 mr-1.5 font-mono">
                    [{candidate.mosCode}]
                  </span>
                  {candidate.mosTitle}
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3 text-xs">
                {/* Metrics Pill Row */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="rounded bg-slate-950/60 p-2 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">WIOA Contact Hours</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {candidate.contactHours.toFixed(1)} Hours
                    </span>
                  </div>
                  <div className="rounded bg-slate-950/60 p-2 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Capstone Lab Grade</span>
                    <span className="font-mono font-bold text-sky-400 text-xs">
                      {candidate.capstoneGrade.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* AI Competencies */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Verified Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.topAiCompetencies.map((comp) => (
                      <Badge
                        key={comp}
                        variant="outline"
                        className="border-slate-700 bg-slate-950/80 text-slate-300 text-[10px] font-normal"
                      >
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>

            <CardFooter className="p-5 pt-3 border-t border-slate-800/60 bg-slate-950/30 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full">
                {/* Existing interactive sandbox button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenSandbox(candidate)}
                  className="border-sky-500/40 bg-sky-950/20 text-xs font-semibold text-sky-300 hover:bg-sky-900/40"
                >
                  Run Capstone Sandbox
                </Button>

                {/* New 1-Page ATS Printable Resume Link */}
                <Link
                  href={`/resume/${candidate.credentialUuid || candidate.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-500/40 bg-emerald-950/20 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40"
                  >
                    <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    1-Page Resume (PDF)
                  </Button>
                </Link>

                {/* Existing hire placement modal trigger */}
                <Button
                  size="sm"
                  onClick={() => handleInitiateHire(candidate)}
                  className="bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Record Hire
                </Button>
              </div>

              <Button
                asChild
                variant="ghost"
                className="w-full text-slate-400 hover:text-amber-400 hover:bg-slate-900/60 text-xs font-medium transition-colors"
              >
                <Link href={`/employers/candidates/${candidate.id}`}>
                  Inspect Portfolio &amp; Capstone
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <Users className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="text-base font-bold text-white">No candidates match active filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your branch, MOS category, or clearance level filters to view more candidates.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
            Reset All Filters
          </Button>
        </div>
      )}

      {/* Hire Placement Modal */}
      {hiringCandidate && (
        <HireActionDialog
          candidateId={hiringCandidate.id}
          candidateName={hiringCandidate.name}
          candidateUuid={hiringCandidate.credentialUuid}
          open={!!hiringCandidate}
          onOpenChange={(isOpen) => {
            if (!isOpen) setHiringCandidate(null);
          }}
          trigger={null}
        />
      )}
    </div>
  );
}
