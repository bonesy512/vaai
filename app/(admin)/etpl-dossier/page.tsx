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
  Sparkles,
  ExternalLink,
  FileText,
  CheckCircle2,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  Users,
} from 'lucide-react';
import {
  VAAI_ETPL_NARRATIVE,
  VAAI_SOC_CIP_CROSSWALK,
  VAAI_CURRICULUM_MATRIX,
  VAAI_PERFORMANCE_BASELINE,
  SAMPLE_PIRL_COHORT,
  VAAI_TWC_COVER_LETTER,
  exportWioaPirlCsv,
  exportTwcCoverLetterMarkdown,
} from '@/lib/etpl-filing-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EtplDossierPage() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'letter' | 'dossier'>('all');
  const [downloadSuccess, setDownloadSuccess] = React.useState<string | null>(null);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportCsv = () => {
    const csvContent = exportWioaPirlCsv(SAMPLE_PIRL_COHORT);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `WIOA_PIRL_AUDIT_EXPORT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess('CSV');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportCoverLetter = () => {
    const mdContent = exportTwcCoverLetterMarkdown();
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VAAI-TWC-ETPL-Transmittal-Cover-Letter-${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess('Letter');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const totalLectureHours = VAAI_CURRICULUM_MATRIX.reduce((s, m) => s + m.lectureHours, 0);
  const totalLabHours = VAAI_CURRICULUM_MATRIX.reduce((s, m) => s + m.labHours, 0);
  const totalClockHours = VAAI_CURRICULUM_MATRIX.reduce((s, m) => s + m.totalHours, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-black">
      {/* Screen-Only Header & Action Toolbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center space-x-3">
            <Link
              href="/employers"
              className="inline-flex items-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Talent Portal
            </Link>
            <span className="text-slate-700">/</span>
            <Link
              href="/vendor-security-assessment"
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Defense VSA
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              State ETPL Accreditation Filing
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Switcher */}
            <div className="hidden md:flex items-center rounded-md bg-slate-950 p-1 border border-slate-800">
              <Button
                variant={activeTab === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('all')}
                className="text-xs h-7 px-2.5"
              >
                All Documents
              </Button>
              <Button
                variant={activeTab === 'letter' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('letter')}
                className="text-xs h-7 px-2.5"
              >
                Transmittal Letter
              </Button>
              <Button
                variant={activeTab === 'dossier' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('dossier')}
                className="text-xs h-7 px-2.5"
              >
                Dossier &amp; Exhibits
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCoverLetter}
              className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              {downloadSuccess === 'Letter' ? 'Saved!' : 'Cover Letter (.md)'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              {downloadSuccess === 'CSV' ? 'CSV Exported!' : 'WIOA PIRL (CSV)'}
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Printable Container */}
      <main className="mx-auto max-w-5xl px-6 py-8 print:p-0 print:max-w-none">
        {/* Cover / Header Banner */}
        <div className="mb-8 rounded-lg border border-amber-500/40 bg-amber-950/20 p-5 print:border-black print:bg-slate-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 rounded-md bg-amber-500/20 print:bg-transparent border border-amber-500/40 print:border-black px-2.5 py-1 text-xs font-mono font-semibold text-amber-400 print:text-black">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-amber-400 print:text-black" />
                TEXAS WORKFORCE COMMISSION // FORM ETPL-300
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-black">
                State Eligible Training Provider List (ETPL) Application
              </h1>
              <p className="mt-1 text-sm text-slate-300 print:text-neutral-700">
                Texas Workforce Commission (TWC) &amp; Workforce Solutions Capital Area Board #14
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/80 print:bg-white p-3.5 text-right font-mono">
              <div className="text-xs text-slate-400 print:text-black">Provider Tracking ID</div>
              <div className="text-sm font-bold text-amber-400 print:text-black">
                {VAAI_ETPL_NARRATIVE.twcProviderId}
              </div>
              <div className="mt-1 text-xs text-slate-400 print:text-black">Statutory Base</div>
              <div className="text-xs font-semibold text-slate-300 print:text-black font-sans">
                WIOA Title I / Title 38 U.S.C.
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 0: OFFICIAL TWC TRANSMITTAL COVER LETTER */}
        {(activeTab === 'all' || activeTab === 'letter') && (
          <section className="mb-12 rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 print:border-black print:bg-white print:p-0 print:break-after-page">
            <div className="border-b border-slate-800 print:border-black pb-4 mb-6">
              <div className="flex justify-between items-start text-xs font-mono text-slate-400 print:text-neutral-700">
                <span>FORMAL STATE APPLICATION TRANSMITTAL</span>
                <span>DATE: {VAAI_TWC_COVER_LETTER.date}</span>
              </div>
            </div>

            {/* Recipient Block */}
            <div className="space-y-4 text-xs text-slate-300 print:text-black mb-6">
              <div className="leading-relaxed">
                <strong className="text-white print:text-black block text-sm">
                  {VAAI_TWC_COVER_LETTER.recipient.title}
                </strong>
                <span>{VAAI_TWC_COVER_LETTER.recipient.agency} — {VAAI_TWC_COVER_LETTER.recipient.division}</span><br />
                <span>{VAAI_TWC_COVER_LETTER.recipient.streetAddress}</span><br />
                <span>{VAAI_TWC_COVER_LETTER.recipient.cityStateZip}</span>
              </div>

              <div className="leading-relaxed border-l-2 border-amber-500/60 pl-3">
                <span className="font-semibold text-amber-400 print:text-black block">
                  In Coordination With:
                </span>
                <span>{VAAI_TWC_COVER_LETTER.coordination.boardName} ({VAAI_TWC_COVER_LETTER.coordination.boardId})</span><br />
                <span>{VAAI_TWC_COVER_LETTER.coordination.streetAddress}</span><br />
                <span>{VAAI_TWC_COVER_LETTER.coordination.cityStateZip}</span>
              </div>
            </div>

            {/* Subject Line */}
            <div className="rounded border border-slate-800 bg-slate-950/70 p-3 mb-6 print:border-black print:bg-slate-50">
              <span className="text-xs font-mono font-bold text-amber-400 print:text-black block">
                SUBJECT: {VAAI_TWC_COVER_LETTER.subject}
              </span>
            </div>

            {/* Salutation & Executive Statement */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-300 print:text-slate-800">
              <p className="font-semibold text-white print:text-black">
                {VAAI_TWC_COVER_LETTER.salutation}
              </p>
              <p>
                {VAAI_TWC_COVER_LETTER.executiveSummary}
              </p>

              {/* Sub-block: Program Classification */}
              <div className="pt-2">
                <h3 className="font-bold text-white print:text-black text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  Program Classification &amp; Occupational Alignment
                </h3>
                <p className="mb-2">
                  The CAIO Level 1 curriculum addresses critical regional and statewide shortages in advanced digital operations and artificial intelligence integration. The program is formally crosswalked to federal and state labor taxonomies:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Classification of Instructional Programs (CIP):</strong>{' '}
                    {VAAI_TWC_COVER_LETTER.classificationAndTaxonomy.cipCodes.join(' and ')}.
                  </li>
                  <li>
                    <strong>Standard Occupational Classification (SOC):</strong>{' '}
                    {VAAI_TWC_COVER_LETTER.classificationAndTaxonomy.socCodes.join(' and ')}.
                  </li>
                  <li>
                    <strong>Curriculum Structure:</strong>{' '}
                    {VAAI_TWC_COVER_LETTER.classificationAndTaxonomy.curriculumStructure}
                  </li>
                </ul>
              </div>

              {/* Sub-block: Verified Instructional Rigor */}
              <div className="pt-2">
                <h3 className="font-bold text-white print:text-black text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Verified Instructional Rigor &amp; Telemetry Compliance
                </h3>
                <p className="mb-2">
                  To meet and exceed TWC and WIOA program accountability standards, VAAI enforces strict instructional integrity safeguards:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>
                    <strong>Deterministic Active Seat-Time Engine:</strong> {VAAI_TWC_COVER_LETTER.instructionalRigor.seatTimeEngine}
                  </li>
                  <li>
                    <strong>Gated Competency Assessments:</strong> {VAAI_TWC_COVER_LETTER.instructionalRigor.gatedAssessments}
                  </li>
                  <li>
                    <strong>Statutory Safe Harbor Guardrails:</strong> {VAAI_TWC_COVER_LETTER.instructionalRigor.safeHarborGuardrails}
                  </li>
                </ol>
              </div>

              {/* Sub-block: Employer Demand & Executed MOUs */}
              <div className="pt-2">
                <h3 className="font-bold text-white print:text-black text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-blue-400" />
                  Employer Demand &amp; Executed Memoranda of Understanding (MOUs)
                </h3>
                <p className="mb-2">
                  {VAAI_TWC_COVER_LETTER.employerDemand.description}
                </p>
                <p className="mb-2">
                  We have executed formal <strong>B2B Employer Partnership Memoranda of Understanding (MOUs)</strong> with corporate hiring partners, including{' '}
                  <strong className="text-amber-400 print:text-black">
                    {VAAI_TWC_COVER_LETTER.employerDemand.executedPartners.join(', ')}
                  </strong>. Under these executed agreements, participating employers have formally pledged:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {VAAI_TWC_COVER_LETTER.employerDemand.commitments.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Exhibits Cross-Index Table */}
              <div className="pt-4">
                <h3 className="font-bold text-white print:text-black text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-amber-400" />
                  Submitted Documentation Package (Enclosures)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {VAAI_TWC_COVER_LETTER.exhibits.map((ex) => (
                    <Link
                      key={ex.id}
                      href={ex.href}
                      className="rounded border border-slate-800 bg-slate-950/40 p-2.5 hover:border-amber-500/50 transition-colors print:border-slate-300 print:bg-transparent"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400 print:text-black">
                        <span>{ex.id}</span>
                        <span className="font-mono text-[10px] text-emerald-400 print:text-slate-600">{ex.status}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-200 print:text-black mt-0.5">
                        {ex.title}
                      </div>
                      <div className="text-[10px] text-slate-400 print:text-slate-600 mt-0.5">
                        {ex.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <p className="pt-2">
                We welcome the opportunity to coordinate with your review team and the Workforce Solutions Capital Area Board to finalize our initial provider interview and technical demonstration. Thank you for your continued dedication to empowering Texas veterans with high-demand workforce skills.
              </p>

              <p>Respectfully submitted,</p>

              {/* Signatory Box */}
              <div className="rounded border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs print:border-slate-400 print:bg-slate-50 print:text-black">
                <div className="text-slate-100 print:text-black font-semibold">
                  {VAAI_TWC_COVER_LETTER.signatory.name}
                </div>
                <div className="text-slate-300 print:text-slate-700">
                  {VAAI_TWC_COVER_LETTER.signatory.title}
                </div>
                <div className="text-slate-400 print:text-slate-600">
                  {VAAI_TWC_COVER_LETTER.signatory.entity}
                </div>
                <div className="text-slate-400 print:text-slate-600">
                  {VAAI_TWC_COVER_LETTER.signatory.address}
                </div>
                <div className="text-amber-400 print:text-black pt-1">
                  Direct: {VAAI_TWC_COVER_LETTER.signatory.phone} | Email: {VAAI_TWC_COVER_LETTER.signatory.email} | Web: {VAAI_TWC_COVER_LETTER.signatory.website}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION: FULL TECHNICAL DOSSIER & EXHIBITS */}
        {(activeTab === 'all' || activeTab === 'dossier') && (
          <div className="space-y-12">
            {/* EXHIBIT A: Institutional Narrative & Compliance */}
            <section id="exhibit-a" className="space-y-6 scroll-mt-20">
              <div className="border-b border-slate-800 pb-3 print:border-black flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-amber-400 print:text-black flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Exhibit A: Institutional Capacity &amp; Operational Narrative
                </h2>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 font-mono text-[10px]">
                  EXHIBIT A
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-800 print:border-black bg-slate-900/50 print:bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-300 print:text-black">
                      Legal Entity &amp; Site Facility
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2 text-slate-400 print:text-black">
                    <div>
                      <span className="font-semibold text-slate-200 print:text-black">Provider:</span>{' '}
                      {VAAI_ETPL_NARRATIVE.legalEntity}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 print:text-black">Training Facility:</span>{' '}
                      {VAAI_ETPL_NARRATIVE.primaryLocation.facilityName}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 print:text-black">Address:</span>{' '}
                      {VAAI_ETPL_NARRATIVE.primaryLocation.streetAddress},{' '}
                      {VAAI_ETPL_NARRATIVE.primaryLocation.city}, {VAAI_ETPL_NARRATIVE.primaryLocation.state}{' '}
                      {VAAI_ETPL_NARRATIVE.primaryLocation.postalCode} ({VAAI_ETPL_NARRATIVE.primaryLocation.county} County)
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 print:text-black">WIOA Local Board:</span>{' '}
                      {VAAI_ETPL_NARRATIVE.wioaLocalBoard}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-800 print:border-black bg-slate-900/50 print:bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-300 print:text-black">
                      WIOA Attendance Engine Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2 text-slate-400 print:text-black">
                    <div>
                      <span className="font-semibold text-slate-200 print:text-black">Required Clock Hours:</span>{' '}
                      {VAAI_ETPL_NARRATIVE.attendancePolicy.requiredClockHours} Hours
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 print:text-black">Mandatory Verified Seat Time:</span>{' '}
                      {VAAI_ETPL_NARRATIVE.attendancePolicy.minimumSeatTimeHours} Hours (129,600 Seconds)
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 print:text-black">Audit Telemetry:</span>{' '}
                      {VAAI_ETPL_NARRATIVE.attendancePolicy.auditMechanism}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 print:text-black">Inactivity Cutoff:</span>{' '}
                      {VAAI_ETPL_NARRATIVE.attendancePolicy.idleTimeoutSeconds}s idle threshold with Page Visibility enforcement.
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/30 print:bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-200 print:text-black">Mission &amp; Scope</h3>
                <p className="mt-1 text-xs text-slate-400 print:text-black leading-relaxed">
                  {VAAI_ETPL_NARRATIVE.missionStatement}
                </p>
              </div>

              {/* Equipment Inventory */}
              <div>
                <h3 className="text-sm font-semibold text-slate-200 print:text-black mb-3">
                  Training Infrastructure &amp; Lab Inventory
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {VAAI_ETPL_NARRATIVE.equipmentInventory.map((eq, i) => (
                    <div key={i} className="rounded border border-slate-800 bg-slate-900/40 p-3 print:border-slate-300 print:bg-white">
                      <div className="font-semibold text-amber-400 print:text-black">{eq.item}</div>
                      <div className="text-[11px] text-slate-300 print:text-slate-800 mt-1 font-mono">{eq.specification}</div>
                      <div className="text-[11px] text-slate-400 print:text-slate-600 mt-1">{eq.purpose}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* EXHIBIT B: 40-Clock-Hour Curriculum Matrix */}
            <section id="exhibit-b" className="space-y-6 scroll-mt-20">
              <div className="border-b border-slate-800 pb-3 print:border-black flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-amber-400 print:text-black flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Exhibit B: 40-Clock-Hour Master Syllabus &amp; Rubric Passing Standards
                </h2>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 font-mono text-[10px]">
                  EXHIBIT B
                </Badge>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-black">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 print:border-black bg-slate-900 print:bg-neutral-100 font-semibold text-slate-200 print:text-black">
                    <tr>
                      <th className="p-3">Module</th>
                      <th className="p-3">Instructional Title</th>
                      <th className="p-3 text-center">Lecture</th>
                      <th className="p-3 text-center">Lab / Sandbox</th>
                      <th className="p-3 text-center">Total Clock</th>
                      <th className="p-3">WIOA Learning Objective</th>
                      <th className="p-3 text-center">Passing Std</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-neutral-200 text-slate-300 print:text-black">
                    {VAAI_CURRICULUM_MATRIX.map((m) => (
                      <tr key={m.moduleNumber}>
                        <td className="p-3 font-mono text-amber-400 print:text-black font-bold">Mod {m.moduleNumber}</td>
                        <td className="p-3 font-semibold text-white print:text-black">{m.title}</td>
                        <td className="p-3 text-center font-mono">{m.lectureHours.toFixed(1)}h</td>
                        <td className="p-3 text-center font-mono">{m.labHours.toFixed(1)}h</td>
                        <td className="p-3 text-center font-mono font-bold text-amber-400 print:text-black">
                          {m.totalHours.toFixed(1)}h
                        </td>
                        <td className="p-3 text-slate-400 print:text-black">{m.wioaObjective}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 print:border-black print:text-black font-mono">
                            &ge; {m.rubricPassingScore}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-900/80 print:bg-neutral-100 font-bold border-t-2 border-slate-700 print:border-black text-white print:text-black">
                      <td colSpan={2} className="p-3 uppercase tracking-wider">
                        Program Totals
                      </td>
                      <td className="p-3 text-center font-mono">{totalLectureHours.toFixed(1)}h</td>
                      <td className="p-3 text-center font-mono">{totalLabHours.toFixed(1)}h</td>
                      <td className="p-3 text-center font-mono text-amber-400 print:text-black">
                        {totalClockHours.toFixed(1)}h
                      </td>
                      <td colSpan={2} className="p-3 text-slate-400 print:text-black font-normal">
                        Satisfies WIOA accelerated credential requirements
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* EXHIBIT C: SOC / CIP Crosswalk & O*NET Mapping */}
            <section id="exhibit-c" className="space-y-6 scroll-mt-20">
              <div className="border-b border-slate-800 pb-3 print:border-black flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-amber-400 print:text-black flex items-center">
                  <FileCheck className="mr-2 h-5 w-5" />
                  Exhibit C: Texas Labor Market Alignment (SOC &amp; CIP Crosswalk)
                </h2>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 font-mono text-[10px]">
                  EXHIBIT C
                </Badge>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-black">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 print:border-black bg-slate-900 print:bg-neutral-100 font-semibold text-slate-200 print:text-black">
                    <tr>
                      <th className="p-3">Classification Type</th>
                      <th className="p-3">Code</th>
                      <th className="p-3">Program / Occupation Title</th>
                      <th className="p-3">Projected Texas Growth</th>
                      <th className="p-3">Median Wage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-neutral-200 text-slate-300 print:text-black">
                    {VAAI_SOC_CIP_CROSSWALK.cipCodes.map((cip) => (
                      <tr key={cip.code}>
                        <td className="p-3 font-mono text-amber-400 print:text-black font-semibold">CIP (Curriculum)</td>
                        <td className="p-3 font-mono">{cip.code}</td>
                        <td className="p-3 font-medium">{cip.title}</td>
                        <td className="p-3 text-slate-400 print:text-black">State-Approved STEM</td>
                        <td className="p-3 text-slate-400 print:text-black">—</td>
                      </tr>
                    ))}
                    {VAAI_SOC_CIP_CROSSWALK.socCodes.map((soc) => (
                      <tr key={soc.code}>
                        <td className="p-3 font-mono text-emerald-400 print:text-black font-semibold">SOC (Workforce)</td>
                        <td className="p-3 font-mono">{soc.code}</td>
                        <td className="p-3 font-medium">{soc.title}</td>
                        <td className="p-3 text-emerald-400 print:text-black font-semibold">{soc.projectedGrowthTexas}</td>
                        <td className="p-3 font-semibold">{soc.medianWageTexas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/30 print:bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-200 print:text-black mb-2">O*NET Task Integration Matrix</h3>
                <div className="space-y-2">
                  {VAAI_SOC_CIP_CROSSWALK.onetTasks.map((t) => (
                    <div key={t.taskId} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 border-b border-slate-800/60 pb-2">
                      <div>
                        <span className="font-mono text-amber-400 print:text-black font-bold mr-2">[{t.taskId}]</span>
                        <span className="text-slate-300 print:text-black">{t.description}</span>
                      </div>
                      <Badge variant="outline" className="w-fit shrink-0 border-slate-700 text-slate-400 print:border-black print:text-black">
                        {t.curriculumModule}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* EXHIBIT D: Executed Employer Partnership MOUs */}
            <section id="exhibit-d" className="space-y-6 scroll-mt-20">
              <div className="border-b border-slate-800 pb-3 print:border-black flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-amber-400 print:text-black flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Exhibit D: Executed Employer Partnership Memoranda of Understanding (MOUs)
                </h2>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 font-mono text-[10px]">
                  EXHIBIT D
                </Badge>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 print:border-slate-300 print:bg-white">
                <p className="text-xs text-slate-300 print:text-slate-800 mb-4 leading-relaxed">
                  In compliance with WIOA employer engagement requirements and affirmative action benchmarks under VEVRAA/OFCCP,
                  VAAI has established formal, legally binding Memoranda of Understanding with commercial defense and intelligence contractors:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded border border-slate-800 bg-slate-950/60 p-3 text-xs print:border-slate-300 print:bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white print:text-black">Booz Allen Hamilton</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">Active MOU</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 print:text-slate-600 mb-2">
                      Guaranteed interview pipeline for certified Applied AI Operators in defense analytics.
                    </p>
                    <Link
                      href="/employers/partnership/MOU-2026-BAH-01"
                      className="text-amber-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                    >
                      View Executed MOU <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="rounded border border-slate-800 bg-slate-950/60 p-3 text-xs print:border-slate-300 print:bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white print:text-black">Lockheed Martin</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">Active MOU</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 print:text-slate-600 mb-2">
                      Missiles &amp; Fire Control workflow automation talent pool access and PIRL Q2 wage reporting.
                    </p>
                    <Link
                      href="/employers/partnership/MOU-2026-LMT-02"
                      className="text-amber-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                    >
                      View Executed MOU <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="rounded border border-slate-800 bg-slate-950/60 p-3 text-xs print:border-slate-300 print:bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white print:text-black">CACI International</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">Active MOU</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 print:text-slate-600 mb-2">
                      National security digital transformation hiring with security clearance priority.
                    </p>
                    <Link
                      href="/employers/partnership/MOU-2026-CACI-03"
                      className="text-amber-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                    >
                      View Executed MOU <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs print:border-slate-300">
                  <span className="text-slate-400">Want to inspect all corporate partnership records?</span>
                  <Link
                    href="/employers/partnership"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    Open Partnership MOUs Hub &rarr;
                  </Link>
                </div>
              </div>
            </section>

            {/* EXHIBIT E: Defense Vendor Security Assessment (VSA) */}
            <section id="exhibit-e" className="space-y-6 scroll-mt-20">
              <div className="border-b border-slate-800 pb-3 print:border-black flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-amber-400 print:text-black flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Exhibit E: Defense Contractor Vendor Security Assessment (VSA)
                </h2>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 font-mono text-[10px]">
                  EXHIBIT E
                </Badge>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 print:border-slate-300 print:bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white print:text-black">
                      NIST SP 800-171 Rev. 3 &amp; CMMC 2.0 Level 2 Attestation Package
                    </h3>
                    <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                      Audit Reference: VAAI-SEC-2026-NIST-800-171-REV3-VSA | Target SPRS Score: 110/110
                    </p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs w-fit">
                    DISA FedRAMP Moderate Aligned
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed mb-4">
                  The VAAI instructional infrastructure is architected for Controlled Unclassified Information (CUI) and Defense PII protection.
                  Features include edge nonces, TLS 1.3, field-level AES-256-GCM encryption, client-side WASM sandboxing, and RFC 5424 / CEF:0
                  HMAC-SHA256 audit logging with a 7-year WORM retention schedule.
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <Link
                    href="/vendor-security-assessment"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Inspect Complete Defense VSA Package &rarr;
                  </Link>
                  <Link
                    href="/api/security/vsa?format=markdown"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-400" />
                    Download VSA Markdown (.md)
                  </Link>
                </div>
              </div>
            </section>

            {/* EXHIBIT F: Performance Outcomes & WIOA PIRL Exporter */}
            <section id="exhibit-f" className="space-y-6 scroll-mt-20">
              <div className="border-b border-slate-800 pb-3 print:border-black flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-amber-400 print:text-black flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Exhibit F: WIOA PIRL Compliance &amp; Cohort Performance Baselines
                </h2>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 font-mono text-[10px]">
                  EXHIBIT F
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/40 print:bg-white p-3 text-center">
                  <div className="text-xs text-slate-400 print:text-black">Target Completion Rate</div>
                  <div className="text-2xl font-bold text-amber-400 print:text-black font-mono">
                    {VAAI_PERFORMANCE_BASELINE.targetedCompletionRate}%
                  </div>
                  <div className="text-[10px] text-slate-500 print:text-black">WIOA Benchmark: &ge; 70%</div>
                </div>

                <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/40 print:bg-white p-3 text-center">
                  <div className="text-xs text-slate-400 print:text-black">90-Day Placement Target</div>
                  <div className="text-2xl font-bold text-emerald-400 print:text-black font-mono">
                    {VAAI_PERFORMANCE_BASELINE.targetedPlacementRate90Days}%
                  </div>
                  <div className="text-[10px] text-slate-500 print:text-black">WIOA Benchmark: &ge; 65%</div>
                </div>

                <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/40 print:bg-white p-3 text-center">
                  <div className="text-xs text-slate-400 print:text-black">Projected Median Wage</div>
                  <div className="text-2xl font-bold text-sky-400 print:text-black font-mono">
                    ${VAAI_PERFORMANCE_BASELINE.projectedMedianAnnualWage.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 print:text-black">${VAAI_PERFORMANCE_BASELINE.projectedMedianHourlyWage}/hr</div>
                </div>

                <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/40 print:bg-white p-3 text-center">
                  <div className="text-xs text-slate-400 print:text-black">Credential Standard</div>
                  <div className="text-sm font-bold text-purple-400 print:text-black font-mono mt-1">
                    OpenBadges v3.0
                  </div>
                  <div className="text-[10px] text-slate-500 print:text-black">Ed25519 Signed Vector SVG</div>
                </div>
              </div>

              {/* Sample PIRL Table */}
              <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/30 print:bg-white p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 print:text-black">
                      State Audit Cohort Sampling (PIRL Participant Records)
                    </h3>
                    <p className="text-xs text-slate-400 print:text-neutral-700">
                      Sample records extracted from immutable seat_time_logs and issued_credentials
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCsv}
                    className="hidden print:hidden sm:flex border-slate-700 text-xs"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                    Download PIRL CSV
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="border-b border-slate-800 print:border-black text-slate-400 print:text-black font-semibold">
                      <tr>
                        <th className="pb-2">Participant ID</th>
                        <th className="pb-2">Branch</th>
                        <th className="pb-2">Verified Hours</th>
                        <th className="pb-2">Capstone</th>
                        <th className="pb-2">Credential UUID</th>
                        <th className="pb-2">Quarter 2 Employer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 print:divide-neutral-200 text-slate-300 print:text-black font-mono">
                      {SAMPLE_PIRL_COHORT.map((r) => (
                        <tr key={r.pirl100_participantId}>
                          <td className="py-2 text-amber-400 print:text-black font-bold">{r.pirl100_participantId}</td>
                          <td className="py-2 font-sans">{r.pirl401_militaryServiceBranch}</td>
                          <td className="py-2 text-emerald-400 print:text-black font-bold">{r.pirl1300_verifiedContactHours}h</td>
                          <td className="py-2 text-sky-400 print:text-black font-bold">{r.pirl1301_capstoneScore}%</td>
                          <td className="py-2 text-slate-400 print:text-black">{r.pirl1205_credentialUuid}</td>
                          <td className="py-2 font-sans text-slate-200 print:text-black">{r.pirl1404_employerName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Institutional Signatures & Attestation */}
            <section className="mt-12 border-t border-slate-800 print:border-black pt-8">
              <div className="text-xs text-slate-400 print:text-neutral-700 leading-relaxed">
                <span className="font-semibold text-slate-200 print:text-black">Institutional Attestation:</span> I hereby
                certify under penalty of perjury that the curriculum, attendance telemetry standards, and performance
                outcomes presented in this dossier are true, accurate, and maintained in compliance with the Texas Workforce
                Commission Career Schools and Colleges rules (40 TAC Chapter 807) and WIOA Title I regulations (20 CFR Part 680).
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-300 print:text-black">
                <div>
                  <div className="border-b border-slate-700 print:border-black pb-1 font-serif italic text-base text-slate-100 print:text-black">
                    Dr. Marcus Vance, Ph.D.
                  </div>
                  <div className="mt-1 font-semibold">Director of Academic Standards &amp; Compliance</div>
                  <div className="text-slate-400 print:text-black">Veteran AI Enablement Platform (VAAI)</div>
                  <div className="text-slate-400 print:text-black">Date of Submission: September 8, 2026</div>
                </div>

                <div>
                  <div className="border-b border-slate-700 print:border-black pb-1 font-serif italic text-base text-slate-100 print:text-black">
                    Col. Evelyn Reed (Ret.)
                  </div>
                  <div className="mt-1 font-semibold">Workforce Accreditation Liaison</div>
                  <div className="text-slate-400 print:text-black">Capital Area Veterans Workforce Board</div>
                  <div className="text-slate-400 print:text-black">State Filing Status: Verified &amp; Pending Board Review</div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
