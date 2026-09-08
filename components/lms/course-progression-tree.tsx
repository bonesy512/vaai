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

export const VAAI_201_PROGRESSION_MODULES: ProgressionModuleNode[] = [
  {
    id: 'mod-1',
    moduleNumber: 1,
    title: 'Module 1: Finite-State Machine Determinism & Acyclic Workflows (JP 3-0)',
    contactHours: 11.25,
    lessons: [
      {
        id: 'L1',
        title: 'FSM Phased Execution & Acyclic Graph Coordination',
        durationMinutes: 675,
        href: '/courses/VAAI-201/M1/L1',
      },
    ],
    lab: {
      title: 'Lab 1: Deterministic Multi-Agent State Machine & Acyclic DAG Coordinator',
      href: '/courses/VAAI-201/M1/L1',
    },
    exam: {
      title: 'Module 1 Doctrinal Examination (JP 3-0 Phased Operations)',
      moduleId: 'mod-1',
      href: '/courses/VAAI-201/exam/mod-1',
      passingScorePercentage: 80,
    },
  },
  {
    id: 'mod-2',
    moduleNumber: 2,
    title: 'Module 2: Sandboxed Tool-Calling & RPC Schema Guardrails (NIST SP 800-218)',
    contactHours: 11.25,
    lessons: [
      {
        id: 'L1',
        title: 'Hardened Tool Dispatchers & Pydantic Schema Validation',
        durationMinutes: 675,
        href: '/courses/VAAI-201/M2/L1',
      },
    ],
    lab: {
      title: 'Lab 2: Hardened Defense Tool Dispatcher & Constrained Function Calling',
      href: '/courses/VAAI-201/M2/L1',
    },
    exam: {
      title: 'Module 2 Doctrinal Examination (NIST SP 800-218 SSDF)',
      moduleId: 'mod-2',
      href: '/courses/VAAI-201/exam/mod-2',
      passingScorePercentage: 80,
    },
  },
  {
    id: 'mod-3',
    moduleNumber: 3,
    title: 'Module 3: Multi-Agent Consensus & Adversarial Debate Networks (FM 3-0)',
    contactHours: 11.25,
    lessons: [
      {
        id: 'L1',
        title: 'Adversarial Debate Topologies & Quorum Consensus Mechanisms',
        durationMinutes: 675,
        href: '/courses/VAAI-201/M3/L1',
      },
    ],
    lab: {
      title: 'Lab 3: Multi-Agent Red/Blue Tactical Consensus Engine',
      href: '/courses/VAAI-201/M3/L1',
    },
    exam: {
      title: 'Module 3 Doctrinal Examination (FM 3-0 Operations)',
      moduleId: 'mod-3',
      href: '/courses/VAAI-201/exam/mod-3',
      passingScorePercentage: 80,
    },
  },
  {
    id: 'mod-4',
    moduleNumber: 4,
    title: 'Module 4: Human-in-the-Loop Gateways & Kinetic Authorization (DoDD 3000.09)',
    contactHours: 11.25,
    lessons: [
      {
        id: 'L1',
        title: 'Fail-Closed Interception Gateways & Token Authorization',
        durationMinutes: 675,
        href: '/courses/VAAI-201/M4/L1',
      },
    ],
    lab: {
      title: 'Lab 4: DoDD 3000.09 Human-in-the-Loop Interceptor Gateway',
      href: '/courses/VAAI-201/M4/L1',
    },
    exam: {
      title: 'Module 4 Doctrinal Examination (DoDD 3000.09 Autonomy in Weapon Systems)',
      moduleId: 'mod-4',
      href: '/courses/VAAI-201/exam/mod-4',
      passingScorePercentage: 80,
    },
  },
];

export function CourseProgressionTree({
  courseId = 'VAAI-101',
  completedExams = [],
}: CourseProgressionTreeProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedExams));
  const modules = courseId === 'VAAI-201' ? VAAI_201_PROGRESSION_MODULES : VAAI_101_PROGRESSION_MODULES;
  const isVAAI201 = courseId === 'VAAI-201';

  const isModuleUnlocked = (moduleIndex: number): boolean => {
    if (moduleIndex === 0) return true;
    const prevModule = modules[moduleIndex - 1];
    return completed.has(prevModule.id);
  };

  const isCapstoneUnlocked = (): boolean => {
    return modules.every((m) => completed.has(m.id));
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
          {isVAAI201 ? 'WIOA 45.0 CONTACT HOURS' : 'WIOA 40.0 CONTACT HOURS'}
        </Badge>
      </div>

      <div className="space-y-4">
        {modules.map((mod, idx) => {
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
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {isFinished ? <CheckCircle2 className="w-4 h-4" /> : `M${mod.moduleNumber}`}
                  </div>
                  <div>
                    <CardTitle className="text-xs md:text-sm font-mono font-bold text-slate-200">
                      {mod.title}
                    </CardTitle>
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{mod.contactHours} Contact Hours &bull; TWC Accredited</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isFinished ? (
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                      EXAM PASSED
                    </Badge>
                  ) : unlocked ? (
                    <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 text-[10px] font-mono">
                      IN PROGRESS
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-slate-800 text-slate-600 text-[10px] font-mono">
                      LOCKED
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-3 space-y-3">
                {/* Micro Steps: Theory -> Lab -> Exam */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                  {/* Step 1: Instructional Lesson */}
                  <div className="p-2.5 rounded border border-slate-900 bg-slate-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-300">
                        {mod.lessons[0]?.title || 'Instructional Brief'}
                      </span>
                    </div>
                    {unlocked ? (
                      <Link
                        href={mod.lessons[0]?.href || `/courses/${courseId}`}
                        className="text-emerald-400 hover:text-emerald-300 text-[11px] shrink-0 font-semibold"
                      >
                        Study &rarr;
                      </Link>
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                  </div>

                  {/* Step 2: Code Laboratory */}
                  <div className="p-2.5 rounded border border-slate-900 bg-slate-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate text-slate-300">{mod.lab.title}</span>
                    </div>
                    {unlocked ? (
                      <Link
                        href={mod.lab.href}
                        className="text-cyan-400 hover:text-cyan-300 text-[11px] shrink-0 font-semibold"
                      >
                        Launch &rarr;
                      </Link>
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                  </div>

                  {/* Step 3: Doctrinal Exam Gate */}
                  <div
                    className={`p-2.5 rounded border flex items-center justify-between ${
                      isFinished
                        ? 'border-emerald-900/60 bg-emerald-950/20'
                        : 'border-slate-900 bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <ShieldCheck
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isFinished ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      />
                      <span className="truncate text-slate-300">{mod.exam.title}</span>
                    </div>
                    {unlocked ? (
                      <Link
                        href={mod.exam.href}
                        className={`text-[11px] shrink-0 font-semibold ${
                          isFinished
                            ? 'text-emerald-400 hover:text-emerald-300'
                            : 'text-amber-400 hover:text-amber-300'
                        }`}
                      >
                        {isFinished ? 'Review' : 'Take Exam \u2192'}
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
                  {isVAAI201
                    ? 'Multi-Agent Recon-and-Strike Pipeline | 10 Missions'
                    : 'Multi-Stage Defense Briefing Pipeline | 10 Noisy SITREPs'}
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
