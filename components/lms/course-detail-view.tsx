'use client';

import * as React from 'react';
import { useState } from 'react';
import type { Course } from '@/lib/types/course';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  ShieldCheck,
  Briefcase,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  FileCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface CourseDetailViewProps {
  course: Course;
  onLaunchSandbox?: () => void;
}

export function CourseDetailView({
  course,
  onLaunchSandbox,
}: CourseDetailViewProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0].id]: true, // Expand module 1 by default
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTrackColor = (track: Course['track']) => {
    switch (track) {
      case 'engineering':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'security':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'operations':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-8 text-slate-100">
      {/* Header Section */}
      <div className="space-y-4 border-b border-slate-800 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`font-mono font-semibold text-xs uppercase px-3 py-1 ${getTrackColor(course.track)}`}>
              {course.track} Track
            </Badge>
            <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 font-mono text-xs">
              Level {course.level}
            </Badge>
            <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-xs">
              SOC {course.socCode}
            </Badge>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {course.clockHours} Clock Hours
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {course.ceuValue} CEUs
            </span>
          </div>
        </div>

        <div>
          <div className="text-xs font-mono font-bold text-amber-500 tracking-wider">
            ACCREDITED PROGRAM CODE: {course.id}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {course.title}
          </h2>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {course.description}
        </p>

        {/* Voucher Economics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">State ETPL Voucher</span>
            <div className="text-2xl font-bold text-amber-400">${course.pricing.etplVoucherPrice.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% WIOA / SkillBridge Eligible
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Commercial Enterprise Price</span>
            <div className="text-2xl font-bold text-slate-400 line-through">${course.pricing.enterpriseSeatPrice.toLocaleString()}</div>
            <span className="text-[11px] text-slate-400">Standard employer rate</span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Approved Funding Vehicles</span>
            <div className="flex flex-wrap gap-1">
              {course.pricing.fundingOptions.map((opt, i) => (
                <span key={i} className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Target Military Ratings & MOS Crosswalk */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          Primary Target Military Specialties (MOS / AFSC / Rating Crosswalk)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {course.targetMos.map((mos, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{mos}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Module Syllabus Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Accredited 4-Module Syllabus Breakdown ({course.clockHours} Verified Contact Hours)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Requires 90% Heartbeat Seat-Time
          </span>
        </div>

        <div className="space-y-3">
          {course.modules.map((mod) => {
            const isExpanded = !!expandedModules[mod.id];
            return (
              <div
                key={mod.id}
                className="border border-slate-800 rounded-xl bg-slate-950/70 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 font-mono text-xs font-bold text-amber-400">
                      {mod.moduleNumber}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{mod.title}</div>
                      <div className="text-xs font-mono text-slate-400">{mod.contactHours} Contact Hours · {mod.exercises.length} Interactive Lab Exercises</div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-900/40 space-y-4 text-xs">
                    {/* Learning Objectives */}
                    <div className="space-y-1.5">
                      <div className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                        Module Learning Objectives:
                      </div>
                      <ul className="space-y-1 pl-4 list-disc text-slate-300">
                        {mod.learningObjectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive Exercises */}
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                        Interactive Lab Exercises:
                      </div>
                      {mod.exercises.map((ex) => (
                        <div key={ex.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sky-300">{ex.title}</span>
                            <Badge variant="outline" className="text-[10px] font-mono border-slate-700 text-slate-400">
                              {ex.language}
                            </Badge>
                          </div>
                          <p className="text-slate-300 text-[11px]">{ex.instructions}</p>
                          <pre className="p-2 rounded bg-slate-900 font-mono text-[10px] text-slate-300 overflow-x-auto border border-slate-800">
                            {ex.starterCode}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Capstone Practicum & Evaluator Rubric Section */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-950 to-slate-950 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-500/20 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-amber-400 tracking-wider">
              MANDATORY WIOA ACCREDITATION PRACTICUM
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {course.capstone.title}
            </h3>
          </div>
          {onLaunchSandbox && (
            <Button
              onClick={onLaunchSandbox}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs shadow-lg shadow-amber-500/20"
            >
              <Code2 className="w-4 h-4 mr-1.5" />
              Launch Sandbox Runtime
            </Button>
          )}
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {course.capstone.briefing}
        </p>

        {/* Evaluator Rubric Matrix */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Evaluator Grading Rubric (Minimum 80% Passing Threshold)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {course.capstone.rubric.map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{item.name}</span>
                  <span className="text-amber-400 font-mono">{item.weight}%</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
