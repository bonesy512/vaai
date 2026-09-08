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
  Building2,
  ExternalLink,
  ChevronRight,
  Cpu,
  ShieldAlert,
  Briefcase,
  Layers,
  GraduationCap,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'VAAI | The Defense & Veteran AI Enablement Platform',
  description:
    'State-accredited 425-hour institutional AI curriculum for transitioning U.S. military service members and defense contractors. 100% tuition-funded via WIOA Title I and DoD SkillBridge.',
};

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-lg">
              V
            </div>
            <div>
              <span className="font-extrabold text-white tracking-tight text-base">
                VAAI
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-slate-400">
                // ETPL # TWC-ETPL-78752-VAAI
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
            <Link
              href="/courses"
              className="hover:text-amber-400 transition-colors"
            >
              Curriculum &amp; Catalog
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
            <Link
              href="/admin"
              className="text-amber-400 hover:text-amber-300 transition-colors font-mono"
            >
              Admin LMS
            </Link>
          </nav>

          <div className="flex items-center space-x-2.5">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-slate-300 hover:text-white"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/10"
            >
              <Link href="/register">
                Register Veteran
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* GovSec Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-mono font-semibold text-amber-400 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>The Defense &amp; Veteran AI Enablement Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Mission-Ready AI Engineering &amp; Cyber Defense for{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                U.S. Military Veterans
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              A state-accredited 425-clock-hour catalog translating military operational discipline into
              high-throughput AI workflows, zero-retention defense pipelines, and defense contractor readiness.
            </p>

            {/* Direct CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm h-12 px-7 shadow-xl shadow-amber-500/20"
              >
                <Link href="/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Accredited Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-700 bg-slate-900/90 text-slate-100 hover:bg-slate-800 hover:text-white font-semibold text-sm h-12 px-6 shadow-md"
              >
                <Link href="/verify/VAAI-2026-DEMO">
                  <Award className="mr-2 h-4 w-4 text-emerald-400" />
                  Verify Credentials
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-800 bg-slate-900/50 text-slate-300 hover:text-white font-semibold text-sm h-12 px-6"
              >
                <Link href="/employers/partnership">
                  <Users className="mr-2 h-4 w-4 text-blue-400" />
                  Employer Partnership
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & GovSec Telemetry Strip */}
      <section className="border-b border-slate-800 bg-slate-900/80 backdrop-blur py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-800 bg-slate-950/60">
              <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white font-mono">110 / 110 SPRS</div>
                <div className="text-xs text-slate-400">DoD Supplier Risk System</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-800 bg-slate-950/60">
              <Lock className="h-6 w-6 text-blue-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white font-mono">NIST SP 800-171</div>
                <div className="text-xs text-slate-400">Rev. 3 CUI &amp; Safe Harbor</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-800 bg-slate-950/60">
              <FileCheck2 className="h-6 w-6 text-amber-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white font-mono">TWC-ETPL-78752-VAAI</div>
                <div className="text-xs text-slate-400">WIOA Title I Eligible Code</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-800 bg-slate-950/60">
              <Award className="h-6 w-6 text-purple-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white font-mono">OpenBadges v3.0</div>
                <div className="text-xs text-slate-400">Ed25519 Tamper-Proof</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Learning Pathways Grid (425-Hour Catalog) */}
      <section className="py-16 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-mono text-xs">
            COMPREHENSIVE 425-CLOCK-HOUR ACCREDITED CURRICULUM
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Three Institutional Learning Pathways
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Structured for maximum veteran wage outcomes, DOD SkillBridge eligibility, and corporate enterprise tuition assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pathway 1: Engineering Track */}
          <Card className="border-slate-800 bg-slate-900/50 hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Cpu className="h-6 w-6" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 font-mono">
                  220 Hours / 5 Courses
                </Badge>
              </div>
              <CardTitle className="text-xl text-white">AI &amp; Software Engineering Track</CardTitle>
              <CardDescription className="text-slate-400 text-xs leading-relaxed">
                Foundational and advanced large language model engineering, vector retrieval (RAG), agentic multi-system orchestration, and edge deployment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-101: Applied AI Foundations &amp; LLM Ops (40h)
                </div>
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-201: Retrieval Augmented Generation &amp; Vector DBs (45h)
                </div>
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-203: Agentic Workflows &amp; Multi-Agent Systems (45h)
                </div>
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-301: Model Fine-Tuning &amp; SLM Optimization (45h)
                </div>
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-302: Edge AI &amp; Tactical Computer Vision (45h)
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">O*NET SOC: 15-1299.08</span>
                <Link
                  href="/courses?track=engineering"
                  className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center"
                >
                  View Track <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pathway 2: Security Track */}
          <Card className="border-slate-800 bg-slate-900/50 hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-mono">
                  130 Hours / 3 Courses
                </Badge>
              </div>
              <CardTitle className="text-xl text-white">Cyber Defense &amp; GovSec Track</CardTitle>
              <CardDescription className="text-slate-400 text-xs leading-relaxed">
                Adversarial red-teaming, prompt injection defense, automated defensive SIEM/SOC response, and CMMC 2.0 / NIST SP 800-171 Rev. 3 compliance engineering.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-202: AI Red-Teaming &amp; Adversarial Robustness (45h)
                </div>
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-401: Autonomous Cyber Defense &amp; SOC Operations (45h)
                </div>
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-402: Defense AI Governance, Ethics &amp; CMMC Compliance (40h)
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">O*NET SOC: 15-1212.00</span>
                <Link
                  href="/courses?track=security"
                  className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center"
                >
                  View Track <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pathway 3: Operations Track */}
          <Card className="border-slate-800 bg-slate-900/50 hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 font-mono">
                  75 Hours / 2 Courses
                </Badge>
              </div>
              <CardTitle className="text-xl text-white">Defense Logistics &amp; GovCon Track</CardTitle>
              <CardDescription className="text-slate-400 text-xs leading-relaxed">
                Autonomous supply chain forecasting, maintenance predictive analytics, FAR/DFARS compliance automation, and proposal generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-303: AI in Defense Logistics &amp; Supply Chain (35h)
                </div>
                <div className="flex items-center text-slate-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-2 shrink-0" />
                  VAAI-403: GovCon RFP Analysis &amp; Compliance Automation (40h)
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">O*NET SOC: 11-3071.04</span>
                <Link
                  href="/courses?track=operations"
                  className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center"
                >
                  View Track <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Veteran Impact & Outcome Metrics */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Proven Veteran Outcomes &amp; Defense Prime Placement
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Direct pathways from active military service to cleared high-paying defense technology roles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/70">
              <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono">94.2%</div>
              <div className="mt-2 text-sm font-semibold text-white">Employment Placement Rate</div>
              <div className="text-xs text-slate-400 mt-1">Within 180 days post-graduation</div>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/70">
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono">$88k-$115k</div>
              <div className="mt-2 text-sm font-semibold text-white">Average Starting Salary</div>
              <div className="text-xs text-slate-400 mt-1">Cleared AI &amp; Cyber roles</div>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/70">
              <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-mono">425h</div>
              <div className="mt-2 text-sm font-semibold text-white">Accredited Clock Hours</div>
              <div className="text-xs text-slate-400 mt-1">42.5 Continuing Education Units (CEUs)</div>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/70">
              <div className="text-4xl sm:text-5xl font-extrabold text-purple-400 font-mono">100%</div>
              <div className="mt-2 text-sm font-semibold text-white">Tuition Funded</div>
              <div className="text-xs text-slate-400 mt-1">Via WIOA Title I / SkillBridge</div>
            </div>
          </div>

          {/* Defense Contractor Hiring Partners */}
          <div className="pt-6 border-t border-slate-800/80">
            <div className="text-center text-xs font-mono uppercase tracking-wider text-slate-400 mb-6">
              Official Defense Prime &amp; Enterprise Hiring Partners
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/90 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-white text-base">Booz Allen Hamilton</div>
                  <div className="text-xs text-slate-400 mt-1">EIN: 13-3949820 | Defense AI &amp; Cyber Systems</div>
                </div>
                <div className="mt-4 inline-flex items-center text-xs text-amber-400 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  MOU Interview Guarantee: 8 seats/yr
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/90 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-white text-base">Lockheed Martin</div>
                  <div className="text-xs text-slate-400 mt-1">EIN: 52-1893632 | Tactical Edge &amp; Avionics AI</div>
                </div>
                <div className="mt-4 inline-flex items-center text-xs text-amber-400 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  MOU Interview Guarantee: 12 seats/yr
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/90 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-white text-base">CACI International</div>
                  <div className="text-xs text-slate-400 mt-1">EIN: 54-1345888 | National Security &amp; C4ISR</div>
                </div>
                <div className="mt-4 inline-flex items-center text-xs text-amber-400 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  MOU Interview Guarantee: 6 seats/yr
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Call To Action */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Translate Your Military Service Into High-Demand AI Leadership?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Apply today with your military branch, MOS/AFSC, and clearance level to verify WIOA Title I state funding eligibility.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm h-12 px-8 shadow-xl shadow-amber-500/20"
            >
              <Link href="/register">
                Register as Veteran Student
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-700 bg-slate-900 text-slate-200 hover:text-white text-sm h-12 px-6"
            >
              <Link href="/login">Existing User Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-sm">
                V
              </div>
              <span className="font-bold text-white">Veterans Applied AI Institute (VAAI)</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-400">
              <Link href="/etpl-dossier" className="hover:text-white">State Dossier</Link>
              <Link href="/sprs-scorecard" className="hover:text-white">SPRS Scorecard</Link>
              <Link href="/vendor-security-assessment" className="hover:text-white">Security Assessment</Link>
              <Link href="/dpa" className="hover:text-white">Data Protection</Link>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-6 text-center text-slate-500">
            Compliant with NIST SP 800-171 Rev. 3, CMMC 2.0 Level 2, and Texas Workforce Commission WIOA Title I criteria. Program Code: TWC-ETPL-78752-VAAI.
          </div>
        </div>
      </footer>
    </div>
  );
}
