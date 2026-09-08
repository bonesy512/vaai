import * as React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  Award,
  ExternalLink,
  Lock,
} from 'lucide-react';

export function SiteFooter() {
  return (
    <footer
      aria-label="Site Footer and Institutional Disclosures"
      className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs mt-16"
    >
      {/* Upper Grid: Organization Footprint, Nav, Accreditation */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Institutional Identity & Physical Footprint */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-base">
                V
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight text-white">
                  Veteran AI Enablement Platform (VAAI)
                </div>
                <div className="text-[11px] font-mono text-amber-400">
                  TWC ETPL Provider # TWC-ETPL-78752-VAAI
                </div>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-xs">
              State-approved workforce development institution providing accelerated 40-clock-hour
              enablement for transitioning military veterans in automated AI operations, zero-retention
              sanitization, and defense enterprise workflows.
            </p>

            {/* Verified Physical Headquarters */}
            <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3.5 text-xs text-slate-300">
              <div className="font-semibold text-white flex items-center gap-1.5 text-xs">
                <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Texas Operational Training Facility:</span>
              </div>
              <div className="text-[11px] text-slate-300 pl-5 leading-snug">
                Veteran AI Enablement Initiative LLC<br />
                Austin Community College Highland Campus<br />
                6101 Highland Campus Dr, Bldg 1000<br />
                Austin, TX 78752
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 pl-5 text-[11px]">
                <a
                  href="tel:5125558224"
                  className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  <Phone className="h-3 w-3 mr-1 text-slate-500" />
                  (512) 555-VAAI (8224)
                </a>
                <a
                  href="mailto:compliance@vaai.edu"
                  className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  <Mail className="h-3 w-3 mr-1 text-slate-500" />
                  compliance@vaai.edu
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Academic & Training */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white tracking-wider text-xs uppercase">
              Curriculum
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/courses/ai-literacy-101/lesson-1"
                  className="hover:text-amber-400 transition-colors"
                >
                  Mod 1: Title 38 Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/ai-literacy-101/lesson-2"
                  className="hover:text-amber-400 transition-colors"
                >
                  Mod 1: DoD PII Sanitization
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/workforce-translation/lesson-1"
                  className="hover:text-amber-400 transition-colors"
                >
                  Mod 2: MOS Translation
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/enterprise-workflows/lesson-1"
                  className="hover:text-amber-400 transition-colors"
                >
                  Mod 3: Enterprise Automation
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/capstone-defense/lesson-1"
                  className="hover:text-amber-400 transition-colors"
                >
                  Mod 4: Capstone Defense
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Enterprise & Hiring */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white tracking-wider text-xs uppercase">
              Enterprise &amp; GovCon
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/employers" className="hover:text-amber-400 transition-colors">
                  Veteran Talent Clearinghouse
                </Link>
              </li>
              <li>
                <Link
                  href="/employers/partnership"
                  className="hover:text-amber-400 transition-colors"
                >
                  Partnership MOUs Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/employers/partnership/MOU-2026-BAH-01"
                  className="hover:text-amber-400 transition-colors"
                >
                  Booz Allen Hamilton MOU
                </Link>
              </li>
              <li>
                <Link
                  href="/resume"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>ATS Resume Generator</span>
                  <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-semibold text-emerald-400">
                    1-Page
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/verify/VAAI-2026-DEMO"
                  className="hover:text-amber-400 transition-colors"
                >
                  Credential Verifier
                </Link>
              </li>
              <li>
                <Link
                  href="/thank-you"
                  className="hover:text-amber-400 transition-colors"
                >
                  Enrollment Confirmation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Accreditation & Compliance */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white tracking-wider text-xs uppercase">
              State Accreditation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/etpl-dossier" className="hover:text-amber-400 transition-colors">
                  TWC Institutional Dossier
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor-security-assessment"
                  className="hover:text-emerald-400 text-emerald-400/90 font-medium transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="h-3 w-3 shrink-0" />
                  Defense VSA (NIST / CMMC)
                </Link>
              </li>
              <li>
                <Link
                  href="/sprs"
                  className="hover:text-emerald-400 text-emerald-400/90 font-medium transition-colors flex items-center gap-1"
                >
                  <Award className="h-3 w-3 shrink-0 text-emerald-400" />
                  DoD SPRS Scorecard (110/110)
                </Link>
              </li>
              <li>
                <Link
                  href="/dpa"
                  className="hover:text-amber-400 text-amber-400/90 font-medium transition-colors flex items-center gap-1"
                >
                  <Lock className="h-3 w-3 shrink-0" />
                  Data Protection Addendum (DPA)
                </Link>
              </li>
              <li>
                <span className="text-slate-400">CIP Code: 11.0102 (AI)</span>
              </li>
              <li>
                <span className="text-slate-400">SOC Code: 15-1299.08</span>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy &amp; Data Isolation
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms &amp; Safe Harbor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Title 38 Safe Harbor Statutory Boundary Alert Box */}
        <div className="mt-8 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-[11px] leading-relaxed text-slate-400 space-y-1">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Title 38 U.S.C. §§ 5901–5905 Safe Harbor Statutory Disclosure</span>
          </div>
          <p>
            VAAI is an educational and technical workforce training provider accredited under the Texas
            Workforce Commission (ETPL Provider # TWC-ETPL-78752-VAAI). VAAI is not a Veterans Service
            Organization (VSO), recognized claims agent, or law firm, and does not provide legal advice,
            veterans benefits claims preparation, or disability rating representation. All student learning
            sandboxes operate with strict zero-retention data policies adhering to DoD PII sanitization standards.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Veteran AI Enablement Initiative LLC. All rights reserved.
            Austin, Texas.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>&middot;</span>
            <Link href="/sprs" className="hover:text-emerald-400 transition-colors">
              DoD SPRS Scorecard (110/110)
            </Link>
            <span>&middot;</span>
            <Link href="/dpa" className="hover:text-white transition-colors">
              Data Protection Addendum (DPA)
            </Link>
            <span>&middot;</span>
            <Link href="/etpl-dossier" className="hover:text-white transition-colors">
              TWC ETPL Dossier
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
