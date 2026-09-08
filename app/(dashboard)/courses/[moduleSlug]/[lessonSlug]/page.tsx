import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLesson, SYLLABUS_MODULES } from '@/lib/courses';
import { LabEditorClient } from './LabEditorClient';

interface PageProps {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleSlug, lessonSlug } = await params;
  const lessonData = getLesson(moduleSlug, lessonSlug);
  const title = lessonData?.title || 'Lesson';
  const moduleInfo = SYLLABUS_MODULES.find((m) => m.slug === moduleSlug);
  const moduleTitle = moduleInfo?.title || 'Applied AI Curriculum';

  return {
    title: `${title} | ${moduleTitle}`,
    description: `VAAI 40-hour veteran AI training module: ${title}. Accredited under Texas Workforce Commission ETPL # TWC-ETPL-78752-VAAI.`,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { moduleSlug, lessonSlug } = await params;
  const lessonData = getLesson(moduleSlug, lessonSlug);

  if (!lessonData) {
    notFound();
  }

  return (
    <LabEditorClient
      lesson={lessonData}
      syllabusModules={SYLLABUS_MODULES}
    />
  );
}
