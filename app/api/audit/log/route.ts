import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logAuditEvent, AuditEventType, AuditStatus } from '@/lib/security/audit-logger';

const AuditIngestSchema = z.object({
  eventType: z.enum([
    'AUTH_ATTEMPT',
    'CUI_ACCESS',
    'SEAT_TIME_HEARTBEAT',
    'CREDENTIAL_ISSUED',
    'SAFE_HARBOR_REFUSAL',
    'SECURITY_VIOLATION',
    'SESSION_TIMEOUT',
    'ENCRYPTION_OPERATION',
  ]),
  action: z.string().min(2, 'Action description is required'),
  status: z.enum(['SUCCESS', 'FAILURE', 'INTERCEPTED']),
  principalId: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
  clientTimestamp: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parseResult = AuditIngestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed for security audit event',
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { eventType, action, status, principalId, details, clientTimestamp } =
      parseResult.data;

    // Extract client IP and trace context
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const traceId = request.headers.get('x-vaai-trace-id') || crypto.randomUUID();

    const loggedRecord = logAuditEvent({
      eventType: eventType as AuditEventType,
      principalId: principalId || 'ANONYMOUS_CLIENT',
      clientIp,
      action,
      status: status as AuditStatus,
      details: {
        ...details,
        traceId,
        clientReportedTime: clientTimestamp || new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      traceId,
      eventId: loggedRecord.id,
      sequence: loggedRecord.sequence,
      signature: loggedRecord.signature,
      timestamp: loggedRecord.timestamp,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: 'GovSec Ingestion Failure',
        message: err instanceof Error ? err.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
