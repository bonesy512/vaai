import React from 'react';
import { ShieldAlert, Scale, BookOpen } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div
      role="region"
      aria-label="Title 38 U.S.C. Regulatory Safe Harbor Notice"
      className="w-full bg-amber-950/40 border-b border-amber-600/40 text-amber-200 px-4 py-3 shadow-md backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs leading-relaxed">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-4 h-4 text-amber-400" aria-hidden="true" />
          </div>
          <div>
            <div className="font-semibold text-amber-300 flex flex-wrap items-center gap-2">
              <span>STATUTORY COMPLIANCE NOTICE</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                38 U.S.C. §§ 5901–5905 &amp; 38 C.F.R. § 14.629
              </span>
            </div>
            <p className="text-amber-200/90 mt-0.5">
              The <strong>Veteran AI Workforce LMS (VAAI)</strong> is strictly an educational digital literacy and technical enablement platform. 
              VAAI is <strong>NOT</strong> an accredited Veteran Service Organization (VSO), claims agent, or attorney.
              This system is strictly prohibited from preparing, presenting, or prosecuting VA benefit claims, generating legal nexus letters, or calculating speculative disability percentages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-[11px] text-amber-400/80 font-medium">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Educational Only
          </span>
          <span className="h-3 w-px bg-amber-500/30" />
          <span className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" />
            No Representation
          </span>
        </div>
      </div>
    </div>
  );
}
