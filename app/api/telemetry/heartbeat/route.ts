import { NextRequest, NextResponse } from 'next/server';
import { getCourseById } from '@/lib/courses-data';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const TelemetryHeartbeatSchema = z.object({
  courseId: z.string().optional().default('VAAI-101'),
  lessonId: z.string().min(1),
  activeSeconds: z.number().int().positive().max(7200),
  totalAccumulatedSeconds: z.number().nonnegative().optional(),
  studentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = TelemetryHeartbeatSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid telemetry heartbeat payload',
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { courseId, lessonId, activeSeconds, totalAccumulatedSeconds, studentId } = parseResult.data;
    const course = getCourseById(courseId);
    const courseClockHours = course ? course.clockHours : 40;
    
    // WIOA Title I Mandate: 90% seat-time compliance threshold
    const requiredThresholdSeconds = Math.round(courseClockHours * 3600 * 0.9);
    const accumulated = (totalAccumulatedSeconds || 0) + activeSeconds;
    const isProgressThresholdMet = accumulated >= requiredThresholdSeconds;
    const progressPercent = Math.min(100, Math.round((accumulated / (courseClockHours * 3600)) * 100));

    const now = new Date();
    const intervalStart = new Date(now.getTime() - activeSeconds * 1000);

    // Attempt Supabase persistence
    let storageBackend: 'supabase' | 'local_enclave' = 'local_enclave';
    let dbError: string | null = null;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const effectiveUserId = user?.id || studentId || 'vet-trainee-session';

      // Insert seat time log
      const { error: insertError } = await supabase.from('seat_time_logs').insert({
        user_id: effectiveUserId,
        lesson_id: `${courseId}:${lessonId}`,
        active_seconds: activeSeconds,
        interval_start: intervalStart.toISOString(),
        interval_end: now.toISOString(),
        is_compliant: true,
      });

      if (!insertError) {
        storageBackend = 'supabase';
      } else {
        dbError = insertError.message;
      }
    } catch (err: unknown) {
      dbError = err instanceof Error ? err.message : String(err);
    }

    return NextResponse.json(
      {
        success: true,
        courseId,
        lessonId,
        activeSeconds,
        accumulatedSeconds: accumulated,
        courseClockHours,
        requiredThresholdSeconds,
        isProgressThresholdMet,
        progressPercent,
        storage: storageBackend,
        dbError: dbError || undefined,
        timestamp: now.toISOString(),
        complianceStandard: 'WIOA Title I / TWC ETPL 90% Threshold',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: 'Telemetry heartbeat processing failure',
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
