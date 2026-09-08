'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Code2,
  Award,
  Terminal,
  Clock,
  ShieldCheck,
  Play,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ProgressionModuleNode {
  id: string;
  moduleNumber: number;
  title: string;
  contactHours: number;
  lessons: Array<{
    id: string;
    title: string;
    durationMinutes: number;
    href: string;
  }>;
  lab: {
    title: string;
    href: string;
  };
  exam: {
    title: string;
    moduleId: string;
    href: string;
    passingScorePercentage: number;
  };
}

interface CourseProgressionTreeProps {
  courseId?: string;
  completedExams?: string[]; // array of moduleId e.g. ['mod-1', 'mod-2']
}

export const VAAI_101_PROGRESSION_MODULES: ProgressionModuleNode[] = [
  {
    id: 'mod-1',
    moduleNumber: 1,
    title: 'Module 1: Prompt Engineering as Code & Deterministic Output Shaping',
    contactHours: 10,
    lessons: [
      {
        id: 'L1',
        title: 'Deterministic Output Shaping & Conversational Suppression',
        durationMinutes: 60,
        href: '/courses/VAAI-101/M1/L1',
      },
    ],
    lab: {
      title: 'Lab 1: Pure-Function SITREP Formatter',
      href: '/courses/VAAI-101/M1/L1',
    },
    exam: {
      title: 'Module 1 Doctrinal Examination (FM 6-0)',
      moduleId: 'mod-1',
      href: '/courses/VAAI-101/exam/mod-1',
      passingScorePercentage: 80,
    },
  },
  {
    id: 'mod-2',
    moduleNumber: 2,
    title: 'Module 2: Schema Enforcement, Pydantic, & Zod Output Validation',
    contactHours: 10,
    lessons: [
      {
        id: 'L1',
        title: 'MIL-STD-2525D Symbology Translation & Output Contracts',
        durationMinutes: 60,
        href: '/courses/VAAI-101/M2/L1',
      },
    ],
    lab: {
      title: 'Lab 2: Pydantic Validation & Retry Loop',
      href: '/courses/VAAI-101/M2/L1',
    },
    exam: {
      title: 'Module 2 Doctrinal Examination (MIL-STD-2525D)',
      moduleId: 'mod-2',
      href: '/courses/VAAI-101/exam/mod-2',
      passingScorePercentage: 80,
    },
  },
  {
    id: 'mod-3',
    moduleNumber: 3,
    title: 'Module 3: Tokenomics, Context Budgets, & High-Throughput Streaming',
    contactHours: 10,
    lessons: [
      {
        id: 'L1',
        title: 'Tactical Edge Context Trimmer & Token-Bucket Limiter',
        durationMinutes: 60,
        href: '/courses/VAAI-101/M3/L1',
      },
    ],
    lab: {
      title: 'Lab 3: Context Trimmer & Token Bucket Engine',
      href: '/courses/VAAI-101/M3/L1',
    },
    exam: {
      title: 'Module 3 Doctrinal Examination (CJCSM 6510.01B)',
      moduleId: 'mod-3',
      href: '/courses/VAAI-101/exam/mod-3',
      passingScorePercentage: 80,
    },
  },
  {
    id: 'mod-4',
    moduleNumber: 4,
    title: 'Module 4: Secure API Architecture, Rate Limiting, & Fallback Circuits',
    contactHours: 10,
    lessons: [
      {
        id: 'L1',
        title: 'Asynchronous Fallback Circuit Breaker & Sub-250ms Failover',
        durationMinutes: 60,
        href: '/courses/VAAI-101/M4/L1',
      },
    ],
    lab: {
      title: 'Lab 4: Fallback Circuit Breaker Runner',
      href: '/courses/VAAI-101/M4/L1',
    },
    exam: {
      title: 'Module 4 Doctrinal Examination (NIST SP 800-171 SC-7/SC-13)',
      moduleId: 'mod-4',
      href: '/courses/VAAI-101/exam/mod-4',
      passingScorePercentage: 80,
    },
  },
];

export function CourseProgressionTree({
  courseId = 'VAAI-101',
  completedExams = [],
}: CourseProgressionTreeProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedExams));

  const isModuleUnlocked = (moduleIndex: number): boolean => {
    if (moduleIndex === 0) return true;
    const prevModule = VAAI_101_PROGRESSION_MODULES[moduleIndex - 1];
    return completed.has(prevModule.id);
  };

  const isCapstoneUnlocked = (): boolean => {
    return VAAI_101_PROGRESSION_MODULES.every((m) => completed.has(m.id));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-mono font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Course Operational Syllabus & Progression Tree</span>
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Sequential mastery gate: Lesson &rarr; Lab &rarr; Examination (&ge; 80% passing floor).
          </p>
        </div>

        <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-xs">
          WIOA 40.0 CONTACT HOURS
        </Badge>
      </div>

      <div className="space-y-4">
        {VAAI_101_PROGRESSION_MODULES.map((mod, idx) => {
          const unlocked = isModuleUnlocked(idx);
          const isFinished = completed.has(mod.id);

          return (
            <Card
              key={mod.id}
              className={`border transition-all ${
                isFinished
                  ? 'border-emerald-500/40 bg-slate-950/80'
                  : unlocked
                  ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  : 'border-slate-900 bg-slate-950/50 opacity-60'
              }`}
            >
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-slate-900">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold ${
                      isFinished
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : unlocked
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {isFinished ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div>
                    <CardTitle className="text-xs md:text-sm font-mono font-semibold text-slate-200">
                      {mod.title}
                    </CardTitle>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {mod.contactHours} Contact Hours | 1.0 CEU
                    </span>
                  </div>
                </div>

                <div>
                  {isFinished ? (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-mono text-[11px]">
                      COMPLETED
                    </Badge>
                  ) : unlocked ? (
                    <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono text-[11px]">
                      ACTIVE GATE
                    </Badge>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-600 font-mono">
                      <Lock className="w-3 h-3" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                  {/* Step 1: Lesson */}
                  <div className="bg-slate-900/40 p-2.5 rounded border border-slate-850 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-300">1. Theory & Doctrine</span>
                    </div>
                    {unlocked ? (
                      <Link href={mod.lessons[0].href} className="text-emerald-400 hover:underline">
                        Open &rarr;
                      </Link>
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>

                  {/* Step 2: Lab */}
                  <div className="bg-slate-900/40 p-2.5 rounded border border-slate-850 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-300">2. Code Laboratory</span>
                    </div>
                    {unlocked ? (
                      <Link href={mod.lab.href} className="text-emerald-400 hover:underline">
                        Launch &rarr;
                      </Link>
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>

                  {/* Step 3: Exam */}
                  <div
                    className={`p-2.5 rounded border flex items-center justify-between ${
                      isFinished
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-slate-900/40 border-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Award className={`w-3.5 h-3.5 ${isFinished ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className={isFinished ? 'text-emerald-200' : 'text-slate-300'}>
                        3. Doctrinal Exam
                      </span>
                    </div>
                    {unlocked ? (
                      <Link href={mod.exam.href} className="text-amber-400 hover:underline font-semibold">
                        {isFinished ? 'Review' : 'Take Exam'} &rarr;
                      </Link>
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Final Capstone Defense Gate */}
        <Card
          className={`border transition-all ${
            isCapstoneUnlocked()
              ? 'border-amber-500/50 bg-slate-950 shadow-lg shadow-amber-950/20'
              : 'border-slate-900 bg-slate-950/40 opacity-60'
          }`}
        >
          <CardHeader className="py-4 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold ${
                  isCapstoneUnlocked()
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                <Award className="w-4 h-4" />
              </div>

              <div>
                <CardTitle className="text-xs md:text-sm font-mono font-bold text-slate-100 uppercase tracking-tight">
                  Capstone Defense & Automated WASM Evaluation Harness
                </CardTitle>
                <span className="text-[11px] text-slate-500 font-mono">
                  Multi-Stage Defense Briefing Pipeline | 10 Noisy SITREPs
                </span>
              </div>
            </div>

            <div>
              {isCapstoneUnlocked() ? (
                <Link href={`/courses/${courseId}/exam/capstone`}>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs font-bold gap-1.5">
                    <span>Enter Defense</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-slate-600 font-mono">
                  <Lock className="w-3 h-3" />
                  <span>Pass Modules 1-4 to Unlock</span>
                </span>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
