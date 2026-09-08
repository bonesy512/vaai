import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { INSTITUTIONAL_COURSES } from '@/lib/courses-data';

export const metadata = {
  title: 'Course Quotas & Voucher Metrics | VAAI Admin LMS',
  description: 'Manage institutional course catalog, seat quotas, WIOA voucher allocations, and enterprise revenue.',
};

export default function AdminCoursesPage() {
  // Course seat quotas mock data mapped to all 10 courses
  const coursesWithQuotas = INSTITUTIONAL_COURSES.map((course, idx) => {
    const totalSeats = 35;
    const activeSeats = [28, 31, 29, 24, 30, 27, 26, 32, 28, 29][idx] || 25;
    const availableSeats = totalSeats - activeSeats;
    const voucherRevenue = activeSeats * course.pricing.etplVoucherPrice;
    const utilizationPct = Math.round((activeSeats / totalSeats) * 100);

    return {
      ...course,
      totalSeats,
      activeSeats,
      availableSeats,
      voucherRevenue,
      utilizationPct,
    };
  });

  const totalActiveSeats = coursesWithQuotas.reduce((acc, c) => acc + c.activeSeats, 0);
  const totalCapacity = coursesWithQuotas.reduce((acc, c) => acc + c.totalSeats, 0);
  const totalVoucherRevenue = coursesWithQuotas.reduce((acc, c) => acc + c.voucherRevenue, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Course Catalog &amp; Seat Quota Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage student seat quotas, state WIOA Title I voucher disbursements, and enterprise cohort allocations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button asChild size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-slate-200 text-xs">
            <Link href="/courses">
              View Public Catalog <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Aggregate Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-400">Total Enrolled Veteran Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white">
              {totalActiveSeats} / {totalCapacity}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-mono">
              {Math.round((totalActiveSeats / totalCapacity) * 100)}% Catalog Capacity Utilization
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-400">Total WIOA Approved Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-400">
              ${totalVoucherRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Texas Workforce Commission ETPL Approved
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-400">Accredited Catalog Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-400">
              10 Courses / 425 Hours
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              42.5 CEUs Across 3 Defense Tracks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 10-Course Management Table */}
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader className="border-b border-slate-800 pb-4">
          <CardTitle className="text-base font-semibold text-white">
            10-Course Accredited Catalog Quotas
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Real-time seat quotas, voucher pricing, and capacity utilization across all programs.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/70 font-mono text-slate-400">
                <tr>
                  <th className="py-3 px-4">Course ID</th>
                  <th className="py-3 px-4">Title &amp; Track</th>
                  <th className="py-3 px-4">Hours / CEUs</th>
                  <th className="py-3 px-4">Active Seats</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Voucher Price</th>
                  <th className="py-3 px-4">Active Allocation</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {coursesWithQuotas.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-amber-400 font-bold">{c.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-sans font-semibold text-white">{c.title}</div>
                      <div className="text-[11px] text-slate-400 uppercase">{c.track} track</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {c.clockHours}h ({c.ceuValue} CEU)
                    </td>
                    <td className="py-3 px-4 text-white font-bold">
                      {c.activeSeats} <span className="text-slate-500 font-normal">/ {c.totalSeats}</span>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      {c.availableSeats} open
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-bold">
                      ${c.pricing.etplVoucherPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      ${c.voucherRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white text-[11px] h-7 px-2.5"
                      >
                        Adjust Quota
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
