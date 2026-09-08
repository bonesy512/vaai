import { NextRequest, NextResponse } from 'next/server';
import { MouSignatureSchema } from '@/lib/schemas/mou';
import { signAgreement } from '@/lib/mou-template';
import { getServiceRoleClient } from '@/lib/db/server-client';
import { hashClientIp, logAuditEvent } from '@/lib/security/audit-logger';

/**
 * POST /api/enterprise/mou/[agreementId]/sign
 * Captures authorized corporate digital signature, audit IP hash, and transitions
 * agreement to active in both public.employer_agreements and local in-memory fallback.
 */
export async function POST(
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

    const rawBody = await request.json();

    // Augment with network telemetry if missing
    const clientIp =
      rawBody.ipAddress ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';

    const clientUserAgent =
      rawBody.userAgent ||
      request.headers.get('user-agent') ||
      'Verified Enterprise Client';

    const payloadToValidate = {
      ...rawBody,
      ipAddress: clientIp,
      userAgent: clientUserAgent,
      signatureTimestamp: rawBody.signatureTimestamp || new Date().toISOString(),
    };

    const parseResult = MouSignatureSchema.safeParse(payloadToValidate);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed for digital signature payload',
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const signatureData = parseResult.data;

    // 1. Execute in-memory store transition
    const updatedAgreement = signAgreement(agreementId, signatureData);

    // 2. Persist to Supabase public.employer_agreements if reachable
    const supabase = getServiceRoleClient();
    let dbPersisted = false;

    if (supabase) {
      try {
        const { error: updateErr } = await supabase
          .from('employer_agreements')
          .update({
            status: 'active',
            signed_at: signatureData.signatureTimestamp,
            signer_name: signatureData.signerName,
            signer_title: signatureData.signerTitle,
            signer_email: signatureData.signerEmail,
            signer_ip_hash: hashClientIp(signatureData.ipAddress),
            user_agent: signatureData.userAgent,
            consent_statement_accepted: signatureData.consentStatementAccepted,
            compiled_contract_text: updatedAgreement
              ? updatedAgreement.compiledContractText
              : undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('agreement_id', agreementId);

        if (!updateErr) {
          dbPersisted = true;
        } else {
          console.warn('Supabase update note:', updateErr.message);
        }
      } catch (dbErr) {
        console.warn('Database update fallback to in-memory store:', dbErr);
      }
    }

    if (!updatedAgreement && !dbPersisted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Agreement Not Found',
          message: `Cannot execute signature. No agreement exists for ID ${agreementId}`,
        },
        { status: 404 }
      );
    }

    // 3. Emit GovSec RFC 5424 / CEF:0 Audit Log Event
    logAuditEvent({
      eventType: 'MOU_SIGNED',
      principalId: signatureData.signerEmail,
      clientIp: signatureData.ipAddress,
      action: `Enterprise MOU executed by ${signatureData.signerName} for ${agreementId}`,
      status: 'SUCCESS',
      details: {
        agreementId,
        signerTitle: signatureData.signerTitle,
        timestamp: signatureData.signatureTimestamp,
        storage: dbPersisted ? 'supabase_employer_agreements' : 'memory_fallback',
      },
    });

    return NextResponse.json({
      success: true,
      agreementId,
      status: 'active',
      signedAt: signatureData.signatureTimestamp,
      storage: dbPersisted ? 'supabase_employer_agreements' : 'memory_fallback',
      message:
        'Memorandum of Understanding formally executed and verified. Corporate partner authorized for candidate clearinghouse and WIOA placement reporting.',
      agreement: updatedAgreement,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
