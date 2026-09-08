'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { SeatTrackerWidget } from '@/components/seat-tracker-widget';
import { PromptSandbox } from '@/components/prompt-sandbox';
import { QuizRunner } from '@/components/quiz-runner';
import { useSeatTracker } from '@/hooks/use-seat-tracker';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import type { LessonData, SyllabusModule } from '@/lib/schemas';

interface LessonViewerClientProps {
  lesson: LessonData;
  syllabusModules: SyllabusModule[];
}

export function LessonViewerClient({
  lesson,
  syllabusModules,
}: LessonViewerClientProps) {
  const [activeTab, setActiveTab] = useState<string>('content');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Initialize WIOA seat tracking engine for this lesson ID
  const tracker = useSeatTracker({
    lessonId: lesson.id,
    idleTimeoutSeconds: 180,
    pulseIntervalSeconds: 60,
  });

  const handleLessonUnlock = () => {
    setIsUnlocked(true);
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
                  VAAI Workforce LMS
                </span>
                <Badge variant="default" className="text-[10px] hidden sm:inline-flex bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  ETPL / WIOA Certified
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Veteran AI Enablement &amp; Credential Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-md border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Session: Active Contact</span>
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
          <span className="text-slate-300 font-medium">{lesson.moduleTitle}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-emerald-400 font-semibold">{lesson.title}</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Syllabus & Course Hierarchy (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Seat Tracker HUD Widget */}
          <SeatTrackerWidget
            tracker={tracker}
            targetSeconds={lesson.wioaContactMinutes * 60}
            totalWioaTargetHours={36}
          />

          {/* Syllabus Navigation Panel */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Instructional Syllabus</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                36 Total Hours
              </Badge>
            </div>

            <div className="mt-4 space-y-5">
              {syllabusModules.map((mod, modIdx) => (
                <div key={mod.slug} className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                    <span className="text-slate-400 font-semibold">
                      {mod.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {mod.contactHours}h
                    </span>
                  </div>

                  <div className="space-y-1 pl-2 border-l border-slate-800">
                    {mod.lessons.map((les) => {
                      const isCurrent =
                        mod.slug === lesson.moduleSlug && les.slug === lesson.lessonSlug;

                      return (
                        <Link
                          key={les.slug}
                          href={`/courses/${mod.slug}/${les.slug}`}
                          className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-md transition-colors ${
                            isCurrent
                              ? 'bg-emerald-950/40 text-emerald-300 font-medium border border-emerald-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isUnlocked && isCurrent ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : isCurrent ? (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            ) : (
                              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                            {les.durationMinutes}m
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
              <div className="flex items-center justify-between">
                <span>Credential Status:</span>
                <span className="font-semibold text-amber-400">
                  {isUnlocked ? 'Unit 1 Certified' : 'In Progress (Active Seat Time)'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Main Content Area & Interactive Workspaces (8 Cols) */}
        <main className="lg:col-span-8 flex flex-col space-y-6">
          {/* Header Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Shield className="w-48 h-48 text-white" />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
              <Badge variant="outline" className="text-[11px] border-emerald-500/40 text-emerald-400 bg-emerald-950/20">
                {lesson.moduleTitle}
              </Badge>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 flex items-center gap-1 font-mono text-xs">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {lesson.wioaContactMinutes} Min Standard Contact Requirement
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {lesson.title}
            </h1>

            {/* Learning Objectives Pill Box */}
            <div className="mt-4 pt-4 border-t border-slate-800/90">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ETPL Learning Objectives
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {lesson.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation Tabs for Content, Sandbox, and Quiz */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full bg-slate-900 border border-slate-800">
              <TabsTrigger value="content" className="text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Instructional Content</span>
              </TabsTrigger>
              <TabsTrigger value="sandbox" className="text-xs flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                <span>AI Prompt Sandbox</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Gated Assessment</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Instructional Content */}
            <TabsContent value="content" className="mt-4 space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sm:p-8 prose prose-invert max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-li:text-slate-300">
                <div
                  className="space-y-4 text-sm leading-relaxed text-slate-300"
                  dangerouslySetInnerHTML={{
                    __html: lesson.markdownContent
                      .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-white mt-6 mb-2">$1</h3>')
                      .replace(/#### (.*)/g, '<h4 class="text-lg font-semibold text-emerald-400 mt-4 mb-2">$1</h4>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                      .replace(/> (.*)/g, '<div class="border-l-4 border-amber-500 bg-amber-950/20 px-4 py-2 my-4 text-amber-200 text-xs rounded-r-md">$1</div>')
                      .replace(/\n\n/g, '<br />'),
                  }}
                />

                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    <span>Ready to test the prompt safety filter?</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('sandbox')}
                      className="text-xs text-slate-200"
                    >
                      <Terminal className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                      Open AI Sandbox
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setActiveTab('quiz')}
                      className="text-xs font-semibold"
                    >
                      Take Gated Quiz
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Sandboxed AI Prompt Workspace */}
            <TabsContent value="sandbox" className="mt-4">
              <PromptSandbox />
            </TabsContent>

            {/* Tab 3: Gated Knowledge Check Quiz */}
            <TabsContent value="quiz" className="mt-4">
              <QuizRunner
                moduleId={lesson.moduleSlug}
                lessonId={lesson.id}
                questions={lesson.quizQuestions}
                onLessonUnlock={handleLessonUnlock}
                passingThresholdPercent={80}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Footer with Compliance Credentials */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">VAAI LMS MVP</span>
            <span>—</span>
            <span>WIOA Eligible Training Provider List (ETPL) Technical Standard</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Title 38 Safe Harbor Protected</span>
            <span>•</span>
            <span>Zero-Retention Policy</span>
            <span>•</span>
            <span>Next.js 16 Active LTS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
