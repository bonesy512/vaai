'use client';

import React from 'react';
import { Clock, Radio, PauseCircle, EyeOff, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { UseSeatTrackerReturn } from '@/hooks/use-seat-tracker';

interface SeatTrackerWidgetProps {
  tracker: UseSeatTrackerReturn;
  targetSeconds?: number; // Target for this session / lesson (e.g., 3600 = 1 hr)
  totalWioaTargetHours?: number; // 36 hours mandatory for ETPL/WIOA
}

export function SeatTrackerWidget({
  tracker,
  targetSeconds = 1800, // 30 min per lesson module
  totalWioaTargetHours = 36,
}: SeatTrackerWidgetProps) {
  const {
    isActive,
    isIdle,
    isTabHidden,
    totalActiveSeconds,
    pendingSeconds,
    lastPulseTime,
  } = tracker;

  // Format seconds to HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round((totalActiveSeconds / targetSeconds) * 100)
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            WIOA Contact Hours Engine
          </span>
        </div>

        {/* Dynamic Status Badge */}
        {isActive ? (
          <Badge variant="default" className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono">RECORDING</span>
          </Badge>
        ) : isTabHidden ? (
          <Badge variant="secondary" className="flex items-center gap-1.5 bg-slate-800 text-slate-400 border-slate-700">
            <EyeOff className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] font-mono">TAB HIDDEN</span>
          </Badge>
        ) : (
          <Badge variant="amber" className="flex items-center gap-1.5">
            <PauseCircle className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-mono">IDLE (&gt;180s)</span>
          </Badge>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            Verified Contact Time
          </p>
          <p className="text-2xl font-mono font-bold text-white mt-0.5 tracking-tight">
            {formatTime(totalActiveSeconds)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            Heartbeat Sync
          </p>
          <div className="flex items-center justify-end gap-1.5 mt-1.5 text-xs text-slate-300 font-mono">
            {lastPulseTime ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lastPulseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse text-amber-400" />
                Awaiting 60s pulse ({60 - pendingSeconds}s)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar towards current lesson target */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex justify-between items-center text-xs mb-1.5 text-slate-400">
          <span>Lesson Contact Requirement ({Math.round(targetSeconds / 60)} min)</span>
          <span className="font-mono text-slate-300 font-semibold">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5 bg-slate-800" indicatorClassName="bg-emerald-500" />
        <p className="mt-2 text-[10px] text-slate-400 leading-normal flex items-center justify-between">
          <span>ETPL Cumulative Standard: <strong>{totalWioaTargetHours} Contact Hours</strong></span>
          <span className="text-slate-400">Threshold: 180s Inactivity / Tab Pause</span>
        </p>
      </div>
    </div>
  );
}
