'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Play,
  Sparkles,
  RotateCcw,
  Terminal,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code2,
  FileCheck,
  Maximize2,
  Minimize2,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SandboxRuntime, LAB_PRESETS, type ExecutionResult } from '@/lib/lms/sandbox-runtime';

// Dynamically load Monaco Editor on client side only
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[350px] bg-slate-950 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
        <Code2 className="w-6 h-6 animate-pulse mb-2 text-emerald-400" />
        <span>Initializing In-Browser Monaco IDE...</span>
      </div>
    ),
  }
);

export interface InteractiveLabWorkspaceProps {
  initialCode?: string;
  initialLanguage?: 'python' | 'javascript' | 'json';
  activePresetId?: string;
  lessonId: string;
  onExecutionComplete?: (result: ExecutionResult) => void;
  onSubmitForGrading?: (
    code: string,
    language: 'python' | 'javascript' | 'json',
    outputLog: string
  ) => void;
  isGrading?: boolean;
}

export function InteractiveLabWorkspace({
  initialCode,
  initialLanguage = 'python',
  activePresetId = 'pii-scrubber',
  lessonId,
  onExecutionComplete,
  onSubmitForGrading,
  isGrading = false,
}: InteractiveLabWorkspaceProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>(activePresetId);
  const preset = LAB_PRESETS[selectedPreset] || LAB_PRESETS['pii-scrubber'];

  const [language, setLanguage] = useState<'python' | 'javascript' | 'json'>(
    initialLanguage || preset.language
  );
  const [code, setCode] = useState<string>(initialCode || preset.initialCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'terminal' | 'schema' | 'sample'>('terminal');
  const [copied, setCopied] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Sync when selected preset changes
  useEffect(() => {
    if (LAB_PRESETS[selectedPreset]) {
      const p = LAB_PRESETS[selectedPreset];
      setLanguage(p.language);
      setCode(p.initialCode);
      setLastResult(null);
    }
  }, [selectedPreset]);

  // Execute client-side script
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const result = await SandboxRuntime.execute(code, language);
      setLastResult(result);
      if (onExecutionComplete) {
        onExecutionComplete(result);
      }
      setTimeout(() => {
        terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setLastResult({
        success: false,
        stdout: [],
        stderr: [message],
        executionTimeMs: 0,
        error: message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Reset to original preset
  const handleResetCode = () => {
    const p = LAB_PRESETS[selectedPreset];
    if (p) {
      setCode(p.initialCode);
      setLastResult(null);
    }
  };

  // Submit to automated grading pipeline
  const handleSubmitGrading = () => {
    if (onSubmitForGrading) {
      const outputLog = lastResult
        ? [...lastResult.stdout, ...lastResult.stderr].join('\n')
        : '';
      onSubmitForGrading(code, language, outputLog);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-xl">
      {/* Top Workspace Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">VAAI Lab Sandbox</span>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="preset-select" className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Preset:
            </label>
            <select
              id="preset-select"
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1 font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="pii-scrubber">Lab 1: PII/CUI Sanitizer (Python)</option>
              <option value="mos-translator">Lab 2: MOS to SOC Crosswalk (Python)</option>
              <option value="wioa-webhook">Lab 3: WIOA Webhook (JavaScript)</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-[11px] text-slate-400 font-mono">Lang:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'python' | 'javascript' | 'json')}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1 font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="python">Python 3 (Pyodide WASM)</option>
              <option value="javascript">JavaScript (Isolated)</option>
              <option value="json">JSON Schema</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyCode}
            className="h-8 px-2.5 text-xs text-slate-400 hover:text-white"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleResetCode}
            className="h-8 px-2.5 text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
            title="Reset to Starter Template"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>

          <Button
            size="sm"
            onClick={handleRunCode}
            disabled={isRunning}
            className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-medium shadow-sm shadow-emerald-950/40"
          >
            <Play className={`w-3.5 h-3.5 mr-1.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Executing...' : 'Run Code (WASM)'}
          </Button>

          <Button
            size="sm"
            onClick={handleSubmitGrading}
            disabled={isGrading}
            className="h-8 px-3 text-xs bg-amber-600 hover:bg-amber-500 text-white font-mono font-medium shadow-sm shadow-amber-950/40"
          >
            <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isGrading ? 'animate-spin' : ''}`} />
            {isGrading ? 'Grading...' : 'Grade Lab'}
          </Button>
        </div>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left Pane: Code Editor */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-slate-950">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>solution.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'json'}</span>
            </span>
            <span className="text-slate-500">Client Sandbox • Zero Remote Risk</span>
          </div>

          <div className="flex-1 w-full min-h-[380px] relative">
            <MonacoEditor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Menlo, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        </div>

        {/* Right Pane: Live Terminal & Schema Inspector */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900/90">
          {/* Sub-tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-2">
            <div className="flex items-center">
              <button
                onClick={() => setActiveRightTab('terminal')}
                className={`px-3 py-2 text-xs font-mono border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeRightTab === 'terminal'
                    ? 'border-emerald-400 text-emerald-300 font-semibold bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Live Terminal
              </button>
              {preset.sampleInput && (
                <button
                  onClick={() => setActiveRightTab('sample')}
                  className={`px-3 py-2 text-xs font-mono border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeRightTab === 'sample'
                      ? 'border-emerald-400 text-emerald-300 font-semibold bg-slate-900/50'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  Test Input
                </button>
              )}
            </div>

            {lastResult && (
              <div className="flex items-center gap-2 pr-2">
                <Badge
                  variant={lastResult.success ? 'default' : 'destructive'}
                  className="text-[10px] py-0 px-1.5"
                >
                  {lastResult.success ? 'EXIT 0' : 'ERROR'}
                </Badge>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {lastResult.executionTimeMs}ms
                </span>
              </div>
            )}
          </div>

          {/* Right Pane Content */}
          <div className="flex-1 p-3 overflow-y-auto font-mono text-xs max-h-[440px] text-slate-300 bg-slate-950/40">
            {activeRightTab === 'terminal' && (
              <div>
                {!lastResult ? (
                  <div className="h-full py-16 flex flex-col items-center justify-center text-center text-slate-500">
                    <Terminal className="w-8 h-8 mb-2 stroke-1 text-slate-600" />
                    <p className="font-semibold text-slate-400 text-xs">Ready for Execution</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                      Click &quot;Run Code&quot; above to execute the script in your local browser sandbox without API quotas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {lastResult.stdout.length > 0 && (
                      <div className="space-y-1">
                        {lastResult.stdout.map((line, idx) => (
                          <div
                            key={idx}
                            className={`whitespace-pre-wrap leading-relaxed ${
                              line.startsWith('[RESULT]') || line.startsWith('[SUCCESS]')
                                ? 'text-emerald-300 font-semibold'
                                : line.startsWith('[INIT]') || line.startsWith('[INSPECT]')
                                ? 'text-sky-300'
                                : line.startsWith('[WARN]')
                                ? 'text-amber-300'
                                : 'text-slate-300'
                            }`}
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    )}

                    {lastResult.stderr.length > 0 && (
                      <div className="p-2.5 rounded bg-rose-950/40 border border-rose-900/50 text-rose-300 space-y-1 mt-2">
                        <div className="flex items-center gap-1.5 font-semibold text-rose-400 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Execution Error:</span>
                        </div>
                        {lastResult.stderr.map((errLine, idx) => (
                          <div key={idx} className="whitespace-pre-wrap text-[11px]">
                            {errLine}
                          </div>
                        ))}
                      </div>
                    )}
                    <div ref={terminalBottomRef} />
                  </div>
                )}
              </div>
            )}

            {activeRightTab === 'sample' && preset.sampleInput && (
              <div className="space-y-2">
                <div className="text-[11px] text-slate-400">
                  Sample JSON test fixture passed to your script:
                </div>
                <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] overflow-x-auto whitespace-pre">
                  {preset.sampleInput}
                </pre>
              </div>
            )}
          </div>

          {/* Description Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
            <p className="font-sans text-[11px] leading-relaxed">
              <strong className="text-slate-300">{preset.title}:</strong> {preset.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
