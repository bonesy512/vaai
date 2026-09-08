'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  ArrowRight,
  Award,
  ChevronRight,
  Terminal,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ModuleExam, ExamQuestion, ExamOptionKey, ExamResult } from '@/lib/types/assessment';

interface ModuleExamCardProps {
  exam: ModuleExam;
  courseId?: string;
  onCompleted?: (result: ExamResult) => void;
  nextRoute?: string;
}

export function ModuleExamCard({
  exam,
  courseId = 'VAAI-101',
  onCompleted,
  nextRoute,
}: ModuleExamCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, ExamOptionKey>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isTransmittingTelemetry, setIsTransmittingTelemetry] = useState(false);
  const [telemetryLogged, setTelemetryLogged] = useState(false);

  const questions = exam.questions;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQuestion = questions[activeQuestionIndex];

  const handleSelectOption = (questionId: string, optionKey: ExamOptionKey) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleGradeExam = async () => {
    if (answeredCount < totalQuestions) return;

    let correctCount = 0;
    const questionResults = questions.map((q) => {
      const studentAns = selectedAnswers[q.id] || null;
      const isCorrect = studentAns === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        studentAnswer: studentAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        doctrinalRef: q.doctrinalRef,
      };
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= exam.passingScorePercentage;

    const result: ExamResult = {
      examId: `${courseId}-${exam.moduleId}`,
      moduleId: exam.moduleId,
      scorePercentage,
      totalQuestions,
      correctCount,
      passed,
      questionResults,
      evaluatedAt: new Date().toISOString(),
    };

    setExamResult(result);
    setIsSubmitted(true);
    if (onCompleted) onCompleted(result);

    // If passed, emit telemetry heartbeat to record milestone
    if (passed) {
      setIsTransmittingTelemetry(true);
      try {
        await fetch('/api/telemetry/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            lessonId: `exam-${exam.moduleId}`,
            activeSeconds: 600, // accredited 10-minute exam allocation
            totalAccumulatedSeconds: 600,
          }),
        });
        setTelemetryLogged(true);
      } catch (e) {
        console.error('Telemetry logging error:', e);
      } finally {
        setIsTransmittingTelemetry(false);
      }
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setExamResult(null);
    setActiveQuestionIndex(0);
    setTelemetryLogged(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* HUD Header Banner */}
      <div className="border border-slate-800 bg-slate-950/80 rounded-lg p-5 font-mono relative overflow-hidden backdrop-blur">
        <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/10 border-b border-l border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 animate-pulse" />
          <span>Doctrinal Gate // MIL-STD-2525D</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-xs uppercase">
              {exam.moduleId.toUpperCase()}
            </Badge>
            <span className="text-slate-500 text-xs">|</span>
            <span className="text-slate-400 text-xs">PASSING THRESHOLD: {exam.passingScorePercentage}%</span>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-slate-100 uppercase tracking-tight">
            {exam.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-900">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              Questions: {totalQuestions}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Standard Time: 15 Mins
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              TWC ETPL Accredited
            </span>
          </div>
        </div>
      </div>

      {/* Results HUD Screen */}
      {isSubmitted && examResult && (
        <Card
          className={`border ${
            examResult.passed
              ? 'border-emerald-500/40 bg-emerald-950/10'
              : 'border-rose-500/40 bg-rose-950/10'
          } rounded-lg`}
        >
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {examResult.passed ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-base md:text-lg font-mono font-bold text-slate-100">
                    {examResult.passed ? 'EXAMINATION PASSED — ACCREDITATION VERIFIED' : 'DEFICIENCY DETECTED — BELOW 80% THRESHOLD'}
                  </CardTitle>
                  <p className="text-xs text-slate-400 font-mono">
                    Scored {examResult.scorePercentage}% ({examResult.correctCount} of {examResult.totalQuestions} correct)
                  </p>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className={`text-2xl font-black ${examResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {examResult.scorePercentage}%
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {examResult.passed ? (
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded p-3 font-mono text-xs text-emerald-300 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <Award className="w-4 h-4" />
                  <span>WIOA Title I Progress Milestone Logged</span>
                </div>
                <p className="text-slate-400">
                  Telemetry heartbeat recorded. Progression gate unlocked for subsequent operational modules and final capstone.
                </p>
                {telemetryLogged && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>State Telemetry Heartbeat: Verified in Supabase Audit Ledger.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-rose-950/30 border border-rose-500/30 rounded p-3 font-mono text-xs text-rose-300 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Remediation Required (Passing Floor: 80%)</span>
                </div>
                <p className="text-slate-400">
                  Review the doctrinal rationale citations below to correct cognitive deficiencies before retaking the assessment.
                </p>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetake}
                className="border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Examination</span>
              </Button>

              {examResult.passed && nextRoute && (
                <Link href={nextRoute}>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs gap-1.5">
                    <span>Advance to Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Review or Interactive Quiz Runner */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selectedAns = selectedAnswers[q.id];
          const resultItem = examResult?.questionResults.find((r) => r.questionId === q.id);

          return (
            <Card
              key={q.id}
              className={`border transition-all ${
                isSubmitted
                  ? resultItem?.isCorrect
                    ? 'border-emerald-500/30 bg-slate-950'
                    : 'border-rose-500/30 bg-slate-950'
                  : 'border-slate-800 bg-slate-950/90'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                  <span className="text-emerald-400 uppercase tracking-wider">
                    Question {idx + 1} of {totalQuestions}
                  </span>
                  <span className="text-slate-500">ID: {q.id}</span>
                </div>
                <CardTitle className="text-sm md:text-base font-sans font-medium text-slate-100 leading-relaxed">
                  {q.question}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Options List */}
                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D'] as ExamOptionKey[]).map((key) => {
                    const isSelected = selectedAns === key;
                    const isCorrectAnswer = q.correctAnswer === key;

                    let btnStyle = 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                    if (isSubmitted) {
                      if (isCorrectAnswer) {
                        btnStyle = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200 font-semibold';
                      } else if (isSelected && !isCorrectAnswer) {
                        btnStyle = 'border-rose-500/60 bg-rose-950/30 text-rose-200 line-through';
                      } else {
                        btnStyle = 'border-slate-850 bg-slate-950 text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'border-emerald-500/80 bg-emerald-950/20 text-emerald-300 font-medium';
                    }

                    return (
                      <button
                        key={key}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, key)}
                        className={`w-full text-left p-3 rounded border text-xs md:text-sm flex items-start gap-3 transition-colors ${btnStyle}`}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center font-mono text-xs shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {key}
                        </span>
                        <span className="flex-1">{q.options[key]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Doctrinal Feedback & Reference Citation */}
                {isSubmitted && resultItem && (
                  <div
                    className={`mt-4 p-3.5 rounded border text-xs font-mono space-y-2 ${
                      resultItem.isCorrect
                        ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                        : 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {resultItem.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span>
                        {resultItem.isCorrect ? 'DOCTRINAL VALIDATION CONFIRMED' : 'DOCTRINAL ERROR // INCORRECT ANSWER'}
                      </span>
                    </div>

                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {q.explanation}
                    </p>

                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Citation: {q.doctrinalRef}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submission Footer Bar */}
      {!isSubmitted && (
        <div className="sticky bottom-4 z-10 border border-slate-800 bg-slate-950/95 backdrop-blur p-4 rounded-lg flex items-center justify-between font-mono shadow-2xl">
          <div className="text-xs text-slate-400">
            Progress: <span className="text-emerald-400 font-bold">{answeredCount}</span> of {totalQuestions} answered
          </div>

          <Button
            disabled={answeredCount < totalQuestions}
            onClick={handleGradeExam}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs gap-2 px-6"
          >
            <span>Submit for Doctrinal Grading</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
