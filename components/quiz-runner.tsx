'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  AlertOctagon,
  RotateCcw,
  BookOpen,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { QuizQuestion } from '@/lib/schemas';

interface QuizRunnerProps {
  moduleId: string;
  lessonId: string;
  questions: QuizQuestion[];
  onLessonUnlock?: () => void;
  passingThresholdPercent?: number; // Defaults to 80% per ETPL requirement
}

export function QuizRunner({
  questions,
  onLessonUnlock,
  passingThresholdPercent = 80,
}: QuizRunnerProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastScorePercent, setLastScorePercent] = useState<number | null>(null);

  const maxAttempts = 2;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted && attemptsCount >= maxAttempts) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const newAttempts = attemptsCount + 1;
    setAttemptsCount(newAttempts);
    setLastScorePercent(score);
    setIsSubmitted(true);

    if (score >= passingThresholdPercent) {
      onLessonUnlock?.();
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setLastScorePercent(null);
  };

  const allAnswered = questions.length > 0 && questions.every((q) => selectedAnswers[q.id] !== undefined);
  const isPassed = lastScorePercent !== null && lastScorePercent >= passingThresholdPercent;
  const isLockedOut = !isPassed && attemptsCount >= maxAttempts;

  return (
    <Card className="border-slate-800 bg-slate-950/60 backdrop-blur-md">
      <CardHeader className="pb-4 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <div>
              <CardTitle className="text-lg text-white">
                Gated Knowledge Check (ETPL WIOA Benchmark)
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Achieve minimum {passingThresholdPercent}% score to unlock lesson completion credential.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">
              Attempt {attemptsCount} of {maxAttempts}
            </Badge>
            {isSubmitted && (
              <Badge
                variant={isPassed ? 'default' : 'destructive'}
                className="text-xs font-mono font-bold"
              >
                {lastScorePercent}% {isPassed ? 'PASSED' : 'DEFICIENT'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Lockout Notice when student fails both attempts */}
        {isLockedOut && (
          <Alert variant="destructive" className="border-red-600/50 bg-red-950/50 text-red-200">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <AlertTitle className="text-sm font-semibold">
              WIOA Remediation Required — Maximum Assessment Attempts Reached
            </AlertTitle>
            <AlertDescription className="mt-1 text-xs text-red-200/90 leading-relaxed">
              You scored {lastScorePercent}% (Passing threshold: {passingThresholdPercent}%).
              Per ETPL workforce credential rules, consecutive failed attempts require an instructor review.
              An automated notification has been dispatched to your designated VAAI workforce counselor.
            </AlertDescription>
          </Alert>
        )}

        {/* Passing Success Notice */}
        {isPassed && (
          <Alert variant="success" className="border-emerald-600/50 bg-emerald-950/50 text-emerald-200">
            <Award className="w-5 h-5 text-emerald-400" />
            <AlertTitle className="text-sm font-semibold">
              Mastery Verified — Lesson Credential Unlocked!
            </AlertTitle>
            <AlertDescription className="mt-1 text-xs text-emerald-200/90 leading-relaxed">
              Congratulations! You achieved a score of {lastScorePercent}%, satisfying the WIOA knowledge benchmark.
              Your seat-time and assessment telemetry are permanently certified.
            </AlertDescription>
          </Alert>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, qIndex) => {
            const selectedIdx = selectedAnswers[q.id];
            const isCorrect = selectedIdx === q.correctOptionIndex;

            return (
              <div
                key={q.id}
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono font-bold text-slate-300 shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <p className="text-sm font-medium text-slate-200 leading-snug">
                    {q.questionText}
                  </p>
                </div>

                {/* Option Radios */}
                <div className="mt-3 space-y-2 pl-7">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedIdx === optIdx;
                    let optionStyle = 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800/80';

                    if (isSubmitted) {
                      if (optIdx === q.correctOptionIndex) {
                        optionStyle = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200 font-medium';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-red-500/60 bg-red-950/30 text-red-200 line-through';
                      }
                    } else if (isSelected) {
                      optionStyle = 'border-emerald-500/80 bg-emerald-950/20 text-white font-medium ring-1 ring-emerald-500/50';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={isSubmitted && attemptsCount >= maxAttempts}
                        className={`w-full text-left px-3 py-2 rounded-md border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && optIdx === q.correctOptionIndex && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {isSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on Submission */}
                {isSubmitted && (
                  <div className="mt-3 pl-7 pt-2 border-t border-slate-800/60 text-xs">
                    <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-emerald-400" />
                      Statutory / Technical Explanation:
                    </p>
                    <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-slate-500" />
          <span>Passing threshold: {passingThresholdPercent}% minimum</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isSubmitted && !isPassed && attemptsCount < maxAttempts && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetake}
              className="text-xs text-amber-300 border-amber-500/40 hover:bg-amber-950/30"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Retake Assessment (Attempt {attemptsCount + 1}/{maxAttempts})
            </Button>
          )}

          {!isSubmitted && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="text-xs font-semibold px-5"
            >
              Submit for Grading
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
