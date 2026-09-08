import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLessonContent, getCourseModules } from '@/lib/lesson-content-data';
import { INSTITUTIONAL_COURSES } from '@/lib/courses-data';
import { LessonProgressionClient } from './LessonProgressionClient';

interface PageProps {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseId, moduleId, lessonId } = await params;
  const lesson = getLessonContent(courseId, moduleId, lessonId);

  if (!lesson) {
    return { title: 'Lesson Not Found | VAAI' };
  }

  return {
    title: `${lesson.lessonTitle} | ${lesson.courseTitle}`,
    description: `VAAI accredited lesson: ${lesson.lessonTitle}. Part of ${lesson.courseTitle} (${lesson.courseId}). TWC ETPL #TWC-ETPL-78752-VAAI.`,
  };
}

export default async function CourseLessonPage({ params }: PageProps) {
  const { courseId, moduleId, lessonId } = await params;
  const lesson = getLessonContent(courseId, moduleId, lessonId);

  if (!lesson) {
    notFound();
  }

  const courseModules = getCourseModules(courseId);
  const course = INSTITUTIONAL_COURSES.find((c) => c.id === courseId);

  return (
    <LessonProgressionClient
      lesson={lesson}
      courseModules={courseModules}
      clockHours={course?.clockHours ?? 40}
    />
  );
}
