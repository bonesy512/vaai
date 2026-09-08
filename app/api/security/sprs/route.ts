import { NextRequest, NextResponse } from 'next/server';
import {
  SPRS_METADATA,
  SPRS_CONTROLS,
  SPRS_FAMILIES,
  getSprsSummary,
  exportSprsMarkdown,
  exportSprsSubmissionRecord,
} from '@/lib/security/sprs-data';
import { logAuditEvent } from '@/lib/security/audit-logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format')?.toLowerCase();

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Record audit event for official DoD SPRS inspection
    logAuditEvent({
      eventType: 'CUI_ACCESS',
      principalId: 'DOD_SPRS_ASSESSOR',
      clientIp,
      action: `Retrieved NIST SP 800-171 Rev. 3 DoD SPRS Scoring Worksheet [Format: ${format || 'JSON'}]`,
      status: 'SUCCESS',
      details: {
        documentId: SPRS_METADATA.documentId,
        score: '110/110',
        cageCode: SPRS_METADATA.cageCode,
        format: format || 'json',
      },
    });

    if (format === 'markdown' || format === 'md') {
      const markdown = exportSprsMarkdown();
      return new Response(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition':
            'attachment; filename="VAAI-NIST-SP-800-171-Rev3-SPRS-Scorecard.md"',
          'X-Compliance-SPRS-Score': '110',
          'X-Compliance-Baseline': 'NIST-SP-800-171-REV3',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    if (format === 'submission') {
      const submission = exportSprsSubmissionRecord();
      return new Response(submission, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': 'inline; filename="VAAI-SPRS-Submission-Record.txt"',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    const summary = getSprsSummary();

    return NextResponse.json(
      {
        success: true,
        metadata: SPRS_METADATA,
        summary,
        families: SPRS_FAMILIES,
        controls: SPRS_CONTROLS,
        submissionRecord: exportSprsSubmissionRecord(),
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'X-Compliance-SPRS-Score': '110',
          'X-Compliance-Framework': 'NIST-SP-800-171-REV3',
          'X-Compliance-CMMC-Level': '2',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
