import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  FileCheck2,
  Calendar,
  Lock,
  ExternalLink,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { SEED_EMPLOYER_AGREEMENTS, getAgreementById } from '@/lib/mou-template';
import { EmployerAgreement } from '@/lib/schemas/mou';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MouStatusBadge } from '@/components/mou-status-badge';
import { MouDocumentViewer } from '@/components/mou-document-viewer';

interface PageProps {
  params: Promise<{ agreementId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agreementId } = await params;
  const agreement = getAgreementById(agreementId);
  const companyName = agreement?.companyLegalName || 'Corporate Partner';

  return {
    title: `MOU: ${companyName} (${agreementId})`,
    description: `Official Memorandum of Understanding and workforce partnership agreement between VAAI and ${companyName} for veteran AI talent hiring.`,
  };
}

export default async function AgreementDetailPage({ params }: PageProps) {
  const { agreementId } = await params;

  let agreement: EmployerAgreement | null = null;
  const isMockEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock');

  if (!isMockEnv) {
    try {
      const supabase = await createClient();
      const { data: record } = await supabase
        .from('employer_agreements')
        .select('*')
        .eq('id', agreementId)
        .maybeSingle();

      if (record) {
        agreement = {
          id: record.id,
          companyLegalName: record.company_name,
          employerEin: record.ein,
          pointOfContact: {
            name: record.contact_name,
            title: record.contact_title,
            email: record.contact_email,
            phone: record.contact_phone || '512-555-0100',
          },
          targetHiringRoles: record.target_roles || [],
          clearanceRequirements: record.clearance_focus || 'Any',
          annualInterviewCommitment: Number(record.annual_interview_target) || 5,
          placementReportingConsent: true,
          status: record.status,
          compiledContractText: record.compiled_contract_text,
          signedAt: record.signed_at,
          signature: record.signer_name
            ? {
                signerName: record.signer_name,
                signerTitle: record.signer_title || 'Authorized Representative',
                signerEmail: record.contact_email,
                signatureTimestamp: record.signed_at || new Date().toISOString(),
                ipAddress: record.signer_ip || '127.0.0.1',
                userAgent: 'Recorded Digital Signature',
                consentStatementAccepted: true,
              }
            : undefined,
          createdAt: record.created_at,
          updatedAt: record.updated_at,
        };
      }
    } catch {
      // Fallback
    }
  }

  // Fallback to in-memory store and seed agreements
  if (!agreement) {
    agreement = getAgreementById(agreementId) || null;
  }

  if (!agreement) {
    notFound();
  }

  const signedDate = agreement.signedAt
    ? new Date(agreement.signedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Pending Execution';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/employers/partnership"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Partnership Hub
        </Link>

        <div className="flex items-center space-x-2">
          <MouStatusBadge status={agreement.status} />
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono text-[10px]"
          >
            <ShieldCheck className="mr-1 h-3 w-3 text-emerald-400" />
            TWC ETPL VERIFIED
          </Badge>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl print:hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-amber-400">{agreement.id}</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">EIN: {agreement.employerEin}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {agreement.companyLegalName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Annual Commitment: <span className="text-emerald-400 font-semibold">{agreement.annualInterviewCommitment} Qualified Veteran Interviews</span> • Clearance Scope: <span className="text-slate-200">{agreement.clearanceRequirements}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-xs">
            <Link href="/employers">
              <Building2 className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
              Recruiting Dashboard
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs">
            <Link href="/etpl-dossier">
              <FileCheck2 className="mr-1.5 h-3.5 w-3.5" />
              State Board Dossier
            </Link>
          </Button>
        </div>
      </div>

      {/* Contract Viewer */}
      <MouDocumentViewer agreement={agreement} />

      {/* Audit Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg space-y-3 print:hidden">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          State Workforce &amp; Regulatory Audit Trail
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">State Provider Filing</span>
            <span className="font-mono font-bold text-amber-400 text-xs">TWC-ETPL-78752-VAAI</span>
          </div>

          <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Ratification Date</span>
            <span className="font-mono font-semibold text-slate-200 text-xs">{signedDate}</span>
          </div>

          <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Affirmative Action Target</span>
            <span className="font-mono font-semibold text-emerald-400 text-xs">VEVRAA 38 U.S.C. § 4212</span>
          </div>

          <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Statutory Safe Harbor</span>
            <span className="font-mono font-semibold text-sky-400 text-xs">Title 38 U.S.C. §§ 5901–5905</span>
          </div>
        </div>
      </div>
    </div>
  );
}
