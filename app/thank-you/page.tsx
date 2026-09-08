import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Download,
  Mail,
  Phone,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Registration Confirmed - Onboarding Next Steps',
  description:
    'Congratulations on enrolling in the VAAI Applied AI Operator program. Review next steps for WIOA Title I voucher verification and LMS orientation.',
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-8">
      {/* Confirmation Header Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl text-center space-y-4">
        <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center space-x-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono font-semibold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          REGISTRATION SECURED // RECORD ID: VAAI-ENR-2026-OCT
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Welcome to the VAAI Enablement Cohort
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Your enrollment application for the <strong className="text-white">Certified Applied AI Operator (Level 1)</strong> program has been received. Your seat allocation has been initialized in our Texas Workforce Commission accredited registry.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-11 px-6 shadow-lg shadow-amber-500/20"
          >
            <Link href="/courses/ai-literacy-101/lesson-1">
              <BookOpen className="mr-2 h-4 w-4" />
              Launch Module 1 Orientation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-slate-700 bg-slate-900 text-slate-200 text-xs h-11 px-5"
          >
            <Link href="/etpl-dossier">
              <FileCheck2 className="mr-1.5 h-4 w-4 text-slate-400" />
              View TWC Accreditation Dossier
            </Link>
          </Button>
        </div>
      </div>

      {/* 3-Step Onboarding Roadmap */}
      <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            Next Steps in Your Enablement Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="space-y-2 border-l-2 border-emerald-500 pl-4">
              <div className="text-[11px] font-mono font-bold text-emerald-400">
                STEP 01 // IMMEDIATE
              </div>
              <h3 className="text-sm font-semibold text-white">
                Orientation &amp; Pre-Flight Lab
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log into the VAAI sandbox right now. You have immediate access to Module 1 to explore Title 38 compliance guardrails and the DoD PII regex sanitization environment.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 border-l-2 border-amber-500 pl-4">
              <div className="text-[11px] font-mono font-bold text-amber-400">
                STEP 02 // 24-48 HOURS
              </div>
              <h3 className="text-sm font-semibold text-white">
                WIOA Title I Voucher Confirmation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our workforce coordinators will submit your Individual Training Account (ITA) voucher authorization to Workforce Solutions Capital Area Board #14 to ensure 100% tuition coverage.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 border-l-2 border-blue-500 pl-4">
              <div className="text-[11px] font-mono font-bold text-blue-400">
                STEP 03 // 40-HOUR PATHWAY
              </div>
              <h3 className="text-sm font-semibold text-white">
                Telemetry &amp; Capstone Defense
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete 36.0+ non-idle contact hours logged via our continuous heartbeat daemon, defend your capstone blueprint, and receive your tamper-evident OpenBadges v3.0 credential.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Contact Coordinates */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
        <div>
          <div className="font-semibold text-white">Questions about your cohort or WIOA funding?</div>
          <div className="text-slate-400">
            Our Texas admissions &amp; veterans support desk is available Monday–Friday, 0800–1700 CST.
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:5125558224"
            className="inline-flex items-center text-slate-300 hover:text-white px-3 py-1.5 rounded-md border border-slate-700 bg-slate-800"
          >
            <Phone className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
            (512) 555-8224
          </a>
          <a
            href="mailto:admissions@vaai.edu"
            className="inline-flex items-center text-slate-300 hover:text-white px-3 py-1.5 rounded-md border border-slate-700 bg-slate-800"
          >
            <Mail className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
            admissions@vaai.edu
          </a>
        </div>
      </div>
    </div>
  );
}
