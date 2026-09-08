'use client';

import * as React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Building,
  DollarSign,
  Calendar,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HireActionDialogProps {
  candidateId: string;
  candidateName: string;
  candidateUuid: string;
  onHireLogged?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function HireActionDialog({
  candidateId,
  candidateName,
  candidateUuid,
  onHireLogged,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: HireActionDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      setControlledOpen?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [employerName, setEmployerName] = React.useState('Booz Allen Hamilton');
  const [jobTitle, setJobTitle] = React.useState('AI Automation Workflow Specialist');
  const [salaryBracket, setSalaryBracket] = React.useState('$80,000 - $95,000');
  const [hireDate, setHireDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [placementType, setPlacementType] = React.useState('Full-Time Direct Hire (W2)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/enterprise/hire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId,
          candidateName,
          candidateUuid,
          employerName,
          jobTitle,
          salaryBracket,
          hireDate,
          placementType,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to record hiring event');
      }

      setSuccess(true);
      if (onHireLogged) {
        onHireLogged();
      }
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record hire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== null && (
        <DialogTrigger asChild>
          {trigger || (
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
              <Briefcase className="mr-2 h-4 w-4" />
              Log Hire / Extend Offer
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md border-slate-800 bg-slate-900 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            Record Veteran Placement
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Log hiring outcome for <span className="text-amber-400 font-semibold">{candidateName}</span>.
            This action registers verified WIOA placement metrics for Texas state workforce reporting.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Hire Recorded Successfully!</h4>
            <p className="text-xs text-slate-300">
              WIOA PIRL Quarter 2 placement metrics have been updated for state compliance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-md bg-rose-950/50 p-2.5 border border-rose-500/40 text-rose-300 text-xs flex items-center"
              >
                <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Hiring Employer / Organization</label>
              <input
                type="text"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Job Title / Role</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Starting Salary Bracket</label>
                <select
                  value={salaryBracket}
                  onChange={(e) => setSalaryBracket(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="$65,000 - $80,000">$65,000 - $80,000</option>
                  <option value="$80,000 - $95,000">$80,000 - $95,000</option>
                  <option value="$95,000 - $115,000">$95,000 - $115,000</option>
                  <option value="$115,000+">$115,000+</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Start Date</label>
                <input
                  type="date"
                  value={hireDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                </input>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Placement Arrangement</label>
              <select
                value={placementType}
                onChange={(e) => setPlacementType(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Full-Time Direct Hire (W2)">Full-Time Direct Hire (W2)</option>
                <option value="Contract-to-Hire">Contract-to-Hire</option>
                <option value="Defense Subcontractor Staffing">Defense Subcontractor Staffing</option>
                <option value="Part-Time / Specialized Apprenticeship">Part-Time / Specialized Apprenticeship</option>
              </select>
            </div>

            <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                State ETPL Placement Verification Notice
              </div>
              <p>
                By submitting this form, you certify that an employment offer or placement agreement has been made.
                Records are submitted under WIOA Title I PIRL reporting.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
              >
                {loading ? 'Submitting...' : 'Confirm Hire &amp; Record Placement'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
