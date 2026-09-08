import { NextResponse, type NextRequest } from 'next/server';
import {
  evaluateLabSubmission,
  SubmissionPayloadSchema,
} from '@/lib/lms/rubric-evaluator';

/**
 * POST /api/lms/grade-submission
 *
 * Zero-Retention Dual-Agent Rubric Assessment Gateway
 * Executes deterministic Stage 1 schema/CUI gate & Stage 2 semantic consensus evaluation.
 * Does NOT retain raw student code or PII on host infrastructure.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    const parsed = SubmissionPayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const gradeReport = await evaluateLabSubmission(parsed.data);

    return NextResponse.json(
      {
        success: true,
        gradeReport,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Zero-Retention': 'ACTIVE-NIST-800-171',
        },
      }
    );
  } catch (err: unknown) {
    console.error('Error grading lab submission:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal grading engine error',
      },
      { status: 500 }
    );
  }
}
