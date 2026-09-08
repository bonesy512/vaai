'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Printer,
  Download,
  ShieldCheck,
  Lock,
  Server,
  Terminal,
  FileCheck,
  CheckCircle2,
  Search,
  ArrowLeft,
  Building2,
  AlertCircle,
  FileText,
  BadgeCheck,
  ExternalLink,
} from 'lucide-react';
import {
  VSA_METADATA,
  VSA_DOMAINS,
  CMMC_PRACTICE_FAMILIES,
  VSA_SOC2_ATTESTATION,
  VSA_DFARS_INCIDENT_RESPONSE,
  VSA_ATTACHMENTS,
  exportVsaMarkdown,
} from '@/lib/security/vsa-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function VendorSecurityAssessmentPage() {
  const [activeDomainTab, setActiveDomainTab] = React.useState<string>('all');
  const [cmmcSearch, setCmmcSearch] = React.useState<string>('');
  const [downloadFormat, setDownloadFormat] = React.useState<string | null>(null);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadMarkdown = () => {
    const md = exportVsaMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VAAI-Defense-Vendor-Security-Assessment-${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadFormat('Markdown');
    setTimeout(() => setDownloadFormat(null), 3000);
  };

  const handleDownloadJson = () => {
    const data = {
      metadata: VSA_METADATA,
      domains: VSA_DOMAINS,
      cmmcFamilies: CMMC_PRACTICE_FAMILIES,
      soc2Attestation: VSA_SOC2_ATTESTATION,
      dfarsIncidentResponse: VSA_DFARS_INCIDENT_RESPONSE,
      attachments: VSA_ATTACHMENTS,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VAAI-Defense-Vendor-Security-Assessment-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadFormat('JSON');
    setTimeout(() => setDownloadFormat(null), 3000);
  };

  const filteredCmmcFamilies = CMMC_PRACTICE_FAMILIES.filter(
    (f) =>
      f.family.toLowerCase().includes(cmmcSearch.toLowerCase()) ||
      f.familyCode.toLowerCase().includes(cmmcSearch.toLowerCase()) ||
      f.nistControls.toLowerCase().includes(cmmcSearch.toLowerCase()) ||
      f.implementedControls.toLowerCase().includes(cmmcSearch.toLowerCase()) ||
      f.evidenceReference.toLowerCase().includes(cmmcSearch.toLowerCase())
  );

  const displayedDomains =
    activeDomainTab === 'all'
      ? VSA_DOMAINS
      : VSA_DOMAINS.filter((d) => d.id === activeDomainTab);

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
              href="/etpl-dossier"
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              ETPL Filing
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Defense Vendor Security Assessment (VSA)
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadJson}
              className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
              {downloadFormat === 'JSON' ? 'JSON Saved!' : 'JSON'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadMarkdown}
              className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              {downloadFormat === 'Markdown' ? 'Markdown Saved!' : 'Markdown'}
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Printable Dossier Container */}
      <main className="mx-auto max-w-5xl px-6 py-8 print:p-0 print:max-w-none">
        {/* Classification Header Banner */}
        <div className="mb-8 rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-5 print:border-black print:bg-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] uppercase tracking-wider print:bg-slate-200 print:text-black">
                  DISA FedRAMP Moderate & NIST SP 800-171 Rev. 3 Attested
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono text-[10px] uppercase tracking-wider print:bg-slate-200 print:text-black">
                  CMMC 2.0 Level 2 (110 Controls)
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white print:text-black">
                Defense Contractor Vendor Security Assessment
              </h1>
              <p className="text-sm text-slate-400 print:text-slate-600 mt-1">
                Standardized Information Gathering (SIG Core) & System Security Plan (SSP) Attestation Package
              </p>
            </div>
            <div className="flex md:flex-col items-end gap-1 text-right font-mono text-xs">
              <Link
                href="/sprs"
                className="text-emerald-400 hover:text-emerald-300 print:text-black font-semibold flex items-center gap-1 transition-colors"
                title="View official DoD SPRS 110/110 Scoring Worksheet"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                SPRS SCORE: 110 / 110 (Verified)
              </Link>
              <span className="text-slate-400 print:text-slate-600">
                Ref: {VSA_METADATA.authorizedSigner.auditReference}
              </span>
              <span className="text-slate-500 print:text-slate-500">
                Authenticated: {VSA_METADATA.authenticationDate}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-slate-800/80 pt-4 text-xs print:border-slate-300">
            <div>
              <span className="text-slate-400 block">Vendor Legal Entity</span>
              <span className="font-semibold text-slate-200 print:text-black">
                {VSA_METADATA.vendorLegalEntity}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">System Evaluated</span>
              <span className="font-semibold text-slate-200 print:text-black">
                {VSA_METADATA.systemEvaluated}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Classification Scope</span>
              <span className="font-semibold text-emerald-300 print:text-black">
                CUI // CDI // Defense PII
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Security Contact</span>
              <span className="font-semibold text-slate-200 print:text-black">
                {VSA_METADATA.primaryContact}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary & Architecture Attestation */}
        <section className="mb-10">
          <div className="border-b border-slate-800 pb-3 mb-4 print:border-black">
            <h2 className="text-lg font-semibold tracking-tight text-white print:text-black flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              1. Executive Summary & Architecture Attestation
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-300 print:text-slate-800 mb-4">
            VAAI provides an accredited workforce development and credentialing platform designed for transitioning
            military service members, defense personnel, and commercial defense industrial base (DIB) enterprise employers.
            The software operates an edge-isolated, multi-tenant architecture designed to process student instructional
            telemetry and candidate technical workflow portfolios while preventing the ingestion, retention, or transit
            of unredacted Federal Contract Information (FCI), Controlled Unclassified Information (CUI), or Controlled
            Defense Information (CDI).
          </p>

          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 font-mono text-xs overflow-x-auto print:border-slate-400 print:bg-slate-100 print:text-black">
            <div className="text-[11px] text-emerald-400 font-semibold mb-2 flex items-center gap-1.5 print:text-black">
              <Terminal className="h-3.5 w-3.5" />
              DEFENSE PERIMETER & DATA BOUNDARY ARCHITECTURE
            </div>
            <pre className="text-slate-300 print:text-black leading-relaxed whitespace-pre font-mono">
{`+---------------------------------------------------------------------------------------------------+
|                                 DEFENSE PERIMETER & DATA BOUNDARY                                 |
+---------------------------------------------------------------------------------------------------+
|  [Edge Security: TLS 1.3 / Strict CSP / Nonce / 2-Year HSTS Preload]                              |
|  * Anti-Clickjacking: X-Frame-Options: DENY                                                       |
|  * Traceability: X-VAAI-Trace-Id (UUIDv4) & X-Compliance-Baseline: NIST-800-171-REV3              |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+-------------------------------------------------+-------------------------------------------------+
|  [Application Layer: Next.js 16 Active LTS / FIPS 140-3 Primitives]                               |
|  * CUI/DoD PII Shield: Auto-redaction of SSN, EDI-PI (DoD ID), MGRS, and //CUI// tokens           |
|  * 15-Minute Authenticated Session Idle Termination (NIST AC-11/12)                               |
|  * Dual-Agent Deterministic Grader: Zero-Retention API Gateway                                     |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+-------------------------------------------------+-------------------------------------------------+
|  [Persistence Layer: Encrypted at Rest & Audit Chained]                                           |
|  * Authenticated AES-256-GCM field-level encryption with 96-bit IVs & 128-bit Auth Tags          |
|  * Immutable Audit Trail: RFC 5424 / CEF:0 with cryptographic HMAC-SHA256 hash chaining           |
|  * Row-Level Security (RLS) PostgreSQL isolation with tenant partition keys                       |
+---------------------------------------------------------------------------------------------------+`}
            </pre>
          </div>
        </section>

        {/* Section 2: Standardized Vendor Security Questionnaire Response (SIG Core) */}
        <section className="mb-10">
          <div className="border-b border-slate-800 pb-3 mb-4 print:border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-white print:text-black flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-400" />
              2. Standardized Vendor Security Questionnaire Response (VSA / SIG Core)
            </h2>
            <div className="flex items-center gap-1 overflow-x-auto print:hidden">
              <Button
                variant={activeDomainTab === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveDomainTab('all')}
                className="text-xs h-7 px-2.5"
              >
                All Domains
              </Button>
              {VSA_DOMAINS.map((domain) => (
                <Button
                  key={domain.id}
                  variant={activeDomainTab === domain.id ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveDomainTab(domain.id)}
                  className="text-xs h-7 px-2.5 whitespace-nowrap"
                >
                  {domain.title.split(':')[0]}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {displayedDomains.map((domain) => (
              <Card key={domain.id} className="border-slate-800 bg-slate-900/60 print:border-slate-400 print:bg-white">
                <CardHeader className="py-3 px-4 border-b border-slate-800/80 bg-slate-900/90 print:bg-slate-100 print:border-slate-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <CardTitle className="text-sm font-semibold text-white print:text-black flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-emerald-400" />
                      {domain.title}
                    </CardTitle>
                    <span className="font-mono text-xs text-slate-400 print:text-slate-700">
                      {domain.frameworkRef}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                    {domain.description}
                  </p>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 print:border-slate-300 print:bg-slate-50 print:text-slate-700">
                        <th className="p-3 font-semibold w-28">Control ID</th>
                        <th className="p-3 font-semibold w-64">Evaluation Question</th>
                        <th className="p-3 font-semibold">Vendor Response & Implementation Details</th>
                        <th className="p-3 font-semibold w-36 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 print:divide-slate-300">
                      {domain.controls.map((ctrl) => (
                        <tr key={ctrl.id} className="hover:bg-slate-900/40 print:hover:bg-transparent">
                          <td className="p-3 font-mono font-bold text-emerald-400 print:text-black whitespace-nowrap align-top">
                            {ctrl.id}
                            <div className="text-[10px] font-normal text-slate-500 print:text-slate-600">
                              (NIST {ctrl.controlRef})
                            </div>
                          </td>
                          <td className="p-3 font-medium text-slate-200 print:text-black align-top">
                            {ctrl.question}
                          </td>
                          <td className="p-3 text-slate-300 print:text-slate-800 leading-relaxed align-top">
                            {ctrl.response}
                          </td>
                          <td className="p-3 align-top text-center">
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] whitespace-nowrap print:border-black print:text-black">
                              {ctrl.complianceStatus}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 3: Data Isolation, Tenant Boundary, & AI Safety Architecture */}
        <section className="mb-10">
          <div className="border-b border-slate-800 pb-3 mb-4 print:border-black">
            <h2 className="text-lg font-semibold tracking-tight text-white print:text-black flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-400" />
              3. Data Isolation, Tenant Boundary, & AI Safety Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 print:border-slate-300 print:bg-white">
              <div className="font-semibold text-sm text-emerald-400 mb-1 print:text-black">
                1. Logical RLS Isolation
              </div>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                PostgreSQL Row-Level Security (RLS) policies mandate that every read/write query evaluates
                <code className="mx-1 px-1 bg-slate-800 rounded font-mono text-[11px] text-amber-300">auth.uid() = user_id</code>
                or verifies employer organization membership. Database queries from Employer A cannot resolve records belonging to Employer B or unauthenticated entities.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 print:border-slate-300 print:bg-white">
              <div className="font-semibold text-sm text-emerald-400 mb-1 print:text-black">
                2. Client WASM Execution Sandbox
              </div>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                All student code execution and prompt engineering experimentation occurs within an
                <strong className="text-slate-100 print:text-black"> in-browser WebAssembly sandbox (Pyodide/WASM)</strong>.
                Student code executes on the client device browser thread; zero untrusted student code executes on server host operating systems.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 print:border-slate-300 print:bg-white">
              <div className="font-semibold text-sm text-emerald-400 mb-1 print:text-black">
                3. Private Artifact Storage
              </div>
              <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                Uploaded military service records, DD-214s, and evaluation reports are stored in private, unlisted
                Supabase Storage buckets with access restricted to cryptographically pre-signed URLs expiring after 15 minutes.
              </p>
            </div>
          </div>

          {/* CUI Guard & Shield Diagram */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 mb-6 font-mono text-xs overflow-x-auto print:border-slate-400 print:bg-slate-100 print:text-black">
            <div className="text-[11px] text-emerald-400 font-semibold mb-2 flex items-center gap-1.5 print:text-black">
              <ShieldCheck className="h-3.5 w-3.5" />
              CUI & DOD PII AUTO-SCRUBBING ENGINE FLOW (lib/security/cui-guard.ts)
            </div>
            <pre className="text-slate-300 print:text-black leading-relaxed whitespace-pre font-mono">
{`+---------------------------------------------------------------------------------------------------+
|                                CUI & DOD PII AUTO-SCRUBBING ENGINE                                |
+---------------------------------------------------------------------------------------------------+
|  Input Text Stream (User prompts, uploaded documents, capstone configurations)                   |
|                                                  |                                                |
|  [Regex & Lexical Analysis Passes]               v                                                |
|  * Social Security Numbers (SSN):                /\\b\\d{3}-\\d{2}-\\d{4}\\b/ -> [REDACTED_DOD_PII]   |
|  * DoD ID / EDI-PI:                              /\\b\\d{10}\\b/            -> [REDACTED_DOD_PII]   |
|  * NATO MGRS Grid Coordinates:                   /\\b[0-6][0-9][C-X]...\\b/-> [REDACTED_MGRS_COORD] |
|  * CUI Distribution Markings:                    /(?:\\/\\/CUI\\/\\/...)/    -> [REDACTED_CUI]        |
|                                                  |                                                |
|  [LLM Gateway Gatekeeper: validateSafeForLlm()]  v                                                |
|  * Clean Payload -> Allowed to Pass to Zero-Retention LLM API                                     |
|  * Unsanitized Spill Detected -> Immediate HTTP 403 / Audit Event Generated                       |
+---------------------------------------------------------------------------------------------------+`}
            </pre>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 text-xs print:border-black print:bg-slate-50">
            <h4 className="font-semibold text-amber-300 print:text-black mb-1.5 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              Statutory Safe Harbor Barrier (Title 38 U.S.C. §§ 5901–5905)
            </h4>
            <p className="text-slate-300 print:text-slate-800 leading-relaxed">
              VAAI incorporates strict programmatic barriers preventing unlicensed claims representation. Prompts requesting
              legal representation, VA disability claim preparation, nexus letter drafting, or disability rating speculation
              are intercepted and terminated with an HTTP 403 Statutory Refusal, ensuring absolute compliance with federal statutes
              governing veteran assistance programs.
            </p>
          </div>
        </section>

        {/* Section 4: CMMC 2.0 Level 2 / NIST SP 800-171 System Security Plan (SSP) Crosswalk */}
        <section className="mb-10">
          <div className="border-b border-slate-800 pb-3 mb-4 print:border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white print:text-black flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-400" />
                4. CMMC 2.0 Level 2 / NIST SP 800-171 System Security Plan (SSP) Crosswalk
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                Mapping all 13 Defense Industrial Base practice families to active architectural implementations
              </p>
            </div>
            <div className="relative w-full sm:w-64 print:hidden">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Filter CMMC families..."
                value={cmmcSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCmmcSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-slate-900 border-slate-800"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900/60 print:border-slate-400 print:bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 print:border-slate-300 print:bg-slate-100 print:text-slate-700">
                    <th className="p-3 font-semibold w-48">CMMC Practice Family</th>
                    <th className="p-3 font-semibold w-32">NIST Controls</th>
                    <th className="p-3 font-semibold">Implemented Architecture & Controls</th>
                    <th className="p-3 font-semibold w-48">Evidence Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 print:divide-slate-300">
                  {filteredCmmcFamilies.map((f) => (
                    <tr key={f.familyCode} className="hover:bg-slate-900/40 print:hover:bg-transparent">
                      <td className="p-3 font-semibold text-white print:text-black align-top">
                        {f.family}
                        <span className="block font-mono text-[10px] text-emerald-400 font-normal">
                          Code: {f.familyCode}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400 print:text-slate-700 align-top">
                        {f.nistControls}
                      </td>
                      <td className="p-3 text-slate-300 print:text-slate-800 leading-relaxed align-top">
                        {f.implementedControls}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-amber-300 print:text-black align-top">
                        <span className="bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800 print:border-none">
                          {f.evidenceReference}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredCmmcFamilies.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-500">
                        No CMMC practice families match your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 5: SOC 2 Type II Trust Services Criteria Attestation */}
        <section className="mb-10">
          <div className="border-b border-slate-800 pb-3 mb-4 print:border-black">
            <h2 className="text-lg font-semibold tracking-tight text-white print:text-black flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-emerald-400" />
              5. SOC 2 Type II Trust Services Criteria Attestation Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-800 bg-slate-900/60 print:border-slate-400 print:bg-white">
              <CardHeader className="py-3 px-4 border-b border-slate-800 bg-slate-900/90 print:bg-slate-100 print:border-slate-300">
                <CardTitle className="text-sm font-semibold text-emerald-400 print:text-black">
                  Security (CC 1.0 – 9.0)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs text-slate-300 print:text-slate-800">
                <p>
                  <strong>Perimeter Defense:</strong> {VSA_SOC2_ATTESTATION.security.perimeterDefense}
                </p>
                <p>
                  <strong>Vulnerability Mgmt:</strong> {VSA_SOC2_ATTESTATION.security.vulnerabilityManagement}
                </p>
                <p>
                  <strong>Change Control:</strong> {VSA_SOC2_ATTESTATION.security.changeManagement}
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60 print:border-slate-400 print:bg-white">
              <CardHeader className="py-3 px-4 border-b border-slate-800 bg-slate-900/90 print:bg-slate-100 print:border-slate-300">
                <CardTitle className="text-sm font-semibold text-emerald-400 print:text-black">
                  Confidentiality
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs text-slate-300 print:text-slate-800">
                <p>
                  <strong>Data Classification:</strong> {VSA_SOC2_ATTESTATION.confidentiality.dataClassification}
                </p>
                <p>
                  <strong>Zero Retention:</strong> {VSA_SOC2_ATTESTATION.confidentiality.zeroHostRetention}
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60 print:border-slate-400 print:bg-white">
              <CardHeader className="py-3 px-4 border-b border-slate-800 bg-slate-900/90 print:bg-slate-100 print:border-slate-300">
                <CardTitle className="text-sm font-semibold text-emerald-400 print:text-black">
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs text-slate-300 print:text-slate-800">
                <p>
                  <strong>SLA Target:</strong> {VSA_SOC2_ATTESTATION.availability.sla}
                </p>
                <p>
                  <strong>DR / Continuity:</strong> {VSA_SOC2_ATTESTATION.availability.disasterRecovery}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 6: Incident Response & DFARS 252.204-7012 Compliance */}
        <section className="mb-10">
          <div className="border-b border-slate-800 pb-3 mb-4 print:border-black">
            <h2 className="text-lg font-semibold tracking-tight text-white print:text-black flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              6. Incident Response & DFARS 252.204-7012 Compliance
            </h2>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 print:border-slate-400 print:bg-white">
            <p className="text-xs text-slate-300 print:text-slate-800 mb-4 leading-relaxed">
              In the event of a confirmed cyber incident or unauthorized data exfiltration involving Covered Defense Information (CDI):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-white print:text-black block">Initial Containment (&le; 60 mins)</span>
                  <span className="text-slate-400 print:text-slate-700">{VSA_DFARS_INCIDENT_RESPONSE.initialContainment}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-white print:text-black block">DoD Notification (&le; 72 hours)</span>
                  <span className="text-slate-400 print:text-slate-700">{VSA_DFARS_INCIDENT_RESPONSE.dodNotification}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-white print:text-black block">Prime Contractor Notification</span>
                  <span className="text-slate-400 print:text-slate-700">{VSA_DFARS_INCIDENT_RESPONSE.primeContractorNotification}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-white print:text-black block">Forensic Preservation</span>
                  <span className="text-slate-400 print:text-slate-700">{VSA_DFARS_INCIDENT_RESPONSE.forensicPreservation}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Executive Sign-Off & Attestation */}
        <section className="mb-10">
          <div className="border-b border-slate-800 pb-3 mb-4 print:border-black">
            <h2 className="text-lg font-semibold tracking-tight text-white print:text-black flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              7. Executive Sign-Off & Attestation
            </h2>
          </div>

          <p className="text-xs text-slate-300 print:text-slate-800 mb-4 leading-relaxed">
            I hereby certify that the security controls, data isolation architectures, and compliance declarations
            documented in this assessment package are fully implemented, continuously monitored, and accurately
            reflect the operational posture of the VAAI infrastructure as of {VSA_METADATA.authenticationDate}.
          </p>

          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 font-mono text-xs overflow-x-auto print:border-slate-400 print:bg-slate-50 print:text-black">
            <div className="text-slate-300 print:text-black leading-relaxed whitespace-pre font-mono">
{`+---------------------------------------------------------------------------------------------------+
|  AUTHORIZED SIGNATURE & ATTESTATION                                                               |
+---------------------------------------------------------------------------------------------------+
|  Signature:  /s/ ${VSA_METADATA.authorizedSigner.name.padEnd(65, ' ')}|
|  Signer:     ${VSA_METADATA.authorizedSigner.name.padEnd(65, ' ')}|
|  Title:      ${VSA_METADATA.authorizedSigner.title.padEnd(65, ' ')}|
|  Date:       ${VSA_METADATA.authenticationDate.padEnd(65, ' ')}|
|  Entity:     ${VSA_METADATA.authorizedSigner.entity.padEnd(65, ' ')}|
|  Address:    ${VSA_METADATA.authorizedSigner.address.padEnd(65, ' ')}|
|  Audit Ref:  ${VSA_METADATA.authorizedSigner.auditReference.padEnd(65, ' ')}|
+---------------------------------------------------------------------------------------------------+`}
            </div>
          </div>
        </section>

        {/* Verification & Attachment Checklist */}
        <section className="mb-12">
          <div className="border-b border-slate-800 pb-3 mb-4 print:border-black">
            <h3 className="text-sm font-semibold tracking-tight text-white print:text-black flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-400" />
              Verification & Attachment Checklist
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VSA_ATTACHMENTS.map((att) => (
              <div
                key={att.id}
                className="flex items-start gap-2.5 rounded border border-slate-800 bg-slate-900/40 p-3 text-xs print:border-slate-300 print:bg-white"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 print:text-black block">
                    Attachment {att.id}: {att.title}
                  </span>
                  <span className="text-slate-400 print:text-slate-600 block text-[11px] mt-0.5">
                    {att.description}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 print:text-slate-800 mt-1 block">
                    Status: {att.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Statutory Notice */}
        <footer className="border-t border-slate-800 pt-4 text-center text-[10px] text-slate-500 print:text-slate-600 print:border-slate-400">
          <p>
            VAAI APEX LMS // VENDOR SECURITY ASSESSMENT RESPONSE PACKAGE // RESTRICTED ACCESS UNDER DFARS 252.204-7012 // 18 U.S.C. § 1030
          </p>
          <p className="mt-1">
            Austin, Texas // Enterprise GovSec Office // govsec@vaai.edu // NIST SP 800-171 Rev. 3 Alignment
          </p>
        </footer>
      </main>
    </div>
  );
}
