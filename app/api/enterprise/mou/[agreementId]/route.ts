import { NextRequest, NextResponse } from 'next/server';
import { getAgreementById } from '@/lib/mou-template';
import { createClient } from '@/lib/supabase/server';
import { EmployerAgreement } from '@/lib/schemas/mou';

/**
 * GET /api/enterprise/mou/[agreementId]
 * Next.js 16 Route Handler with asynchronous context params: Promise<{ agreementId: string }>
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ agreementId: string }> }
) {
  try {
    const { agreementId } = await context.params;

    if (!agreementId) {
      return NextResponse.json(
        { success: false, error: 'Agreement ID parameter is required' },
        { status: 400 }
      );
    }

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
            dbaName: record.dba_name || undefined,
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
        // Fallback to in-memory store
      }
    }

    if (!agreement) {
      agreement = getAgreementById(agreementId) || null;
    }

    if (!agreement) {
      return NextResponse.json(
        {
          success: false,
          error: 'Agreement Not Found',
          message: `No partnership agreement exists matching ID ${agreementId}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agreement,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
