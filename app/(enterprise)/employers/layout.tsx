import * as React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Users,
  FileCheck,
  Award,
  ExternalLink,
  Lock,
} from 'lucide-react';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { SecurityClassificationBanner } from '@/components/security-classification-banner';

export const metadata: Metadata = {
  title: 'Enterprise Veteran AI Talent Clearinghouse',
  description:
    'Prioritized access to security-cleared, certified Applied AI Operator military veterans for defense contractors and commercial enterprises with zero placement fees.',
};

export default function EnterpriseEmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* CUI / FEDCON Security Classification Top Banner */}
      <div className="print:hidden">
        <SecurityClassificationBanner position="top" />
      </div>

      {/* Top Enterprise Partner Nav */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center space-x-3">
            <Link href="/employers" className="flex items-center space-x-2">
              <div className="rounded-md bg-amber-500/10 p-1.5 border border-amber-500/30 text-amber-400">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold tracking-tight text-white sm:text-lg">
                  VAAI <span className="text-amber-400 font-semibold text-xs tracking-normal">ENTERPRISE</span>
                </span>
                <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                  Defense Contractor &amp; Corporate Talent Clearinghouse
                </div>
              </div>
            </Link>
          </div>

          <nav className="flex items-center space-x-4 text-xs font-semibold">
            <Link
              href="/employers"
              className="text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Users className="h-3.5 w-3.5 text-slate-400" />
              Candidate Directory
            </Link>

            <Link
              href="/employers/training-brochure"
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Training Brochure
            </Link>

            <Link
              href="/employers/partnership"
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="h-3.5 w-3.5 text-slate-400" />
              Partnership MOUs
            </Link>

            <Link
              href="/etpl-dossier"
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="h-3.5 w-3.5 text-slate-400" />
              State ETPL Dossier
            </Link>

            <Link
              href="/vendor-security-assessment"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              GovSec VSA
            </Link>

            <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-slate-800">
              <Badge
                variant="outline"
                className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono text-[10px]"
              >
                <ShieldCheck className="mr-1 h-3 w-3 text-emerald-400" />
                DOD / WIOA AUTHORIZED
              </Badge>
            </div>
          </nav>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; 2026 Veteran AI Enablement Initiative (VAAI) LLC. Texas Workforce Commission ETPL Provider.
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-slate-400 font-mono">Title 38 U.S.C. §§ 5901–5905 Safe Harbor</span>
            <span>•</span>
            <Link href="/employers/training-brochure" className="text-amber-400 hover:underline">
              B2B Defense Catalog
            </Link>
            <span>•</span>
            <Link href="/etpl-dossier" className="text-amber-400 hover:underline">
              PIRL Compliance Audit
            </Link>
            <span>•</span>
            <Link href="/vendor-security-assessment" className="text-emerald-400 hover:underline">
              NIST 800-171 / CMMC VSA
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
