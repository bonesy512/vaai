'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Server,
  FileCheck,
  ArrowLeft,
  Building2,
  AlertTriangle,
  FileText,
  BadgeCheck,
  ExternalLink,
  Cpu,
  Clock,
  Radio,
  FileCode,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { compileDpaText } from '@/lib/mou-template';

const TOMS_MATRIX = [
  {
    family: 'Access Control (AC)',
    controls: 'AC.L2-3.1.1 through AC.L2-3.1.22 (22 controls)',
    implementation: 'PostgreSQL Row-Level Security (RLS) policies, role-based access control, 15-min session inactivity lockout, and edge IP filtering.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Audit & Accountability (AU)',
    controls: 'AU.L2-3.3.1 through AU.L2-3.3.9 (9 controls)',
    implementation: 'RFC 5424 / Common Event Format (CEF:0) telemetry with HMAC-SHA256 hash chaining and tamper-evident WORM audit persistence.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Configuration Management (CM)',
    controls: 'CM.L2-3.4.1 through CM.L2-3.4.9 (9 controls)',
    implementation: 'Strict Infrastructure-as-Code, immutable container configurations, zero-dependency sandboxes, and automated CI/CD pipeline gating.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Identification & Authentication (IA)',
    controls: 'IA.L2-3.5.1 through IA.L2-3.5.11 (11 controls)',
    implementation: 'Multi-factor authentication (MFA) via FIPS-approved tokens, DoD CAC/PIV certificate integration, and salted SHA-256 password hashing.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Incident Response (IR)',
    controls: 'IR.L2-3.6.1 through IR.L2-3.6.3 (3 controls)',
    implementation: 'DFARS 252.204-7012 compliant 72-hour DoD DC3 notification procedure, 24-hour partner alert, and 90-day forensic image retention.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Maintenance (MA)',
    controls: 'MA.L2-3.7.1 through MA.L2-3.7.6 (6 controls)',
    implementation: 'Controlled maintenance sessions, multi-factor authenticated remote sessions, and automated dependency vulnerability scanning.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Media Protection (MP)',
    controls: 'MP.L2-3.8.1 through MP.L2-3.8.9 (9 controls)',
    implementation: 'NIST SP 800-88 Rev. 1 cryptographic erasure, field-level encryption, and strict prohibition of portable storage devices.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Personnel Security (PS)',
    controls: 'PS.L2-3.9.1 through PS.L2-3.9.2 (2 controls)',
    implementation: 'Mandatory background screening, non-disclosure agreements, and immediate credential revocation upon separation.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Physical Protection (PE)',
    controls: 'PE.L2-3.10.1 through PE.L2-3.10.6 (6 controls)',
    implementation: 'Physical access restricted to Austin Community College Highland Campus facilities with electronic badge logging.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Risk Assessment (RA)',
    controls: 'RA.L2-3.11.1 through RA.L2-3.11.3 (3 controls)',
    implementation: 'Quarterly automated threat modeling, continuous vulnerability discovery, and annual third-party penetration testing.',
    status: 'Implemented (100%)',
  },
  {
    family: 'Security Assessment (CA)',
    controls: 'CA.L2-3.12.1 through CA.L2-3.12.4 (4 controls)',
    implementation: 'SPRS score tracking (110/110), System Security Plan (SSP) maintenance, and Plans of Action and Milestones (POA&M) management.',
    status: 'Implemented (100%)',
  },
  {
    family: 'System & Communications (SC)',
    controls: 'SC.L2-3.13.1 through SC.L2-3.13.16 (16 controls)',
    implementation: 'Strict CSP with cryptographic nonces, 2-year HSTS preload, TLS 1.3 in-transit, and authenticated AES-256-GCM field encryption at rest.',
    status: 'Implemented (100%)',
  },
  {
    family: 'System & Information Integrity (SI)',
    controls: 'SI.L2-3.14.1 through SI.L2-3.14.7 (7 controls)',
    implementation: 'Lexical CUI/DoD PII scrubber, real-time input sanitization, automated static analysis gates, and anti-tamper triggers.',
    status: 'Implemented (100%)',
  },
];

const CUI_CATEGORIES = [
  {
    category: 'Controlled Technical Information (CTI)',
    marking: '//CUI// CTI',
    description: 'Technical workflow configurations, prompt defense blueprints, and algorithm automation scripts.',
    safeguarding: 'FIPS authenticated AES-256-GCM at rest, TLS 1.3 in transit, client-side WASM sandbox execution.',
    authorizedUsers: 'Cleared Partner Recruiters & Authorized Academic Evaluators',
  },
  {
    category: 'Defense Personnel PII (DoD PII)',
    marking: '//CUI// PRVCY // DOD-PII',
    description: '10-digit DoD EDI-PI IDs, military service evaluations, redacted SSNs, and service discharge records.',
    safeguarding: 'Automated regex/lexical masking, salted SHA-256 hashing, zero external AI model retention.',
    authorizedUsers: 'Enterprise Partner Security Officers & State WIOA Auditors',
  },
  {
    category: 'Military Tactical Coordinates (MGRS)',
    marking: '//CUI// GEO-TACTICAL',
    description: 'NATO/DoD Military Grid Reference System (MGRS) tactical deployment locations and training operational grids.',
    safeguarding: 'Automatic regex detection and replacement with [REDACTED_MGRS_COORDINATE] prior to model ingest.',
    authorizedUsers: 'Strictly prohibited from foundation model processing',
  },
  {
    category: 'Student Interaction Telemetry',
    marking: '//CUI// FEDCON // WIOA-AUDIT',
    description: 'Biometric active-seat-time logs, code execution attempts, tab focus pings, and capstone evaluation scores.',
    safeguarding: 'Cryptographic HMAC-SHA256 signature chaining, write-once-read-many (WORM) audit tables.',
    authorizedUsers: 'Texas Workforce Commission & DOL WIOA Compliance Reviewers',
  },
];

export default function DataProtectionAddendumPage() {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopy = async () => {
    try {
      const dpaText = compileDpaText();
      await navigator.clipboard.writeText(dpaText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const dpaText = compileDpaText();
    const blob = new Blob([dpaText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VAAI_Data_Protection_Addendum_DFARS_NIST_CMMC_${new Date().getFullYear()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-black">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-800 bg-slate-900/60 print:hidden">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white -ml-2">
            <Link href="/employers/partnership">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Enterprise Partnership Hub
            </Link>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs h-8"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                  Copied Text
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                  Copy Markdown
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs h-8"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              Download (.md)
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 font-semibold shadow-md"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8 print:p-0 print:max-w-none">
        {/* Document Header */}
        <header className="space-y-4 border-b border-slate-800 print:border-black pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-mono text-[11px] hover:bg-emerald-500/20">
              <ShieldCheck className="mr-1 h-3 w-3" />
              DFARS 252.204-7012 / 7020 / 7021
            </Badge>
            <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-400 font-mono text-[11px] hover:bg-amber-500/20">
              <BadgeCheck className="mr-1 h-3 w-3" />
              NIST SP 800-171 Rev. 3 (110/110 SPRS)
            </Badge>
            <Badge className="bg-sky-500/10 border-sky-500/30 text-sky-400 font-mono text-[11px] hover:bg-sky-500/20">
              <Lock className="mr-1 h-3 w-3" />
              CMMC 2.0 Level 2
            </Badge>
            <Badge className="bg-purple-500/10 border-purple-500/30 text-purple-400 font-mono text-[11px] hover:bg-purple-500/20">
              Title 38 U.S.C. §§ 5901–5905 Safe Harbor
            </Badge>
          </div>

          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-emerald-400 print:text-neutral-700 uppercase">
              GOVSEC BINDING LEGAL INSTRUMENT
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white print:text-black mt-1">
              Data Protection Addendum (DPA)
            </h1>
            <p className="text-sm sm:text-base text-slate-400 print:text-neutral-700 mt-1 font-medium">
              Safeguarding Covered Defense Information, Controlled Unclassified Information, and Workforce Participant Records
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 rounded-lg border border-slate-800 print:border-neutral-300 bg-slate-900/60 print:bg-neutral-50 p-4 text-xs">
            <div>
              <span className="text-slate-400 print:text-neutral-600 block">Effective Date:</span>
              <span className="font-semibold text-white print:text-black">September 8, 2026</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-neutral-600 block">Governing Master Contract:</span>
              <span className="font-semibold text-white print:text-black">Employer Partnership MOU</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-neutral-600 block">Educational Provider:</span>
              <span className="font-semibold text-white print:text-black">Schustereit &amp; Co. LLC d/b/a VAAI</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-neutral-600 block">TWC Accreditation ID:</span>
              <span className="font-mono font-bold text-amber-400 print:text-black">TWC-ETPL-78752-VAAI</span>
            </div>
          </div>
        </header>

        {/* Executive Summary Alert */}
        <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-xs text-slate-300 print:border-black print:bg-transparent print:text-black space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 print:text-black font-bold text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <h2>Defense Industrial Base (DIB) Security Attestation</h2>
          </div>
          <p className="leading-relaxed">
            This Data Protection Addendum (&ldquo;DPA&rdquo;) forms an inseparable component of all B2B Employer Memoranda of Understanding executed with the Veteran AI Enablement Platform (VAAI). It legally obligates VAAI and enterprise defense partners (e.g., Booz Allen Hamilton, Lockheed Martin, CACI, Leidos) to protect Controlled Unclassified Information (CUI), Controlled Technical Information (CTI), and defense personnel records in strict accordance with <strong>DFARS 252.204-7012</strong>, <strong>NIST SP 800-171 Rev. 3</strong>, and <strong>CMMC 2.0 Level 2</strong>.
          </p>
        </section>

        {/* Section 1 */}
        <section id="section-1" className="space-y-3">
          <h2 className="text-base font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-400 pb-1.5 flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">01.</span>
            Purpose, Scope, and Order of Precedence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 print:text-black leading-relaxed">
            This Data Protection Addendum (&ldquo;DPA&rdquo;) supplements and amends the Master Agreement between Provider and Partner. It establishes binding data protection, cybersecurity controls, and incident response requirements governing Partner access to the VAAI Talent Clearinghouse, candidate technical portfolios, military service evaluation extracts, and WIOA outcome tracking systems.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 print:text-black leading-relaxed">
            To the extent that Provider processes, stores, or transmits Covered Defense Information (CDI), Controlled Unclassified Information (CUI), or defense workforce Personally Identifiable Information (PII) on behalf of or in collaboration with Partner, the terms of this DPA shall govern. In the event of any conflict between the Master Agreement and this DPA, the terms of this DPA shall control.
          </p>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="space-y-3">
          <h2 className="text-base font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-400 pb-1.5 flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">02.</span>
            Definitions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 print:bg-white print:border-neutral-300 p-3.5 space-y-1">
              <strong className="text-emerald-400 print:text-black font-semibold">Controlled Unclassified Information (CUI):</strong>
              <p className="text-slate-300 print:text-black leading-relaxed">
                Has the meaning given in 32 C.F.R. Part 2002 and DoD Instruction 5200.48, encompassing unclassified information requiring safeguarding or dissemination controls pursuant to applicable laws, regulations, and government-wide policies.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 print:bg-white print:border-neutral-300 p-3.5 space-y-1">
              <strong className="text-emerald-400 print:text-black font-semibold">Covered Defense Information (CDI):</strong>
              <p className="text-slate-300 print:text-black leading-relaxed">
                Has the meaning defined in DFARS 252.204-7012, including unclassified Controlled Technical Information (CTI) or other information marked or identified in a contract, task order, or delivery order requiring defense safeguarding.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 print:bg-white print:border-neutral-300 p-3.5 space-y-1">
              <strong className="text-emerald-400 print:text-black font-semibold">Candidate Portfolio Data:</strong>
              <p className="text-slate-300 print:text-black leading-relaxed">
                Technical workflow artifacts, automated script configurations, capstone rubrics, military occupational specialty (MOS) crosswalks, security clearance assertions, and contact data relating to veteran candidates.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 print:bg-white print:border-neutral-300 p-3.5 space-y-1">
              <strong className="text-emerald-400 print:text-black font-semibold">Cyber Incident:</strong>
              <p className="text-slate-300 print:text-black leading-relaxed">
                Actions taken through computer networks resulting in compromise or actual/potential adverse effect on an information system or residing information, meeting DFARS 252.204-7012(c) reporting thresholds.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 print:bg-white print:border-neutral-300 p-3.5 space-y-1">
              <strong className="text-emerald-400 print:text-black font-semibold">DoD PII:</strong>
              <p className="text-slate-300 print:text-black leading-relaxed">
                Individual identifiers unique to military service, including Department of Defense Identification Numbers (EDI-PI), Social Security Numbers (SSN), and service record evaluations.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 print:bg-white print:border-neutral-300 p-3.5 space-y-1">
              <strong className="text-emerald-400 print:text-black font-semibold">FIPS Validated Cryptography:</strong>
              <p className="text-slate-300 print:text-black leading-relaxed">
                Cryptographic modules tested, verified, and formally certified under FIPS 140-2 or FIPS 140-3 standards.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="space-y-4">
          <h2 className="text-base font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-400 pb-1.5 flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">03.</span>
            Cybersecurity Standards &amp; Technical Safeguards
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 print:text-black leading-relaxed">
            <div>
              <h3 className="font-bold text-white print:text-black">3.1 Implementation of NIST SP 800-171 Rev. 3</h3>
              <p className="mt-1">
                Provider warrants and represents that its covered information systems, including the VAAI Apex LMS Engine, edge infrastructure, and talent clearinghouse, implement and maintain all one hundred ten (110) security requirements specified in <strong>NIST SP 800-171 Rev. 3</strong> (and CMMC 2.0 Level 2). Provider maintains a Supplier Performance Risk System (SPRS) self-assessment score of <strong>110/110</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white print:text-black">3.2 Technical Safeguards Enforced</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs">
                <li>
                  <strong className="text-slate-200 print:text-black">Perimeter Edge Defense:</strong> Strict Content Security Policy (CSP) enforcing cryptographic per-request nonces (<code className="font-mono text-emerald-400">script-src &apos;self&apos; &apos;nonce-...&apos;</code>), two-year HTTP Strict Transport Security (<code className="font-mono text-emerald-400">max-age=63072000; includeSubDomains; preload</code>), and frame embedding denial (<code className="font-mono text-emerald-400">X-Frame-Options: DENY</code>).
                </li>
                <li>
                  <strong className="text-slate-200 print:text-black">Cryptographic Data Protection at Rest:</strong> Field-level encryption using FIPS-validated authenticated AES-256-GCM with randomized 96-bit initialization vectors (IVs) and 128-bit authentication tags.
                </li>
                <li>
                  <strong className="text-slate-200 print:text-black">Data in Transit:</strong> Mandatory TLS 1.3 encryption (TLS 1.2 minimum fallback with approved ECDHE suites). Unencrypted cleartext transit is strictly blocked.
                </li>
                <li>
                  <strong className="text-slate-200 print:text-black">Automated CUI &amp; DoD PII Shield:</strong> Server-side lexical and pattern-matching parsers that detect, sanitize, and redact SSNs, EDI-PIs, and Military Grid Reference System (MGRS) tactical coordinates prior to database writes or transmission to processing models.
                </li>
                <li>
                  <strong className="text-slate-200 print:text-black">Session Termination (NIST AC-11/12):</strong> Automatic session invalidation and re-authentication requirements after fifteen (15) minutes of user inactivity.
                </li>
                <li>
                  <strong className="text-slate-200 print:text-black">Tenant Isolation:</strong> Multi-tenant separation enforced through PostgreSQL Row-Level Security (RLS) policies requiring cryptographic user context verification on every query.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="space-y-4">
          <h2 className="text-base font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-400 pb-1.5 flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">04.</span>
            Client-Side Code Execution &amp; Zero-Retention Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 print:bg-white print:border-neutral-300 p-4 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                <Cpu className="h-4 w-4 shrink-0" />
                <span>4.1 In-Browser WASM Execution</span>
              </div>
              <p className="text-slate-300 print:text-black leading-relaxed">
                Candidate workflow evaluations execute exclusively within client-side WebAssembly (WASM) sandboxes on the user&apos;s local thread. No untrusted student scripts or blueprints execute directly on host infrastructure.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 print:bg-white print:border-neutral-300 p-4 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <Layers className="h-4 w-4 shrink-0" />
                <span>4.2 Zero Data Retention</span>
              </div>
              <p className="text-slate-300 print:text-black leading-relaxed">
                Provider enforces zero-data-retention terms with foundation models. User prompts and assessment artifacts are never logged, never used for training or fine-tuning, and purged immediately after execution.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 print:bg-white print:border-neutral-300 p-4 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>4.3 Title 38 Safe Harbor</span>
              </div>
              <p className="text-slate-300 print:text-black leading-relaxed">
                Platform workflows are technically constrained under Title 38 U.S.C. §§ 5901–5905. Queries attempting to generate VA disability rating claims or nexus letters trigger automated HTTP 403 refusals and audit logs.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="section-5" className="space-y-3">
          <h2 className="text-base font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-400 pb-1.5 flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">05.</span>
            Audit Logging &amp; Tamper-Proof Evidence
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-black leading-relaxed">
            <p>
              <strong>5.1 RFC 5424 and Common Event Format (CEF:0) Ingestion:</strong> Provider maintains continuous audit telemetry logging security-relevant events, including authentication attempts, CUI access, credential issuances, administrative changes, and MOU executions. Audit entries record UTC millisecond timestamps, actor UUIDs, salted SHA-256 anonymized IP hashes, resource targets, and execution status.
            </p>
            <p>
              <strong>5.2 Cryptographic HMAC-SHA256 Chaining:</strong> To comply with NIST SP 800-171 AU-9 (Protection of Audit Information), all audit records are cryptographically linked using an HMAC-SHA256 signature chain. Every log entry computes its signature using the preceding entry&apos;s hash, creating an immutable, append-only log ledger that programmatically exposes any manual modification or deletion attempt.
            </p>
            <p>
              <strong>5.3 Audit Retention:</strong> Audit ledgers and compliance validation records shall be maintained on write-once-read-many (WORM) storage for a mandatory period of not less than seven (7) years to satisfy federal contract review standards.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="section-6" className="space-y-3">
          <h2 className="text-base font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-400 pb-1.5 flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">06.</span>
            Cyber Incident Reporting &amp; DFARS Compliance
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-black leading-relaxed">
            <p>
              <strong>6.1 Incident Thresholds:</strong> A reportable Cyber Incident includes any unauthorized access, malicious exfiltration, data spillage, or compromise impacting Covered Defense Information, Candidate Portfolio Data containing DoD PII, or the system integrity of the talent clearinghouse.
            </p>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 space-y-2 text-xs">
              <strong className="text-red-400 font-bold block">6.2 72-Hour DoD Notification (DFARS 252.204-7012)</strong>
              <p className="text-slate-300 leading-relaxed">
                In the event of a confirmed Cyber Incident affecting defense-related infrastructure:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  <strong>DoD Reporting:</strong> Provider shall submit an official incident report to the Department of Defense Cyber Crime Center (DC3) via <code className="font-mono text-red-300">https://dibnet.dod.mil</code> within <strong>seventy-two (72) hours</strong> of confirmation.
                </li>
                <li>
                  <strong>Partner Notification:</strong> Provider shall notify Partner&apos;s designated Enterprise Partner Security Officer (PSO) in writing within <strong>twenty-four (24) hours</strong> of confirmation, detailing the scope of impacted records, indicators of compromise (IOCs), and initial mitigation measures.
                </li>
              </ol>
            </div>
            <p>
              <strong>6.3 Forensic Preservation:</strong> Provider shall isolate and preserve complete forensic images of affected systems, volatile memory captures, packet logs, and cryptographic audit records for a minimum of ninety (90) days following the incident to facilitate Department of Defense and federal forensic investigations.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="section-7" className="space-y-3">
          <h2 className="text-base font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-400 pb-1.5 flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">07.</span>
            WIOA PIRL Data Exchange &amp; Employment Placement Verification
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-black leading-relaxed">
            <p>
              <strong>7.1 Statutory Reporting Mandate:</strong> To maintain Provider&apos;s listing on the Texas Statewide Eligible Training Provider List (ETPL) under WIOA Title I, Partner agrees to fulfill its placement verification obligations as set forth in the Master Agreement.
            </p>
            <p>
              <strong>7.2 Data Elements Transmitted:</strong> Within thirty (30) days of hiring a candidate sourced through Provider, Partner shall securely report the following fields via Provider&apos;s verified hiring API or portal: Candidate Verification UUID, Job Title &amp; SOC Code (<code className="font-mono text-amber-300">15-1299.08</code>), Hire Date, Base Salary Tier Bracket, and Partner EIN.
            </p>
            <p>
              <strong>7.3 Data Minimization:</strong> Provider shall utilize Partner placement data exclusively for mandatory state reporting under the 90-field WIOA Participant Individual Record Layout (PIRL) submitted to the Texas Workforce Commission (TWC) and the U.S. Department of Labor. Provider shall never sell, commercialize, or disclose Partner compensation models to unauthorized third parties.
            </p>
          </div>
        </section>

        {/* Section 8 & 9 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section id="section-8" className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/40 print:bg-white print:border-neutral-300 p-4 text-xs">
            <h2 className="text-sm font-bold text-amber-400 print:text-black flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500">08.</span>
              Subcontractor Flow-Down Requirements
            </h2>
            <p className="text-slate-300 print:text-black leading-relaxed">
              Provider shall not engage any subcontractor or third-party cloud service provider to process, store, or transmit CUI or CDI unless such entity:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-300 print:text-black">
              <li>Operates strictly within the continental United States (CONUS).</li>
              <li>Holds an active FedRAMP Moderate (or higher) authorization.</li>
              <li>Contractually commits to data protection terms substantially equivalent to this DPA, including DFARS 252.204-7012 flow-down provisions.</li>
            </ol>
          </section>

          <section id="section-9" className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/40 print:bg-white print:border-neutral-300 p-4 text-xs">
            <h2 className="text-sm font-bold text-amber-400 print:text-black flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500">09.</span>
              Term &amp; NIST SP 800-88 Sanitization
            </h2>
            <p className="text-slate-300 print:text-black leading-relaxed">
              <strong>9.1 Term:</strong> Remains in full force and effect concurrently with the Master Agreement until all candidate and defense data is destroyed or sanitized.
            </p>
            <p className="text-slate-300 print:text-black leading-relaxed">
              <strong>9.2 Media Sanitization:</strong> Upon contract termination, both parties shall securely purge all confidential candidate records and military evaluation extracts in accordance with <strong>NIST SP 800-88 Rev. 1</strong> guidelines for cryptographic erasure. Immutable audit ledgers and PIRL placement records are retained for mandatory statutory compliance.
            </p>
          </section>
        </div>

        {/* Section 10: Execution Block */}
        <section id="section-10" className="space-y-4 pt-4 border-t border-slate-800 print:border-black">
          <h2 className="text-base font-bold text-amber-400 print:text-black pb-1 flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">10.</span>
            Execution &amp; Attestation
          </h2>
          <p className="text-xs text-slate-400 print:text-black">
            IN WITNESS WHEREOF, the parties have caused this Data Protection Addendum to be executed by their duly authorized corporate officers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/60 print:bg-white p-4 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-400 print:text-black font-semibold">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>SCHUSTEREIT &amp; CO. LLC d/b/a VAAI</span>
              </div>
              <div className="border-b border-slate-700 print:border-black pb-1 pt-2 font-serif italic text-sm text-slate-100 print:text-black">
                /s/ Thomas M. Schustereit
              </div>
              <div className="font-semibold text-slate-200 print:text-black">Thomas M. Schustereit</div>
              <div className="text-[11px] text-slate-400 print:text-neutral-700">Co-Founder &amp; Chief Technology Officer</div>
              <div className="text-[11px] text-slate-400 print:text-neutral-700">Date: September 8, 2026</div>
              <div className="text-[11px] text-slate-400 print:text-neutral-700">HQ: 6101 Highland Campus Dr, Austin, TX 78752</div>
              <div className="text-[10px] font-mono text-emerald-400 print:text-black">
                &#10003; Attested &amp; Ratified
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/60 print:bg-white p-4 space-y-2">
              <div className="flex items-center space-x-1.5 text-sky-400 print:text-black font-semibold">
                <Building2 className="h-4 w-4 shrink-0" />
                <span>ENTERPRISE DEFENSE PARTNER</span>
              </div>
              <div className="border-b border-dashed border-slate-700 print:border-black pb-1 pt-2 text-slate-500 italic text-xs">
                [Executed concurrently with Master MOU Agreement]
              </div>
              <div className="text-[11px] text-slate-400 print:text-neutral-700">Corporate Officer / Authorized Representative</div>
              <div className="text-[11px] text-slate-400 print:text-neutral-700">Designated Enterprise Partner Security Officer (PSO)</div>
              <div className="text-[11px] text-slate-400 print:text-neutral-700">Date: Concurrent with MOU Effective Date</div>
              <div className="text-[10px] font-mono text-sky-400 print:text-black">
                &#10003; CMMC Level 2 Covenants Accepted
              </div>
            </div>
          </div>
        </section>

        {/* Schedule 1: TOMs Matrix */}
        <section id="schedule-1" className="space-y-4 pt-6 border-t border-slate-800 print:border-neutral-400">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                ADDENDUM SCHEDULE 1
              </span>
              <h2 className="text-lg font-bold text-white print:text-black">
                Technical &amp; Organizational Security Measures (TOMs) Matrix
              </h2>
              <p className="text-xs text-slate-400 print:text-neutral-600">
                14 CMMC 2.0 Level 2 / NIST SP 800-171 Rev. 3 Practice Families (110 Controls)
              </p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-mono">
              110 / 110 SPRS
            </Badge>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-neutral-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 print:bg-neutral-100 text-slate-300 print:text-black border-b border-slate-800 print:border-neutral-300 font-semibold">
                <tr>
                  <th className="p-3">Practice Family</th>
                  <th className="p-3">Requirement Range</th>
                  <th className="p-3">VAAI Implementation &amp; Control Architecture</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-neutral-200">
                {TOMS_MATRIX.map((tom) => (
                  <tr key={tom.family} className="hover:bg-slate-900/30">
                    <td className="p-3 font-semibold text-white print:text-black whitespace-nowrap">{tom.family}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-400 print:text-neutral-600 whitespace-nowrap">{tom.controls}</td>
                    <td className="p-3 text-slate-300 print:text-neutral-800 leading-relaxed">{tom.implementation}</td>
                    <td className="p-3 text-emerald-400 print:text-black font-semibold whitespace-nowrap">{tom.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Schedule 2: CUI Crosswalk */}
        <section id="schedule-2" className="space-y-4 pt-6 border-t border-slate-800 print:border-neutral-400">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              ADDENDUM SCHEDULE 2
            </span>
            <h2 className="text-lg font-bold text-white print:text-black">
              CUI Category Crosswalk &amp; Permitted Dissemination Lists
            </h2>
            <p className="text-xs text-slate-400 print:text-neutral-600">
              Controlled Unclassified Information Categorization pursuant to DoD Instruction 5200.48
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-neutral-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 print:bg-neutral-100 text-slate-300 print:text-black border-b border-slate-800 print:border-neutral-300 font-semibold">
                <tr>
                  <th className="p-3">CUI Category</th>
                  <th className="p-3">Standard Marking</th>
                  <th className="p-3">Data Description</th>
                  <th className="p-3">Safeguarding Mechanism</th>
                  <th className="p-3">Authorized Recipients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-neutral-200">
                {CUI_CATEGORIES.map((cat) => (
                  <tr key={cat.category} className="hover:bg-slate-900/30">
                    <td className="p-3 font-semibold text-white print:text-black whitespace-nowrap">{cat.category}</td>
                    <td className="p-3 font-mono text-[11px] text-amber-400 print:text-black whitespace-nowrap">{cat.marking}</td>
                    <td className="p-3 text-slate-300 print:text-neutral-800 leading-relaxed">{cat.description}</td>
                    <td className="p-3 text-slate-300 print:text-neutral-800 leading-relaxed">{cat.safeguarding}</td>
                    <td className="p-3 text-emerald-400 print:text-black font-medium">{cat.authorizedUsers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Schedule 3: DFARS Incident Report Template */}
        <section id="schedule-3" className="space-y-4 pt-6 border-t border-slate-800 print:border-neutral-400">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              ADDENDUM SCHEDULE 3
            </span>
            <h2 className="text-lg font-bold text-white print:text-black">
              Form of DFARS 72-Hour Cyber Incident Report Notification
            </h2>
            <p className="text-xs text-slate-400 print:text-neutral-600">
              Department of Defense Cyber Crime Center (DC3) Standard Notification Template (DFARS 252.204-7012)
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 print:border-black bg-slate-900/80 print:bg-white p-5 font-mono text-xs text-slate-300 print:text-black space-y-3 leading-relaxed">
            <div className="text-amber-400 print:text-black font-bold border-b border-slate-800 print:border-black pb-2">
              DEPARTMENT OF DEFENSE CYBER CRIME CENTER (DC3) DIBNET REPORTING FORM
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div><strong>01. Submitting Contractor:</strong> Schustereit &amp; Co. LLC d/b/a VAAI</div>
              <div><strong>02. CAGE Code / DUNS:</strong> Available upon verified defense contract audit</div>
              <div><strong>03. Contracting Officer POC:</strong> govsec@vaai.edu</div>
              <div><strong>04. Incident Date &amp; Time (UTC):</strong> [RECORDED TIMESTAMP]</div>
              <div><strong>05. Incident Discovery Time (UTC):</strong> [DISCOVERY TIMESTAMP]</div>
              <div><strong>06. Location of Compromise:</strong> Austin Operational Cloud Facility / CONUS</div>
              <div><strong>07. Affected System Name:</strong> VAAI Apex LMS &amp; Clearinghouse Node</div>
              <div><strong>08. Impacted CUI Categories:</strong> Controlled Technical Information (CTI) / DoD PII</div>
            </div>
            <div className="pt-2 text-[11px] space-y-1">
              <div><strong>09. Description of Technique or Exploit:</strong></div>
              <div className="p-2.5 rounded bg-slate-950 print:bg-neutral-100 text-slate-400 print:text-black border border-slate-800 print:border-neutral-300">
                [Detailed technical analysis: attack vector, CVE identifiers, payload signatures, lateral movement indicators, exfiltration pathways]
              </div>
            </div>
            <div className="text-[11px] space-y-1">
              <div><strong>10. Indicators of Compromise (IOCs):</strong></div>
              <div className="p-2.5 rounded bg-slate-950 print:bg-neutral-100 text-slate-400 print:text-black border border-slate-800 print:border-neutral-300">
                [Source IP addresses, domain names, file SHA-256 hashes, affected user accounts, anomalous process trees]
              </div>
            </div>
            <div className="text-[11px] space-y-1">
              <div><strong>11. Mitigation &amp; Containment Measures Executed:</strong></div>
              <div className="p-2.5 rounded bg-slate-950 print:bg-neutral-100 text-slate-400 print:text-black border border-slate-800 print:border-neutral-300">
                [Session revocation, network isolation, firewall rule injection, cryptographic rotation, forensic memory dump captured]
              </div>
            </div>
            <div className="pt-1 text-[10px] text-slate-500 print:text-neutral-700">
              * Transmission channel: Encrypted DoD DIBNet portal at https://dibnet.dod.mil within 72 hours of confirmation.
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-slate-800 print:hidden flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>&middot;</span>
            <Link href="/vendor-security-assessment" className="hover:text-white transition-colors">Vendor Security Assessment (VSA)</Link>
            <span>&middot;</span>
            <Link href="/etpl-dossier" className="hover:text-white transition-colors">TWC ETPL Dossier</Link>
          </div>

          <div className="text-slate-500">
            &copy; {new Date().getFullYear()} Schustereit &amp; Co. LLC d/b/a VAAI. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
}
