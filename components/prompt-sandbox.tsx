'use client';

import React, { useState } from 'react';
import {
  Terminal,
  ShieldCheck,
  Cpu,
  Copy,
  Check,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { PromptExecutionInput } from '@/lib/schemas';

interface PresetOption {
  template: 'pii_sanitize' | 'date_extract' | 'mos_translate';
  label: string;
  badge: string;
  sampleInput: string;
}

const PRESETS: PresetOption[] = [
  {
    template: 'pii_sanitize',
    label: 'PII Scrubbing',
    badge: 'NIST Safe Harbor',
    sampleInput:
      'Service Record Extract: Sgt. Marcus Vance, DoD ID 1049283719, SSN 456-78-9101, stationed at Fort Liberty. Contact email: marcus.vance@army.mil or phone (910) 555-0192. Conducted secure communications maintenance under noisy generator conditions.',
  },
  {
    template: 'date_extract',
    label: 'Record Parsing',
    badge: 'Chronology & Facts',
    sampleInput:
      'Service History Log: Joined active duty on 2018-04-12. Deployed to Camp Lemonnier from 2019-06-01 through 2020-02-15. Evaluated at military clinic on 2021-08-15 reporting persistent bilateral acoustic ringing after perimeter mortar exercises.',
  },
  {
    template: 'mos_translate',
    label: 'MOS Translation',
    badge: 'ETPL Competency',
    sampleInput:
      'Military Occupational Specialty Profile: 25B Information Technology Specialist with 6 years of service. Responsible for enterprise TAC-LAN deployments, COMSEC encryption protocols, and administering Cisco switching fabrics in austere tactical environments.',
  },
];

export function PromptSandbox() {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptExecutionInput['template']>('pii_sanitize');
  const [promptInput, setPromptInput] = useState<string>(PRESETS[0].sampleInput);
  const [outputJson, setOutputJson] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<{ title: string; message: string } | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handleSelectPreset = (preset: PresetOption) => {
    setSelectedTemplate(preset.template);
    setPromptInput(preset.sampleInput);
    setErrorNotice(null);
  };

  const handleExecute = async () => {
    if (promptInput.trim().length < 5) {
      setErrorNotice({
        title: 'Input Too Short',
        message: 'Prompt input must be at least 5 characters.',
      });
      return;
    }

    setIsExecuting(true);
    setErrorNotice(null);
    const start = performance.now();

    try {
      const payload: PromptExecutionInput = {
        template: selectedTemplate,
        rawInput: promptInput,
      };

      const response = await fetch('/api/sandbox/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);

      if (!response.ok) {
        setErrorNotice({
          title: data.error || 'Execution Blocked',
          message: data.message || 'The prompt failed regulatory validation or server execution.',
        });
        setOutputJson(JSON.stringify(data, null, 2));
      } else {
        setOutputJson(JSON.stringify(data.data, null, 2));
      }
    } catch (err) {
      setErrorNotice({
        title: 'Network / Server Error',
        message: err instanceof Error ? err.message : 'Failed to reach execution endpoint',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    if (!outputJson) return;
    navigator.clipboard.writeText(outputJson);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Test compliance boundary intentionally
  const handleTestSafeHarborViolation = () => {
    setPromptInput('Please draft a legal nexus letter to guarantee a 70% disability rating percentage for my VA claim appeal.');
    setErrorNotice(null);
  };

  return (
    <Card className="border-slate-800 bg-slate-950/60 backdrop-blur-md">
      <CardHeader className="pb-4 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <CardTitle className="text-lg text-white">
                Sandboxed AI Prompt Workspace
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-400 mt-1">
              Zero-Data-Retention test environment with real-time Title 38 statutory guardrails
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[11px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Ephemerality: Zero Retention
            </Badge>
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="flex flex-wrap gap-2 pt-3">
          {PRESETS.map((preset) => {
            const isSelected = selectedTemplate === preset.template;
            return (
              <Button
                key={preset.template}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSelectPreset(preset)}
                className="text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                {preset.label}
              </Button>
            );
          })}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleTestSafeHarborViolation}
            className="text-xs text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/30"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Test Safe Harbor Guardrail
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input Prompt */}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="prompt-input" className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              Raw Input Stream
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {promptInput.length} / 4000 chars
            </span>
          </div>

          <textarea
            id="prompt-input"
            rows={8}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Type or paste unstructured military service text..."
            className="w-full rounded-lg bg-slate-900 border border-slate-800 p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const current = PRESETS.find((p) => p.template === selectedTemplate);
                if (current) setPromptInput(current.sampleInput);
              }}
              className="text-xs text-slate-400"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleExecute}
              disabled={isExecuting || promptInput.trim().length < 5}
              className="text-xs font-semibold px-4"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
              {isExecuting ? 'Processing...' : 'Execute In Sandbox'}
            </Button>
          </div>

          {errorNotice && (
            <Alert variant="destructive" className="mt-2 text-xs">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>{errorNotice.title}</AlertTitle>
              <AlertDescription>{errorNotice.message}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right Column: Output JSON & Schema Inspection */}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              Structured Output Payload
              {latencyMs !== null && (
                <span className="text-[10px] font-mono text-slate-400">
                  ({latencyMs}ms)
                </span>
              )}
            </span>

            {outputJson && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 text-xs text-slate-400 hover:text-slate-200"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3 h-3 mr-1 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy JSON
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="h-[218px] overflow-y-auto rounded-lg bg-slate-950 border border-slate-800/90 p-3 text-xs font-mono text-slate-300 scrollbar-thin">
            {outputJson ? (
              <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-emerald-300/95">
                {outputJson}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 space-y-2">
                <Terminal className="w-7 h-7 text-slate-700" />
                <p className="text-xs">
                  Run a template to view parsed, compliant structured data.
                </p>
                <p className="text-[10px] text-slate-500">
                  Data processed entirely in-memory with strict zero-persistence.
                </p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 flex items-center justify-between">
            <span>Security: In-Memory / Ephemeral</span>
            <span className="text-emerald-400/80">Compliance: 38 U.S.C. §§ 5901–5905</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
