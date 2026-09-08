import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Download,
  BookOpen,
  Radio,
  FileCheck2,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { INSTITUTIONAL_COURSES } from '@/lib/courses-data';

export const metadata = {
  title: 'Admin Telemetry HUD | VAAI LMS',
  description: 'High-level administrator LMS telemetry, WIOA seat-time queue, and active enrollment overview.',
};

export default function AdminTelemetryDashboard() {
  // Telemetry Metrics
  const activeEnrolledVeterans = 284;
  const atRiskSeatTimeCount = 4; // Students falling below 90% seat-time threshold
  const totalVerifiedContactHours = 11390;
  const capstonePassRate = 96.4;
  const credentialsIssuedCount = 176;

  // Sample Audit Queue for students requiring seat-time intervention (<90% threshold)
  const auditQueue = [
    {
      id: 'AUD-8921',
      studentName: 'Sgt. Marcus Vance',
      branch: 'Army (25B)',
      courseId: 'VAAI-101',
      courseTitle: 'Applied AI Foundations & LLM Ops',
      activeSeatTimePct: 84.5,
      requiredFloor: 90.0,
      missingHours: 2.2,
      lastHeartbeat: '22 minutes ago',
      status: 'NEEDS_INTERVENTION',
    },
    {
      id: 'AUD-8922',
      studentName: 'PO1 Elena Rostova',
      branch: 'Navy (IT/IS)',
      courseId: 'VAAI-201',
      courseTitle: 'RAG Architecture & Vector DBs',
      activeSeatTimePct: 87.2,
      requiredFloor: 90.0,
      missingHours: 1.3,
      lastHeartbeat: '1 hour ago',
      status: 'NEEDS_INTERVENTION',
    },
    {
      id: 'AUD-8923',
      studentName: 'TSgt. Kyle Harris',
      branch: 'Air Force (1D7X1)',
      courseId: 'VAAI-202',
      courseTitle: 'AI Red-Teaming & Adversarial Robustness',
      activeSeatTimePct: 81.0,
      requiredFloor: 90.0,
      missingHours: 4.0,
      lastHeartbeat: '3 hours ago',
      status: 'FLAGGED_AT_RISK',
    },
    {
      id: 'AUD-8924',
      studentName: 'Cpl. Jordan Hayes',
      branch: 'Marine Corps (0671)',
      courseId: 'VAAI-301',
      courseTitle: 'Model Fine-Tuning & SLM Optimization',
      activeSeatTimePct: 88.6,
      requiredFloor: 90.0,
      missingHours: 0.6,
      lastHeartbeat: '45 minutes ago',
      status: 'NEEDS_INTERVENTION',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              State Workforce Telemetry HUD
            </h1>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-xs">
              LIVE TELEMETRY
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time WIOA Title I telemetry monitoring across all 10 accredited defense courses.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs">
            <Link href="/admin/cohorts">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Generate PIRL Report
            </Link>
          </Button>
        </div>
      </div>

      {/* 4 Core Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Enrolled Veterans */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Active Enrolled Veterans
            </CardTitle>
            <Users className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white">
              {activeEnrolledVeterans}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 text-emerald-400 mr-1" />
              Across 10 courses (425h catalog)
            </p>
          </CardContent>
        </Card>

        {/* Card 2: State WIOA Seat-Time Audit Queue */}
        <Card className="border-slate-800 bg-slate-900/60 border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              WIOA Audit Queue (&lt;90% Floor)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-400">
              {atRiskSeatTimeCount} Flagged
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Require active telemetry recovery
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Total Verified Contact Hours */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Verified Contact Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white">
              {totalVerifiedContactHours.toLocaleString()}h
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Logged via 30s client heartbeats
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Capstone Pass Rate & Ed25519 Credentials */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">
              Capstone Pass / Credentials
            </CardTitle>
            <Award className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white">
              {capstonePassRate}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {credentialsIssuedCount} Ed25519 Badges issued
            </p>
          </CardContent>
        </Card>
      </div>

      {/* State WIOA Seat-Time Audit Queue Table */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader className="border-b border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold text-white flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>State WIOA Seat-Time Audit Queue</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Students below the mandatory 90% telemetry threshold required by Texas Workforce Commission criteria.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-300 font-mono text-xs w-fit">
              4 ACTION ITEMS PENDING
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/70 font-mono text-slate-400">
                <tr>
                  <th className="py-3 px-4">Audit ID</th>
                  <th className="py-3 px-4">Student &amp; Service Branch</th>
                  <th className="py-3 px-4">Enrolled Course</th>
                  <th className="py-3 px-4">Verified Seat-Time</th>
                  <th className="py-3 px-4">Missing Hours</th>
                  <th className="py-3 px-4">Last Heartbeat</th>
                  <th className="py-3 px-4">Compliance Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {auditQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-400">{item.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-sans font-semibold text-white">{item.studentName}</div>
                      <div className="text-[11px] text-slate-400">{item.branch}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-amber-400 font-semibold">{item.courseId}</span>
                      <div className="text-[11px] text-slate-400 font-sans">{item.courseTitle}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-400 font-bold">{item.activeSeatTimePct}%</span>
                        <span className="text-slate-500 text-[10px]">/ 90.0% min</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-amber-300">+{item.missingHours}h req</td>
                    <td className="py-3 px-4 text-slate-400">{item.lastHeartbeat}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/40 text-[10px]">
                        DEFICIT DETECTED
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white text-[11px] h-7 px-2.5"
                      >
                        Notify Student
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Course Catalog Telemetry Quick Rollup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>AI Engineering Track (220h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Active Enrollees:</span>
              <span className="font-mono font-bold text-white">142 Veterans</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Average Seat-Time:</span>
              <span className="font-mono font-bold text-emerald-400">94.8% (Compliant)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Approved WIOA Voucher:</span>
              <span className="font-mono text-amber-400">$4,950 - $7,850</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Cyber Defense Track (130h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Active Enrollees:</span>
              <span className="font-mono font-bold text-white">88 Veterans</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Average Seat-Time:</span>
              <span className="font-mono font-bold text-emerald-400">95.2% (Compliant)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Approved WIOA Voucher:</span>
              <span className="font-mono text-amber-400">$6,250 - $7,500</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white flex items-center space-x-2">
              <FileCheck2 className="h-4 w-4 text-purple-400" />
              <span>Logistics &amp; GovCon Track (75h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Active Enrollees:</span>
              <span className="font-mono font-bold text-white">54 Veterans</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Average Seat-Time:</span>
              <span className="font-mono font-bold text-emerald-400">96.0% (Compliant)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Approved WIOA Voucher:</span>
              <span className="font-mono text-amber-400">$5,400 - $6,200</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
