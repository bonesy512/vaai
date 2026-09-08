import * as React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Compass,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section
      aria-label="VAAI Mission Hero Section"
      className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 min-h-[85vh] flex flex-col justify-center border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950"
    >
      {/* Background Military Grid Accent */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Core Value Proposition & Above-the-Fold CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Regulatory Status Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-amber-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>TWC ETPL # TWC-ETPL-78752-VAAI</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">WIOA TITLE I APPROVED</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Certified Applied AI Operator for{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                Military Veterans
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              An accredited 40-clock-hour workforce credential translating military operational
              discipline into automated enterprise AI workflows, zero-retention data sanitization,
              and defense contracting readiness.
            </p>

            {/* Dual Above-The-Fold CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 h-12 px-6"
              >
                <Link href="/courses/ai-literacy-101/lesson-1" id="hero-cta-student">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Enroll with WIOA Voucher
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-700 bg-slate-900/90 text-slate-100 hover:bg-slate-800 hover:text-white font-semibold text-sm h-12 px-6 shadow-lg"
              >
                <Link href="/employers" id="hero-cta-employer">
                  <Users className="mr-2 h-4 w-4 text-amber-400" />
                  Hire Certified Veterans
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-slate-400 hover:text-white text-xs h-12 px-3"
              >
                <Link href="/etpl-dossier">
                  <FileCheck2 className="mr-1.5 h-4 w-4" />
                  State ETPL Dossier
                </Link>
              </Button>
            </div>

            {/* Trust Badges Ribbon */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>$0 Tuition (WIOA)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-amber-400 shrink-0" />
                <span>OpenBadges v3.0</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Title 38 Safe Harbor</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-purple-400 shrink-0" />
                <span>Zero AI Data Retention</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Credential & Telemetry Preview HUD */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="font-mono text-xs text-slate-400 font-semibold pl-2">
                    VAAI VERIFIED CREDENTIAL HUD
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px]"
                >
                  LIVE STATE AUDIT
                </Badge>
              </div>

              {/* Sample Credential Snapshot */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono text-amber-400">
                      CREDENTIAL ID: VAAI-2026-DEMO
                    </div>
                    <div className="text-sm font-bold text-white">
                      Sgt. Marcus Vance (USMC Veteran)
                    </div>
                    <div className="text-xs text-slate-400">
                      MOS 0671 (Data Systems Administrator)
                    </div>
                  </div>
                  <div className="rounded-md bg-amber-500/10 p-2 border border-amber-500/20 text-amber-400">
                    <Award className="h-5 w-5" />
                  </div>
                </div>

                {/* State Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">
                      Contact Seat Time
                    </div>
                    <div className="text-base font-bold text-white font-mono">
                      40.0 / 40.0 hrs
                    </div>
                    <div className="text-[10px] text-emerald-400">100% Verified Non-Idle</div>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">
                      Capstone Defense
                    </div>
                    <div className="text-base font-bold text-white font-mono">
                      94.5% (Pass)
                    </div>
                    <div className="text-[10px] text-emerald-400">Rubric Benchmark &ge; 80%</div>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 text-xs flex items-center justify-between">
                  <div className="text-[11px] text-slate-300">
                    Security Clearance Status:
                  </div>
                  <Badge className="bg-purple-950/80 text-purple-300 border-purple-800 text-[10px]">
                    Active Secret (DoD)
                  </Badge>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <Link
                    href="/verify/VAAI-2026-DEMO"
                    className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Inspect Cryptographic Proof</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="font-mono text-[10px] text-slate-400">
                    Ed25519 W3C Compliant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
