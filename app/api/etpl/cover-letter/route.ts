import { NextRequest, NextResponse } from 'next/server';
import {
  VAAI_TWC_COVER_LETTER,
  exportTwcCoverLetterMarkdown,
} from '@/lib/etpl-filing-data';
import { logAuditEvent } from '@/lib/security/audit-logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format')?.toLowerCase();

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    logAuditEvent({
      eventType: 'AUTH_ATTEMPT',
      principalId: 'TWC_STATE_REVIEWER',
      clientIp,
      action: `Exported TWC ETPL Transmittal Cover Letter [Format: ${format || 'JSON'}]`,
      status: 'SUCCESS',
      details: {
        programCode: VAAI_TWC_COVER_LETTER.programCode,
        format: format || 'json',
      },
    });

    if (format === 'markdown' || format === 'md') {
      const markdown = exportTwcCoverLetterMarkdown();
      return new Response(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition':
            'attachment; filename="VAAI-TWC-ETPL-Transmittal-Cover-Letter.md"',
          'X-Compliance-Baseline': 'WIOA-TITLE-I-ETPL',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        coverLetter: VAAI_TWC_COVER_LETTER,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Compliance-Baseline': 'WIOA-TITLE-I-ETPL',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate TWC ETPL transmittal package',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
