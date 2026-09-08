import * as React from 'react';
import { ShieldCheck, Clock, FileEdit, AlertCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MouStatus } from '@/lib/schemas/mou';

interface MouStatusBadgeProps {
  status: MouStatus;
  className?: string;
}

export function MouStatusBadge({ status, className }: MouStatusBadgeProps) {
  switch (status) {
    case 'active':
      return (
        <Badge
          variant="outline"
          className={`border-emerald-500/50 bg-emerald-950/50 text-emerald-300 font-mono text-[11px] font-semibold ${className || ''}`}
        >
          <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
          ACTIVE &amp; EXECUTED
        </Badge>
      );
    case 'pending_signature':
      return (
        <Badge
          variant="outline"
          className={`border-sky-500/50 bg-sky-950/50 text-sky-300 font-mono text-[11px] font-semibold animate-pulse ${className || ''}`}
        >
          <Clock className="mr-1.5 h-3.5 w-3.5 text-sky-400" />
          PENDING E-SIGNATURE
        </Badge>
      );
    case 'draft':
      return (
        <Badge
          variant="outline"
          className={`border-amber-500/40 bg-amber-950/30 text-amber-300 font-mono text-[11px] ${className || ''}`}
        >
          <FileEdit className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
          DRAFTING
        </Badge>
      );
    case 'expired':
      return (
        <Badge
          variant="outline"
          className={`border-slate-700 bg-slate-900 text-slate-400 font-mono text-[11px] ${className || ''}`}
        >
          <AlertCircle className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
          TERM EXPIRED
        </Badge>
      );
    case 'terminated':
      return (
        <Badge
          variant="outline"
          className={`border-rose-500/40 bg-rose-950/40 text-rose-300 font-mono text-[11px] ${className || ''}`}
        >
          <XCircle className="mr-1.5 h-3.5 w-3.5 text-rose-400" />
          TERMINATED
        </Badge>
      );
    default:
      return null;
  }
}
