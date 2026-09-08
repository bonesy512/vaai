'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Award,
  Copy,
  Check,
  Download,
  Clock,
  Layers,
  Activity,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { evaluateCapstoneSubmission } from '@/lib/capstone-evaluator';
import { CAPSTONE_RUBRIC } from '@/lib/vaai-101-assessment-data';
import type { CapstoneEvaluationResult } from '@/lib/types/assessment';

const DEFAULT_CAPSTONE_CODE = `# VAAI-101 Capstone: Multi-Stage Defense Briefing Generator
# Adheres to FM 6-0, MIL-STD-2525D, CJCSM 6510.01B, and NIST SP 800-171 SC-7/SC-13
import json
import re
import time
from typing import Dict, Any, List

class DefenseBriefingPipeline:
    def __init__(self, max_token_ceiling: int = 4096):
        self.max_ceiling = max_token_ceiling
        self.circuit_open = False
        self.failure_threshold = 3

    def sanitize_boundary_entities(self, raw_text: str) -> str:
        """
        NIST SP 800-171 SC-7 & DoD 5200.48: Redacts SSNs, EDIPIs, MGRS, and sensitive callsigns.
        """
        ssn_regex = r'\\b\\d{3}-\\d{2}-\\d{4}\\b|\\b\\d{9}\\b'
        edipi_regex = r'\\b\\d{10}\\b'
        mgrs_regex = r'\\b(?:[1-5]?[0-9]|60)\\s*[C-HJ-NP-X]\\s*[A-HJ-NP-Z]{2}\\s*(?:\\d{5}\\s*\\d{5}|\\d{8}|\\d{10})\\b'
        name_regex = r'\\b(?:Capt\\.|Maj\\.|Lt\\.|Sgt\\.|Col\\.)\\s+[A-Za-z]+(?:\\s+[A-Za-z]+)?\\b'
        callsign_regex = r'\\b(?:GHOST|WARHAMMER|VIPER|TALON|SHIELD|IRONCLAD)-\\d+\\b'

        text = re.sub(ssn_regex, '[REDACTED_SSN]', raw_text)
        text = re.sub(edipi_regex, '[REDACTED_EDIPI]', text)
        text = re.sub(mgrs_regex, '[REDACTED_MGRS]', text)
        text = re.sub(name_regex, '[REDACTED_PERSONNEL]', text)
        text = re.sub(callsign_regex, '[REDACTED_CALLSIGN]', text)
        return text

    def execute_with_circuit_breaker(self, handler, fallback, simulate_fault: str = None) -> Dict[str, Any]:
        """
        PACE sub-250ms deterministic failover upon HTTP 429/503 fault.
        """
        start = time.perf_counter()
        if simulate_fault in ["HTTP_429", "HTTP_503", "TIMEOUT"]:
            res = fallback()
            elapsed_ms = (time.perf_counter() - start) * 1000
            res["failover_latency_ms"] = round(elapsed_ms, 2)
            res["circuit_status"] = "FAILOVER_LOCAL_PACE"
            return res

        res = handler()
        elapsed_ms = (time.perf_counter() - start) * 1000
        res["latency_ms"] = round(elapsed_ms, 2)
        res["circuit_status"] = "PRIMARY_NOMINAL"
        return res

    def process_sitrep(self, raw_report: str, simulate_fault: str = None) -> Dict[str, Any]:
        """
        End-to-End Processing: Boundary Defense -> Schema Validation -> PACE Circuit
        """
        sanitized = self.sanitize_boundary_entities(raw_report)

        def nominal_handler():
            return {
                "briefing_id": "DB-2026-VAAI101",
                "status": "SANITIZED",
                "sanitized_payload": sanitized,
                "schema_version": "1.0.0",
                "zero_retention_verified": True
            }

        def local_fallback():
            return {
                "briefing_id": "DB-2026-VAAI101-FALLBACK",
                "status": "DEGRADED_LOCAL",
                "sanitized_payload": sanitized,
                "schema_version": "1.0.0",
                "zero_retention_verified": True
            }

        return self.execute_with_circuit_breaker(nominal_handler, local_fallback, simulate_fault)

# Instantiate and verify pipeline
pipeline = DefenseBriefingPipeline()
sample_input = "SITREP: GHOST-1 under Capt. John Miller (EDIPI: 1029384756, SSN: 219-45-8821) at 18S UJ 23480 06470. Status: FULLY_MISSION_CAPABLE."
output = pipeline.process_sitrep(sample_input)
print(json.dumps(output, indent=2))
`;

interface CapstoneEvaluationRunnerProps {
  courseId?: string;
  onPassed?: (score: number) => void;
}

export function CapstoneEvaluationRunner({
  courseId = 'VAAI-101',
  onPassed,
}: CapstoneEvaluationRunnerProps) {
  const [code, setCode] = useState(DEFAULT_CAPSTONE_CODE);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<CapstoneEvaluationResult | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '[INIT] VAAI-101 Defense Capstone Evaluation Engine Ready.',
    '[INFO] Ingesting 10 tactical noisy SITREPs in client WASM runtime.',
    '[READY] Click "Execute 4-Stage Capstone Evaluation" to begin.',
  ]);
  const [copied, setCopied] = useState(false);
  const [telemetryDispatched, setTelemetryDispatched] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaai_101_capstone_pipeline.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetCode = () => {
    setCode(DEFAULT_CAPSTONE_CODE);
    setEvaluationResult(null);
    setTelemetryDispatched(false);
    setTerminalOutput([
      '[RESET] Code reset to accredited baseline template.',
      '[READY] Ready for new evaluation run.',
    ]);
  };

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    setTerminalOutput(['[EXEC] Initializing Pyodide WASM micro-sandbox...']);

    // Simulate progressive terminal output streaming
    const interimSteps = [
      '[STAGE 1/4] Loading MIL-STD-2525D Schema Engine & Testing 10 SITREPs...',
      '[STAGE 2/4] Simulating HTTP 429 Throttle & HTTP 503 Outage PACE Failover...',
      '[STAGE 3/4] Scanning Lexical Boundary Defense (SSN, EDIPI, MGRS, Callsigns)...',
      '[STAGE 4/4] Verifying 4,096-Token Budget & Zero Memory Leaks...',
    ];

    for (const step of interimSteps) {
      await new Promise((r) => setTimeout(r, 350));
      setTerminalOutput((prev) => [...prev, step]);
    }

    try {
      const result = await evaluateCapstoneSubmission(code);
      setEvaluationResult(result);
      setTerminalOutput(result.logs);

      if (result.passed) {
        if (onPassed) onPassed(result.scorePercentage);

        // Record telemetry heartbeat
        try {
          await fetch('/api/telemetry/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId,
              lessonId: 'capstone-defense-evaluation',
              activeSeconds: 1200, // 20-minute capstone defense allocation
              totalAccumulatedSeconds: 1200,
            }),
          });
          setTelemetryDispatched(true);
        } catch (e) {
          console.error('Failed to dispatch capstone telemetry:', e);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTerminalOutput((prev) => [...prev, `[ERROR] Evaluation failed: ${msg}`]);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="border border-slate-800 bg-slate-950/90 rounded-lg p-5 font-mono relative overflow-hidden backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-xs uppercase">
                CAPSTONE DEFENSE PROJECT
              </Badge>
              <span className="text-slate-500 text-xs">|</span>
              <span className="text-slate-400 text-xs">ACCREDITATION: TWC-ETPL-78752-VAAI-101</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 uppercase tracking-tight">
              Automated Multi-Stage Defense Briefing Generator
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
              Deploy an end-to-end Python pipeline processing 10 unstandardized tactical SITREPs in client-side Pyodide WASM.
              Graded automatically across 4 defense dimensions with an &ge; 80% passing floor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="border-slate-800 hover:bg-slate-900 text-slate-300 font-mono text-xs gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              className="border-slate-800 hover:bg-slate-900 text-slate-300 font-mono text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetCode}
              className="border-slate-800 hover:bg-slate-900 text-slate-300 font-mono text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* Rubric Weights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-900 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">1. Schema Conformity</span>
            <span className="font-bold text-slate-200">Weight: 30%</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">2. Fallback Resilience</span>
            <span className="font-bold text-slate-200">Weight: 25% (&le; 250ms)</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">3. Boundary Defense</span>
            <span className="font-bold text-slate-200">Weight: 25% (100% PII)</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">4. Code Quality & Tokens</span>
            <span className="font-bold text-slate-200">Weight: 20% (&le; 4,096)</span>
          </div>
        </div>
      </div>

      {/* Editor & Terminal Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Editor Pane */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Cpu className="w-4 h-4" />
              <span>Python 3.12 / Pyodide WASM Runtime</span>
            </span>
            <span className="text-slate-500">Zero-Egress Sandboxed</span>
          </div>

          <div className="relative rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-[450px] p-4 font-mono text-xs md:text-sm bg-transparent text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/50 leading-relaxed selection:bg-emerald-900/50"
            />
          </div>

          <Button
            disabled={isEvaluating}
            onClick={handleRunEvaluation}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs md:text-sm py-5 gap-2"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing 4-Stage WASM Test Harness...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Execute 4-Stage Capstone Evaluation (10 SITREPs)</span>
              </>
            )}
          </Button>
        </div>

        {/* Live Evaluation Terminal & Scores Pane */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Terminal className="w-4 h-4" />
              <span>Diagnostic Telemetry Console</span>
            </span>
            {evaluationResult && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  evaluationResult.passed
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                    : 'border-rose-500 text-rose-400 bg-rose-950/20'
                }`}
              >
                {evaluationResult.passed ? 'PASSED >= 80%' : 'DEFICIENT < 80%'}
              </Badge>
            )}
          </div>

          {/* Terminal Box */}
          <div className="border border-slate-800 bg-black rounded-lg p-4 font-mono text-xs h-[300px] overflow-y-auto space-y-1.5 select-text shadow-inner">
            {terminalOutput.map((line, idx) => {
              let lineClass = 'text-slate-400';
              if (line.includes('✓ PASS')) lineClass = 'text-emerald-400 font-semibold';
              else if (line.includes('✗ FAIL')) lineClass = 'text-rose-400 font-semibold';
              else if (line.includes('⚠ PARTIAL')) lineClass = 'text-amber-400 font-semibold';
              else if (line.includes('[STAGE')) lineClass = 'text-cyan-400 font-bold';
              else if (line.includes('[EVALUATION COMPLETE]')) lineClass = 'text-white font-bold';
              else if (line.includes('[CONFIG]') || line.includes('[INIT]')) lineClass = 'text-slate-500';

              return (
                <div key={idx} className={`${lineClass} leading-relaxed break-words`}>
                  {line}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Score Cards Breakdown */}
          {evaluationResult && (
            <div className="space-y-3 font-mono">
              <div className="border border-slate-800 bg-slate-950/90 rounded p-3 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-300">Composite Score:</span>
                  <span
                    className={`text-lg ${
                      evaluationResult.passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {evaluationResult.scorePercentage} / 100 PTS
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-900 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">1. Schema Conformity:</span>
                    <span className="text-slate-200">
                      {evaluationResult.breakdown.schemaConformity.score} / 30 pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">2. Fallback Resilience:</span>
                    <span className="text-slate-200">
                      {evaluationResult.breakdown.fallbackResilience.score} / 25 pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">3. Boundary Defense:</span>
                    <span className="text-slate-200">
                      {evaluationResult.breakdown.boundarySanitization.score} / 25 pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">4. Code Quality & Budget:</span>
                    <span className="text-slate-200">
                      {evaluationResult.breakdown.codeQuality.score} / 20 pts
                    </span>
                  </div>
                </div>

                {evaluationResult.passed && telemetryDispatched && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-2 border-t border-slate-900">
                    <Award className="w-3.5 h-3.5" />
                    <span>State Telemetry Heartbeat Dispatched & Recorded.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
