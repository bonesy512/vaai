'use client';

import * as React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Search,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { INSTITUTIONAL_COURSES } from '@/lib/courses-data';
import type { Course, TrackType } from '@/lib/types/course';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const COURSE_CREDENTIALS: Record<string, string> = {
  'VAAI-101': 'Certified Applied AI Operator (CAIO) Level 1',
  'VAAI-201': 'Autonomous Systems & Agentic Workflow Engineer',
  'VAAI-202': 'Edge AI & GovCloud Security Specialist',
  'VAAI-203': 'Defense Knowledge Graph & RAG Architect',
  'VAAI-301': 'Domain Model Adaptation & Fine-Tuning Engineer',
  'VAAI-302': 'ISR Multimodal Systems & Computer Vision Engineer',
  'VAAI-303': 'GovCloud CUI & Compliance Operations Manager',
  'VAAI-401': 'Adversarial AI Red Team Specialist',
  'VAAI-402': 'Defense C4ISR AI Systems Architect',
  'VAAI-403': 'GovCon AI Capture & Proposal Automation Specialist',
};

export const SOC_DESCRIPTIONS: Record<string, string> = {
  '15-1299.08': 'Computer Systems Engineers/Architects (AI Specialists)',
  '15-1252.00': 'Software Developers (Agentic & ISR Systems)',
  '15-1212.00': 'Information Security Analysts (Cyber Defense & Red Teaming)',
  '15-2051.01': 'Data Scientists (Domain Model Adaptation & LoRA)',
  '11-1021.00': 'General & Operations Managers (GovCloud & Compliance)',
  '13-1020.00': 'Buyers & Cost Estimators (Defense AI Capture & RFPs)',
};

export function getTwcProgramCode(courseId: string): string {
  return `TWC-ETPL-78752-${courseId}`;
}

export function getTelemetryFloorHours(clockHours: number): number {
  return Number((clockHours * 0.9).toFixed(1));
}

export function getTelemetryFloorSeconds(clockHours: number): number {
  return Math.round(clockHours * 0.9 * 3600);
}

interface CourseProgramTableProps {
  courses?: Course[];
  selectedCourseId?: string;
  onSelectCourse?: (courseId: string) => void;
  interactive?: boolean;
}

export function CourseProgramTable({
  courses = INSTITUTIONAL_COURSES,
  selectedCourseId,
  onSelectCourse,
  interactive = true,
}: CourseProgramTableProps) {
  const [trackFilter, setTrackFilter] = React.useState<'all' | TrackType>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCourses = React.useMemo(() => {
    return courses.filter((c) => {
      const matchesTrack = trackFilter === 'all' || c.track === trackFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.socCode.toLowerCase().includes(q) ||
        getTwcProgramCode(c.id).toLowerCase().includes(q);
      return matchesTrack && matchesQuery;
    });
  }, [courses, trackFilter, searchQuery]);

  const totalFilteredClockHours = filteredCourses.reduce((sum, c) => sum + c.clockHours, 0);
  const totalFilteredCeus = filteredCourses.reduce((sum, c) => sum + c.ceuValue, 0);
  const totalFilteredVouchers = filteredCourses.reduce((sum, c) => sum + c.pricing.etplVoucherPrice, 0);
  const totalFilteredTelemetryFloor = filteredCourses.reduce((sum, c) => sum + getTelemetryFloorHours(c.clockHours), 0);

  const totalAllHours = courses.reduce((sum, c) => sum + c.clockHours, 0);
  const totalAllCeus = courses.reduce((sum, c) => sum + c.ceuValue, 0);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Filter & Search (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        {/* Track Filter Tabs */}
        <div className="flex items-center space-x-1 rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
          <Button
            type="button"
            variant={trackFilter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTrackFilter('all')}
            className="h-7 px-2.5 text-xs"
          >
            All Tracks ({courses.length} / {totalAllHours}h)
          </Button>
          <Button
            type="button"
            variant={trackFilter === 'engineering' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTrackFilter('engineering')}
            className="h-7 px-2.5 text-xs text-sky-400"
          >
            Engineering (5 / 220h)
          </Button>
          <Button
            type="button"
            variant={trackFilter === 'security' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTrackFilter('security')}
            className="h-7 px-2.5 text-xs text-emerald-400"
          >
            Cyber Defense (3 / 130h)
          </Button>
          <Button
            type="button"
            variant={trackFilter === 'operations' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTrackFilter('operations')}
            className="h-7 px-2.5 text-xs text-amber-400"
          >
            Operations &amp; GovCon (2 / 75h)
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search code, title, SOC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-800 bg-slate-900/90 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Regulatory Table Container */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/40 print:border-black print:bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 print:border-black bg-slate-950/90 print:bg-slate-100 font-semibold text-slate-200 print:text-black">
            <tr>
              <th className="p-3 w-16">Program ID</th>
              <th className="p-3">State Program Code &amp; Title</th>
              <th className="p-3">Track / Level</th>
              <th className="p-3">Primary O*NET SOC</th>
              <th className="p-3 text-center">Clock Hours &amp; CEU</th>
              <th className="p-3 text-center">Active Telemetry (&ge;90%)</th>
              <th className="p-3 text-right">Max Voucher (ITA)</th>
              {interactive && <th className="p-3 text-center print:hidden">Audit Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 print:divide-slate-200 text-slate-300 print:text-black">
            {filteredCourses.map((course) => {
              const isSelected = selectedCourseId === course.id;
              const floorHours = getTelemetryFloorHours(course.clockHours);
              const floorSeconds = getTelemetryFloorSeconds(course.clockHours);
              const twcCode = getTwcProgramCode(course.id);
              const socDesc = SOC_DESCRIPTIONS[course.socCode] || 'Advanced STEM Specialty';
              const exitCred = COURSE_CREDENTIALS[course.id] || 'OpenBadges v3.0 Digital Assertion';

              return (
                <tr
                  key={course.id}
                  onClick={() => interactive && onSelectCourse?.(course.id)}
                  className={`transition-colors ${
                    interactive ? 'cursor-pointer hover:bg-slate-800/50 print:hover:bg-transparent' : ''
                  } ${isSelected ? 'bg-amber-950/20 border-l-2 border-amber-500' : ''}`}
                >
                  {/* Course ID */}
                  <td className="p-3 font-mono font-bold text-amber-400 print:text-black whitespace-nowrap">
                    {course.id}
                  </td>

                  {/* Title & Program Code */}
                  <td className="p-3">
                    <div className="font-semibold text-white print:text-black flex items-center gap-1.5">
                      {course.title}
                      {isSelected && (
                        <span className="inline-flex items-center text-[10px] font-mono text-amber-400 print:hidden font-normal">
                          (Auditing)
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 font-mono text-[10px] text-slate-400 print:text-slate-700">
                      <span className="text-amber-500/90 font-semibold">{twcCode}</span>
                      <span>•</span>
                      <span className="text-slate-400 truncate max-w-xs">{exitCred}</span>
                    </div>
                  </td>

                  {/* Track & Level */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-mono ${
                          course.track === 'engineering'
                            ? 'border-sky-500/40 text-sky-400 print:border-black print:text-black'
                            : course.track === 'security'
                            ? 'border-emerald-500/40 text-emerald-400 print:border-black print:text-black'
                            : 'border-amber-500/40 text-amber-400 print:border-black print:text-black'
                        }`}
                      >
                        {course.track}
                      </Badge>
                      <span className="text-[11px] font-mono text-slate-400 print:text-black">
                        L{course.level}
                      </span>
                    </div>
                  </td>

                  {/* SOC Code */}
                  <td className="p-3">
                    <div className="font-mono font-bold text-emerald-400 print:text-black">
                      {course.socCode}
                    </div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600 line-clamp-1">
                      {socDesc}
                    </div>
                  </td>

                  {/* Clock Hours & CEUs */}
                  <td className="p-3 text-center whitespace-nowrap font-mono">
                    <div className="font-bold text-white print:text-black">
                      {course.clockHours}h
                    </div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600">
                      {course.ceuValue.toFixed(1)} CEU
                    </div>
                  </td>

                  {/* Verified Active Telemetry Floor */}
                  <td className="p-3 text-center whitespace-nowrap font-mono">
                    <div className="font-semibold text-emerald-400 print:text-black">
                      &ge; {floorHours.toFixed(1)}h
                    </div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600">
                      {floorSeconds.toLocaleString()}s
                    </div>
                  </td>

                  {/* Max WIOA Voucher Price */}
                  <td className="p-3 text-right whitespace-nowrap font-mono">
                    <div className="font-bold text-amber-400 print:text-black text-sm">
                      ${course.pricing.etplVoucherPrice.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 print:text-slate-600">
                      ITA Approved
                    </div>
                  </td>

                  {/* Interactive Audit Action */}
                  {interactive && (
                    <td className="p-3 text-center print:hidden whitespace-nowrap">
                      <Button
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCourse?.(course.id);
                        }}
                        className={`h-6 px-2 text-[11px] font-mono ${
                          isSelected
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                            : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'Auditing' : 'Audit'}
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={interactive ? 8 : 7} className="p-8 text-center text-slate-400">
                  No state-accredited programs found matching current filters.
                </td>
              </tr>
            )}

            {/* Portfolio Summary & Totals Row */}
            <tr className="bg-slate-950/90 print:bg-slate-100 font-bold border-t-2 border-slate-700 print:border-black text-white print:text-black">
              <td className="p-3 font-mono text-amber-400 print:text-black">
                TOTALS
              </td>
              <td className="p-3">
                <div className="uppercase tracking-wider">
                  Accredited Program Portfolio ({filteredCourses.length} of {courses.length} Programs)
                </div>
                <div className="text-[10px] font-mono text-slate-400 print:text-slate-600 font-normal">
                  Provider Code: TWC-ETPL-78752-VAAI • Local Workforce Board #14
                </div>
              </td>
              <td className="p-3 font-mono text-xs text-slate-400 print:text-black">
                {trackFilter === 'all' ? '3 Tracks' : `${trackFilter.toUpperCase()} TRACK`}
              </td>
              <td className="p-3 font-mono text-[11px] text-slate-400 print:text-black">
                6 BLS SOC Crosswalks
              </td>
              <td className="p-3 text-center font-mono text-amber-400 print:text-black">
                <div>{totalFilteredClockHours.toFixed(1)}h</div>
                <div className="text-[10px] text-slate-400 print:text-slate-600 font-normal">
                  {totalFilteredCeus.toFixed(1)} CEU
                </div>
              </td>
              <td className="p-3 text-center font-mono text-emerald-400 print:text-black">
                <div>&ge; {totalFilteredTelemetryFloor.toFixed(1)}h</div>
                <div className="text-[10px] text-slate-400 print:text-slate-600 font-normal">
                  &ge; 90% Floor
                </div>
              </td>
              <td className="p-3 text-right font-mono text-amber-400 print:text-black text-sm">
                ${totalFilteredVouchers.toLocaleString()}
              </td>
              {interactive && <td className="p-3 text-center print:hidden text-[10px] text-slate-400">All Active</td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
