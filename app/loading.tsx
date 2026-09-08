import * as React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Skeleton Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-slate-800" />
          <div className="space-y-1.5">
            <div className="h-4 w-36 rounded bg-slate-800" />
            <div className="h-3 w-24 rounded bg-slate-900" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-7 w-28 rounded-md bg-slate-800" />
          <div className="h-7 w-20 rounded-md bg-slate-800" />
        </div>
      </div>

      {/* Hero / Banner Skeleton */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 space-y-4">
        <div className="h-6 w-48 rounded bg-slate-800" />
        <div className="h-10 w-3/4 max-w-xl rounded bg-slate-800" />
        <div className="h-4 w-full max-w-2xl rounded bg-slate-900" />
        <div className="h-4 w-1/2 rounded bg-slate-900" />
        <div className="pt-2 flex gap-3">
          <div className="h-9 w-36 rounded-md bg-slate-800" />
          <div className="h-9 w-32 rounded-md bg-slate-800" />
        </div>
      </div>

      {/* Main Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="h-6 w-40 rounded bg-slate-800" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-800/60" />
              <div className="h-4 w-5/6 rounded bg-slate-800/60" />
              <div className="h-4 w-4/6 rounded bg-slate-800/60" />
            </div>
            <div className="h-48 rounded-lg bg-slate-900/80 border border-slate-800/60" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="h-5 w-32 rounded bg-slate-800" />
            <div className="h-8 w-24 rounded bg-slate-800" />
            <div className="h-2.5 w-full rounded-full bg-slate-800" />
            <div className="h-4 w-3/4 rounded bg-slate-900" />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <div className="h-5 w-36 rounded bg-slate-800" />
            <div className="space-y-2">
              <div className="h-8 w-full rounded bg-slate-800/60" />
              <div className="h-8 w-full rounded bg-slate-800/60" />
              <div className="h-8 w-full rounded bg-slate-800/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
