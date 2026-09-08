'use client';

import React from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Lightbulb,
  ArrowRight,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { GradeReport } from '@/lib/lms/rubric-evaluator';

export interface AutomatedGradeReportProps {
  report: GradeReport;
  onRetry?: () => void;
  onContinue?: () => void;
}

export function AutomatedGradeReport({
  report,
  onRetry,
  onContinue,
}: AutomatedGradeReportProps) {
  const isPassing = report.passed;

  return (
    <div className="w-full flex flex-col border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          {/* Circular Score Gauge */}
          <div
            className={`h-20 w-20 rounded-full flex flex-col items-center justify-center border-4 font-mono font-bold shadow-lg ${
              isPassing
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-emerald-900/30'
                : 'border-rose-500 bg-rose-950/40 text-rose-300 shadow-rose-900/30'
            }`}
          >
            <span className="text-2xl leading-none">{report.scorePercentage}%</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">Score</span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {isPassing ? 'Lab Competency Verified' : 'Remediation Required'}
              </h3>
              <Badge
                variant={isPassing ? 'amber' : 'destructive'}
                className="text-xs px-2 py-0.5 font-semibold"
              >
                {isPassing ? 'PASSED (≥ 80% Benchmark)' : 'REVISION REQUIRED'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Dual-Agent Consensus Audit • NIST SP 800-171 Rev. 3 &amp; Title 38 Safe Harbor Verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Revise Solution
            </Button>
          )}
          {isPassing && onContinue && (
            <Button
              size="sm"
              onClick={onContinue}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-mono"
            >
              Next Lesson
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          )}
        </div>
      </div>

      {/* PII / CUI Breach Warning Banner if detected */}
      {report.piiLeakDetected && (
        <div className="p-4 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-xs text-rose-300">
              Defense PII / CUI Leakage Detected
            </h4>
            <p className="text-xs text-rose-300/90 leading-relaxed font-sans">
              Your submission contained unredacted military defense identifiers (SSN, 10-digit EDI-PI, tactical MGRS coordinates, or CUI markings). Under DoD Instruction 5200.48, all sensitive identifiers must be sanitized with standard redaction tokens before submission.
            </p>
          </div>
        </div>
      )}

      {/* Rubric Breakdown Criterion Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Evaluator Rubric Breakdown ({report.rubricBreakdown.length} Stages)
        </h4>

        <div className="grid grid-cols-1 gap-3">
          {report.rubricBreakdown.map((criterion, idx) => {
            const isFullCredit = criterion.pointsAwarded === criterion.maxPoints;
            const isPartial = criterion.pointsAwarded > 0 && !isFullCredit;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border transition-all ${
                  isFullCredit
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : isPartial
                    ? 'border-amber-500/30 bg-amber-950/10'
                    : 'border-rose-500/30 bg-rose-950/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {isFullCredit ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isPartial ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="font-semibold text-xs text-slate-100 font-sans">
                      {criterion.criterion}
                    </span>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-300 shrink-0">
                    {criterion.pointsAwarded} / {criterion.maxPoints} pts
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans pl-6 leading-relaxed">
                  {criterion.feedback}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Remediation Suggestions */}
      {report.remediationSuggestions.length > 0 && (
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400">
            <Lightbulb className="w-4 h-4" />
            <span>Remediation &amp; Optimization Recommendations</span>
          </div>

          <ul className="space-y-1.5 pl-6 list-disc text-xs text-slate-300 font-sans">
            {report.remediationSuggestions.map((sug, idx) => (
              <li key={idx} className="leading-relaxed">
                {sug}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Statutory & Evaluator Metadata Footer */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audit Stamp: {report.evaluatorMetadata.modelVerification}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Evaluated: {new Date(report.evaluatorMetadata.evaluatedAt).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
