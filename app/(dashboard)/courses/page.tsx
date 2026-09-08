import * as React from 'react';
import type { Metadata } from 'next';
import { CourseCatalogFilter } from '@/components/course-catalog-filter';

export const metadata: Metadata = {
  title: 'Accredited Curriculum Catalog | 10-Course Defense AI Tracks',
  description:
    'Explore 10 accredited defense and enterprise AI courses spanning 425 clock hours across Engineering, Security, and Operations tracks. Approved under TWC ETPL and DoD SkillBridge.',
};

export default function CoursesCatalogPage() {
  return (
    <div className="py-6">
      <CourseCatalogFilter />
    </div>
  );
}
