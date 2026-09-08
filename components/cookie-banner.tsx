'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieBanner() {
  const [mounted, setMounted] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const existingConsent = localStorage.getItem('vaai_cookie_consent');
    if (!existingConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (level: 'essential' | 'all') => {
    localStorage.setItem('vaai_cookie_consent', level);
    localStorage.setItem('vaai_cookie_consent_date', new Date().toISOString());
    window.dispatchEvent(
      new CustomEvent('vaai_consent_change', { detail: { consent: level } })
    );
    setShowBanner(false);
  };

  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      role="region"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-200 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5 max-w-3xl">
          <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Privacy &amp; Telemetry Notice</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Zero AI Data Retention
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              VAAI uses privacy-preserving, cookieless session telemetry to audit WIOA attendance and system
              uptime. We never sell student data, use commercial ad tracking, or retain prompts on AI sandbox models.
              Read our{' '}
              <Link
                href="/privacy"
                className="text-amber-400 underline hover:text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded"
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                href="/terms"
                className="text-amber-400 underline hover:text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConsent('essential')}
            className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white text-xs flex-1 md:flex-initial"
          >
            Essential Only
          </Button>
          <Button
            size="sm"
            onClick={() => handleConsent('all')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex-1 md:flex-initial"
          >
            Accept All
          </Button>
          <button
            onClick={() => handleConsent('essential')}
            aria-label="Dismiss cookie notice"
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
