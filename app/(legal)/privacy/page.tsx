import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, Server, Database, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Privacy Policy & Zero AI Data Retention Guarantee',
  description:
    'VAAI institutional privacy policy detailing our zero-retention AI sandbox architecture, FERPA student record protections, and Texas Workforce Commission WIOA reporting standards.',
};

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          INSTITUTIONAL DATA GOVERNANCE POLICY
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy &amp; Zero AI Retention Guarantee
        </h1>
        <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 pt-1">
          <span>EFFECTIVE DATE: OCTOBER 1, 2026</span>
          <span>&middot;</span>
          <span>VERSION: 2.4-GOVCON</span>
          <span>&middot;</span>
          <span>TWC ETPL # TWC-ETPL-78752-VAAI</span>
        </div>
      </div>

      {/* Core Policy Document */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">01.</span>
            Institutional Scope &amp; Legal Framework
          </h2>
          <p>
            This Privacy Policy governs the collection, processing, and storage of technical telemetry and student
            records across the <strong className="text-white">Veteran AI Enablement Platform (VAAI)</strong>, operated
            by Veteran AI Enablement Initiative LLC, an accredited educational institution under the Texas Workforce
            Commission (TWC ETPL Provider ID: <code className="text-amber-400">TWC-ETPL-78752-VAAI</code>) and Workforce
            Solutions Capital Area Board #14, located at 6101 Highland Campus Dr, Austin, TX 78752.
          </p>
          <p>
            VAAI is designed from the ground up for U.S. military service members, veterans, and defense enterprise
            personnel. We maintain strict compliance with the Privacy Act of 1974 (5 U.S.C. § 552a), Family Educational
            Rights and Privacy Act (FERPA, 34 CFR Part 99), and Department of Defense Instruction (DoDI) 5400.11.
          </p>
        </section>

        {/* Section 2: Zero Retention Guarantee */}
        <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
            <Lock className="h-5 w-5" />
            <h2>02. Absolute Zero AI Data Retention Guarantee</h2>
          </div>
          <p className="text-slate-200">
            All artificial intelligence inference and student prompt testing within the VAAI Interactive Learning
            Sandbox (<code className="text-amber-300">/api/sandbox/execute</code>) operates under strict commercial zero-data-retention
            agreements:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>
              <strong>No Model Training:</strong> Prompt inputs, capstone blueprints, and sandbox outputs are NEVER used to
              train, fine-tune, or calibrate public or proprietary foundational LLMs.
            </li>
            <li>
              <strong>Ephemeral In-Memory Routing:</strong> Prompts are processed strictly in ephemeral system memory and are
              purged immediately following socket response transmission.
            </li>
            <li>
              <strong>Client-Side PII Scrubbing:</strong> Students are trained to utilize regex de-identification pipelines
              prior to passing records to any AI processing endpoint.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">03.</span>
            Information We Collect &amp; Purpose of Processing
          </h2>
          <p>
            VAAI collects only the minimal data strictly necessary to fulfill state accreditation requirements and
            award verifiable digital credentials:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-1.5">
              <div className="font-semibold text-white text-xs">A. WIOA Attendance Heartbeat Telemetry</div>
              <p className="text-xs text-slate-400">
                Logged periodically while students interact with coursework to verify compliance with the Texas Workforce
                Commission mandate requiring &ge; 36.0 verified non-idle contact hours.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-1.5">
              <div className="font-semibold text-white text-xs">B. Capstone Blueprint Submissions</div>
              <p className="text-xs text-slate-400">
                Evaluation rubrics and grading artifacts saved to authenticate students&apos; Applied AI Operator credentials
                and issue cryptographically signed OpenBadges v3.0 assertions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">04.</span>
            State Workforce Commission (PIRL) Outcome Disclosures
          </h2>
          <p>
            Pursuant to the Workforce Innovation and Opportunity Act (WIOA Title I, 20 CFR Part 680), accredited training
            providers are legally required to report post-program completion and employment placement outcomes. VAAI
            transmits de-identified, aggregate participant records to the Texas Workforce Commission for quarterly
            Participant Individual Record Layout (PIRL) reporting. No classified, operational, or identifiable student
            communications are ever disclosed.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">05.</span>
            Zero Commercial Advertising &amp; Tracking Prohibition
          </h2>
          <p>
            VAAI operates with zero third-party commercial advertising networks, programmatic tracking pixels, or data
            brokers. We do not sell, rent, or trade student profiles, candidate resumes, or recruiter inquiries to any
            commercial entity.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400 font-mono">06.</span>
            Contact Data Protection Officer
          </h2>
          <p className="text-xs text-slate-300">
            For inquiries regarding student records, FERPA data inspection, or WIOA outcome auditing, please contact our
            institutional compliance department:
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 text-xs space-y-1 font-mono">
            <div>Office of Academic Standards &amp; Privacy</div>
            <div>Veteran AI Enablement Initiative LLC</div>
            <div>Austin Community College Highland Campus, Bldg 1000</div>
            <div>Austin, TX 78752</div>
            <div className="pt-1 text-amber-400">Email: compliance@vaai.edu | Tel: (512) 555-8224</div>
          </div>
        </section>
      </div>
    </div>
  );
}
