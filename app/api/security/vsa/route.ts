import { NextRequest, NextResponse } from 'next/server';
import {
  VSA_METADATA,
  VSA_DOMAINS,
  CMMC_PRACTICE_FAMILIES,
  VSA_SOC2_ATTESTATION,
  VSA_DFARS_INCIDENT_RESPONSE,
  VSA_ATTACHMENTS,
  exportVsaMarkdown,
} from '@/lib/security/vsa-data';
import { logAuditEvent } from '@/lib/security/audit-logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format')?.toLowerCase();

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Record audit event for Defense VSA compliance retrieval
    logAuditEvent({
      eventType: 'CUI_ACCESS',
      principalId: 'DEFENSE_VENDOR_AUDITOR',
      clientIp,
      action: `Exported Vendor Security Assessment Response Package [Format: ${format || 'JSON'}]`,
      status: 'SUCCESS',
      details: {
        auditReference: VSA_METADATA.authorizedSigner.auditReference,
        format: format || 'json',
      },
    });

    if (format === 'markdown' || format === 'md') {
      const markdown = exportVsaMarkdown();
      return new Response(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition':
            'attachment; filename="VAAI-Defense-Vendor-Security-Assessment.md"',
          'X-Compliance-Baseline': 'NIST-800-171-REV3',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        metadata: VSA_METADATA,
        domains: VSA_DOMAINS,
        cmmcFamilies: CMMC_PRACTICE_FAMILIES,
        soc2Attestation: VSA_SOC2_ATTESTATION,
        dfarsIncidentResponse: VSA_DFARS_INCIDENT_RESPONSE,
        attachments: VSA_ATTACHMENTS,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Compliance-Baseline': 'NIST-800-171-REV3',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate Vendor Security Assessment package',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
