'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Lock,
  Layers,
  Award,
  FileText,
  Terminal,
  GraduationCap,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  Play,
  Briefcase,
  Code2,
  Command,
} from 'lucide-react';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { SeatTrackerWidget } from '@/components/seat-tracker-widget';
import { QuizRunner } from '@/components/quiz-runner';
import { useSeatTracker } from '@/hooks/use-seat-tracker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InteractiveLabWorkspace } from '@/components/lms/interactive-lab-workspace';
import { VideoCheckpointPlayer, type VideoCheckpoint } from '@/components/lms/video-checkpoint-player';
import { AutomatedGradeReport } from '@/components/lms/automated-grade-report';
import { MosCareerMatrix } from '@/components/lms/mos-career-matrix';
import { CommandPalette } from '@/components/ui/command-palette';
import { EngagementTracker } from '@/lib/telemetry/engagement-tracker';
import type { LessonData, SyllabusModule } from '@/lib/schemas';
import type { GradeReport } from '@/lib/lms/rubric-evaluator';
import type { ExecutionResult } from '@/lib/lms/sandbox-runtime';

export interface LabEditorClientProps {
  lesson: LessonData;
  syllabusModules: SyllabusModule[];
  initialTab?: 'lecture' | 'lab' | 'skills' | 'quiz';
}

export function LabEditorClient({
  lesson,
  syllabusModules,
  initialTab = 'lecture',
}: LabEditorClientProps) {
  const [activeTab, setActiveTab] = useState<'lecture' | 'lab' | 'skills' | 'quiz'>(initialTab);
  const [activePresetId, setActivePresetId] = useState<string>('pii-scrubber');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradeReport, setGradeReport] = useState<GradeReport | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Initialize WIOA seat tracking hook
  const tracker = useSeatTracker({
    lessonId: lesson.id,
    idleTimeoutSeconds: 180,
    pulseIntervalSeconds: 60,
  });

  // Initialize multi-signal engagement telemetry engine
  const engagementRef = useRef<EngagementTracker | null>(null);
  useEffect(() => {
    const et = new EngagementTracker(lesson.id, 'vet-student-demo');
    engagementRef.current = et;
    return () => {
      et.destroy();
    };
  }, [lesson.id]);

  // Determine appropriate default preset based on lesson slug
  useEffect(() => {
    if (lesson.lessonSlug === 'lesson-2' || lesson.moduleSlug === 'ai-literacy-101') {
      setActivePresetId('pii-scrubber');
    } else if (lesson.moduleSlug === 'workforce-translation') {
      setActivePresetId('mos-translator');
    } else if (lesson.moduleSlug === 'etpl-capstone') {
      setActivePresetId('wioa-webhook');
    }
  }, [lesson.moduleSlug, lesson.lessonSlug]);

  const handleExecutionComplete = (result: ExecutionResult) => {
    if (engagementRef.current) {
      engagementRef.current.recordEvent(
        result.success ? 'CODE_EXECUTION_SUCCESS' : 'CODE_EXECUTION_ERROR',
        {
          executionTimeMs: result.executionTimeMs,
          hasError: !result.success,
        }
      );
    }
  };

  const handleGradeSubmission = async (
    code: string,
    language: 'python' | 'javascript' | 'json',
    outputLog: string
  ) => {
    setIsGrading(true);
    if (engagementRef.current) {
      engagementRef.current.recordEvent('RUBRIC_GRADE_SUBMITTED', {
        language,
        codeLength: code.length,
      });
    }

    try {
      const res = await fetch('/api/lms/grade-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          labPresetId: activePresetId,
          studentId: 'vet-student-demo',
          code,
          language,
          outputLog,
        }),
      });

      const json = await res.json();
      if (json.success && json.gradeReport) {
        setGradeReport(json.gradeReport);
        if (json.gradeReport.passed) {
          setIsUnlocked(true);
        }
      }
    } catch (err) {
      console.error('Grade submission failed:', err);
    } finally {
      setIsGrading(false);
    }
  };

  const handleCheckpointReached = (cp: VideoCheckpoint) => {
    if (engagementRef.current) {
      engagementRef.current.recordEvent('VIDEO_CHECKPOINT_REACHED', {
        checkpointId: cp.id,
        timestampSeconds: cp.timestampSeconds,
      });
    }
  };

  const handleCheckpointAnswered = (cp: VideoCheckpoint, correct: boolean) => {
    if (engagementRef.current) {
      engagementRef.current.recordEvent('VIDEO_CHECKPOINT_ANSWERED', {
        checkpointId: cp.id,
        correct,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Mandatory Statutory Compliance Notice */}
      <DisclaimerBanner />

      {/* Top Application Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-900/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                  VAAI Apex LMS Engine
                </span>
                <Badge
                  variant="default"
                  className="text-[10px] hidden sm:inline-flex bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                >
                  ETPL / WIOA Certified
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Interactive AI Workforce Training Operating System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Command Palette Trigger Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/70 border border-slate-700/80 text-xs font-mono text-slate-300 hover:border-emerald-500 hover:text-white transition-all shadow-sm"
              title="Open Global Command Palette (Cmd+K)"
            >
              <Command className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Commands</span>
              <kbd className="text-[10px] bg-slate-800 px-1 py-0.5 rounded border border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-md border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Session: Active Telemetry</span>
            </div>

            {isUnlocked && (
              <Badge variant="amber" className="text-xs flex items-center gap-1 font-semibold animate-bounce">
                <Award className="w-3.5 h-3.5" />
                Lesson Completed!
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumbs Subheader */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          <Link href={`/courses/${lesson.moduleSlug}/${lesson.lessonSlug}`} className="hover:text-slate-200 transition-colors">
            Curriculum
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-300 font-medium truncate max-w-xs">{lesson.moduleTitle}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-emerald-400 font-medium truncate">{lesson.title}</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Navigation: Syllabus Modules */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-5 order-2 lg:order-1">
          {/* Active WIOA Seat Tracker HUD */}
          <SeatTrackerWidget tracker={tracker} targetSeconds={1800} />

          {/* Module Syllabus Accordion */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/60 p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-200">
                Syllabus &amp; Clock Hours
              </h2>
            </div>

            <div className="space-y-4">
              {syllabusModules.map((module) => {
                const isCurrentModule = module.slug === lesson.moduleSlug;
                return (
                  <div key={module.slug} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 line-clamp-1">{module.title}</span>
                      <span className="text-[11px] font-mono text-slate-500">{module.contactHours} hrs</span>
                    </div>

                    <div className="space-y-1 pl-2 border-l border-slate-800">
                      {module.lessons.map((l) => {
                        const isCurrentLesson = isCurrentModule && l.slug === lesson.lessonSlug;
                        return (
                          <Link
                            key={l.slug}
                            href={`/courses/${module.slug}/${l.slug}`}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                              isCurrentLesson
                                ? 'bg-emerald-600/20 text-emerald-300 font-semibold border border-emerald-500/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                          >
                            <span className="truncate pr-2">{l.title}</span>
                            <span className="font-mono text-[10px] text-slate-500 shrink-0">
                              {l.durationMinutes}m
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Center / Right Workspace Area */}
        <section className="flex-1 flex flex-col gap-6 order-1 lg:order-2 min-w-0">
          {/* Main Mode Navigation Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 p-1.5 rounded-xl gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveTab('lecture')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'lecture'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Interactive Video &amp; Theory</span>
              </button>

              <button
                onClick={() => setActiveTab('lab')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'lab'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>WASM Lab Workspace</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'skills'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>MOS Career Matrix</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'quiz'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Knowledge Check</span>
              </button>
            </div>

            {gradeReport && (
              <Badge
                variant={gradeReport.passed ? 'default' : 'destructive'}
                className="text-xs px-2.5 py-1 font-mono cursor-pointer"
                onClick={() => setActiveTab('lab')}
              >
                Grade: {gradeReport.scorePercentage}% {gradeReport.passed ? 'PASSED' : 'RETRY'}
              </Badge>
            )}
          </div>

          {/* Tab 1: Video Player & Theory */}
          {activeTab === 'lecture' && (
            <div className="space-y-6">
              {/* Interactive Video Player */}
              <VideoCheckpointPlayer
                title={lesson.title}
                videoDurationSeconds={lesson.wioaContactMinutes * 2 || 60}
                onCheckpointReached={handleCheckpointReached}
                onCheckpointAnswered={handleCheckpointAnswered}
                onComplete={() => {
                  if (engagementRef.current) {
                    engagementRef.current.recordEvent('VIDEO_CHECKPOINT_ANSWERED', { allCompleted: true });
                  }
                }}
              />

              {/* Lesson Objectives */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>State WIOA Learning Objectives</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {lesson.learningObjectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Narrative Content */}
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 prose prose-invert prose-emerald max-w-none text-slate-300 text-sm leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{
                    __html: lesson.markdownContent
                      .replace(/### (.*?)\n/g, '<h3 class="text-white font-bold text-base mt-4 mb-2">$1</h3>')
                      .replace(/#### (.*?)\n/g, '<h4 class="text-emerald-400 font-semibold text-sm mt-3 mb-1.5">$1</h4>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100">$1</strong>')
                      .replace(/> (.*?)\n/g, '<blockquote class="border-l-2 border-emerald-500 pl-4 text-slate-400 italic my-3">$1</blockquote>'),
                  }}
                />
              </div>
            </div>
          )}

          {/* Tab 2: In-Browser WASM Lab Workspace */}
          {activeTab === 'lab' && (
            <div className="space-y-6">
              {/* Grade Report if available */}
              {gradeReport && (
                <AutomatedGradeReport
                  report={gradeReport}
                  onRetry={() => setGradeReport(null)}
                  onContinue={() => setActiveTab('quiz')}
                />
              )}

              {/* Split-pane Monaco IDE Workspace */}
              <InteractiveLabWorkspace
                lessonId={lesson.id}
                activePresetId={activePresetId}
                onExecutionComplete={handleExecutionComplete}
                onSubmitForGrading={handleGradeSubmission}
                isGrading={isGrading}
              />
            </div>
          )}

          {/* Tab 3: Military Skills Graph & MOS Crosswalk */}
          {activeTab === 'skills' && (
            <MosCareerMatrix
              initialBranch="Army"
              initialMosCode="25B"
              initialRank="E-5_to_E-6"
            />
          )}

          {/* Tab 4: Knowledge Quiz Runner */}
          {activeTab === 'quiz' && (
            <QuizRunner
              moduleId={lesson.moduleSlug}
              lessonId={lesson.id}
              questions={lesson.quizQuestions}
              passingThresholdPercent={80}
              onLessonUnlock={() => {
                setIsUnlocked(true);
              }}
            />
          )}
        </section>
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectPreset={(presetId) => {
          setActivePresetId(presetId);
          setActiveTab('lab');
        }}
        onRunCode={() => setActiveTab('lab')}
        onSubmitGrade={() => setActiveTab('lab')}
        onSwitchTab={(tabId) => setActiveTab(tabId as 'lecture' | 'lab' | 'skills' | 'quiz')}
      />
    </div>
  );
}
