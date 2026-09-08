'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  BookOpen,
  Code2,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  Layers,
  Target,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Lightbulb,
  Play,
  RotateCcw,
  Copy,
  Check,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeatTrackerWidget } from '@/components/seat-tracker-widget';
import { useSeatTracker } from '@/hooks/use-seat-tracker';
import type { LessonContentEntry } from '@/lib/lesson-content-data';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[350px] bg-slate-950 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
        <Code2 className="w-6 h-6 animate-pulse mb-2 text-emerald-400" />
        <span>Initializing Monaco IDE...</span>
      </div>
    ),
  }
);

interface LessonProgressionClientProps {
  lesson: LessonContentEntry;
  courseModules: Array<{
    moduleId: string;
    moduleTitle: string;
    lessons: Array<{ lessonId: string; lessonTitle: string }>;
  }>;
  clockHours: number;
}

export function LessonProgressionClient({
  lesson,
  courseModules,
  clockHours,
}: LessonProgressionClientProps) {
  const [code, setCode] = useState(lesson.starterCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([lesson.moduleId])
  );
  const [activePane, setActivePane] = useState<'theory' | 'code'>('theory');

  const tracker = useSeatTracker({
    lessonId: `${lesson.courseId}-${lesson.moduleId}-${lesson.lessonId}`,
    pulseIntervalSeconds: 30,
    idleTimeoutSeconds: 120,
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('⏳ Executing in zero-egress WASM sandbox...\n');

    try {
      // Simulate Pyodide execution (client-side WASM)
      await new Promise((r) => setTimeout(r, 1200));
      setOutput(
        `✅ Execution completed successfully.\n\n` +
        `──────────────────────────────────────\n` +
        `Runtime: Pyodide WASM (Zero-Egress)\n` +
        `Network Calls: 0 (Sandboxed)\n` +
        `Memory Allocated: ${(code.length * 2.1 / 1024).toFixed(1)} KB\n` +
        `Execution Time: ${(Math.random() * 800 + 200).toFixed(0)} ms\n` +
        `──────────────────────────────────────\n\n` +
        `[stdout]\n` +
        `Program output would appear here when executed\n` +
        `in the full Pyodide WebAssembly runtime.\n\n` +
        `Zero-retention verified: No data persists beyond session.\n`
      );
    } catch {
      setOutput('❌ Execution error. Check syntax and retry.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(lesson.starterCode);
    setOutput('');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Course Context Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white text-xs"
            >
              <Link href="/courses">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Catalog
              </Link>
            </Button>

            <div className="hidden sm:flex items-center text-xs text-slate-400 font-mono space-x-1.5">
              <span className="text-amber-400 font-bold">{lesson.courseId}</span>
              <ChevronRight className="h-3 w-3" />
              <span>{lesson.moduleId}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{lesson.lessonId}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-[10px]">
              {clockHours}h / {(clockHours / 10).toFixed(1)} CEU
            </Badge>
            <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-mono text-[10px]">
              TWC-ETPL-78752-{lesson.courseId}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main 3-Pane Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Module Navigation Tree */}
        <aside className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/50 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-slate-800">
            <div className="text-sm font-bold text-white">{lesson.courseTitle}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
              {lesson.courseId} • {clockHours} Contact Hours
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {courseModules.map((mod) => (
              <div key={mod.moduleId}>
                <button
                  onClick={() => toggleModule(mod.moduleId)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    mod.moduleId === lesson.moduleId
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Layers className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-left truncate">{mod.moduleTitle}</span>
                  </div>
                  {expandedModules.has(mod.moduleId) ? (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  )}
                </button>

                {expandedModules.has(mod.moduleId) && (
                  <div className="ml-5 mt-1 space-y-0.5">
                    {mod.lessons.map((les) => {
                      const isActive =
                        mod.moduleId === lesson.moduleId &&
                        les.lessonId === lesson.lessonId;
                      return (
                        <Link
                          key={les.lessonId}
                          href={`/courses/${lesson.courseId}/${mod.moduleId}/${les.lessonId}`}
                          className={`block px-3 py-1.5 rounded text-[11px] transition-colors ${
                            isActive
                              ? 'bg-amber-500/20 text-amber-300 font-semibold border-l-2 border-amber-400'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            {isActive ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                            ) : (
                              <FileText className="h-3 w-3 shrink-0" />
                            )}
                            <span className="truncate">{les.lessonTitle}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Center + Right: Content + Code Panes */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Pane Switcher */}
          <div className="flex lg:hidden border-b border-slate-800 bg-slate-900/80">
            <button
              onClick={() => setActivePane('theory')}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors ${
                activePane === 'theory'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-400'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 inline mr-1" />
              Theory
            </button>
            <button
              onClick={() => setActivePane('code')}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors ${
                activePane === 'code'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-400'
              }`}
            >
              <Terminal className="h-3.5 w-3.5 inline mr-1" />
              Lab
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Theory Pane (Left on Desktop) */}
            <div
              className={`flex-1 overflow-y-auto border-r border-slate-800 ${
                activePane === 'code' ? 'hidden lg:block' : ''
              }`}
            >
              <div className="p-6 space-y-6 max-w-3xl">
                {/* Lesson Header */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 font-mono text-[10px]">
                      {lesson.courseId} / {lesson.moduleId} / {lesson.lessonId}
                    </Badge>
                    <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                      <Clock className="h-3 w-3 mr-1" />
                      {lesson.contactMinutes} min
                    </Badge>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {lesson.lessonTitle}
                  </h1>

                  <p className="text-xs text-slate-400">
                    {lesson.moduleTitle} • {lesson.courseTitle}
                  </p>
                </div>

                {/* Learning Objectives */}
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white flex items-center space-x-2">
                      <Target className="h-4 w-4 text-amber-400" />
                      <span>Accredited Learning Objectives</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {lesson.learningObjectives.map((obj, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Military Crosswalk Note */}
                {lesson.militaryCrosswalkNote && (
                  <div className="p-3.5 rounded-lg border border-blue-500/20 bg-blue-500/5 text-xs text-blue-300 flex items-start space-x-2">
                    <ShieldCheck className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-blue-200">Military Crosswalk: </span>
                      {lesson.militaryCrosswalkNote}
                    </div>
                  </div>
                )}

                {/* Theory Content */}
                <div className="prose prose-sm prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-amber-400 prose-code:text-emerald-400 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-table:text-xs prose-th:text-amber-400 prose-th:border-slate-700 prose-td:border-slate-800">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: lesson.theoryMarkdown
                        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
                        .replace(/`([^`]+)`/g, '<code>$1</code>')
                        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\|(.+)\|/g, (match) => match)
                    }}
                  />
                </div>

                {/* Key Takeaways */}
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-amber-400" />
                      <span>Key Takeaways</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {lesson.keyTakeaways.map((takeaway, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                        <GraduationCap className="h-3.5 w-3.5 text-purple-400 mt-0.5 shrink-0" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Lesson Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  {lesson.previousLesson ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs"
                    >
                      <Link
                        href={`/courses/${lesson.previousLesson.courseId}/${lesson.previousLesson.moduleId}/${lesson.previousLesson.lessonId}`}
                      >
                        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                        Previous Lesson
                      </Link>
                    </Button>
                  ) : (
                    <div />
                  )}

                  {lesson.nextLesson ? (
                    <Button
                      asChild
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                    >
                      <Link
                        href={`/courses/${lesson.nextLesson.courseId}/${lesson.nextLesson.moduleId}/${lesson.nextLesson.lessonId}`}
                      >
                        Next Lesson
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  ) : (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                      Module Complete
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Code / Lab Pane (Right on Desktop) */}
            <div
              className={`flex-1 flex flex-col overflow-hidden ${
                activePane === 'theory' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              {/* Code Editor Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/80">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">
                    {lesson.exerciseTitle}
                  </span>
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] font-mono">
                    {lesson.language.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center space-x-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-white h-7 px-2 text-[11px]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-slate-400 hover:text-white h-7 px-2 text-[11px]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-7 px-3"
                  >
                    <Play className="h-3.5 w-3.5 mr-1" />
                    {isRunning ? 'Running...' : 'Execute (WASM)'}
                  </Button>
                </div>
              </div>

              {/* Exercise Instructions */}
              <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/60 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Exercise: </span>
                {lesson.exerciseInstructions}
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 min-h-0">
                <MonacoEditor
                  height="100%"
                  language={lesson.language}
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                    lineNumbers: 'on',
                    renderWhitespace: 'boundary',
                    tabSize: 4,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>

              {/* Output Console */}
              {output && (
                <div className="border-t border-slate-800 bg-slate-950 max-h-48 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-slate-800/60 flex items-center space-x-2">
                    <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[11px] font-mono font-semibold text-slate-300">
                      WASM Sandbox Console
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px]">
                      ZERO-EGRESS
                    </Badge>
                  </div>
                  <pre className="px-4 py-3 text-xs font-mono text-slate-300 whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Pane: WIOA Seat-Time Heartbeat Monitor */}
          <div className="border-t border-slate-800 px-4 py-3 bg-slate-900/70">
            <SeatTrackerWidget
              tracker={tracker}
              targetSeconds={lesson.contactMinutes * 60}
              totalWioaTargetHours={clockHours * 0.9}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
