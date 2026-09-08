'use client';

import * as React from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileText,
  Lock,
  Server,
  Radio,
  Clock,
  Layers,
  FileCode,
  AlertTriangle,
} from 'lucide-react';
import { EmployerAgreement } from '@/lib/schemas/mou';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MouStatusBadge } from '@/components/mou-status-badge';
import { compileDpaText } from '@/lib/mou-template';

interface MouDocumentViewerProps {
  agreement: EmployerAgreement;
  showActions?: boolean;
}

const TOMS_MATRIX_SUMMARY = [
  {
    family: 'Access Control (AC)',
    requirement: 'PostgreSQL RLS, RBAC, 15-min session timeout, non-interactive WASM runtime',
    status: '100% Implemented',
  },
  {
    family: 'Audit & Accountability (AU)',
    requirement: 'RFC 5424 / CEF:0 logs, HMAC-SHA256 hash chaining, 7-year WORM retention',
    status: '100% Implemented',
  },
  {
    family: 'Configuration Management (CM)',
    requirement: 'Strict IaC, immutable build images, zero-dependency sandboxing',
    status: '100% Implemented',
  },
  {
    family: 'Identification & Auth (IA)',
    requirement: 'FIPS token MFA, DoD CAC/PIV certificate integration, salted SHA-256 hashes',
    status: '100% Implemented',
  },
  {
    family: 'Incident Response (IR)',
    requirement: '72-hour DoD DC3 DIBNet notification, 24-hour partner alert, 90-day forensics',
    status: '100% Implemented',
  },
  {
    family: 'Media Protection (MP)',
    requirement: 'NIST SP 800-88 Rev. 1 cryptographic erasure, field-level AES-256-GCM',
    status: '100% Implemented',
  },
  {
    family: 'System & Communications (SC)',
    requirement: 'CSP cryptographic nonces, 2-year HSTS preload, TLS 1.3 mandatory',
    status: '100% Implemented',
  },
];

export function MouDocumentViewer({
  agreement,
  showActions = true,
}: MouDocumentViewerProps) {
  const [copied, setCopied] = React.useState(false);
  const [viewTab, setViewTab] = React.useState<'package' | 'mou' | 'dpa'>('package');

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getActiveTextToExport = () => {
    if (viewTab === 'dpa') {
      return `# ADDENDUM A: DATA PROTECTION ADDENDUM (DPA)\n\n${compileDpaText(
        agreement.companyLegalName,
        agreement.employerEin,
        agreement.signature
      )}`;
    }
    // For 'package' or 'mou', agreement.compiledContractText includes MOU + Addendum A
    return agreement.compiledContractText;
  };

  const handleDownload = () => {
    const text = getActiveTextToExport();
    const blob = new Blob([text], {
      type: 'text/markdown;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const prefix = viewTab === 'dpa' ? 'VAAI_DPA' : 'VAAI_MOU_PACKAGE';
    link.setAttribute(
      'download',
      `${prefix}_${agreement.companyLegalName.replace(/[^a-zA-Z0-9]/g, '_')}_${agreement.id}.md`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getActiveTextToExport());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const signedDateStr = agreement.signedAt
    ? new Date(agreement.signedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Pending Execution';

  return (
    <div className="space-y-4">
      {/* Screen-Only Toolbar & Navigation */}
      {showActions && (
        <div className="space-y-2 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                Contract Ref: <code className="font-mono text-amber-400">{agreement.id}</code>
              </span>
              <MouStatusBadge status={agreement.status} />
              <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300 border border-slate-700">
                <Lock className="h-3 w-3 text-emerald-400" />
                DFARS / NIST 800-171 Covered
              </span>
            </div>

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
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                    Copy Text
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs h-8"
              >
                <Download className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                Download .md
              </Button>

              <Button
                size="sm"
                onClick={handlePrint}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs h-8"
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                Print / Save PDF
              </Button>
            </div>
          </div>

          {/* Section View Tabs (Screen Only) */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-1">
            <button
              onClick={() => setViewTab('package')}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                viewTab === 'package'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Complete Legal Package (MOU + DPA)
            </button>
            <button
              onClick={() => setViewTab('mou')}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                viewTab === 'mou'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Master MOU Only
            </button>
            <button
              onClick={() => setViewTab('dpa')}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                viewTab === 'dpa'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Addendum A: Data Protection Addendum (DPA)
            </button>
          </div>
        </div>
      )}

      {/* Contract Document Sheet (8.5x11 Styled) */}
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-800 print:border-none bg-slate-900/70 print:bg-white p-8 sm:p-12 shadow-2xl text-slate-100 print:text-black print:p-0">
        
        {/* ================================================================= */}
        {/* PART 1: MASTER MEMORANDUM OF UNDERSTANDING (MOU)                   */}
        {/* ================================================================= */}
        {(viewTab === 'package' || viewTab === 'mou') && (
          <section className="space-y-6">
            {/* Document Header */}
            <div className="border-b border-slate-800 print:border-neutral-400 pb-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono font-bold tracking-widest text-amber-500 print:text-neutral-700 uppercase">
                    FORMAL MEMORANDUM OF UNDERSTANDING
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white print:text-black mt-1">
                    Veteran Workforce Talent Pipeline &amp; Affirmative Action Partnership
                  </h1>
                  <p className="text-xs text-slate-400 print:text-neutral-600 mt-0.5">
                    Texas Workforce Commission ETPL Provider # <span className="font-mono">TWC-ETPL-78752-VAAI</span>
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 print:border-black bg-slate-950/60 print:bg-white p-3 text-right">
                  <div className="text-[10px] text-slate-400 print:text-black">Agreement ID</div>
                  <div className="text-xs font-mono font-bold text-amber-400 print:text-black">
                    {agreement.id}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400 print:text-black">EIN</div>
                  <div className="text-xs font-mono text-slate-200 print:text-black">
                    {agreement.employerEin}
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Content Body */}
            <div className="prose prose-invert print:prose max-w-none text-xs leading-relaxed text-slate-300 print:text-black space-y-4">
              <div className="rounded-lg bg-slate-950/40 print:bg-neutral-50 p-4 border border-slate-800/80 print:border-neutral-300">
                <div className="font-bold text-slate-200 print:text-black text-sm mb-2">Parties to the Agreement:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 print:text-neutral-600">Educational Provider:</span>
                    <div className="font-semibold text-white print:text-black">Veteran AI Enablement Platform (VAAI)</div>
                    <div className="text-[11px] text-slate-400 print:text-neutral-700">Veteran AI Enablement Initiative LLC</div>
                    <div className="text-[11px] text-slate-500 print:text-neutral-700">Austin Community College Highland Campus</div>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-neutral-600">Corporate Hiring Partner:</span>
                    <div className="font-semibold text-white print:text-black">{agreement.companyLegalName}</div>
                    {agreement.dbaName && (
                      <div className="text-[11px] text-slate-400 print:text-neutral-700">d/b/a {agreement.dbaName}</div>
                    )}
                    <div className="text-[11px] text-slate-400 print:text-neutral-700">
                      POC: {agreement.pointOfContact.name} ({agreement.pointOfContact.title})
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  SECTION 1: Scope &amp; Talent Clearinghouse Access
                </h3>
                <p className="mt-2 text-justify">
                  VAAI grants Employer prioritized access to the VAAI Enterprise Candidate Clearinghouse to evaluate certified graduates of the 40-clock-hour Veteran AI Enablement &amp; Automation curriculum. VAAI guarantees that all introduced candidates have satisfied state-verified WIOA Title I requirements, including a minimum of 36.0 verified non-idle contact hours validated via biometric active-tab telemetry, and an 80.0%+ passing benchmark on the Capstone Workflow Configuration practical examination.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  SECTION 2: Employer Commitments &amp; Guaranteed Interviews
                </h3>
                <p className="mt-2 text-justify">
                  Employer makes a good-faith commitment to review verified candidate portfolios and conduct technical or behavioral screening interviews for a minimum of <strong>{agreement.annualInterviewCommitment} qualified VAAI graduates</strong> during each 12-month calendar period. Targeted occupational roles include:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-200 print:text-black font-medium">
                  {agreement.targetHiringRoles.map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
                <p className="mt-2 text-justify">
                  Employer shall receive documented affirmative action audit logs from VAAI to satisfy recruitment metrics under the Vietnam Era Veterans&apos; Readjustment Assistance Act (VEVRAA, 38 U.S.C. § 4212) and Department of Labor OFCCP compliance audits.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  SECTION 3: WIOA Outcome Reporting &amp; Placement Verification
                </h3>
                <p className="mt-2 text-justify">
                  Pursuant to WIOA Title I regulations (20 CFR Part 680) governing Eligible Training Provider List (ETPL) eligibility, Employer agrees to verify candidate hires within thirty (30) calendar days of offer acceptance. Verification shall confirm hire date, occupational title, and starting wage bracket for inclusion in Texas Workforce Commission PIRL Quarter 2 and Quarter 4 quarterly state performance reports.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  SECTION 4: Title 38 U.S.C. Safe Harbor Boundary
                </h3>
                <p className="mt-2 text-justify">
                  Both Parties reaffirm that VAAI operates strictly as an educational technical literacy institution pursuant to Title 38 U.S.C. §§ 5901–5905 and 38 C.F.R. § 14.629. VAAI is not an accredited Veteran Service Organization (VSO), claims agent, or attorney. Neither party shall use platform workflows for benefits advocacy, claims preparation, or nexus speculation.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  SECTION 5: Zero Direct Placement Fees
                </h3>
                <p className="mt-2 text-justify">
                  VAAI provides all talent matching, candidate portfolio sandbox access, and credential verification services to Employer at <strong>$0.00 direct placement fee</strong>. Program operations are funded through state workforce allocations, federal WIOA grants, and philanthropic enablement initiatives.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  SECTION 6: Term, Automatic Renewal &amp; Termination
                </h3>
                <p className="mt-2 text-justify">
                  This Agreement shall remain in full force and effect for twelve (12) consecutive months from the date of final signature and shall automatically renew annually unless terminated by either party with thirty (30) calendar days prior written notice.
                </p>
              </div>
            </div>

            {/* Master MOU Signatures */}
            <div className="mt-8 pt-6 border-t border-slate-800 print:border-black">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black mb-4">
                IN WITNESS WHEREOF, the Parties have executed this Memorandum of Understanding:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
                {/* VAAI Signer Block */}
                <div className="rounded-lg bg-slate-950/60 print:bg-white p-4 border border-slate-800 print:border-black space-y-2">
                  <div className="flex items-center space-x-1.5 text-amber-400 print:text-black font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>FOR VAAI EDUCATIONAL AUTHORITY:</span>
                  </div>
                  <div className="border-b border-slate-700 print:border-black pb-1 pt-3 font-serif italic text-base text-slate-100 print:text-black">
                    Dr. Marcus Vance, Ph.D.
                  </div>
                  <div className="font-semibold text-slate-200 print:text-black">Director of Academic Standards</div>
                  <div className="text-[11px] text-slate-400 print:text-neutral-700">Veteran AI Enablement Platform (VAAI)</div>
                  <div className="text-[10px] font-mono text-emerald-400 print:text-black">
                    &#10003; Formally Ratified &amp; Approved
                  </div>
                </div>

                {/* Employer Signer Block */}
                <div className="rounded-lg bg-slate-950/60 print:bg-white p-4 border border-slate-800 print:border-black space-y-2">
                  <div className="flex items-center space-x-1.5 text-sky-400 print:text-black font-semibold">
                    <Building2 className="h-4 w-4" />
                    <span>FOR CORPORATE HIRING PARTNER:</span>
                  </div>

                  {agreement.signature ? (
                    <>
                      <div className="border-b border-slate-700 print:border-black pb-1 pt-3 font-serif italic text-base text-slate-100 print:text-black">
                        {agreement.signature.signerName}
                      </div>
                      <div className="font-semibold text-slate-200 print:text-black">
                        {agreement.signature.signerTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 print:text-neutral-700">
                        {agreement.companyLegalName} ({agreement.signature.signerEmail})
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 print:text-black flex items-center">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Digitally Signed: {signedDateStr}
                      </div>
                    </>
                  ) : (
                    <div className="py-6 text-center text-slate-500 italic border-b border-dashed border-slate-700">
                      [Awaiting Authorized Corporate E-Signature]
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Verification Stamp Footer */}
              {agreement.signature && (
                <div className="mt-4 rounded-md bg-slate-950 p-2.5 border border-slate-800/80 font-mono text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500">AUDIT HASH:</span> {agreement.id}-SIG
                    <span className="mx-2 text-slate-700">|</span>
                    <span className="text-slate-500">SIGNER IP:</span> {agreement.signature.ipAddress}
                    <span className="mx-2 text-slate-700">|</span>
                    <span className="text-slate-500">TIMESTAMP:</span> {agreement.signature.signatureTimestamp}
                  </div>
                  <div className="text-emerald-400 font-semibold">
                    &#10003; WIOA STATE AUDIT READY
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Page Break Divider between MOU and DPA in Full Package View */}
        {viewTab === 'package' && (
          <div className="my-12 border-t-2 border-dashed border-slate-800 print:border-neutral-400 print:my-8 print:break-before-page" />
        )}

        {/* ================================================================= */}
        {/* PART 2: ADDENDUM A — DATA PROTECTION ADDENDUM (DPA)               */}
        {/* ================================================================= */}
        {(viewTab === 'package' || viewTab === 'dpa') && (
          <section className="space-y-6">
            {/* DPA GovSec Header */}
            <div className="border-b border-slate-800 print:border-neutral-400 pb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-mono">
                  DFARS 252.204-7012 / 7020 / 7021
                </Badge>
                <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-400 text-[10px] uppercase font-mono">
                  NIST SP 800-171 Rev. 3 (110/110)
                </Badge>
                <Badge variant="outline" className="border-sky-500/40 bg-sky-500/10 text-sky-400 text-[10px] uppercase font-mono">
                  CMMC 2.0 Level 2
                </Badge>
                <Badge variant="outline" className="border-purple-500/40 bg-purple-500/10 text-purple-400 text-[10px] uppercase font-mono">
                  Title 38 U.S.C. Safe Harbor
                </Badge>
              </div>

              <div className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 print:text-neutral-700 uppercase">
                ADDENDUM A: BINDING DEFENSE DATA PROTECTION COVENANTS
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white print:text-black mt-1">
                Data Protection Addendum (DPA)
              </h2>
              <p className="text-xs text-slate-300 print:text-neutral-700 mt-1 font-medium">
                Safeguarding Covered Defense Information, Controlled Unclassified Information, and Workforce Participant Records
              </p>

              {/* DPA Regulatory Metadata Box */}
              <div className="mt-4 rounded-lg bg-slate-950/60 print:bg-neutral-50 p-3.5 border border-slate-800 print:border-neutral-300 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-400 print:text-neutral-600">Governing Agreement:</span>
                  <div className="font-semibold text-slate-200 print:text-black font-mono">
                    Master MOU #{agreement.id}
                  </div>
                  <span className="text-slate-400 print:text-neutral-600 block mt-1.5">Addendum Effective Date:</span>
                  <div className="font-semibold text-slate-200 print:text-black">{signedDateStr}</div>
                </div>
                <div>
                  <span className="text-slate-400 print:text-neutral-600">Customer / Enterprise Partner:</span>
                  <div className="font-semibold text-white print:text-black">{agreement.companyLegalName}</div>
                  <span className="text-slate-400 print:text-neutral-600 block mt-1.5">Partner EIN:</span>
                  <div className="font-mono text-slate-300 print:text-black">{agreement.employerEin}</div>
                </div>
              </div>
            </div>

            {/* DPA Articles */}
            <div className="prose prose-invert print:prose max-w-none text-xs leading-relaxed text-slate-300 print:text-black space-y-4">
              
              {/* Article 1 */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1">
                  1. Purpose, Scope, and Order of Precedence
                </h3>
                <p className="mt-2 text-justify">
                  This Data Protection Addendum (&quot;DPA&quot;) supplements and amends the Master Agreement between Provider and Partner. It establishes binding data protection, cybersecurity controls, and incident response requirements governing Partner access to the VAAI Talent Clearinghouse, candidate technical portfolios, military service evaluation extracts, and WIOA outcome tracking systems.
                </p>
                <p className="mt-2 text-justify">
                  To the extent that Provider processes, stores, or transmits Covered Defense Information (CDI), Controlled Unclassified Information (CUI), or defense workforce Personally Identifiable Information (PII) on behalf of or in collaboration with Partner, the terms of this DPA shall govern. In the event of any conflict between the Master Agreement and this DPA, the terms of this DPA shall control.
                </p>
              </div>

              {/* Article 2 */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  2. Definitions
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>&quot;Controlled Unclassified Information&quot; (CUI):</strong> Has the meaning given in 32 C.F.R. Part 2002 and DoD Instruction 5200.48, encompassing unclassified information requiring safeguarding or dissemination controls pursuant to applicable laws, regulations, and government-wide policies.
                  </li>
                  <li>
                    <strong>&quot;Covered Defense Information&quot; (CDI):</strong> Has the meaning defined in DFARS 252.204-7012, including unclassified Controlled Technical Information (CTI) or other information marked or identified in a contract, task order, or delivery order that requires safeguarding under defense regulations.
                  </li>
                  <li>
                    <strong>&quot;Candidate Portfolio Data&quot;:</strong> Technical workflow artifacts, automated script configurations, capstone rubrics, military occupational specialty (MOS) crosswalks, security clearance assertions, and contact data relating to veteran candidates.
                  </li>
                  <li>
                    <strong>&quot;Cyber Incident&quot;:</strong> Actions taken through the use of computer networks that result in a compromise or an actual or potentially adverse effect on an information system and/or the information residing therein, specifically meeting the reporting thresholds of DFARS 252.204-7012(c).
                  </li>
                  <li>
                    <strong>&quot;DoD PII&quot;:</strong> Identifiers unique to military service, including Department of Defense Identification Numbers (EDI-PI), Social Security Numbers (SSN), and service record evaluations.
                  </li>
                  <li>
                    <strong>&quot;FIPS Validated Cryptography&quot;:</strong> Cryptographic modules tested and approved under FIPS 140-2 or FIPS 140-3 standards.
                  </li>
                </ul>
              </div>

              {/* Article 3 */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  3. Cybersecurity Standards and Security Controls
                </h3>
                <h4 className="font-semibold text-slate-200 print:text-black mt-2">3.1 Implementation of NIST SP 800-171 Rev. 3</h4>
                <p className="mt-1 text-justify">
                  Provider warrants and represents that its covered information systems, including the VAAI Apex LMS Engine, edge infrastructure, and talent clearinghouse, implement and maintain all one hundred ten (110) security requirements specified in <strong>NIST SP 800-171 Rev. 3</strong> (and CMMC 2.0 Level 2). Provider maintains a Supplier Performance Risk System (SPRS) self-assessment score of 110/110.
                </p>

                <h4 className="font-semibold text-slate-200 print:text-black mt-3">3.2 Technical Safeguards</h4>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li><strong>Perimeter Edge Defense:</strong> Strict Content Security Policy (CSP) enforcing cryptographic per-request nonces (<code className="text-amber-300 print:text-black">script-src &apos;self&apos; &apos;nonce-...&apos;</code>), two-year HSTS (<code className="text-amber-300 print:text-black">max-age=63072000; includeSubDomains; preload</code>), and frame embedding denial (<code className="text-amber-300 print:text-black">X-Frame-Options: DENY</code>).</li>
                  <li><strong>Cryptographic Data Protection at Rest:</strong> Field-level encryption using FIPS-validated authenticated AES-256-GCM with randomized 96-bit initialization vectors (IVs) and 128-bit authentication tags.</li>
                  <li><strong>Data in Transit:</strong> Mandatory TLS 1.3 encryption (TLS 1.2 minimum fallback with approved ECDHE suites). Unencrypted cleartext transit is strictly blocked.</li>
                  <li><strong>Automated CUI &amp; DoD PII Shield:</strong> Server-side lexical and pattern-matching parsers that detect, sanitize, and redact SSNs, EDI-PIs, and Military Grid Reference System (MGRS) tactical coordinates prior to database writes or transmission.</li>
                  <li><strong>Session Termination (NIST AC-11/12):</strong> Automatic session invalidation and re-authentication requirements after fifteen (15) minutes of user inactivity.</li>
                  <li><strong>Tenant Isolation:</strong> Multi-tenant separation enforced through PostgreSQL Row-Level Security (RLS) policies requiring cryptographic user context verification on every query.</li>
                </ul>
              </div>

              {/* Article 4 */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  4. Client-Side Code Execution &amp; Zero-Retention Architecture
                </h3>
                <h4 className="font-semibold text-slate-200 print:text-black mt-2">4.1 In-Browser WebAssembly Sandbox Execution</h4>
                <p className="mt-1 text-justify">
                  Candidate workflow evaluations and prompt automation testing shall execute exclusively within client-side WebAssembly (WASM) sandboxes operating on the user&apos;s local hardware thread. No untrusted candidate scripts, blueprints, or workflow payloads shall execute directly on host infrastructure.
                </p>

                <h4 className="font-semibold text-slate-200 print:text-black mt-3">4.2 Zero Data Retention for Foundation Model Processing</h4>
                <p className="mt-1 text-justify">
                  Provider maintains zero-data-retention agreements with downstream inference providers. User input strings, candidate assessment data, and workflow artifacts shall: (a) never be logged or retained by external AI platform providers; (b) never be utilized for model training, fine-tuning, or algorithmic weight adjustment; and (c) be processed in volatile memory and purged immediately upon response generation and Zod schema verification.
                </p>

                <h4 className="font-semibold text-slate-200 print:text-black mt-3">4.3 Title 38 U.S.C. Statutory Safe Harbor Enforcement</h4>
                <p className="mt-1 text-justify">
                  Partner acknowledges that Provider operates solely as a workforce training and technical education institution. Platform services are technically constrained to prevent unauthorized claims assistance. Prompts attempting to generate VA disability rating claims, nexus letters, or formal administrative submissions under Title 38 U.S.C. §§ 5901–5905 shall trigger automated HTTP 403 statutory refusals and immutable audit events.
                </p>
              </div>

              {/* Article 5 */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  5. Audit Logging and Tamper-Proof Evidence
                </h3>
                <h4 className="font-semibold text-slate-200 print:text-black mt-2">5.1 RFC 5424 and Common Event Format (CEF:0) Ingestion</h4>
                <p className="mt-1 text-justify">
                  Provider shall maintain continuous audit telemetry logging security-relevant events, including authentication attempts, CUI access, credential issuances, administrative changes, and MOU executions. Audit entries must record UTC millisecond timestamps, actor UUIDs, salted SHA-256 anonymized IP hashes, resource targets, and execution status.
                </p>

                <h4 className="font-semibold text-slate-200 print:text-black mt-3">5.2 Cryptographic HMAC-SHA256 Chaining (NIST SP 800-171 AU-9)</h4>
                <p className="mt-1 text-justify">
                  All audit records shall be cryptographically linked using an HMAC-SHA256 signature chain. Every log entry must compute its signature using the preceding entry&apos;s hash, creating an immutable, append-only log ledger that programmatically exposes any manual modification or deletion attempt.
                </p>

                <h4 className="font-semibold text-slate-200 print:text-black mt-3">5.3 Audit Retention</h4>
                <p className="mt-1 text-justify">
                  Audit ledgers and compliance validation records shall be maintained on write-once-read-many (WORM) storage for a mandatory period of not less than seven (7) years to satisfy federal contract review standards.
                </p>
              </div>

              {/* Article 6 */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  6. Cyber Incident Reporting and DFARS Compliance
                </h3>
                <h4 className="font-semibold text-slate-200 print:text-black mt-2">6.1 Incident Thresholds</h4>
                <p className="mt-1 text-justify">
                  A reportable Cyber Incident includes any unauthorized access, malicious exfiltration, data spillage, or compromise impacting Covered Defense Information, Candidate Portfolio Data containing DoD PII, or the system integrity of the talent clearinghouse.
                </p>

                <h4 className="font-semibold text-slate-200 print:text-black mt-3">6.2 72-Hour DoD Notification (DFARS 252.204-7012) &amp; 24-Hour Partner Notification</h4>
                <p className="mt-1 text-justify">
                  In the event of a confirmed Cyber Incident affecting defense-related infrastructure:
                </p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li><strong>DoD Reporting:</strong> Provider shall submit an official incident report to the Department of Defense Cyber Crime Center (DC3) via <code className="text-amber-300 print:text-black font-mono">https://dibnet.dod.mil</code> within <strong>seventy-two (72) hours</strong> of confirmation.</li>
                  <li><strong>Partner Notification:</strong> Provider shall notify Partner&apos;s designated Enterprise Partner Security Officer (PSO) in writing within <strong>twenty-four (24) hours</strong> of confirmation, detailing the scope of impacted records, indicators of compromise (IOCs), and initial mitigation measures.</li>
                </ol>

                <h4 className="font-semibold text-slate-200 print:text-black mt-3">6.3 Forensic Preservation</h4>
                <p className="mt-1 text-justify">
                  Provider shall isolate and preserve complete forensic images of affected systems, volatile memory captures, packet logs, and cryptographic audit records for a minimum of ninety (90) days following the incident to facilitate Department of Defense and federal forensic investigations.
                </p>
              </div>

              {/* Article 7 */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  7. WIOA PIRL Data Exchange &amp; Employment Placement Verification
                </h3>
                <h4 className="font-semibold text-slate-200 print:text-black mt-2">7.1 Statutory Reporting Mandate</h4>
                <p className="mt-1 text-justify">
                  To maintain Provider&apos;s listing on the Texas Statewide Eligible Training Provider List (ETPL) under WIOA Title I, Partner agrees to fulfill its placement verification obligations as set forth in the Master Agreement.
                </p>

                <h4 className="font-semibold text-slate-200 print:text-black mt-3">7.2 Data Elements Transmitted</h4>
                <p className="mt-1 text-justify">
                  Within thirty (30) days of hiring a candidate sourced through Provider, Partner shall securely report the following data fields via Provider&apos;s verified hiring API or secure portal: Candidate Verification UUID (e.g., <code className="text-slate-300 font-mono">VAAI-2026-XXXX</code>), Job Title and Standard Occupational Classification (SOC) code (e.g., <code className="text-slate-300 font-mono">15-1299.08</code>), Confirmed Hire/Start Date, Annual Base Salary Tier/Bracket, and Partner Employer Identification Number (EIN).
                </p>

                <h4 className="font-semibold text-slate-200 print:text-black mt-3">7.3 Data Minimization and Privacy Protection</h4>
                <p className="mt-1 text-justify">
                  Provider shall utilize Partner-submitted placement data exclusively for mandatory state reporting under the 90-field WIOA Participant Individual Record Layout (PIRL) submitted to the Texas Workforce Commission (TWC) and the U.S. Department of Labor. Provider shall never sell, commercialize, or disclose Partner compensation models to unauthorized third parties.
                </p>
              </div>

              {/* Article 8 */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  8. Subcontractor Flow-Down Requirements (DFARS 252.204-7020 / CMMC)
                </h3>
                <p className="mt-2 text-justify">
                  Provider shall not engage any subcontractor or third-party cloud service provider to process, store, or transmit CUI or CDI unless such entity: (1) operates within the continental United States (CONUS); (2) holds an active FedRAMP Moderate (or higher) authorization; and (3) contractually commits to data protection terms substantially equivalent to this DPA, including DFARS 252.204-7012 flow-down provisions.
                </p>
              </div>

              {/* Article 9 */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  9. Term, Termination, and Cryptographic Sanitization
                </h3>
                <p className="mt-2 text-justify">
                  This DPA shall remain in full force and effect concurrently with the Master Agreement until all candidate and defense data in Provider&apos;s or Partner&apos;s possession is destroyed or sanitized. Upon termination of the Master Agreement or written request by either party, each party shall securely purge all confidential candidate records, military evaluation extracts, and proprietary technical blueprints in accordance with <strong>NIST SP 800-88 Rev. 1</strong> guidelines for cryptographic erasure. Provider shall retain only those immutable audit records, credential verification entries, and WIOA placement logs strictly required by applicable state and federal compliance statutes.
                </p>
              </div>

              {/* Article 10: Execution Block */}
              <div>
                <h3 className="text-sm font-bold text-emerald-400 print:text-black border-b border-slate-800 print:border-neutral-300 pb-1 mt-4">
                  10. Execution and Attestation
                </h3>
                <p className="mt-2 text-justify">
                  IN WITNESS WHEREOF, the parties have caused this Data Protection Addendum to be executed by their duly authorized corporate officers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 not-prose">
                  {/* VAAI Provider Execution Block */}
                  <div className="rounded-lg bg-slate-950/60 print:bg-white p-4 border border-slate-800 print:border-black space-y-1.5 text-xs">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 print:text-black font-semibold">
                      SCHUSTEREIT &amp; CO. LLC d/b/a VAAI:
                    </div>
                    <div className="border-b border-slate-700 print:border-black pb-1 pt-2 font-serif italic text-base text-slate-100 print:text-black">
                      /s/ Thomas M. Schustereit
                    </div>
                    <div className="font-semibold text-slate-200 print:text-black">Thomas M. Schustereit</div>
                    <div className="text-[11px] text-slate-400 print:text-neutral-700">Co-Founder &amp; Chief Technology Officer</div>
                    <div className="text-[10px] text-slate-400 print:text-neutral-700">Date: September 8, 2026</div>
                    <div className="text-[10px] text-slate-500 print:text-neutral-600 leading-tight">
                      6101 Highland Campus Dr, Bldg 3000, Austin, TX 78752<br />
                      govsec@vaai.edu
                    </div>
                  </div>

                  {/* Partner Execution Block */}
                  <div className="rounded-lg bg-slate-950/60 print:bg-white p-4 border border-slate-800 print:border-black space-y-1.5 text-xs">
                    <div className="text-[10px] font-mono uppercase text-sky-400 print:text-black font-semibold">
                      ENTERPRISE PARTNER:
                    </div>
                    {agreement.signature ? (
                      <>
                        <div className="border-b border-slate-700 print:border-black pb-1 pt-2 font-serif italic text-base text-slate-100 print:text-black">
                          {agreement.signature.signerName}
                        </div>
                        <div className="font-semibold text-slate-200 print:text-black">
                          {agreement.signature.signerName}
                        </div>
                        <div className="text-[11px] text-slate-400 print:text-neutral-700">
                          {agreement.signature.signerTitle}
                        </div>
                        <div className="text-[10px] text-slate-400 print:text-neutral-700">
                          Date: {signedDateStr}
                        </div>
                        <div className="text-[10px] text-slate-500 print:text-neutral-600 leading-tight">
                          {agreement.companyLegalName} (EIN: {agreement.employerEin})<br />
                          {agreement.pointOfContact.email}
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center text-slate-500 italic border-b border-dashed border-slate-700">
                        [Pending Authorized Partner Execution]
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* DPA Schedules Section */}
              <div className="pt-6 border-t border-slate-800 print:border-black space-y-6">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-black">
                  Addendum Schedules
                </div>

                {/* Schedule 1 */}
                <div className="rounded-lg bg-slate-950/40 print:bg-neutral-50 p-4 border border-slate-800/80 print:border-neutral-300">
                  <h4 className="text-xs font-bold text-white print:text-black uppercase">
                    Schedule 1: Technical &amp; Organizational Security Measures (TOMs) Matrix
                  </h4>
                  <p className="text-[11px] text-slate-400 print:text-neutral-600 mt-1 mb-3">
                    Summary of active controls certified under NIST SP 800-171 Rev. 3 and CMMC 2.0 Level 2:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 print:text-neutral-700">
                          <th className="pb-1.5 font-semibold">CMMC Practice Family</th>
                          <th className="pb-1.5 font-semibold">Control Specification</th>
                          <th className="pb-1.5 font-semibold text-right">Audit Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 print:divide-neutral-200">
                        {TOMS_MATRIX_SUMMARY.map((t) => (
                          <tr key={t.family}>
                            <td className="py-1.5 font-medium text-slate-200 print:text-black">{t.family}</td>
                            <td className="py-1.5 text-slate-400 print:text-neutral-700">{t.requirement}</td>
                            <td className="py-1.5 text-right font-mono text-emerald-400 print:text-black">{t.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Schedule 2 */}
                <div className="rounded-lg bg-slate-950/40 print:bg-neutral-50 p-4 border border-slate-800/80 print:border-neutral-300">
                  <h4 className="text-xs font-bold text-white print:text-black uppercase">
                    Schedule 2: CUI Category Crosswalk &amp; Permitted Dissemination Lists
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-[11px]">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-200 print:text-black">CUI Specified: Controlled Technical Information (CTI)</div>
                      <div className="text-slate-400 print:text-neutral-700">Candidate script blueprints, automated workflow orchestrations, and capstone rubrics. Dissemination: Authorized recruiters with CONUS IP binding.</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-200 print:text-black">CUI Basic: Defense Privacy Data (DoD PII)</div>
                      <div className="text-slate-400 print:text-neutral-700">EDI-PI identifiers, SSNs, and service record evaluations. Handled via field-level AES-256-GCM and strict redaction shielding.</div>
                    </div>
                  </div>
                </div>

                {/* Schedule 3 */}
                <div className="rounded-lg bg-slate-950/40 print:bg-neutral-50 p-4 border border-slate-800/80 print:border-neutral-300">
                  <h4 className="text-xs font-bold text-white print:text-black uppercase">
                    Schedule 3: Form of DFARS 72-Hour Cyber Incident Report Notification
                  </h4>
                  <p className="text-[11px] text-slate-400 print:text-neutral-600 mt-1 mb-2">
                    Standard reporting format submitted to DC3 via <span className="font-mono text-amber-400 print:text-black">https://dibnet.dod.mil</span>:
                  </p>
                  <pre className="rounded bg-slate-950 p-3 text-[10px] font-mono text-slate-300 print:text-black print:bg-neutral-100 overflow-x-auto border border-slate-800/80">
{`DFARS 252.204-7012 CYBER INCIDENT DISCLOSURE
Report ID:         DC3-INC-[YYYYMMDD]-[RANDOM]
Company Legal Name: Schustereit & Co. LLC d/b/a VAAI (CAGE: 9H8K2)
Impacted Partner:   ${agreement.companyLegalName} (EIN: ${agreement.employerEin})
Incident Summary:  [Compromise Description / Exfiltration Scope]
CUI Impact Scope:  [CDI / Defense PII / System Integrity Impacted]
Forensic Status:   Images Isolated / Volatile Memory Captured / 90-Day Retention Active`}
                  </pre>
                </div>

              </div>

            </div>
          </section>
        )}

      </div>
    </div>
  );
}
