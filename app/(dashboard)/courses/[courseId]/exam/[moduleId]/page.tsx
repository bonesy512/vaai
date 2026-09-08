import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Terminal, Shield, Award } from 'lucide-react';
import { getCourseById } from '@/lib/courses-data';
import { getModuleExam } from '@/lib/vaai-101-assessment-data';
import { ModuleExamCard } from '@/components/lms/module-exam-card';
import { CapstoneEvaluationRunner } from '@/components/lms/capstone-evaluation-runner';

interface ExamPageProps {
  params: Promise<{ courseId: string; moduleId: string }>;
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const { courseId, moduleId } = await params;
  const course = getCourseById(courseId);
  const isCapstone = moduleId.toLowerCase() === 'capstone';
  const exam = getModuleExam(moduleId);

  if (isCapstone) {
    return {
      title: `Capstone Defense & Evaluation | ${course?.title || courseId}`,
      description: `4-Dimension Automated WASM Defense Capstone Harness. TWC ETPL #TWC-ETPL-78752-VAAI-101.`,
    };
  }

  if (!exam) {
    return { title: 'Assessment Not Found | VAAI' };
  }

  return {
    title: `${exam.title} | ${course?.title || courseId}`,
    description: `Accredited defense doctrinal examination. Passing threshold: ${exam.passingScorePercentage}%.`,
  };
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { courseId, moduleId } = await params;
  const course = getCourseById(courseId);
  const isCapstone = moduleId.toLowerCase() === 'capstone';
  const exam = getModuleExam(moduleId);

  if (!isCapstone && !exam) {
    notFound();
  }

  // Determine next route on pass
  let nextRoute = `/courses/${courseId}`;
  if (moduleId === 'mod-1' || moduleId === 'M1') {
    nextRoute = `/courses/${courseId}/M2/L1`;
  } else if (moduleId === 'mod-2' || moduleId === 'M2') {
    nextRoute = `/courses/${courseId}/M3/L1`;
  } else if (moduleId === 'mod-3' || moduleId === 'M3') {
    nextRoute = `/courses/${courseId}/M4/L1`;
  } else if (moduleId === 'mod-4' || moduleId === 'M4') {
    nextRoute = `/courses/${courseId}/exam/capstone`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between font-mono text-xs text-slate-400 pb-2 border-b border-slate-900">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Course Overview</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-slate-600">ACCREDITATION:</span>
            <span className="text-emerald-400 font-semibold">TWC-ETPL-78752-VAAI-101</span>
          </div>
        </div>

        {/* Content Render */}
        {isCapstone ? (
          <CapstoneEvaluationRunner courseId={courseId} />
        ) : (
          exam && (
            <ModuleExamCard
              exam={exam}
              courseId={courseId}
              nextRoute={nextRoute}
            />
          )
        )}
      </div>
    </div>
  );
}
