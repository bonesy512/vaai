'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

export interface TelemetryEvent {
  eventName: string;
  path: string;
  timestamp: string;
  properties?: Record<string, string | number | boolean>;
}

/**
 * Privacy-preserving, cookieless client telemetry emitter.
 * Suppresses tracking if Do Not Track is enabled or if user rejected analytics.
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return;

  // Respect browser Do Not Track header
  if (navigator.doNotTrack === '1' || (window as unknown as { doNotTrack?: string }).doNotTrack === '1') {
    return;
  }

  const consent = localStorage.getItem('vaai_cookie_consent');
  // If consent is specifically rejected or set to essential only, avoid non-essential analytics
  if (consent === 'essential' && eventName !== 'essential_heartbeat') {
    return;
  }

  const telemetryPayload: TelemetryEvent = {
    eventName,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    properties,
  };

  // Safe client dispatch / console logging in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[VAAI Telemetry]', telemetryPayload);
  }
}

export function Analytics() {
  const pathname = usePathname();

  React.useEffect(() => {
    trackEvent('page_view', { route: pathname });
  }, [pathname]);

  return null;
}
