import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Users,
  FileCheck2,
  Lock,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { HeroSection } from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Accredited Military Veteran AI Workforce Training',
  description:
    'VAAI empowers transitioning U.S. military service members and veterans with an accredited 40-hour Applied AI Operator credential. 100% tuition-funded via WIOA Title I.',
};

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-lg">
              V
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-sm sm:text-base">
                VAAI
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-slate-400">
                // ETPL # TWC-ETPL-78752-VAAI
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
            <Link
              href="/courses/ai-literacy-101/lesson-1"
              className="hover:text-amber-400 transition-colors"
            >
              Curriculum &amp; Courses
            </Link>
            <Link href="/employers" className="hover:text-amber-400 transition-colors">
              Talent Clearinghouse
            </Link>
            <Link
              href="/employers/partnership"
              className="hover:text-amber-400 transition-colors"
            >
              Corporate MOUs
            </Link>
            <Link href="/etpl-dossier" className="hover:text-amber-400 transition-colors">
              State Accreditation
            </Link>
            <Link
              href="/verify/VAAI-2026-DEMO"
              className="hover:text-amber-400 transition-colors"
            >
              Verify Credential
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              asChild
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              <Link href="/courses/ai-literacy-101/lesson-1">
                Student LMS Portal
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Item 2: Hero Section strictly Above the Fold */}
      <HeroSection />

      {/* 40-Clock-Hour Curriculum Breakdown */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-md bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-mono font-semibold text-blue-400">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            TEXAS WORKFORCE COMMISSION STANDARDIZED SYLLABUS
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive 40-Clock-Hour Enablement
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every module combines rigorous classroom instruction with live interactive sandboxes, requiring 36.0+ verified contact hours logged through our continuous telemetry heartbeat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Module 1 */}
          <Card className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">
                  MODULE 01
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-700">
                  12 Contact Hrs
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-white pt-2">
                Title 38 Compliance &amp; PII Sanitization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300">
              <p>
                Non-advocacy guardrails under 38 U.S.C. §§ 5901–5905, DoD PII regex scrubbers, and zero-retention ephemeral routing.
              </p>
              <div className="pt-2">
                <Link
                  href="/courses/ai-literacy-101/lesson-1"
                  className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-semibold"
                >
                  <span>Launch Lesson 1.1</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Module 2 */}
          <Card className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">
                  MODULE 02
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-700">
                  14 Contact Hrs
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-white pt-2">
                Military Occupational Translation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300">
              <p>
                MOS-to-Civilian competency crosswalks, O*NET task alignments, and structured chron-med record extraction.
              </p>
              <div className="pt-2">
                <Link
                  href="/courses/workforce-translation/lesson-1"
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-semibold"
                >
                  <span>Launch Lesson 2.1</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Module 3 */}
          <Card className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">
                  MODULE 03
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-700">
                  8 Contact Hrs
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-white pt-2">
                Defense Enterprise Workflows
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300">
              <p>
                Multi-step prompt orchestrations, webhook automations, JSON schema validations, and audit trail generation.
              </p>
              <div className="pt-2">
                <Link
                  href="/courses/enterprise-workflows/lesson-1"
                  className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 font-semibold"
                >
                  <span>Launch Lesson 3.1</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Module 4 */}
          <Card className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  MODULE 04
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-700">
                  6 Contact Hrs
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-white pt-2">
                Defense Capstone &amp; Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300">
              <p>
                Live defense before the Academic Council (&ge; 80%), portfolio export, and OpenBadges v3.0 credential issuance.
              </p>
              <div className="pt-2">
                <Link
                  href="/courses/capstone-defense/lesson-1"
                  className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-semibold"
                >
                  <span>Launch Lesson 4.1</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Corporate Employer Partnership Network */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 rounded-md bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-mono font-semibold text-purple-400">
                <Building2 className="h-3.5 w-3.5 mr-1" />
                DEFENSE &amp; ENTERPRISE HIRING NETWORK
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Direct Pipelines to Federal &amp; Commercial Contractors
              </h2>
              <p className="text-sm text-slate-300">
                Our active Memoranda of Understanding (MOUs) guarantee candidate screening interviews while providing corporate partners with VEVRAA/OFCCP affirmative action compliance documentation at zero recruitment fees.
              </p>
            </div>

            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0"
            >
              <Link href="/employers/partnership">
                Draft Employer Partnership MOU
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>ACTIVE AGREEMENT: MOU-2026-BAH-01</span>
              </div>
              <div className="text-base font-bold text-white">Booz Allen Hamilton Inc.</div>
              <p className="text-xs text-slate-400">
                Targeting Secret / TS-cleared Applied NLP Analysts and AI Systems Operators.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>ACTIVE AGREEMENT: MOU-2026-LMT-02</span>
              </div>
              <div className="text-base font-bold text-white">Lockheed Martin Corporation</div>
              <p className="text-xs text-slate-400">
                Commitment for 6 annual interviews in autonomous systems test &amp; evaluation.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>ACTIVE AGREEMENT: MOU-2026-CACI-03</span>
              </div>
              <div className="text-base font-bold text-white">CACI International Inc.</div>
              <p className="text-xs text-slate-400">
                Prioritizing military intelligence veterans with Top Secret / SCI eligibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 text-xs font-mono font-semibold text-amber-400">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            ENROLLMENT OPEN FOR NEXT COHORT
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Launch Your Career in Applied AI Operations
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Transition your military operational excellence into an accredited, high-growth civilian AI specialization. Complete our 40-hour program with 100% WIOA Title I state voucher funding.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm h-12 px-8 shadow-xl shadow-amber-500/20"
            >
              <Link href="/courses/ai-literacy-101/lesson-1">
                Begin Orientation Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-700 bg-slate-900 text-slate-200 text-sm h-12 px-6"
            >
              <Link href="/employers">
                Access Talent Clearinghouse
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
