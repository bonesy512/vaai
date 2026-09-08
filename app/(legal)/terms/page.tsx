import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Scale, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Terms of Service & Title 38 Safe Harbor Disclosures',
  description:
    'Institutional Terms of Service for VAAI Workforce LMS, establishing Title 38 U.S.C. Safe Harbor boundaries, attendance verification standards, and credential integrity.',
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-8 text-slate-300">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-xs text-slate-400 hover:text-white -ml-2 mb-2"
        >
          <Link href="/">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Platform Home
          </Link>
        </Button>
        <div className="inline-flex items-center space-x-2 rounded-md bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-mono font-semibold text-amber-400">
          <Scale className="h-3.5 w-3.5 mr-1" />
          INSTITUTIONAL TERMS OF SERVICE &amp; STATUTORY COVENANTS
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms of Service &amp; Title 38 Safe Harbor
        </h1>
        <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 pt-1">
          <span>EFFECTIVE DATE: OCTOBER 1, 2026</span>
          <span>&middot;</span>
          <span>VERSION: 3.1-SAFEHARBOR</span>
          <span>&middot;</span>
          <span>TWC ETPL # TWC-ETPL-78752-VAAI</span>
        </div>
      </div>

      {/* Core Terms Document */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1: Title 38 Safe Harbor - Critical Box */}
        <section className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <h2>01. Title 38 U.S.C. §§ 5901–5905 Safe Harbor Statutory Boundary</h2>
          </div>
          <p className="text-slate-200">
            <strong className="text-white">CRITICAL STATUTORY NOTICE:</strong> VAAI is an educational and technical
            enablement platform accredited under the Texas Workforce Commission (TWC ETPL # <code className="text-amber-300">TWC-ETPL-78752-VAAI</code>).
            VAAI is strictly an education and workforce development entity:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
            <li>
              <strong>Non-Advocacy Affirmation:</strong> VAAI is NOT a Veterans Service Organization (VSO), recognized
              claims agent, or law firm. VAAI does not prepare, present, or prosecute claims for Department of Veterans
              Affairs (VA) disability benefits under Title 38 of the United States Code.
            </li>
            <li>
              <strong>No Fee for Benefits Assistance:</strong> In compliance with 38 U.S.C. § 5905 and 38 C.F.R. § 14.629,
              VAAI never charges veterans or service members fees in connection with any VA claims representation.
            </li>
            <li>
              <strong>Purely Educational Curriculum:</strong> All coursework regarding military service records (DD-214,
              chronological medical records, evaluation reports) is solely for the technical purpose of teaching AI
              data extraction, regex sanitization, and civilian job translation.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">02.</span>
            Educational Program &amp; Telemetry Attendance Mandate
          </h2>
          <p>
            Enrolled students are granted authorized access to the VAAI curriculum, interactive prompts, and Capstone
            evaluation system. To qualify for the <strong className="text-white">Certified Applied AI Operator (Level 1)</strong> credential
            and OpenBadges v3.0 assertion, candidates must fulfill the following state accreditation standards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>
              <strong>Continuous Heartbeat Telemetry:</strong> Completion of at least 36.0 verified non-idle contact hours
              logged via client-side heartbeats (<code className="text-amber-400">/api/attendance/heartbeat</code>).
            </li>
            <li>
              <strong>Gated Modular Assessments:</strong> Score of &ge; 80.0% on each module assessment quiz.
            </li>
            <li>
              <strong>Defense Capstone Benchmark:</strong> Defense score of &ge; 80.0% evaluated against the official
              TWC rubric (PII sanitization, automation blueprints, Title 38 non-advocacy guardrails).
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">03.</span>
            Intellectual Property &amp; Student Blueprint Ownership
          </h2>
          <p>
            Students retain sole intellectual property ownership over any original automation blueprints, prompt pipelines,
            or capstone artifacts authored in the VAAI sandbox. VAAI retains all intellectual property in the underlying
            curriculum, video lectures, interactive evaluation software, and cryptographic credentialing infrastructure.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">04.</span>
            Enterprise Recruiter &amp; Employer Clearinghouse Covenants
          </h2>
          <p>
            Recruiters and corporate hiring partners accessing the VAAI Candidate Directory (<code className="text-amber-400">/employers</code>)
            agree to utilize candidate portfolios solely for bona fide employment interviews and affirmative action
            hiring (VEVRAA/OFCCP). Employers agree to report verified hires within thirty (30) days to support state
            WIOA PIRL tracking. VAAI provides candidate access at zero placement fees.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">05.</span>
            Limitation of Liability &amp; Texas Governing Law
          </h2>
          <p>
            VAAI is provided &ldquo;as is&rdquo; without warranties of any kind regarding third-party model inference
            uptime or specific employment placement outcomes. These Terms are governed by and construed in accordance
            with the laws of the State of Texas, with exclusive jurisdiction in Travis County, Texas.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">06.</span>
            Institutional Contact
          </h2>
          <p className="text-xs text-slate-300">
            For questions regarding these Terms or our institutional accreditation standing, contact:
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 text-xs space-y-1 font-mono">
            <div>Office of the General Counsel &amp; Accreditation</div>
            <div>Veteran AI Enablement Initiative LLC</div>
            <div>6101 Highland Campus Dr, Bldg 1000, Austin, TX 78752</div>
            <div className="pt-1 text-amber-400">legal@vaai.edu | (512) 555-8224</div>
          </div>
        </section>
      </div>
    </div>
  );
}
