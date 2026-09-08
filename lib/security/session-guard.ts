import crypto from 'node:crypto';
import { logAuditEvent } from './audit-logger';

/**
 * NIST SP 800-171 Rev. 2 / AC-11 & AC-12 Session Termination Guard
 * Enforces a strict 15-minute (900 seconds) maximum idle timeout for authenticated
 * sessions accessing student records, candidate rosters, or WIOA voucher telemetry.
 */

export const SESSION_IDLE_TIMEOUT_SECONDS = 15 * 60; // 900 seconds (15 minutes)

export interface SessionState {
  sessionId: string;
  userId: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'TERMINATED_IDLE' | 'TERMINATED_LOGOUT';
  telemetry?: Record<string, unknown>;
}

export interface SessionValidationResult {
  active: boolean;
  remainingSeconds: number;
  reason?: string;
}

interface GlobalSessionState {
  __vaai_sessions?: Map<string, SessionState>;
}

const globalSessions = globalThis as unknown as GlobalSessionState;

if (!globalSessions.__vaai_sessions) {
  globalSessions.__vaai_sessions = new Map<string, SessionState>();
}

/**
 * Creates a new tracked session and records the initialization audit event.
 */
export function createSessionTracker(
  userId: string,
  clientIp?: string,
  initialTelemetry?: Record<string, unknown>
): SessionState {
  const sessionId = `VAAI-SESS-${crypto.randomUUID()}`;
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + SESSION_IDLE_TIMEOUT_SECONDS * 1000
  );

  const session: SessionState = {
    sessionId,
    userId,
    createdAt: now.toISOString(),
    lastActiveAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'ACTIVE',
    telemetry: initialTelemetry,
  };

  globalSessions.__vaai_sessions!.set(sessionId, session);

  logAuditEvent({
    eventType: 'AUTH_ATTEMPT',
    principalId: userId,
    clientIp,
    action: 'SESSION_INITIALIZED',
    status: 'SUCCESS',
    details: {
      sessionId,
      idleTimeoutSeconds: SESSION_IDLE_TIMEOUT_SECONDS,
    },
  });

  return session;
}

/**
 * Validates whether a session or timestamp is still active under the 15-minute idle rule.
 */
export function validateSession(
  lastActivityTimestamp: number | string | Date
): SessionValidationResult {
  const lastActiveMs =
    typeof lastActivityTimestamp === 'number'
      ? lastActivityTimestamp
      : new Date(lastActivityTimestamp).getTime();

  if (isNaN(lastActiveMs)) {
    return {
      active: false,
      remainingSeconds: 0,
      reason: 'Invalid session timestamp',
    };
  }

  const nowMs = Date.now();
  const elapsedSeconds = Math.floor((nowMs - lastActiveMs) / 1000);
  const remainingSeconds = Math.max(
    0,
    SESSION_IDLE_TIMEOUT_SECONDS - elapsedSeconds
  );

  if (elapsedSeconds > SESSION_IDLE_TIMEOUT_SECONDS) {
    return {
      active: false,
      remainingSeconds: 0,
      reason: `NIST AC-12 Lockout: Session exceeded 15-minute inactivity limit (${elapsedSeconds}s idle).`,
    };
  }

  return {
    active: true,
    remainingSeconds,
  };
}

/**
 * Checks if a timestamp is expired under AC-11/12 controls.
 */
export function isSessionExpired(lastActive: Date | number | string): boolean {
  return !validateSession(lastActive).active;
}

/**
 * Updates session activity timestamp ("heartbeat touch") to reset the 15-minute idle clock.
 */
export function touchSession(
  sessionId: string,
  clientIp?: string
): SessionState | null {
  const store = globalSessions.__vaai_sessions!;
  const session = store.get(sessionId);

  if (!session) return null;

  const validation = validateSession(session.lastActiveAt);

  if (!validation.active) {
    session.status = 'TERMINATED_IDLE';
    store.set(sessionId, session);

    logAuditEvent({
      eventType: 'SESSION_TIMEOUT',
      principalId: session.userId,
      clientIp,
      action: 'IDLE_TIMEOUT_TERMINATION',
      status: 'INTERCEPTED',
      details: { sessionId, reason: validation.reason },
    });

    return session;
  }

  const now = new Date();
  session.lastActiveAt = now.toISOString();
  session.expiresAt = new Date(
    now.getTime() + SESSION_IDLE_TIMEOUT_SECONDS * 1000
  ).toISOString();

  store.set(sessionId, session);
  return session;
}

/**
 * Explicitly terminates a session (e.g. on logout or security violation).
 */
export function terminateSession(
  sessionId: string,
  reason = 'USER_LOGOUT',
  clientIp?: string
): boolean {
  const store = globalSessions.__vaai_sessions!;
  const session = store.get(sessionId);

  if (!session) return false;

  session.status = reason === 'USER_LOGOUT' ? 'TERMINATED_LOGOUT' : 'TERMINATED_IDLE';
  store.set(sessionId, session);

  logAuditEvent({
    eventType: 'AUTH_ATTEMPT',
    principalId: session.userId,
    clientIp,
    action: 'SESSION_TERMINATED',
    status: 'SUCCESS',
    details: { sessionId, reason },
  });

  return true;
}
