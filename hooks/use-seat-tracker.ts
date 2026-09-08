'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { HeartbeatPayload } from '@/lib/schemas';

interface UseSeatTrackerOptions {
  lessonId: string;
  idleTimeoutSeconds?: number; // Defaults to 180s per WIOA compliance
  pulseIntervalSeconds?: number; // Defaults to 60s per WIOA compliance
  onHeartbeatSuccess?: (activeSeconds: number, totalSeconds: number) => void;
  onHeartbeatError?: (error: Error) => void;
}

export interface UseSeatTrackerReturn {
  isActive: boolean;
  isIdle: boolean;
  isTabHidden: boolean;
  totalActiveSeconds: number;
  pendingSeconds: number;
  lastPulseTime: Date | null;
  resetTracker: () => void;
  recordActivity: () => void;
}

export function useSeatTracker({
  lessonId,
  idleTimeoutSeconds = 180,
  pulseIntervalSeconds = 60,
  onHeartbeatSuccess,
  onHeartbeatError,
}: UseSeatTrackerOptions): UseSeatTrackerReturn {
  const [totalActiveSeconds, setTotalActiveSeconds] = useState<number>(0);
  const [pendingSeconds, setPendingSeconds] = useState<number>(0);
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const [lastPulseTime, setLastPulseTime] = useState<Date | null>(null);

  const lastActivityRef = useRef<number>(Date.now());
  const pendingSecondsRef = useRef<number>(0);
  const totalSecondsRef = useRef<number>(0);
  const isSyncingRef = useRef<boolean>(false);

  const sendHeartbeat = useCallback(
    async (secondsToLog: number) => {
      if (secondsToLog <= 0 || isSyncingRef.current) return;

      isSyncingRef.current = true;
      try {
        const payload: HeartbeatPayload = {
          lessonId,
          activeSeconds: secondsToLog,
        };

        const response = await fetch('/api/attendance/heartbeat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Heartbeat failed with status: ${response.status}`);
        }

        pendingSecondsRef.current -= secondsToLog;
        setPendingSeconds(pendingSecondsRef.current);
        const now = new Date();
        setLastPulseTime(now);

        onHeartbeatSuccess?.(secondsToLog, totalSecondsRef.current);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown heartbeat error');
        onHeartbeatError?.(error);
        // Do not discard pendingSeconds so it can retry on next pulse
      } finally {
        isSyncingRef.current = false;
      }
    },
    [lessonId, onHeartbeatSuccess, onHeartbeatError]
  );

  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsIdle(false);
  }, []);

  // Listen to user interaction events to prevent idle state
  useEffect(() => {
    const handleActivity = () => {
      recordActivity();
    };

    const handleVisibility = () => {
      const hidden = typeof document !== 'undefined' && document.visibilityState !== 'visible';
      setIsTabHidden(hidden);
      if (!hidden) {
        // Tab restored; reset activity timestamp to avoid immediate idle flag
        lastActivityRef.current = Date.now();
        setIsIdle(false);
      }
    };

    const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

    events.forEach((evt) => {
      window.addEventListener(evt, handleActivity, { passive: true });
    });

    document.addEventListener('visibilitychange', handleVisibility);

    // Initial check
    if (typeof document !== 'undefined') {
      setIsTabHidden(document.visibilityState !== 'visible');
    }

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [recordActivity]);

  // Main 1-second pulse accumulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSinceActivity = (now - lastActivityRef.current) / 1000;
      const idle = elapsedSinceActivity >= idleTimeoutSeconds;
      const hidden = typeof document !== 'undefined' && document.visibilityState !== 'visible';

      setIsIdle(idle);
      setIsTabHidden(hidden);

      // Accumulate only if BOTH active (not idle) and tab is VISIBLE
      if (!idle && !hidden) {
        totalSecondsRef.current += 1;
        pendingSecondsRef.current += 1;

        setTotalActiveSeconds(totalSecondsRef.current);
        setPendingSeconds(pendingSecondsRef.current);

        // Emit heartbeat when accumulated threshold is reached
        if (pendingSecondsRef.current >= pulseIntervalSeconds) {
          sendHeartbeat(pendingSecondsRef.current);
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [idleTimeoutSeconds, pulseIntervalSeconds, sendHeartbeat]);

  // Cleanup: send any remaining active seconds via keepalive beacon on unmount/unload
  useEffect(() => {
    const handleUnload = () => {
      const remaining = pendingSecondsRef.current;
      if (remaining > 0 && typeof navigator !== 'undefined') {
        const payload: HeartbeatPayload = {
          lessonId,
          activeSeconds: Math.min(120, Math.max(1, remaining)),
        };

        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/attendance/heartbeat', blob);
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      // Attempt synchronous beacon on unmount if pending
      if (pendingSecondsRef.current > 0 && typeof navigator !== 'undefined') {
        const payload: HeartbeatPayload = {
          lessonId,
          activeSeconds: Math.min(120, Math.max(1, pendingSecondsRef.current)),
        };
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/attendance/heartbeat', blob);
      }
    };
  }, [lessonId]);

  const resetTracker = useCallback(() => {
    totalSecondsRef.current = 0;
    pendingSecondsRef.current = 0;
    setTotalActiveSeconds(0);
    setPendingSeconds(0);
    lastActivityRef.current = Date.now();
    setIsIdle(false);
  }, []);

  const isActive = !isIdle && !isTabHidden;

  return {
    isActive,
    isIdle,
    isTabHidden,
    totalActiveSeconds,
    pendingSeconds,
    lastPulseTime,
    resetTracker,
    recordActivity,
  };
}
