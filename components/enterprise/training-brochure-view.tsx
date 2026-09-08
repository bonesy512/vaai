'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Printer,
  Download,
  ShieldCheck,
  Building2,
  FileCheck,
  GraduationCap,
  Award,
  Clock,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Lock,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  Zap,
  Users,
  BadgeAlert,
  FileSpreadsheet,
} from 'lucide-react';
import { INSTITUTIONAL_COURSES, getCatalogSummary, getCoursesByTrack } from '@/lib/courses-data';
import type { Course } from '@/lib/types/course';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TrainingBrochureView() {
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);

  const catalogSummary = React.useMemo(() => getCatalogSummary(), []);

  const engineeringCourses = React.useMemo(() => getCoursesByTrack('engineering'), []);
  const securityCourses = React.useMemo(() => getCoursesByTrack('security'), []);
  const operationsCourses = React.useMemo(() => getCoursesByTrack('operations'), []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadSyllabus = () => {
    const markdown = `# VAAI Defense Enterprise Training Catalog & Syllabus
Classification: CONTROLLED UNCLASSIFIED INFORMATION // FEDCON
Provider: Veteran AI Enablement Platform (VAAI)
Pricing Model: Enterprise Cohort Fixed Rate ($12,500 / Seat)
DoD SkillBridge Corporate Integration: 100% Eligible (Zero Employer Cost During Active Duty)

## Executive Summary
VAAI provides mission-critical, state-accredited, and defense-aligned AI engineering training for transitioning military veterans and defense prime contractors.
- Total Programs: 10 Courses (425.0 Clock Hours / 42.5 CEUs)
- Architecture: Zero-Overhead In-Browser WebAssembly (Pyodide) Sandboxes
- Security: NIST SP 800-171 Rev. 3 / CMMC 2.0 Level 2 (SPRS 110/110)
- Compliance: DFARS 252.204-7012 Data Protection Addendum (DPA) included
- Credentialing: Ed25519 Signed OpenBadges v3.0 Assertions + 1-Page Defense ATS Resumes

## Track 1: AI & Software Engineering Track (220 Hours / 5 Courses)
1. VAAI-101: Applied AI Foundations & LLM Operations (40h, Level 1) - SOC 15-1299.08
2. VAAI-201: Autonomous Agents & Multi-Agent Swarms (45h, Level 2) - SOC 15-1252.00
3. VAAI-203: Enterprise Knowledge Graphs & Defense RAG (45h, Level 2) - SOC 15-1299.08
4. VAAI-301: Fine-Tuning, LoRA & Domain Model Adaptation (45h, Level 3) - SOC 15-2051.01
5. VAAI-302: Multimodal AI, Computer Vision & ISR Pipelines (45h, Level 3) - SOC 15-1252.00

## Track 2: Cyber Defense & GovSec Track (130 Hours / 3 Courses)
1. VAAI-202: Edge AI, WASM & Sovereign Cloud Deployment (45h, Level 2) - SOC 15-1212.00
2. VAAI-401: Adversarial AI, Red Teaming & Model Security (45h, Level 4) - SOC 15-1212.00
3. VAAI-402: Defense AI Architecture & C4ISR Integration (40h, Level 4) - SOC 15-1212.00

## Track 3: Defense Logistics & GovCon Operations Track (75 Hours / 2 Courses)
1. VAAI-303: Secure GovCloud, CUI & Compliance Operations (40h, Level 3) - SOC 11-1021.00
2. VAAI-403: GovCon AI Capture, Proposals & RFP Automation (35h, Level 4) - SOC 13-1020.00

## Enterprise Cohort Deliverables
- Dedicated Private Cohort Instances with Customized Capstone Vehicle Alignment
- Pre-Cleared Veteran Candidate Matching (Secret & TS/SCI Talent Pipeline)
- Complete WIOA Title I and SkillBridge Reporting Telemetry
`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VAAI-Defense-Enterprise-Training-Catalog-2026.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-black">
      {/* Embedded Print Isolation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: letter portrait;
            margin: 0.5in;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-avoid-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-page-break {
            break-after: page !important;
            page-break-after: always !important;
          }
        }
      ` }} />

      {/* Screen-Only Control Toolbar */}
      <div className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 py-3 print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center space-x-3 text-xs">
            <Link
              href="/employers"
              className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Talent Portal
            </Link>
            <span className="text-slate-700">/</span>
            <span className="font-semibold text-amber-400 uppercase tracking-wider">
              B2B Defense Enterprise Training Brochure
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSyllabus}
              className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
              {downloadSuccess ? 'Downloaded!' : 'Download Syllabus (.md)'}
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Print Brochure (Letter PDF)
            </Button>
          </div>
        </div>
      </div>

      {/* Main Printable Document Container */}
      <article className="mx-auto max-w-5xl px-6 py-8 print:p-0 print:max-w-none text-slate-100 print:text-black">
        {/* DOCUMENT HEADER / MASTHEAD */}
        <header className="border-b-2 border-amber-500/80 print:border-black pb-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded bg-amber-500/10 print:bg-transparent border border-amber-500/30 print:border-black px-2.5 py-1 text-[11px] font-mono font-bold text-amber-400 print:text-black mb-3">
                <Lock className="h-3 w-3 text-amber-400 print:text-black" />
                <span>CUI // FEDCON // DEFENSE INDUSTRIAL BASE WORKFORCE DEVELOPMENT</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white print:text-black">
                B2B Defense Enterprise Training Catalog
              </h1>
              <p className="text-sm sm:text-base text-slate-300 print:text-neutral-800 mt-1 font-medium">
                Fast-Track AI Upskilling &amp; Transition for Cleared Military Veterans (Secret &amp; TS/SCI)
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/90 print:bg-white p-3 text-right font-mono text-xs">
              <div className="text-slate-400 print:text-black font-medium">Catalog Identifier</div>
              <div className="text-sm font-bold text-amber-400 print:text-black">VAAI-ENT-CAT-2026.1</div>
              <div className="text-slate-400 print:text-black mt-1 font-medium">Effective Baseline</div>
              <div className="text-slate-200 print:text-black font-semibold">September 2026 • DoD SkillBridge</div>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 print:border-slate-300 text-xs">
            <div className="rounded border border-slate-800 bg-slate-950/60 p-3 print:border-slate-300 print:bg-white">
              <div className="text-slate-400 print:text-slate-700 font-medium">Accredited Catalog</div>
              <div className="text-xl font-bold font-mono text-amber-400 print:text-black mt-0.5">
                10 Courses
              </div>
              <div className="text-[10px] text-slate-500 print:text-slate-600 font-mono mt-0.5">
                425.0 Clock Hours / 42.5 CEUs
              </div>
            </div>

            <div className="rounded border border-slate-800 bg-slate-950/60 p-3 print:border-slate-300 print:bg-white">
              <div className="text-slate-400 print:text-slate-700 font-medium">Enterprise Cohort Rate</div>
              <div className="text-xl font-bold font-mono text-white print:text-black mt-0.5">
                $12,500 / Seat
              </div>
              <div className="text-[10px] text-slate-500 print:text-slate-600 font-mono mt-0.5">
                Dedicated Instance &amp; Scope
              </div>
            </div>

            <div className="rounded border border-slate-800 bg-slate-950/60 p-3 print:border-slate-300 print:bg-white">
              <div className="text-slate-400 print:text-slate-700 font-medium">DoD SkillBridge Integration</div>
              <div className="text-xl font-bold font-mono text-emerald-400 print:text-black mt-0.5">
                $0 Employer Cost
              </div>
              <div className="text-[10px] text-slate-500 print:text-slate-600 font-mono mt-0.5">
                Active Duty Transition Window
              </div>
            </div>

            <div className="rounded border border-slate-800 bg-slate-950/60 p-3 print:border-slate-300 print:bg-white">
              <div className="text-slate-400 print:text-slate-700 font-medium">Cyber &amp; Data Security</div>
              <div className="text-xl font-bold font-mono text-sky-400 print:text-black mt-0.5">
                SPRS 110/110
              </div>
              <div className="text-[10px] text-slate-500 print:text-slate-600 font-mono mt-0.5">
                NIST SP 800-171 / DFARS DPA
              </div>
            </div>
          </div>
        </header>

        {/* SECTION 1: EXECUTIVE VALUE PROPOSITION */}
        <section className="mb-10 print-avoid-break">
          <h2 className="text-lg font-extrabold text-amber-400 print:text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-400 print:text-black" />
            Executive Value Proposition for Defense Prime Contractors
          </h2>
          <div className="rounded-xl border border-slate-800 print:border-black bg-slate-900/50 print:bg-white p-5 space-y-4 text-xs text-slate-300 print:text-slate-800 leading-relaxed">
            <p>
              Defense prime contractors face severe workforce shortages in high-yield AI engineering, cyber operations, and GovCon capture. Traditional university pipelines lack military operational context, security clearance readiness, and the practical software discipline required for classified and CUI environments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 print:border-slate-300 print:bg-slate-50">
                <div className="flex items-center gap-2 font-semibold text-white print:text-black mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 print:text-black" />
                  Cleared Veteran Pipeline
                </div>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  Targeted at active duty, reservists, and honorably discharged veterans holding active Secret and Top Secret / SCI clearances ready for immediate billable defense program deployment.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 print:border-slate-300 print:bg-slate-50">
                <div className="flex items-center gap-2 font-semibold text-white print:text-black mb-1">
                  <Clock className="h-4 w-4 text-sky-400 print:text-black" />
                  DoD SkillBridge Integration
                </div>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  Zero corporate salary or benefits overhead during active duty transition (last 180 days of service). Corporate partners evaluate vetted fellows on live projects prior to civilian hire.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 print:border-slate-300 print:bg-slate-50">
                <div className="flex items-center gap-2 font-semibold text-white print:text-black mb-1">
                  <Award className="h-4 w-4 text-amber-400 print:text-black" />
                  Fixed Cohort Seat Pricing
                </div>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  Fixed pricing at <strong>$12,500/seat</strong> includes dedicated cohort execution environments, custom capstone vehicle scoping, employer LMS dashboards, and hiring guarantees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CURRICULUM TRACKS BREAKDOWN */}
        <section className="mb-10 space-y-8">
          <div className="border-b border-slate-800 print:border-black pb-2">
            <h2 className="text-lg font-extrabold text-amber-400 print:text-black uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-amber-400 print:text-black" />
              Accredited Defense Training Tracks (10 Courses • 425 Clock Hours)
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
              Structured from foundational operator literacy (Level 1) to autonomous swarms and adversarial red teaming (Level 4).
            </p>
          </div>

          {/* TRACK 1: AI & SOFTWARE ENGINEERING */}
          <div className="space-y-4 print-avoid-break">
            <div className="flex items-center justify-between bg-sky-950/30 print:bg-slate-100 p-3 rounded-lg border border-sky-500/30 print:border-black">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-sky-400 print:text-black" />
                <h3 className="text-sm font-bold text-sky-300 print:text-black uppercase tracking-wider">
                  Track 1: AI &amp; Software Engineering (220 Hours • 5 Courses)
                </h3>
              </div>
              <Badge className="bg-sky-500/20 text-sky-300 print:border-black print:text-black font-mono text-xs">
                22.0 CEUs • SOC 15-1299.08 / 15-1252.00
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {engineeringCourses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-white p-3.5 print-avoid-break text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-amber-400 print:text-black">{c.id}</span>
                    <Badge variant="outline" className="text-[10px] font-mono border-sky-500/40 text-sky-400 print:text-black">
                      Level {c.level} • {c.clockHours}h
                    </Badge>
                  </div>
                  <h4 className="font-bold text-white print:text-black mb-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-400 print:text-slate-700 line-clamp-2 mb-2 leading-relaxed">
                    {c.description}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 print:border-slate-200 text-[10px] text-slate-400 print:text-slate-600 font-mono">
                    <div><strong>Capstone:</strong> {c.capstone.title}</div>
                    <div className="mt-0.5 text-emerald-400 print:text-slate-700">WASM Pyodide Sandboxed • {c.targetMos[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRACK 2: CYBER DEFENSE & GOVSEC */}
          <div className="space-y-4 print-avoid-break">
            <div className="flex items-center justify-between bg-emerald-950/30 print:bg-slate-100 p-3 rounded-lg border border-emerald-500/30 print:border-black">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 print:text-black" />
                <h3 className="text-sm font-bold text-emerald-300 print:text-black uppercase tracking-wider">
                  Track 2: Cyber Defense &amp; GovSec (130 Hours • 3 Courses)
                </h3>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 print:border-black print:text-black font-mono text-xs">
                13.0 CEUs • SOC 15-1212.00
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {securityCourses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-white p-3.5 print-avoid-break text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-amber-400 print:text-black">{c.id}</span>
                    <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-400 print:text-black">
                      Level {c.level} • {c.clockHours}h
                    </Badge>
                  </div>
                  <h4 className="font-bold text-white print:text-black mb-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-400 print:text-slate-700 line-clamp-2 mb-2 leading-relaxed">
                    {c.description}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 print:border-slate-200 text-[10px] text-slate-400 print:text-slate-600 font-mono">
                    <div><strong>Capstone:</strong> {c.capstone.title}</div>
                    <div className="mt-0.5 text-emerald-400 print:text-slate-700">Adversarial Model Security • {c.targetMos[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRACK 3: DEFENSE LOGISTICS & GOVCON OPERATIONS */}
          <div className="space-y-4 print-avoid-break">
            <div className="flex items-center justify-between bg-amber-950/30 print:bg-slate-100 p-3 rounded-lg border border-amber-500/30 print:border-black">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-amber-400 print:text-black" />
                <h3 className="text-sm font-bold text-amber-300 print:text-black uppercase tracking-wider">
                  Track 3: Defense Logistics &amp; GovCon Operations (75 Hours • 2 Courses)
                </h3>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 print:border-black print:text-black font-mono text-xs">
                7.5 CEUs • SOC 11-1021.00 / 13-1020.00
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {operationsCourses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-white p-3.5 print-avoid-break text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-amber-400 print:text-black">{c.id}</span>
                    <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-400 print:text-black">
                      Level {c.level} • {c.clockHours}h
                    </Badge>
                  </div>
                  <h4 className="font-bold text-white print:text-black mb-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-400 print:text-slate-700 line-clamp-2 mb-2 leading-relaxed">
                    {c.description}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 print:border-slate-200 text-[10px] text-slate-400 print:text-slate-600 font-mono">
                    <div><strong>Capstone:</strong> {c.capstone.title}</div>
                    <div className="mt-0.5 text-amber-400 print:text-slate-700">GovCon Capture &amp; CUI Ops • {c.targetMos[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: ARCHITECTURE HIGHLIGHTS & COMPLIANCE */}
        <section className="mb-10 print-avoid-break">
          <h2 className="text-lg font-extrabold text-amber-400 print:text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400 print:text-black" />
            Zero-Overhead Architecture &amp; Federal Contracting Baselines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-lg border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-white p-4">
              <div className="font-bold text-white print:text-black text-sm mb-1 flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-amber-400" />
                Zero-Overhead WASM Sandboxes
              </div>
              <p className="text-slate-400 print:text-slate-700 leading-relaxed text-[11px]">
                In-browser WebAssembly (Pyodide) sandboxes eliminate cloud compute costs and infrastructure creep. Code and prompts execute 100% locally in the browser with zero third-party telemetry egress.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-white p-4">
              <div className="font-bold text-white print:text-black text-sm mb-1 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-purple-400" />
                Ed25519 OpenBadges v3.0
              </div>
              <p className="text-slate-400 print:text-slate-700 leading-relaxed text-[11px]">
                Cryptographically verifiable digital credentials signed under W3C OpenBadges v3.0 specification. Each assertion binds candidate telemetry, capstone code scores, and instant 1-page defense ATS resume exports.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-white p-4">
              <div className="font-bold text-white print:text-black text-sm mb-1 flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                DFARS 252.204-7012 DPA
              </div>
              <p className="text-slate-400 print:text-slate-700 leading-relaxed text-[11px]">
                All enterprise agreements include a Defense Data Protection Addendum (DPA) affirming NIST SP 800-171 Rev. 3 compliance (SPRS score 110/110) with zero PII retention and immutable WORM audit logs.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: TRUSTED PARTNERS & ENROLLMENT CTA */}
        <section className="rounded-xl border border-amber-500/40 print:border-black bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-amber-950/20 print:bg-slate-50 p-6 print-avoid-break">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="text-[10px] font-mono font-bold text-amber-400 print:text-black uppercase tracking-wider">
                Enterprise Cohort Enrollment • Commercial Item Acquisition (FAR Part 12)
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white print:text-black">
                Reserve a Dedicated Defense Training Cohort
              </h3>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                Active MOUs executed with <strong>Booz Allen Hamilton</strong>, <strong>Lockheed Martin</strong>, and <strong>CACI International</strong>. Secure your organization&apos;s custom cohort instance with pre-cleared veteran pipeline priority.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 print:hidden shrink-0">
              <Button
                asChild
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                <Link href="/employers/partnership">
                  Initiate Enterprise MOU &rarr;
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                Print Brochure
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 print:border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400 print:text-black">
            <div>Provider: Veteran AI Enablement Initiative (VAAI) LLC • Austin, TX</div>
            <div>Defense Liaison: defense@vaai.edu • Direct: (512) 555-VAAI</div>
          </div>
        </section>
      </article>
    </div>
  );
}
