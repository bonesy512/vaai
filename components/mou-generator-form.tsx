'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  FileCheck2,
  PenTool,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  Lock,
} from 'lucide-react';
import {
  MouDraftSchema,
  MouSignatureSchema,
  MouDraftData,
  EmployerAgreement,
} from '@/lib/schemas/mou';
import { compileMouText } from '@/lib/mou-template';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MouDocumentViewer } from '@/components/mou-document-viewer';

const AVAILABLE_ROLES = [
  'AI Prompt Engineer & Automation Specialist',
  'Defense Workflow Integration Analyst',
  'Enterprise Data Operations Technician',
  'NIST/Title 38 Compliance Auditor',
  'Adversarial AI Security Analyst',
  'Logistics Supply Chain AI Coordinator',
];

interface MouGeneratorFormProps {
  onAgreementCreated?: (agreement: EmployerAgreement) => void;
}

export function MouGeneratorForm({ onAgreementCreated }: MouGeneratorFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Form State: Step 1 (Corporate Profile)
  const [companyLegalName, setCompanyLegalName] = React.useState('');
  const [dbaName, setDbaName] = React.useState('');
  const [employerEin, setEmployerEin] = React.useState('');
  const [pocName, setPocName] = React.useState('');
  const [pocTitle, setPocTitle] = React.useState('');
  const [pocEmail, setPocEmail] = React.useState('');
  const [pocPhone, setPocPhone] = React.useState('');

  // Form State: Step 2 (Talent Commitments)
  const [targetHiringRoles, setTargetHiringRoles] = React.useState<string[]>([
    'AI Prompt Engineer & Automation Specialist',
    'Defense Workflow Integration Analyst',
  ]);
  const [customRoleInput, setCustomRoleInput] = React.useState('');
  const [clearanceRequirements, setClearanceRequirements] = React.useState<
    'None' | 'Secret' | 'Top Secret / SCI' | 'Any'
  >('Any');
  const [annualInterviewCommitment, setAnnualInterviewCommitment] = React.useState<number>(5);
  const [placementReportingConsent, setPlacementReportingConsent] = React.useState(true);

  // Form State: Step 4 (E-Signature)
  const [signerName, setSignerName] = React.useState('');
  const [signerTitle, setSignerTitle] = React.useState('');
  const [signerEmail, setSignerEmail] = React.useState('');
  const [consentStatementAccepted, setConsentStatementAccepted] = React.useState(false);

  // Synchronize signer details from POC on first reach
  React.useEffect(() => {
    if (!signerName && pocName) setSignerName(pocName);
    if (!signerTitle && pocTitle) setSignerTitle(pocTitle);
    if (!signerEmail && pocEmail) setSignerEmail(pocEmail);
  }, [pocName, pocTitle, pocEmail, signerName, signerTitle, signerEmail]);

  const toggleRole = (role: string) => {
    if (targetHiringRoles.includes(role)) {
      if (targetHiringRoles.length > 1) {
        setTargetHiringRoles(targetHiringRoles.filter((r) => r !== role));
      }
    } else {
      setTargetHiringRoles([...targetHiringRoles, role]);
    }
  };

  const handleAddCustomRole = () => {
    if (customRoleInput.trim() && !targetHiringRoles.includes(customRoleInput.trim())) {
      setTargetHiringRoles([...targetHiringRoles, customRoleInput.trim()]);
      setCustomRoleInput('');
    }
  };

  // Build draft payload for preview and submission
  const currentDraftPayload: MouDraftData = {
    companyLegalName: companyLegalName.trim() || 'ACME Defense Corporation',
    dbaName: dbaName.trim() || undefined,
    employerEin: employerEin.trim() || '12-3456789',
    pointOfContact: {
      name: pocName.trim() || 'Corporate Recruiter',
      title: pocTitle.trim() || 'Director of Talent',
      email: pocEmail.trim() || 'recruiting@company.mil',
      phone: pocPhone.trim() || '512-555-0100',
    },
    targetHiringRoles,
    clearanceRequirements,
    annualInterviewCommitment: Number(annualInterviewCommitment) || 5,
    placementReportingConsent: true,
  };

  const previewAgreement: EmployerAgreement = {
    id: 'MOU-PREVIEW-DRAFT',
    ...currentDraftPayload,
    status: 'draft',
    compiledContractText: compileMouText(currentDraftPayload),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Step 1 Validation
  const validateStep1 = () => {
    setFormError(null);
    if (!companyLegalName.trim() || companyLegalName.trim().length < 2) {
      setFormError('Please enter your company legal entity name.');
      return false;
    }
    const einRegex = /^\d{2}-\d{7}$/;
    if (!einRegex.test(employerEin.trim())) {
      setFormError('Employer EIN must follow standard format: XX-XXXXXXX (e.g., 54-1234567).');
      return false;
    }
    if (!pocName.trim() || !pocTitle.trim()) {
      setFormError('Please provide primary recruiter / point of contact name and title.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(pocEmail.trim())) {
      setFormError('Please provide a valid corporate email address for the contact person.');
      return false;
    }
    if (pocPhone.trim().length < 10) {
      setFormError('Please provide a valid contact telephone number (at least 10 digits).');
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    setFormError(null);
    if (targetHiringRoles.length === 0) {
      setFormError('Please select at least one target occupational role for veteran hiring.');
      return false;
    }
    if (annualInterviewCommitment < 3) {
      setFormError('Annual interview commitment must be at least 3 candidates per year.');
      return false;
    }
    if (!placementReportingConsent) {
      setFormError('Employer must authorize WIOA placement outcome reporting to state workforce boards.');
      return false;
    }
    return true;
  };

  // Step 4 Submission (Draft + Sign in one seamless flow)
  const handleExecuteAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!signerName.trim() || !signerTitle.trim()) {
      setFormError('Authorized corporate signer name and corporate title are required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signerEmail.trim())) {
      setFormError('Please enter a valid corporate email for the authorized signatory.');
      return;
    }
    if (!consentStatementAccepted) {
      setFormError('You must check the box agreeing to electronic signature execution.');
      return;
    }

    setLoading(true);

    try {
      // 1. Submit Draft Creation
      const draftRes = await fetch('/api/enterprise/mou', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentDraftPayload),
      });

      const draftJson = await draftRes.json();
      if (!draftRes.ok || !draftJson.success) {
        throw new Error(draftJson.error || 'Failed to create MOU draft');
      }

      const agreementId = draftJson.agreementId;

      // 2. Submit Digital Signature Execution
      const signaturePayload = {
        signerName: signerName.trim(),
        signerTitle: signerTitle.trim(),
        signerEmail: signerEmail.trim(),
        signatureTimestamp: new Date().toISOString(),
        ipAddress: 'client-session',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Next.js App',
        consentStatementAccepted: true,
      };

      const signRes = await fetch(`/api/enterprise/mou/${agreementId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signaturePayload),
      });

      const signJson = await signRes.json();
      if (!signRes.ok || !signJson.success) {
        throw new Error(signJson.error || 'Failed to sign agreement');
      }

      if (onAgreementCreated && signJson.agreement) {
        onAgreementCreated(signJson.agreement);
      }

      // 3. Navigate to dedicated agreement permalink
      router.push(`/employers/partnership/${agreementId}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred executing the agreement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wizard Progress Indicator */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          <div
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg transition-colors ${
              currentStep === 1
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : currentStep > 1
                ? 'text-emerald-400 font-bold'
                : 'text-slate-500'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">1. Corporate Profile</span>
            <span className="sm:hidden">1. Profile</span>
          </div>

          <div
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg transition-colors ${
              currentStep === 2
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : currentStep > 2
                ? 'text-emerald-400 font-bold'
                : 'text-slate-500'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">2. Talent Targets</span>
            <span className="sm:hidden">2. Targets</span>
          </div>

          <div
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg transition-colors ${
              currentStep === 3
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : currentStep > 3
                ? 'text-emerald-400 font-bold'
                : 'text-slate-500'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">3. Review MOU</span>
            <span className="sm:hidden">3. Review</span>
          </div>

          <div
            className={`flex items-center justify-center gap-1.5 p-2 rounded-lg transition-colors ${
              currentStep === 4
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-500'
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">4. E-Signature</span>
            <span className="sm:hidden">4. Sign</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {formError && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg bg-rose-950/60 p-3 border border-rose-500/40 text-rose-300 text-xs flex items-center"
        >
          <AlertCircle className="h-4 w-4 mr-2 shrink-0 text-rose-400" />
          {formError}
        </div>
      )}

      {/* STEP 1: Corporate Profile */}
      {currentStep === 1 && (
        <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-400" />
              Step 1: Corporate &amp; Legal Organization Information
            </CardTitle>
            <p className="text-xs text-slate-400">
              Enter your legal corporate identity to generate the formal Texas Workforce Commission partnership MOU.
            </p>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  Legal Entity Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Booz Allen Hamilton Inc."
                  value={companyLegalName}
                  onChange={(e) => setCompanyLegalName(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  Doing Business As (DBA) Name <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Booz Allen Defense Solutions"
                  value={dbaName}
                  onChange={(e) => setDbaName(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                Employer Identification Number (EIN) <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                placeholder="XX-XXXXXXX (e.g. 54-0892014)"
                value={employerEin}
                onChange={(e) => setEmployerEin(e.target.value)}
                className="w-full sm:w-1/2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Required for state workforce PIRL Quarter 2 placement auditing and VEVRAA reporting.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="font-bold text-slate-200 text-xs mb-3">Primary Talent Acquisition Point of Contact</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    Contact Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jennifer K. Vance"
                    value={pocName}
                    onChange={(e) => setPocName(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    Corporate Title <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Director of Veteran Talent Acquisition"
                    value={pocTitle}
                    onChange={(e) => setPocTitle(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    Corporate Work Email <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. vance_jennifer@bah.com"
                    value={pocEmail}
                    onChange={(e) => setPocEmail(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    Direct Phone Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 703-902-5000"
                    value={pocPhone}
                    onChange={(e) => setPocPhone(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t border-slate-800 pt-4">
            <Button
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs"
            >
              Continue to Talent Requirements
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: Talent Commitments */}
      {currentStep === 2 && (
        <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-amber-400" />
              Step 2: Hiring Commitments &amp; Role Alignments
            </CardTitle>
            <p className="text-xs text-slate-400">
              Specify your hiring preferences to guarantee candidate interview pipelines and fulfill state WIOA placement criteria.
            </p>
          </CardHeader>

          <CardContent className="space-y-5 text-xs">
            {/* Target Roles Checkboxes */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-300">
                Target Occupational Roles <span className="text-amber-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-lg text-left text-xs border transition-colors ${
                      targetHiringRoles.includes(role)
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                        targetHiringRoles.includes(role)
                          ? 'border-amber-400 bg-amber-500 text-slate-950'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {targetHiringRoles.includes(role) && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <span>{role}</span>
                  </button>
                ))}
              </div>

              {/* Custom Role Adder */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom role title..."
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomRole}
                  className="border-slate-700 bg-slate-800 text-xs"
                >
                  Add Role
                </Button>
              </div>
            </div>

            {/* Security Clearance Selection */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                Security Clearance Requirement
              </label>
              <select
                value={clearanceRequirements}
                onChange={(e) =>
                  setClearanceRequirements(
                    e.target.value as 'None' | 'Secret' | 'Top Secret / SCI' | 'Any'
                  )
                }
                className="w-full sm:w-1/2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Any">Any Clearance (Secret, TS/SCI, Eligible, None)</option>
                <option value="Top Secret / SCI">Top Secret / SCI Required</option>
                <option value="Secret">Secret Clearance Required</option>
                <option value="None">No Clearance Required (Commercial)</option>
              </select>
            </div>

            {/* Annual Interview Target */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                Annual Candidate Interview Commitment <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                min={3}
                max={100}
                value={annualInterviewCommitment}
                onChange={(e) => setAnnualInterviewCommitment(Number(e.target.value))}
                className="w-32 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Partnership requires a minimum good-faith commitment of 3 interviews per 12-month term (recommended: 5–20).
              </p>
            </div>

            {/* WIOA Consent Checkbox */}
            <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={placementReportingConsent}
                  onChange={(e) => setPlacementReportingConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                />
                <span className="text-slate-300 text-xs leading-relaxed">
                  <strong className="text-white">State Workforce Board Placement Reporting Authorization:</strong>{' '}
                  Employer agrees to confirm candidate hires, job titles, start dates, and base salary brackets to
                  satisfy WIOA Title I PIRL state quarterly audit reporting.
                </span>
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-slate-800 pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="border-slate-700 bg-slate-800 text-xs"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              onClick={() => {
                if (validateStep2()) setCurrentStep(3);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs"
            >
              Review Compiled Agreement
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: Document Review */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-amber-400" />
                Step 3: Review Full Legal Memorandum of Understanding
              </h3>
              <p className="text-xs text-slate-400">
                Inspect the dynamically compiled contract clauses before capturing authorized electronic signature.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(2)}
                className="border-slate-700 bg-slate-800 text-xs"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Edit Terms
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrentStep(4)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs"
              >
                Proceed to E-Signature
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <MouDocumentViewer agreement={previewAgreement} showActions={false} />
        </div>
      )}

      {/* STEP 4: E-Signature Capture */}
      {currentStep === 4 && (
        <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <PenTool className="h-5 w-5 text-amber-400" />
              Step 4: Corporate Execution &amp; Electronic Signature
            </CardTitle>
            <p className="text-xs text-slate-400">
              Provide authorized corporate signatory details to ratify the agreement under U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act).
            </p>
          </CardHeader>

          <form onSubmit={handleExecuteAgreement}>
            <CardContent className="space-y-4 text-xs">
              <div className="rounded-lg bg-amber-950/20 p-4 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  Legal Electronic Signature Attestation
                </div>
                <p className="leading-relaxed text-[11px] text-amber-200/90">
                  By executing this document, you certify that you have express corporate authority to bind{' '}
                  <strong className="text-white">{companyLegalName || 'Employer'}</strong> to this Memorandum of
                  Understanding. Execution creates an active partnership record with the Texas Workforce Commission ETPL system.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    Authorized Signer Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jennifer K. Vance"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    Corporate Officer Title <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Director of Talent Acquisition"
                    value={signerTitle}
                    onChange={(e) => setSignerTitle(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  Authorized Signer Email <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. vance_jennifer@bah.com"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  required
                  className="w-full sm:w-1/2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-2">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentStatementAccepted}
                    onChange={(e) => setConsentStatementAccepted(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-slate-300 text-xs leading-relaxed">
                    I agree to electronically execute this Memorandum of Understanding. I understand that my digital
                    signature, timestamp, and IP address will be recorded in the state workforce audit trail.
                  </span>
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-slate-800 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="border-slate-700 bg-slate-800 text-xs"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to Review
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
              >
                {loading ? 'Executing & Registering...' : 'Sign & Ratify Agreement'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
