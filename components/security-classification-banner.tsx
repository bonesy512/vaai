'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldAlert, Lock, AlertTriangle, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SecurityClassificationBannerProps {
  position?: 'top' | 'bottom';
  compact?: boolean;
}

export function SecurityClassificationBanner({
  position = 'top',
  compact = false,
}: SecurityClassificationBannerProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <aside
      aria-label="Federal Defense Security Classification and System Use Notice"
      role="region"
      className={`w-full z-40 border-y border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-slate-950 to-amber-500/20 text-slate-200 text-xs shadow-md transition-all ${
        position === 'bottom' ? 'border-t border-b-0' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-1.5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Classification Title & Identifiers */}
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <div className="flex items-center gap-1.5 font-mono font-black tracking-wider text-[11px] text-amber-400">
            <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" aria-hidden="true" />
            <span>CONTROLLED UNCLASSIFIED INFORMATION // FEDCON</span>
          </div>
          <span className="hidden md:inline text-slate-500 text-[10px]">|</span>
          <span className="hidden md:inline font-mono text-[10px] text-slate-300">
            DISA IL4-ALIGNED WORKSPACE // NIST SP 800-171
          </span>
        </div>

        {/* Right Badge & Statutory Toggle */}
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-[9px] py-0 px-1.5"
          >
            CMMC LEVEL 2 CONTROLS
          </Badge>

          {!compact && (
            <button
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls="fedsec-statutory-notice"
              className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1.5 py-0.5"
            >
              <span>{expanded ? 'Hide 18 U.S.C. Notice' : '18 U.S.C. § 1030 Notice'}</span>
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Statutory Use Warning (18 U.S.C. § 1030) */}
      {expanded && !compact && (
        <div
          id="fedsec-statutory-notice"
          className="border-t border-amber-500/30 bg-slate-950/95 px-4 py-3 sm:px-6 text-[11px] leading-relaxed text-slate-300 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="mx-auto max-w-7xl flex items-start space-x-3">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-white">
                US GOVERNMENT &amp; DEFENSE CONTRACTOR SYSTEM USE NOTICE
              </div>
              <p className="text-slate-400">
                You are accessing a state-accredited workforce information system authorized to process
                Controlled Unclassified Information (CUI) and military veteran records. This system is actively
                monitored for compliance with federal and state workforce regulations. Unauthorized access,
                attempted security control bypass, or exfiltration is strictly prohibited and subject to criminal
                and civil penalties under <strong className="text-white">18 U.S.C. § 1030</strong> (Computer Fraud and Abuse Act),
                the Privacy Act of 1974, and applicable Texas state laws.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-[10px] text-amber-400">
                <span>CUI CATEGORY: PRIVACY (PRVCY)</span>
                <span>LIMITED DISSEMINATION: FEDCON</span>
                <span>GOVERNING DIRECTIVE: DODI 5200.48</span>
                <Link
                  href="/vendor-security-assessment"
                  className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors"
                >
                  VIEW DEFENSE VSA ATTESTATION &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
