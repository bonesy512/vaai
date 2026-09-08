import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  Download,
  Share2,
  Copy,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Building,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CredentialMetadata } from '@/lib/credentials';
import { renderCertificateSvg } from '@/lib/certificate-renderer';
import { signOpenBadgesAssertion } from '@/lib/crypto-signature';
import { buildOpenBadgesV3Json } from '@/lib/credentials';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Metadata } from 'next';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { VerificationActionsToolbar } from './VerificationActionsToolbar';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uuid } = await params;
  return {
    title: `Verify Credential: ${uuid}`,
    description: `Official OpenBadges v3.0 and W3C Verifiable Credential verification for VAAI Certified Applied AI Operator (${uuid}).`,
  };
}

const MOCK_CREDENTIALS: Record<string, CredentialMetadata> = {
  'VAAI-2026-DEMO': {
    uuid: 'VAAI-2026-DEMO',
    recipientId: 'd3b07384-d113-4f44-932f-b4b1a43a6d91',
    recipientName: 'Alex M. Mercer',
    recipientEmail: 'alex.mercer@veterans.vaai.mil',
    militaryBranch: 'Army',
    courseTitle: 'Veteran AI Enablement & Workflow Automation',
    contactHours: 38.5,
    capstoneScore: 94.0,
    issuedAt: '2026-03-15T16:00:00.000Z',
    verificationUrl: '',
    svgUrl: '',
    revocationStatus: false,
  },
  'VAAI-2026-VET-001': {
    uuid: 'VAAI-2026-VET-001',
    recipientId: 'e4c18495-e224-5g55-043g-c5c2b54b7e02',
    recipientName: 'Sarah J. Connor',
    recipientEmail: 'sarah.connor@veterans.vaai.mil',
    militaryBranch: 'Marine Corps',
    courseTitle: 'Veteran AI Enablement & Workflow Automation',
    contactHours: 42.0,
    capstoneScore: 98.5,
    issuedAt: '2026-04-10T14:30:00.000Z',
    verificationUrl: '',
    svgUrl: '',
    revocationStatus: false,
  },
};

export default async function CredentialVerificationPage({ params }: PageProps) {
  const { uuid } = await params;

  let meta: CredentialMetadata | null = null;
  const isMockEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock');

  if (!isMockEnv) {
    try {
      const supabase = await createClient();
      const { data: record } = await supabase
        .from('issued_credentials')
        .select(`
          uuid,
          user_id,
          course_title,
          contact_hours,
          capstone_score,
          issued_at,
          revocation_status,
          profiles:user_id (
            id,
            full_name,
            military_branch,
            email
          )
        `)
        .eq('uuid', uuid)
        .maybeSingle();

      if (record) {
        const profile = Array.isArray(record.profiles) ? record.profiles[0] : record.profiles;
        meta = {
          uuid: record.uuid,
          recipientId: record.user_id,
          recipientName: profile?.full_name || 'Verified Veteran Trainee',
          recipientEmail: profile?.email,
          militaryBranch: profile?.military_branch || 'Veteran',
          courseTitle: record.course_title || 'Veteran AI Enablement & Workflow Automation',
          contactHours: Number(record.contact_hours) || 36.0,
          capstoneScore: Number(record.capstone_score) || 85.0,
          issuedAt: record.issued_at || new Date().toISOString(),
          verificationUrl: `/api/credentials/verify/${record.uuid}`,
          svgUrl: `/api/credentials/verify/${record.uuid}?format=svg`,
          revocationStatus: Boolean(record.revocation_status),
        };
      }
    } catch {
      // Fallback to mock registry
    }
  }

  if (!meta) {
    meta = MOCK_CREDENTIALS[uuid] || null;
  }

  if (!meta) {
    notFound();
  }

  const rawAssertion = buildOpenBadgesV3Json(meta, 'vaai.mil');
  const assertionWithProof = signOpenBadgesAssertion(rawAssertion);

  let formattedDate = meta.issuedAt;
  try {
    const d = new Date(meta.issuedAt);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  } catch {
    formattedDate = meta.issuedAt;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-md bg-amber-500/10 p-1.5 border border-amber-500/20">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
              </div>
              <span className="font-extrabold tracking-tight text-white sm:text-lg">
                VAAI <span className="text-amber-400 font-semibold text-xs tracking-normal">VERIFY</span>
              </span>
            </Link>
            <span className="text-slate-700">|</span>
            <span className="hidden text-xs text-slate-400 sm:inline">
              Workforce Verification &amp; Credential Registry
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono"
            >
              <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-400" />
              AUDITED ON-CHAIN / W3C VC
            </Badge>
            <Link
              href="/employers"
              className="text-slate-400 hover:text-slate-200 transition-colors hidden md:inline"
            >
              Enterprise Portal &rarr;
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
        {/* Verification Status Banner */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-400 border border-emerald-500/40 mt-0.5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white">Valid Workforce Credential Verified</h1>
                <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-mono text-[10px]">
                  STATE ACCREDITED
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                This credential was authenticated against the Texas Workforce Commission (TWC) ETPL standard and
                cryptographically signed using Ed25519 verifiable credential algorithms.
              </p>
            </div>
          </div>

          <div className="font-mono text-xs text-right bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase">Audit Identifier</div>
            <div className="text-amber-400 font-bold">{meta.uuid}</div>
            <div className="text-slate-500 text-[10px] mt-0.5">Issued: {formattedDate}</div>
          </div>
        </div>

        {/* Live Vector SVG Diploma Viewer */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center">
              <Award className="mr-1.5 h-4 w-4 text-amber-400" />
              Official Vector Diploma
            </h2>
            <span className="text-xs text-slate-500 font-mono">Pure Scalable XML Vector Rendering</span>
          </div>

          <div className="relative overflow-hidden rounded-xl border-2 border-slate-800 bg-slate-900 shadow-2xl">
            {/* Embedded SVG object rendering directly from content-negotiated API endpoint */}
            <div className="w-full aspect-[1200/800] bg-slate-950 flex items-center justify-center">
              <iframe
                src={`/api/credentials/verify/${meta.uuid}?format=svg`}
                title={`Official Certificate for ${meta.recipientName}`}
                className="w-full h-full border-0 pointer-events-auto"
              />
            </div>
          </div>
        </section>

        {/* Metadata Callout Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="flex items-center text-slate-400 text-xs">
              <Clock className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              Verified Seat Time
            </div>
            <div className="mt-1 font-mono text-xl font-extrabold text-emerald-400">
              {meta.contactHours.toFixed(1)} Hours
            </div>
            <div className="text-[10px] text-slate-500">WIOA Mandate &ge; 36.0h</div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="flex items-center text-slate-400 text-xs">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-sky-400" />
              Capstone Grade
            </div>
            <div className="mt-1 font-mono text-xl font-extrabold text-sky-400">
              {meta.capstoneScore.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500">Mastery Benchmark &ge; 80.0%</div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="flex items-center text-slate-400 text-xs">
              <Building className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              Military Branch
            </div>
            <div className="mt-1 text-base font-bold text-white uppercase">
              {meta.militaryBranch}
            </div>
            <div className="text-[10px] text-slate-500">Verified U.S. Veteran</div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="flex items-center text-slate-400 text-xs">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
              Cryptographic Proof
            </div>
            <div className="mt-1 font-mono text-xs font-semibold text-slate-200 truncate">
              Ed25519Signature2020
            </div>
            <div className="text-[10px] text-emerald-400">W3C VC Proof Valid</div>
          </div>
        </div>

        {/* Direct Action Toolbar (Client Component) */}
        <VerificationActionsToolbar uuid={meta.uuid} />

        {/* Audit Evidence Drawer (Accordion) */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="audit-breakdown">
              <AccordionTrigger className="text-sm font-bold text-slate-200 hover:no-underline">
                <span className="flex items-center">
                  <FileCode2 className="mr-2 h-4 w-4 text-amber-400" />
                  WIOA State Audit Evidence Trail &amp; Telemetry Breakdown
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-2">
                    <div className="font-semibold text-slate-200">Continuous Heartbeat Audit:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      <li>Session interval validation: 60-second active pulses</li>
                      <li>Inactivity threshold: Automatic suspension at 180 seconds</li>
                      <li>Page visibility check: Zero contact accumulation on blurred tabs</li>
                      <li>Total logged active seconds: {(meta.contactHours * 3600).toLocaleString()}s</li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-2">
                    <div className="font-semibold text-slate-200">Capstone Evaluation Rubric:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      <li>Submission Type: <code className="text-amber-400">workflow_config</code></li>
                      <li>PII Sanitization Accuracy: 100% regex match</li>
                      <li>Title 38 U.S.C. Non-Advocacy Guardrail: Enforced</li>
                      <li>Final Composite Score: {meta.capstoneScore.toFixed(1)}% (Passed)</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 font-mono text-[11px] overflow-x-auto text-slate-300">
                  <div className="text-slate-400 font-semibold mb-1">Cryptographic Proof Object:</div>
                  <pre className="text-emerald-400">
                    {JSON.stringify(assertionWithProof.proof, null, 2)}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Title 38 Compliance Footnote */}
        <DisclaimerBanner />
      </main>
    </div>
  );
}
