/**
 * VAAI Multi-Signal Competency & Engagement Telemetry Tracker
 *
 * Tracks granular student interaction telemetry satisfying WIOA Title I
 * pedagogical rigor and Texas Workforce Commission audit mandates:
 * - Code execution attempts, execution duration, syntax/runtime error metrics
 * - Video checkpoint comprehension hits, seek violations blocked
 * - Active tab focus/blur state transitions and idle timeout windows
 * - Concept drift during hands-on lab evaluations
 */

export type TelemetryEventType =
  | 'CODE_EXECUTION_ATTEMPT'
  | 'CODE_EXECUTION_SUCCESS'
  | 'CODE_EXECUTION_ERROR'
  | 'VIDEO_CHECKPOINT_REACHED'
  | 'VIDEO_CHECKPOINT_ANSWERED'
  | 'VIDEO_SEEK_PREVENTED'
  | 'TAB_FOCUS'
  | 'TAB_BLUR'
  | 'IDLE_TIMEOUT_TRIGGERED'
  | 'CONCEPT_DRIFT_DETECTED'
  | 'RUBRIC_GRADE_SUBMITTED';

export interface TelemetryEvent {
  id: string;
  eventType: TelemetryEventType;
  lessonId: string;
  studentId?: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface TelemetryBatch {
  lessonId: string;
  studentId?: string;
  clientTimestamp: string;
  events: TelemetryEvent[];
}

export interface TelemetryIngestResponse {
  success: boolean;
  receivedCount: number;
  wioaAccumulatedSeconds?: number;
  message?: string;
}

/**
 * Client-Side Engagement Tracker Engine
 */
export class EngagementTracker {
  private buffer: TelemetryEvent[] = [];
  private lessonId: string;
  private studentId?: string;
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private isFlushing = false;
  private endpoint = '/api/lms/telemetry/stream';

  constructor(lessonId: string, studentId?: string, flushIntervalMs = 15000) {
    this.lessonId = lessonId;
    this.studentId = studentId;

    if (typeof window !== 'undefined') {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, flushIntervalMs);

      // Listen for window visibility changes
      window.addEventListener('visibilitychange', this.handleVisibilityChange);
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.recordEvent('TAB_BLUR', { hidden: true });
      this.flush();
    } else {
      this.recordEvent('TAB_FOCUS', { hidden: false });
    }
  };

  private handleBeforeUnload = () => {
    if (this.buffer.length > 0 && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const batch: TelemetryBatch = {
        lessonId: this.lessonId,
        studentId: this.studentId,
        clientTimestamp: new Date().toISOString(),
        events: this.buffer,
      };
      navigator.sendBeacon(this.endpoint, JSON.stringify(batch));
      this.buffer = [];
    }
  };

  /**
   * Records a granular interaction telemetry event.
   */
  public recordEvent(eventType: TelemetryEventType, payload: Record<string, unknown> = {}): void {
    const event: TelemetryEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      eventType,
      lessonId: this.lessonId,
      studentId: this.studentId,
      timestamp: new Date().toISOString(),
      payload,
    };

    this.buffer.push(event);

    // Immediately flush critical milestone events
    if (
      eventType === 'RUBRIC_GRADE_SUBMITTED' ||
      eventType === 'VIDEO_CHECKPOINT_ANSWERED' ||
      this.buffer.length >= 10
    ) {
      this.flush();
    }
  }

  /**
   * Dispatches buffered telemetry events to the ingestion endpoint.
   */
  public async flush(): Promise<TelemetryIngestResponse> {
    if (this.buffer.length === 0 || this.isFlushing) {
      return { success: true, receivedCount: 0 };
    }

    this.isFlushing = true;
    const eventsToSend = [...this.buffer];
    this.buffer = [];

    const batch: TelemetryBatch = {
      lessonId: this.lessonId,
      studentId: this.studentId,
      clientTimestamp: new Date().toISOString(),
      events: eventsToSend,
    };

    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      });

      if (!res.ok) {
        // Re-buffer on failure
        this.buffer = [...eventsToSend, ...this.buffer];
        return { success: false, receivedCount: 0, message: `HTTP ${res.status}` };
      }

      const data: TelemetryIngestResponse = await res.json();
      return data;
    } catch (err: unknown) {
      // Re-buffer events on network error
      this.buffer = [...eventsToSend, ...this.buffer];
      return {
        success: false,
        receivedCount: 0,
        message: err instanceof Error ? err.message : String(err),
      };
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Disposes timers and event listeners.
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
    this.flush();
  }
}
