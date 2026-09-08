'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Shield,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  Eye,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface VideoCheckpoint {
  id: string;
  timestampSeconds: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface VideoCheckpointPlayerProps {
  title: string;
  videoDurationSeconds?: number;
  checkpoints?: VideoCheckpoint[];
  onCheckpointReached?: (checkpoint: VideoCheckpoint) => void;
  onCheckpointAnswered?: (checkpoint: VideoCheckpoint, correct: boolean) => void;
  onComplete?: () => void;
}

const DEFAULT_CHECKPOINTS: VideoCheckpoint[] = [
  {
    id: 'chk-1',
    timestampSeconds: 15,
    question:
      'Under 38 U.S.C. §§ 5901-5905, why is an AI platform prohibited from generating speculative disability ratings?',
    options: [
      'Federal law restricts formal VA representation and claims prosecution to accredited representatives.',
      'AI models require more training data on historical medical charts.',
      'Disability rating calculations must be performed on GPU clusters.',
      'Only the Department of Labor has jurisdiction over claims appeals.',
    ],
    correctOptionIndex: 0,
    explanation:
      'Correct! 38 U.S.C. §§ 5901–5905 and 38 C.F.R. § 14.629 mandate that only accredited attorneys, agents, and VSO representatives may provide legal representation and claim formulation.',
  },
  {
    id: 'chk-2',
    timestampSeconds: 40,
    question:
      'Which classification marking must be redacted from military candidate portfolios before ingestion into commercial LLMs?',
    options: [
      'PUBLIC DOMAIN // UNCLASSIFIED',
      '//CUI// (Controlled Unclassified Information) and //FEDCON//',
      'STANDARD RESUME FORMAT 2026',
      'WIOA TITLE I ACCREDITED',
    ],
    correctOptionIndex: 1,
    explanation:
      'Correct! DoD Instruction 5200.48 requires rigorous boundary protection over CUI and FEDCON marked data to prevent unauthorized external dissemination.',
  },
];

export function VideoCheckpointPlayer({
  title,
  videoDurationSeconds = 60,
  checkpoints = DEFAULT_CHECKPOINTS,
  onCheckpointReached,
  onCheckpointAnswered,
  onComplete,
}: VideoCheckpointPlayerProps) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isTabFocused, setIsTabFocused] = useState<boolean>(true);
  const [activeCheckpoint, setActiveCheckpoint] = useState<VideoCheckpoint | null>(null);
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState<Set<string>>(new Set());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tab Focus & Visibility Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabFocused(false);
        setIsPlaying(false);
      } else {
        setIsTabFocused(true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;

          // Check if we reached a checkpoint
          const hitCheckpoint = checkpoints.find(
            (c) => Math.floor(c.timestampSeconds) === next && !answeredCheckpoints.has(c.id)
          );

          if (hitCheckpoint) {
            setIsPlaying(false);
            setActiveCheckpoint(hitCheckpoint);
            if (onCheckpointReached) onCheckpointReached(hitCheckpoint);
            return next;
          }

          if (next > maxWatchedTime) {
            setMaxWatchedTime(next);
          }

          if (next >= videoDurationSeconds) {
            setIsPlaying(false);
            setIsCompleted(true);
            if (onComplete) onComplete();
            return videoDurationSeconds;
          }

          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, checkpoints, answeredCheckpoints, maxWatchedTime, videoDurationSeconds, onCheckpointReached, onComplete]);

  // Enforce Gated Progress: Cannot scrub past maxWatchedTime
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value);
    if (target <= maxWatchedTime) {
      setCurrentTime(target);
    } else {
      // Seek blocked: set to maxWatchedTime
      setCurrentTime(maxWatchedTime);
    }
  };

  const handleCheckpointSubmit = () => {
    if (selectedOption === null || !activeCheckpoint) return;

    const isCorrect = selectedOption === activeCheckpoint.correctOptionIndex;

    if (isCorrect) {
      setFeedback({
        correct: true,
        message: activeCheckpoint.explanation,
      });
      setAnsweredCheckpoints((prev) => new Set([...prev, activeCheckpoint.id]));
      if (onCheckpointAnswered) onCheckpointAnswered(activeCheckpoint, true);

      setTimeout(() => {
        setActiveCheckpoint(null);
        setSelectedOption(null);
        setFeedback(null);
        setIsPlaying(true);
      }, 2000);
    } else {
      setFeedback({
        correct: false,
        message: 'Incorrect. Please review the instructional concept and try again.',
      });
      if (onCheckpointAnswered) onCheckpointAnswered(activeCheckpoint, false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col border border-slate-800 rounded-xl bg-slate-950 overflow-hidden shadow-2xl relative">
      {/* Visual Video Simulation Frame */}
      <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        {/* Synthetic Tactical Video Screen */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-90" />

        {/* Animated HUD Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem]" />

        {/* Active Focus / Idle Warning Overlay */}
        {!isTabFocused && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <Eye className="w-10 h-10 text-amber-400 animate-pulse mb-3" />
            <h4 className="text-white font-bold text-base">Seat-Time Telemetry Paused</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Playback automatically halts when the active browser tab loses focus to satisfy WIOA Title I instructional verification.
            </p>
          </div>
        )}

        {/* Active Checkpoint Modal Dialog Overlay */}
        {activeCheckpoint && (
          <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="amber" className="text-xs flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Checkpoint {formatTime(activeCheckpoint.timestampSeconds)}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">Gated Progress Gate</span>
                </div>
                <Lock className="w-4 h-4 text-amber-400" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                  {activeCheckpoint.question}
                </h4>
              </div>

              <div className="space-y-2">
                {activeCheckpoint.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full p-3 rounded-lg text-left text-xs font-sans transition-all border ${
                      selectedOption === idx
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium'
                        : 'border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
                    feedback.correct
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  }`}
                >
                  {feedback.correct ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  Correct answer unlocks subsequent video modules.
                </span>
                <Button
                  size="sm"
                  onClick={handleCheckpointSubmit}
                  disabled={selectedOption === null}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs px-4"
                >
                  Verify Answer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Video Visual Graphic */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="h-16 w-16 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Instructional Verification &amp; Competency Stream
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Badge variant="default" className="text-[10px] bg-slate-800 text-slate-300 border-slate-700">
              WIOA Accredited
            </Badge>
            <Badge variant="secondary" className="text-[10px] bg-emerald-950/60 text-emerald-300 border-emerald-800">
              {checkpoints.length} Checkpoint Checks
            </Badge>
            {isCompleted && (
              <Badge variant="amber" className="text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Video Progress & Timeline Control Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
        {/* Checkpoint Indicators Bar */}
        <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-visible">
          {/* Watched progress */}
          <div
            className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${(currentTime / videoDurationSeconds) * 100}%` }}
          />

          {/* Gated scrub boundary indicator */}
          <div
            className="absolute top-0 left-0 h-full bg-emerald-700/40 rounded-full pointer-events-none"
            style={{ width: `${(maxWatchedTime / videoDurationSeconds) * 100}%` }}
          />

          {/* Checkpoint Diamonds on Timeline */}
          {checkpoints.map((cp) => {
            const pct = (cp.timestampSeconds / videoDurationSeconds) * 100;
            const isAnswered = answeredCheckpoints.has(cp.id);
            return (
              <div
                key={cp.id}
                title={`Checkpoint at ${formatTime(cp.timestampSeconds)}`}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 transition-transform cursor-pointer hover:scale-125 z-20 ${
                  isAnswered
                    ? 'bg-emerald-400 border-slate-900'
                    : 'bg-amber-400 border-slate-900 animate-pulse'
                }`}
                style={{ left: `${pct}%` }}
              />
            );
          })}

          {/* Transparent scrub input slider */}
          <input
            type="range"
            min={0}
            max={videoDurationSeconds}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          />
        </div>

        {/* Playback Controls & Timestamp */}
        <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 w-8 p-0 text-slate-300 hover:text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentTime(0)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              title="Rewind to start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>

            <span className="font-mono text-slate-400 text-[11px] ml-1">
              {formatTime(currentTime)} / {formatTime(videoDurationSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gated Telemetry Active</span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
