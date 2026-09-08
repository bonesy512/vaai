'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileStickyCta() {
  const pathname = usePathname();

  // Hide on full-screen course workspace to maximize learning canvas
  const isCourseWorkspace = pathname?.startsWith('/courses/');

  if (isCourseWorkspace) {
    return null;
  }

  return (
    <div
      aria-label="Quick Mobile Navigation"
      role="region"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <Button
          asChild
          size="sm"
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-10 shadow-md"
        >
          <Link href="/courses/ai-literacy-101/lesson-1">
            <BookOpen className="h-3.5 w-3.5 mr-1.5 shrink-0" />
            <span>Enroll ($0 WIOA)</span>
          </Link>
        </Button>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="flex-1 border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 hover:text-white font-semibold text-xs h-10 shadow-md"
        >
          <Link href="/employers">
            <Users className="h-3.5 w-3.5 mr-1.5 text-amber-400 shrink-0" />
            <span>Hire Veterans</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
