import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/lib/courses-data';
import { CourseDetailView } from '@/components/lms/course-detail-view';
import { CourseProgressionTree } from '@/components/lms/course-progression-tree';

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    return { title: 'Course Not Found | VAAI' };
  }

  return {
    title: `${course.id}: ${course.title} | Accredited Defense AI`,
    description: `${course.description} TWC ETPL #TWC-ETPL-78752-VAAI-101 | ${course.clockHours} Clock Hours | ${course.ceuValue} CEUs.`,
  };
}

export default async function CourseOverviewPage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Course Overview & Curriculum Details */}
      <CourseDetailView course={course} />

      {/* Interactive Progression Tree */}
      <div className="pt-6 border-t border-slate-800">
        <CourseProgressionTree courseId={course.id} />
      </div>
    </div>
  );
}
