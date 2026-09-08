import * as React from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowLeft,
  BookOpen,
  Users,
  FileCheck,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold">
            V
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">
              VAAI WORKFORCE LMS
            </div>
            <div className="text-xs font-mono text-slate-400">
              TWC ETPL # TWC-ETPL-78752-VAAI
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>NETWORK DEFENSE ACTIVE</span>
        </div>
      </header>

      {/* Main Tactical 404 Console */}
      <main className="max-w-3xl mx-auto w-full my-auto py-12 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-mono font-semibold text-red-400">
          <Terminal className="h-3.5 w-3.5" />
          <span>HTTP 404 // TACTICAL VECTOR UNRESOLVED</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono">
            404: LOST COMM
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            The requested tactical coordinate or student record does not exist on this operational grid.
            Verify the target URL or redirect to an authorized mission waypoint below.
          </p>
        </div>

        {/* Waypoint Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left pt-2">
          <Button
            asChild
            variant="outline"
            className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:text-white justify-start h-auto p-3.5 text-xs"
          >
            <Link href="/" className="flex items-center space-x-3 w-full">
              <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Compass className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Return to Base</div>
                <div className="text-[11px] text-slate-400">Main Platform Landing Page</div>
              </div>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:text-white justify-start h-auto p-3.5 text-xs"
          >
            <Link href="/courses/ai-literacy-101/lesson-1" className="flex items-center space-x-3 w-full">
              <div className="p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">LMS Curriculum</div>
                <div className="text-[11px] text-slate-400">Module 1: Title 38 Safe Harbor</div>
              </div>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:text-white justify-start h-auto p-3.5 text-xs"
          >
            <Link href="/employers" className="flex items-center space-x-3 w-full">
              <div className="p-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Talent Clearinghouse</div>
                <div className="text-[11px] text-slate-400">Vetted Veteran Profiles &amp; Sandboxes</div>
              </div>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:text-white justify-start h-auto p-3.5 text-xs"
          >
            <Link href="/etpl-dossier" className="flex items-center space-x-3 w-full">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileCheck className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">State ETPL Dossier</div>
                <div className="text-[11px] text-slate-400">TWC Institutional Accreditation</div>
              </div>
            </Link>
          </Button>
        </div>

        <div className="pt-4">
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Re-Establish Command Link (Home)
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-slate-900 pt-4 text-center text-xs text-slate-400 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-amber-500" />
          <span>Title 38 U.S.C. §§ 5901–5905 Safe Harbor Educational Program</span>
        </div>
        <div>
          Austin Community College Highland Campus · Workforce Solutions Capital Area
        </div>
      </footer>
    </div>
  );
}
