import * as React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ShieldAlert,
  LayoutDashboard,
  BookOpen,
  Users,
  FileCheck2,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronRight,
  Database,
  Radio,
} from 'lucide-react';
import { getServerUserProfile } from '@/lib/auth/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Administrator LMS Management Portal | VAAI',
  description: 'WIOA Title I telemetry auditing, student seat-time monitoring, and course seat allocation.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getServerUserProfile();

  // Role Gate: Must be admin in production
  // In development/test environments, allow inspection if no user session exists or if user is admin
  if (process.env.NODE_ENV === 'production') {
    if (!profile || profile.role !== 'admin') {
      redirect('/login?error=admin_required');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-lg">
              V
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white tracking-tight text-sm sm:text-base">
                  VAAI Command Center
                </span>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-mono">
                  ADMIN LMS
                </Badge>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                NIST SP 800-171 Rev. 3 AC-2/AC-3 Security Domain
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
              <span>WIOA Telemetry Engine: ACTIVE</span>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs"
            >
              <Link href="/">
                Exit to Platform <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Secondary Subnavigation Bar */}
        <div className="border-t border-slate-800/80 bg-slate-950/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center space-x-8 h-11 text-xs font-medium text-slate-400 overflow-x-auto">
            <Link
              href="/admin"
              className="hover:text-amber-400 transition-colors flex items-center space-x-1.5 py-2 text-white border-b-2 border-amber-500"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Telemetry HUD</span>
            </Link>

            <Link
              href="/admin/courses"
              className="hover:text-amber-400 transition-colors flex items-center space-x-1.5 py-2"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Course Quotas &amp; Vouchers</span>
            </Link>

            <Link
              href="/admin/cohorts"
              className="hover:text-amber-400 transition-colors flex items-center space-x-1.5 py-2"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Cohorts &amp; WIOA PIRL</span>
            </Link>

            <Link
              href="/etpl-dossier"
              className="hover:text-amber-400 transition-colors flex items-center space-x-1.5 py-2"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>State ETPL Filing</span>
            </Link>

            <Link
              href="/sprs-scorecard"
              className="hover:text-amber-400 transition-colors flex items-center space-x-1.5 py-2"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>110/110 SPRS Scorecard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content Area */}
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        VAAI WIOA Title I LMS Administrator Portal // TWC Provider ID: TWC-ETPL-78752-VAAI // Ed25519 Signed Audit Log
      </footer>
    </div>
  );
}
