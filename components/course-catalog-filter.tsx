'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import type { Course, TrackType } from '@/lib/types/course';
import { INSTITUTIONAL_COURSES, getCatalogSummary } from '@/lib/courses-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Code2,
  Cpu,
  ShieldCheck,
  Briefcase,
  Search,
  Filter,
  GraduationCap,
  Award,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { CourseDetailView } from './lms/course-detail-view';
import { WasmSandboxRunner } from './lms/wasm-sandbox-runner';

interface CourseCatalogFilterProps {
  initialTrack?: TrackType | 'all';
  onSelectCourse?: (course: Course) => void;
}

export function CourseCatalogFilter({
  initialTrack = 'all',
  onSelectCourse,
}: CourseCatalogFilterProps) {
  const [selectedTrack, setSelectedTrack] = useState<TrackType | 'all'>(initialTrack);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const [activeSandboxCourse, setActiveSandboxCourse] = useState<Course | null>(null);

  const summary = useMemo(() => getCatalogSummary(), []);

  // Filter logic
  const filteredCourses = useMemo(() => {
    return INSTITUTIONAL_COURSES.filter((course) => {
      // Track match
      if (selectedTrack !== 'all' && course.track !== selectedTrack) {
        return false;
      }
      // Level match
      if (selectedLevel !== 'all' && course.level !== selectedLevel) {
        return false;
      }
      // Branch match
      if (selectedBranch !== 'all') {
        const branchLower = selectedBranch.toLowerCase();
        const matchesBranch = course.targetMos.some((mos) =>
          mos.toLowerCase().includes(branchLower)
        );
        if (!matchesBranch) return false;
      }
      // Search query match (title, id, socCode, description, targetMos)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          course.id.toLowerCase().includes(q) ||
          course.title.toLowerCase().includes(q) ||
          course.socCode.toLowerCase().includes(q) ||
          course.description.toLowerCase().includes(q) ||
          course.targetMos.some((m) => m.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [selectedTrack, selectedLevel, selectedBranch, searchQuery]);

  // Aggregate stats of filtered set
  const filteredHours = useMemo(() => {
    return filteredCourses.reduce((sum, c) => sum + c.clockHours, 0);
  }, [filteredCourses]);

  const getTrackBadgeStyle = (track: TrackType) => {
    switch (track) {
      case 'engineering':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'security':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'operations':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  const getTrackIcon = (track: TrackType) => {
    switch (track) {
      case 'engineering':
        return <Cpu className="w-4 h-4 mr-1 text-sky-400" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />;
      case 'operations':
        return <Briefcase className="w-4 h-4 mr-1 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Institutional Overview */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-xs">
                TWC ETPL ACCREDITED CATALOG
              </Badge>
              <Badge variant="outline" className="border-sky-500/40 bg-sky-500/10 text-sky-300 font-mono text-xs">
                DoD SKILLBRIDGE COMPLIANT
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Defense AI Applied Operator Curriculum
            </h1>
            <p className="text-slate-400 max-w-3xl text-sm sm:text-base">
              10 accredited military-to-civilian pathways spanning <span className="text-amber-400 font-semibold">425 cumulative clock hours</span> across Engineering, Security, and Operations tracks. Built for transitioning service members, veterans, and defense contractors.
            </p>
          </div>

          {/* Institutional Metric Pill Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-400">10</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Courses</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-sky-400">425</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Clock Hrs</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">42.5</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">CEUs</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">WASM Lab</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Track Switcher Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 backdrop-blur-sm">
        {/* Track Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              selectedTrack === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            All Tracks ({summary.totalCourses} Courses · {summary.totalClockHours}h)
          </button>
          <button
            onClick={() => setSelectedTrack('engineering')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              selectedTrack === 'engineering'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Engineering ({summary.trackCounts.engineering} Courses · {summary.trackHours.engineering}h)
          </button>
          <button
            onClick={() => setSelectedTrack('security')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              selectedTrack === 'security'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Security & Defense ({summary.trackCounts.security} Courses · {summary.trackHours.security}h)
          </button>
          <button
            onClick={() => setSelectedTrack('operations')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              selectedTrack === 'operations'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Operations & GovCon ({summary.trackCounts.operations} Courses · {summary.trackHours.operations}h)
          </button>
        </div>

        {/* Secondary Filters (Search, Military Branch, Level) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search title, ID, SOC code, or MOS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          {/* Military Branch Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">All Military Branches</option>
              <option value="army">U.S. Army (25B, 17C, 35F, 88M, 92A)</option>
              <option value="navy">U.S. Navy (IT, IS, CTN/CWT)</option>
              <option value="air force">U.S. Air Force (1D7X1, 1B4X1, 1N0X1)</option>
              <option value="marine corps">U.S. Marine Corps (0671, 0631, 1721)</option>
              <option value="officer">Transitioning Officers (O1–O5)</option>
            </select>
          </div>

          {/* Course Level Selector */}
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">All Curriculum Levels (1–4)</option>
              <option value="1">Level 1: Foundations</option>
              <option value="2">Level 2: Intermediate & CUI</option>
              <option value="3">Level 3: Advanced Architecture</option>
              <option value="4">Level 4: Red-Teaming Specialist</option>
            </select>
          </div>
        </div>

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div>
            Showing <span className="text-white font-semibold">{filteredCourses.length}</span> of {INSTITUTIONAL_COURSES.length} courses ({filteredHours} cumulative clock hours)
          </div>
          {(selectedTrack !== 'all' || selectedBranch !== 'all' || selectedLevel !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTrack('all');
                setSelectedBranch('all');
                setSelectedLevel('all');
                setSearchQuery('');
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Card Header: Badges & Meta */}
              <CardHeader className="pb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`font-mono text-[11px] font-semibold flex items-center ${getTrackBadgeStyle(course.track)}`}>
                    {getTrackIcon(course.track)}
                    {course.track.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="border-slate-700 bg-slate-800/80 text-slate-300 font-mono text-[11px]">
                      Level {course.level}
                    </Badge>
                    <Badge variant="outline" className="border-slate-700 bg-slate-800/80 text-slate-300 font-mono text-[11px]">
                      {course.clockHours}h · {course.ceuValue} CEU
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                    {course.id} · SOC {course.socCode}
                  </div>
                  <CardTitle className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mt-1">
                    {course.title}
                  </CardTitle>
                </div>

                <CardDescription className="text-slate-300 text-xs line-clamp-3 leading-relaxed">
                  {course.description}
                </CardDescription>
              </CardHeader>

              {/* Card Content: Target MOS & Funding */}
              <CardContent className="space-y-4 py-2">
                {/* Target MOS Crosswalk Chips */}
                <div className="space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Target Military Ratings / MOS:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {course.targetMos.slice(0, 3).map((mos, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300 truncate max-w-[200px]"
                        title={mos}
                      >
                        {mos}
                      </span>
                    ))}
                    {course.targetMos.length > 3 && (
                      <span className="text-[10px] bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                        +{course.targetMos.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Capstone Preview */}
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/90 text-xs space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-sky-400" />
                    Capstone Practicum:
                  </div>
                  <div className="text-slate-200 font-medium line-clamp-1">
                    {course.capstone.title}
                  </div>
                </div>

                {/* Voucher Economics Box */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/10 border border-amber-500/20 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">State ETPL Voucher</span>
                    <span className="text-base font-bold text-amber-400">${course.pricing.etplVoucherPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">Enterprise Seat</span>
                    <span className="text-xs text-slate-400 line-through">${course.pricing.enterpriseSeatPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">100% WIOA Covered</span>
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Card Footer: Action Buttons */}
            <CardFooter className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCourseModal(course)}
                className="flex-1 border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-400" />
                View Syllabus
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveSandboxCourse(course)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold"
              >
                <Code2 className="w-3.5 h-3.5 mr-1 text-slate-950" />
                Run Sandbox
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Course Detail Modal Drawer */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setActiveCourseModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full p-2"
            >
              ✕
            </button>
            <CourseDetailView
              course={activeCourseModal}
              onLaunchSandbox={() => {
                const target = activeCourseModal;
                setActiveCourseModal(null);
                setActiveSandboxCourse(target);
              }}
            />
          </div>
        </div>
      )}

      {/* WASM Sandbox Runner Modal */}
      {activeSandboxCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-mono text-amber-400">{activeSandboxCourse.id} CAPSTONE RUNTIME</div>
                <h3 className="text-lg font-bold text-white">{activeSandboxCourse.capstone.title}</h3>
              </div>
              <button
                onClick={() => setActiveSandboxCourse(null)}
                className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full p-2"
              >
                ✕
              </button>
            </div>
            <WasmSandboxRunner
              title={activeSandboxCourse.capstone.title}
              initialCode={activeSandboxCourse.capstone.starterCode}
              language={activeSandboxCourse.capstone.language}
              rubric={activeSandboxCourse.capstone.rubric}
              courseId={activeSandboxCourse.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
