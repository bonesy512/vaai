import crypto from 'node:crypto';

/**
 * NIST SP 800-171 Rev. 2 / CMMC 2.0 Level 2 Audit Logging Engine
 * Implements AU-2 (Event Logging), AU-3 (Content of Audit Records), and AU-12 (Audit Generation).
 * Formats events in RFC 5424 / Common Event Format (CEF) and guarantees tamper-evidence
 * through cryptographic HMAC-SHA256 hash-chaining.
 */

export type AuditEventType =
  | 'AUTH_ATTEMPT'
  | 'CUI_ACCESS'
  | 'SEAT_TIME_HEARTBEAT'
  | 'CREDENTIAL_ISSUED'
  | 'SAFE_HARBOR_REFUSAL'
  | 'MOU_SIGNED'
  | 'PLACEMENT_RECORDED'
  | 'SECURITY_VIOLATION'
  | 'SESSION_TIMEOUT'
  | 'ENCRYPTION_OPERATION'
  | 'EVALUATION_COMPLETED'
  | 'TELEMETRY_LOGGED';

export type AuditStatus = 'SUCCESS' | 'FAILURE' | 'INTERCEPTED';

export interface AuditEvent {
  id: string; // UUID v4
  sequence: number; // Monotonic sequence counter
  timestamp: string; // ISO 8601 with ms (UTC)
  eventType: AuditEventType;
  principalId: string; // User UUID or 'ANONYMOUS_PROBE'
  ipHash: string; // SHA-256 salted hash of client IP
  action: string; // Action description
  status: AuditStatus;
  details: Record<string, unknown>;
  previousEntryHash: string; // Hash of preceding entry in chain
  signature: string; // HMAC-SHA256 signature covering this record + previousEntryHash
}

export interface AuditLogInput {
  eventType: AuditEventType;
  principalId?: string;
  clientIp?: string;
  action: string;
  status: AuditStatus;
  details?: Record<string, unknown>;
}

const GENESIS_HASH =
  '0000000000000000000000000000000000000000000000000000000000000000';
const AUDIT_SALT =
  process.env.AUDIT_LOG_SALT || 'VAAI_GOVSEC_AUDIT_SALT_CMMC_LEVEL2';

function getAuditHmacKey(): string {
  return (
    process.env.AUDIT_HMAC_SECRET ||
    'VAAI_AUDIT_HMAC_SECRET_NIST_800_171_AU_CONTROLS_SEED'
  );
}

/**
 * Computes a privacy-preserving SHA-256 hash of the client IP address.
 */
export function hashClientIp(clientIp?: string): string {
  if (!clientIp) return 'ANONYMOUS_IP';
  return crypto
    .createHash('sha256')
    .update(`${clientIp}:${AUDIT_SALT}`)
    .digest('hex');
}

/**
 * Computes the HMAC-SHA256 signature for a specific record in the audit chain.
 */
function computeRecordSignature(
  sequence: number,
  timestamp: string,
  eventType: string,
  principalId: string,
  ipHash: string,
  action: string,
  status: string,
  detailsJson: string,
  previousEntryHash: string
): string {
  const canonicalString = [
    sequence.toString(),
    timestamp,
    eventType,
    principalId,
    ipHash,
    action,
    status,
    detailsJson,
    previousEntryHash,
  ].join('|');

  return crypto
    .createHmac('sha256', getAuditHmacKey())
    .update(canonicalString)
    .digest('hex');
}

// Attach audit store to globalThis so it persists across Next.js bundles in Node process
interface GlobalAuditState {
  __vaai_audit_chain?: AuditEvent[];
  __vaai_audit_sequence?: number;
}

const globalAudit = globalThis as unknown as GlobalAuditState;

if (!globalAudit.__vaai_audit_chain) {
  globalAudit.__vaai_audit_chain = [];
  globalAudit.__vaai_audit_sequence = 0;
}

/**
 * Records an audit event into the tamper-evident cryptographic chain.
 */
export function logAuditEvent(input: AuditLogInput): AuditEvent {
  const chain = globalAudit.__vaai_audit_chain!;
  const sequence = ++globalAudit.__vaai_audit_sequence!;
  const timestamp = new Date().toISOString();
  const id = crypto.randomUUID();
  const principalId = input.principalId || 'ANONYMOUS_PROBE';
  const ipHash = hashClientIp(input.clientIp);
  const details = input.details || {};
  const detailsJson = JSON.stringify(details);

  const previousEntryHash =
    chain.length > 0 ? chain[chain.length - 1].signature : GENESIS_HASH;

  const signature = computeRecordSignature(
    sequence,
    timestamp,
    input.eventType,
    principalId,
    ipHash,
    input.action,
    input.status,
    detailsJson,
    previousEntryHash
  );

  const record: AuditEvent = {
    id,
    sequence,
    timestamp,
    eventType: input.eventType,
    principalId,
    ipHash,
    action: input.action,
    status: input.status,
    details,
    previousEntryHash,
    signature,
  };

  chain.push(record);

  // Keep up to 10,000 events in memory for live audit verification
  if (chain.length > 10000) {
    chain.shift();
  }

  // Format to CEF and emit to standard log stream
  const cef = formatCef(record);
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.info(`[GOVSEC-AUDIT] ${cef}`);
  }

  return record;
}

/**
 * Verifies the mathematical integrity of an audit chain.
 * Returns { valid: true } or identifies the exact sequence where tampering occurred.
 */
export function verifyAuditChain(events: AuditEvent[]): {
  valid: boolean;
  tamperedIndex?: number;
  expectedSignature?: string;
  actualSignature?: string;
  error?: string;
} {
  if (events.length === 0) return { valid: true };

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const expectedPreviousHash =
      i === 0 ? event.previousEntryHash : events[i - 1].signature;

    if (event.previousEntryHash !== expectedPreviousHash) {
      return {
        valid: false,
        tamperedIndex: i,
        error: `Hash chain broken at sequence ${event.sequence}. Previous hash pointer does not match preceding signature.`,
      };
    }

    const calculatedSignature = computeRecordSignature(
      event.sequence,
      event.timestamp,
      event.eventType,
      event.principalId,
      event.ipHash,
      event.action,
      event.status,
      JSON.stringify(event.details),
      event.previousEntryHash
    );

    if (calculatedSignature !== event.signature) {
      return {
        valid: false,
        tamperedIndex: i,
        expectedSignature: calculatedSignature,
        actualSignature: event.signature,
        error: `Signature mismatch at sequence ${event.sequence}. Record content has been modified after logging.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Returns in-memory audit log records, optionally capped by limit.
 */
export function getAuditHistory(limit = 100): AuditEvent[] {
  const chain = globalAudit.__vaai_audit_chain || [];
  return chain.slice(-limit);
}

/**
 * Formats an AuditEvent into ArcSight Common Event Format (CEF:0).
 * CEF:Version|Device Vendor|Device Product|Device Version|Device Event Class ID|Name|Severity|[Extension]
 */
export function formatCef(event: AuditEvent): string {
  const severityMap: Record<AuditEventType, number> = {
    AUTH_ATTEMPT: 3,
    CUI_ACCESS: 5,
    SEAT_TIME_HEARTBEAT: 2,
    CREDENTIAL_ISSUED: 4,
    SAFE_HARBOR_REFUSAL: 6,
    MOU_SIGNED: 4,
    PLACEMENT_RECORDED: 4,
    SECURITY_VIOLATION: 8,
    SESSION_TIMEOUT: 4,
    ENCRYPTION_OPERATION: 2,
    EVALUATION_COMPLETED: 4,
    TELEMETRY_LOGGED: 2,
  };

  const severity = severityMap[event.eventType] || 3;
  const detailsString = Object.entries(event.details)
    .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join(' ');

  return `CEF:0|VAAI|LMS|1.0|${event.eventType}|${event.action}|${severity}|src=${event.ipHash} suser=${event.principalId} outcome=${event.status} sequence=${event.sequence} ${detailsString}`;
}
