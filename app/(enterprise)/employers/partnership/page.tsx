'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  FileCheck,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { SEED_EMPLOYER_AGREEMENTS } from '@/lib/mou-template';
import { EmployerAgreement } from '@/lib/schemas/mou';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MouStatusBadge } from '@/components/mou-status-badge';
import { MouGeneratorForm } from '@/components/mou-generator-form';

export default function EmployerPartnershipHubPage() {
  const [agreements, setAgreements] = React.useState<EmployerAgreement[]>(SEED_EMPLOYER_AGREEMENTS);
  const [showGenerator, setShowGenerator] = React.useState(false);

  // Attempt to fetch any dynamically created agreements from API
  React.useEffect(() => {
    async function loadAgreements() {
      try {
        const res = await fetch('/api/enterprise/mou');
        if (res.ok) {
          const data = await res.json();
          if (data.agreements && data.agreements.length > 0) {
            setAgreements(data.agreements);
          }
        }
      } catch {
        // Fallback to seed data
      }
    }
    loadAgreements();
  }, []);

  const handleAgreementCreated = (newAgreement: EmployerAgreement) => {
    setAgreements([newAgreement, ...agreements]);
    setShowGenerator(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Hero Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 rounded-md bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-mono font-semibold text-amber-400">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-amber-400" />
            WIOA TITLE I &amp; VEVRAA COMPLIANCE FRAMEWORK
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            B2B Employer Partnership Agreements
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Formalize your organization&apos;s veteran hiring pipeline through a non-exclusive Memorandum of
            Understanding (MOU). Gain prioritized access to security-cleared AI operators with zero recruitment fees,
            while fulfilling Department of Labor VEVRAA and OFCCP affirmative action hiring quotas.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <Button
              onClick={() => setShowGenerator(!showGenerator)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              {showGenerator ? 'Close MOU Generator' : 'Draft & Execute New MOU'}
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-700 bg-slate-800 text-slate-200 text-xs"
            >
              <Link href="/employers">
                <Users className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                Browse Candidate Directory
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-300 text-xs"
            >
              <Link href="/vendor-security-assessment">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                Defense VSA Package
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Generator Form Section (Collapsible) */}
      {showGenerator && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Self-Serve MOU Execution Wizard
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGenerator(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
          <MouGeneratorForm onAgreementCreated={handleAgreementCreated} />
        </section>
      )}

      {/* Strategic Framework Benefits Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-800 bg-slate-900/60 shadow-lg">
          <CardHeader className="pb-2">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20 w-fit">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-bold text-white mt-2">
              $0 Direct Placement Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400 leading-relaxed">
            All candidate instruction, technical vetting, and verifiable credentialing is 100% funded through Texas
            Workforce Commission ETPL allocations and federal WIOA Title I workforce grants.
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 shadow-lg">
          <CardHeader className="pb-2">
            <div className="rounded-lg bg-sky-500/10 p-2 text-sky-400 border border-sky-500/20 w-fit">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-bold text-white mt-2">
              VEVRAA &amp; OFCCP Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400 leading-relaxed">
            Formal partnership MOUs document targeted veteran outreach for federal contractor affirmative action
            benchmarks under 38 U.S.C. § 4212, protecting against audit deficiencies.
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 shadow-lg">
          <CardHeader className="pb-2">
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20 w-fit">
              <Award className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-bold text-white mt-2">
              State-Verified Seat Time
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400 leading-relaxed">
            Every graduate introduced under this MOU has logged $\ge 36.0$ verified non-idle contact hours and earned
            $\ge 80.0\%$ on the practical capstone exam, certified via OpenBadges v3.0 digital diplomas.
          </CardContent>
        </Card>
      </section>

      {/* Active Defense & Enterprise Agreements Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-400" />
              Active Corporate Partnership Roster
            </h2>
            <p className="text-xs text-slate-400">
              Approved Memoranda of Understanding on file with the Texas Workforce Commission
            </p>
          </div>

          <Badge variant="outline" className="border-slate-700 text-xs font-mono text-slate-300">
            {agreements.length} Ratified Partners
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900 font-semibold text-slate-200">
              <tr>
                <th className="p-3.5">Agreement Reference</th>
                <th className="p-3.5">Corporate Legal Entity</th>
                <th className="p-3.5">Clearance Scope</th>
                <th className="p-3.5 text-center">Annual Target</th>
                <th className="p-3.5">Execution Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {agreements.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-semibold text-amber-400">
                    <Link
                      href={`/employers/partnership/${a.id}`}
                      className="hover:underline flex items-center gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      {a.id}
                    </Link>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{a.companyLegalName}</div>
                    <div className="text-[11px] text-slate-400">
                      EIN: <code className="font-mono">{a.employerEin}</code> • POC: {a.pointOfContact.name}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="outline" className="border-slate-700 text-[10px] text-slate-300">
                      {a.clearanceRequirements}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-emerald-400">
                    {a.annualInterviewCommitment} Interviews/yr
                  </td>
                  <td className="p-3.5">
                    <MouStatusBadge status={a.status} />
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs text-amber-400 hover:text-amber-300 hover:bg-slate-800"
                    >
                      <Link href={`/employers/partnership/${a.id}`}>
                        View Full Contract &rarr;
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
