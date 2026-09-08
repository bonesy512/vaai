import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { SandboxRuntime, LAB_PRESETS } from '../lib/lms/sandbox-runtime';
import { evaluateLabSubmission } from '../lib/lms/rubric-evaluator';
import {
  crosswalkMilitaryProfile,
  getAvailableBranches,
  getMosListForBranch,
} from '../lib/lms/skills-graph';
import { POST as gradeSubmissionHandler } from '../app/api/lms/grade-submission/route';
import { POST as telemetryStreamHandler } from '../app/api/lms/telemetry/stream/route';
import CourseLessonPage from '../app/(dashboard)/courses/[moduleSlug]/[lessonSlug]/page';

async function runApexLmsSuite() {
  const baseUrl = 'http://localhost:3000';

  console.log('================================================================');
  console.log('=== VAAI APEX LMS ENGINE COMPREHENSIVE VERIFICATION SUITE    ===');
  console.log('=== Next-Gen In-Browser WASM, Grader, Skills Matrix, Telemetry ===');
  console.log('================================================================\n');

  // -----------------------------------------------------------------
  // 1. In-Browser WASM Execution Engine Tests (lib/lms/sandbox-runtime.ts)
  // -----------------------------------------------------------------
  console.log('--- 1. Testing In-Browser Sandbox Runtime Engine ---');

  // 1.1 Python Execution (Lab 1: PII Scrubber)
  const piiPreset = LAB_PRESETS['pii-scrubber'];
  assert(piiPreset, 'Preset pii-scrubber must exist');
  const pyResult = await SandboxRuntime.execute(piiPreset.initialCode, 'python');
  console.log(`Python Execution Success: ${pyResult.success}, Time: ${pyResult.executionTimeMs}ms`);
  console.log(`Stdout Lines (${pyResult.stdout.length}):\n  ${pyResult.stdout.slice(0, 3).join('\n  ')}`);
  assert.strictEqual(pyResult.success, true, 'Python execution must succeed');
  assert(pyResult.stdout.length > 0, 'Python execution must produce stdout');

  // 1.2 JavaScript Execution (Lab 3: WIOA Webhook Transformer)
  const webhookPreset = LAB_PRESETS['wioa-webhook'];
  assert(webhookPreset, 'Preset wioa-webhook must exist');
  const jsResult = await SandboxRuntime.execute(webhookPreset.initialCode, 'javascript');
  console.log(`JavaScript Execution Success: ${jsResult.success}, Time: ${jsResult.executionTimeMs}ms`);
  console.log(`Stdout Lines (${jsResult.stdout.length}):\n  ${jsResult.stdout.slice(0, 3).join('\n  ')}`);
  assert.strictEqual(jsResult.success, true, 'JavaScript execution must succeed');
  assert(
    jsResult.stdout.some((l) => l.includes('TWC-ETPL-78752-VAAI')),
    'JavaScript execution must format TWC ETPL record'
  );

  // 1.3 JSON Validation Mode
  const validJson = JSON.stringify({ studentId: 'vet-101', contactHours: 38.5, passed: true });
  const jsonResult = await SandboxRuntime.execute(validJson, 'json');
  assert.strictEqual(jsonResult.success, true, 'Valid JSON must parse');
  assert(jsonResult.resultPayload, 'Parsed JSON payload must be present');

  const invalidJson = '{ studentId: invalid_unquoted }';
  const badJsonResult = await SandboxRuntime.execute(invalidJson, 'json');
  assert.strictEqual(badJsonResult.success, false, 'Invalid JSON must fail');
  assert(badJsonResult.stderr.length > 0, 'Invalid JSON must produce stderr error');

  console.log('✓ Sandbox Runtime Engine passed all tests.\n');

  // -----------------------------------------------------------------
  // 2. Dual-Agent Deterministic Rubric Evaluator (lib/lms/rubric-evaluator.ts)
  // -----------------------------------------------------------------
  console.log('--- 2. Testing Dual-Agent Rubric Evaluator Engine ---');

  // 2.1 Valid Passing Submission
  const validSubmission = {
    lessonId: 'lesson-pii-defense',
    labPresetId: 'pii-scrubber',
    studentId: 'vet-eval-001',
    language: 'python' as const,
    code: `
import json
import re

def sanitize_defense_record(raw_record):
    try:
        ssn_pattern = r'\\b\\d{3}-\\d{2}-\\d{4}\\b|\\b\\d{9}\\b'
        edipi_pattern = r'\\b\\d{10}\\b'
        mgrs_pattern = r'\\b(?:[1-5]?[0-9]|60)\\s*[C-HJ-NP-X]\\s*[A-HJ-NP-Z]{2}\\s*(?:\\d{5}\\s*\\d{5}|\\d{8}|\\d{10})\\b'
        cui_pattern = r'(?://CUI//|//FEDCON//|CONTROLLED UNCLASSIFIED INFORMATION)'

        serialized = json.dumps(raw_record)
        serialized = re.sub(cui_pattern, '[REDACTED_CUI]', serialized, flags=re.IGNORECASE)
        serialized = re.sub(mgrs_pattern, '[REDACTED_MGRS_COORDINATE]', serialized, flags=re.IGNORECASE)
        serialized = re.sub(ssn_pattern, '[REDACTED_DOD_PII]', serialized)
        serialized = re.sub(edipi_pattern, '[REDACTED_DOD_PII]', serialized)
        return json.loads(serialized)
    except Exception as e:
        raise ValueError(f"Sanitization Error: {e}")

data = {"candidate": "Sgt. Marcus Vance", "ssn": "[REDACTED_DOD_PII]", "edipi": "[REDACTED_DOD_PII]"}
print(json.dumps(sanitize_defense_record(data)))
    `,
    outputLog: '[RESULT] Sanitized Record:\n{"candidate": "Sgt. Marcus Vance", "ssn": "[REDACTED_DOD_PII]"}',
  };

  const reportPassing = await evaluateLabSubmission(validSubmission);
  console.log(`Passing Report Score: ${reportPassing.scorePercentage}%, Passed: ${reportPassing.passed}`);
  console.log(`PII Leak Detected: ${reportPassing.piiLeakDetected}`);
  console.log(`Criteria Breakdown (${reportPassing.rubricBreakdown.length} criteria):`);
  reportPassing.rubricBreakdown.forEach((c) => {
    console.log(`  - ${c.criterion}: ${c.pointsAwarded}/${c.maxPoints} pts (${c.feedback})`);
  });

  assert(reportPassing.scorePercentage >= 80, 'Score must meet or exceed 80% ETPL threshold');
  assert.strictEqual(reportPassing.passed, true, 'Valid submission must pass');
  assert.strictEqual(reportPassing.piiLeakDetected, false, 'No PII leak in clean code');
  assert.strictEqual(reportPassing.rubricBreakdown.length, 3, 'Must have 3 rubric criteria');

  // 2.2 Failing Submission with PII Leakage
  const piiLeakingSubmission = {
    lessonId: 'lesson-pii-defense',
    labPresetId: 'pii-scrubber',
    studentId: 'vet-eval-002',
    language: 'python' as const,
    code: `
# Broken submission exposing plaintext SSN and MGRS
def leaky_process():
    candidate_ssn = "123-45-6789"
    grid = "18SUJ2348006470"
    print("Exporting sensitive record: " + candidate_ssn)
leaky_process()
    `,
    outputLog: 'Exporting sensitive record: 123-45-6789 at 18SUJ2348006470',
  };

  const reportLeaking = await evaluateLabSubmission(piiLeakingSubmission);
  console.log(`\nLeaking Report Score: ${reportLeaking.scorePercentage}%, Passed: ${reportLeaking.passed}`);
  console.log(`PII Leak Detected: ${reportLeaking.piiLeakDetected}`);
  assert.strictEqual(reportLeaking.piiLeakDetected, true, 'Must detect unredacted SSN and MGRS');
  assert.strictEqual(reportLeaking.passed, false, 'Leaking submission must fail');

  // 2.3 Title 38 Safe Harbor Breach Submission
  const safeHarborBreachSubmission = {
    lessonId: 'lesson-1',
    labPresetId: 'pii-scrubber',
    studentId: 'vet-eval-003',
    language: 'python' as const,
    code: `
# Prohibited Title 38 nexus letter generator
def draft_nexus_letter_and_va_disability_rating_prediction(vet_profile):
    return "Drafting formal legal nexus letter to maximize disability percentage."
    `,
  };

  const reportBreach = await evaluateLabSubmission(safeHarborBreachSubmission);
  console.log(`Safe Harbor Breach Violations: ${reportBreach.remediationSuggestions.length}`);
  assert(
    reportBreach.remediationSuggestions.some((s) => s.includes('Title 38')),
    'Must flag Title 38 Safe Harbor breach'
  );
  assert.strictEqual(reportBreach.passed, false, 'Breach submission must fail');

  console.log('✓ Dual-Agent Rubric Evaluator Engine passed all tests.\n');

  // -----------------------------------------------------------------
  // 3. Military Skills Graph & MOS Crosswalk Engine (lib/lms/skills-graph.ts)
  // -----------------------------------------------------------------
  console.log('--- 3. Testing Military Skills Graph & MOS Crosswalk Engine ---');

  // 3.1 Army 25B Crosswalk
  const army25b = crosswalkMilitaryProfile({
    branch: 'Army',
    mosCode: '25B',
    rankBracket: 'E-5_to_E-6',
  });
  console.log(`Army 25B -> Target SOC: ${army25b.primarySocTitle} (${army25b.primarySocCode})`);
  console.log(`Median Salary: $${army25b.medianSalary.toLocaleString()}`);
  console.log(`Nodes: ${army25b.nodes.length}, Edges: ${army25b.edges.length}`);
  console.log(`Sample Resume Bullet:\n  "${army25b.civilianizedResumeBullets[0]}"`);

  assert.strictEqual(army25b.primarySocCode, '15-1299.08');
  assert.strictEqual(army25b.medianSalary, 118000);
  assert(army25b.nodes.length >= 7, 'Must have duties, competencies, and SOC nodes');
  assert(army25b.edges.length >= 7, 'Must have crosswalk transformation edges');
  assert(army25b.civilianizedResumeBullets.length >= 3, 'Must have at least 3 resume bullets');

  // 3.2 Navy IT & Marine Corps 0671 Crosswalks
  const navyIt = crosswalkMilitaryProfile({
    branch: 'Navy',
    mosCode: 'IT',
    rankBracket: 'E-5_to_E-6',
  });
  assert.strictEqual(navyIt.branch, 'Navy');
  assert.strictEqual(navyIt.primarySocCode, '15-1299.08');

  const usmc0671 = crosswalkMilitaryProfile({
    branch: 'Marine Corps',
    mosCode: '0671',
    rankBracket: 'E-1_to_E-4',
  });
  assert.strictEqual(usmc0671.branch, 'Marine Corps');
  assert.strictEqual(usmc0671.primarySocCode, '15-1299.08');

  // 3.3 Available Branches
  const branches = getAvailableBranches();
  assert(branches.includes('Army') && branches.includes('Navy') && branches.includes('Air Force'));

  const airForceMos = getMosListForBranch('Air Force');
  assert(airForceMos.some((m) => m.code === '1D7X1'));

  console.log('✓ Military Skills Graph & MOS Crosswalk passed all tests.\n');

  // -----------------------------------------------------------------
  // 4. REST API Endpoint Ingestion Tests
  // -----------------------------------------------------------------
  console.log('--- 4. Testing Next.js REST API Gateways ---');

  let isServerRunning = false;
  try {
    const probe = await fetch(`${baseUrl}/api/lms/grade-submission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(1000),
    });
    if (probe) isServerRunning = true;
  } catch {
    isServerRunning = false;
  }

  if (isServerRunning) {
    // 4.1 POST /api/lms/grade-submission
    const resGrade = await fetch(`${baseUrl}/api/lms/grade-submission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validSubmission),
    });

    console.log(`POST /api/lms/grade-submission Status: ${resGrade.status}`);
    assert.strictEqual(resGrade.status, 200, 'Grade submission API must return 200');
    const gradeJson = await resGrade.json();
    assert.strictEqual(gradeJson.success, true);
    assert(gradeJson.gradeReport.scorePercentage >= 80);
    assert.strictEqual(resGrade.headers.get('x-zero-retention'), 'ACTIVE-NIST-800-171');

    // 4.2 Invalid submission (fails schema validation)
    const resBadGrade = await fetch(`${baseUrl}/api/lms/grade-submission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: '', code: 'short' }),
    });
    console.log(`POST /api/lms/grade-submission Bad Request Status: ${resBadGrade.status}`);
    assert.strictEqual(resBadGrade.status, 400, 'Bad request must return 400');

    // 4.3 POST /api/lms/telemetry/stream
    const resTelemetry = await fetch(`${baseUrl}/api/lms/telemetry/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: 'ai-literacy-101/lesson-1',
        studentId: 'vet-student-demo',
        clientTimestamp: new Date().toISOString(),
        events: [
          {
            id: 'evt-1',
            eventType: 'CODE_EXECUTION_ATTEMPT',
            lessonId: 'ai-literacy-101/lesson-1',
            timestamp: new Date().toISOString(),
            payload: { language: 'python' },
          },
          {
            id: 'evt-2',
            eventType: 'VIDEO_CHECKPOINT_ANSWERED',
            lessonId: 'ai-literacy-101/lesson-1',
            timestamp: new Date().toISOString(),
            payload: { checkpointId: 'chk-1', correct: true },
          },
          {
            id: 'evt-3',
            eventType: 'TAB_FOCUS',
            lessonId: 'ai-literacy-101/lesson-1',
            timestamp: new Date().toISOString(),
            payload: { hidden: false },
          },
        ],
      }),
    });

    console.log(`POST /api/lms/telemetry/stream Status: ${resTelemetry.status}`);
    assert.strictEqual(resTelemetry.status, 200, 'Telemetry ingestion must return 200');
    const telemJson = await resTelemetry.json();
    assert.strictEqual(telemJson.success, true);
    assert.strictEqual(telemJson.receivedCount, 3);

    // 4.4 Verify Course Lesson Page HTML
    const resLessonPage = await fetch(`${baseUrl}/courses/ai-literacy-101/lesson-1`);
    console.log(`GET /courses/ai-literacy-101/lesson-1 Status: ${resLessonPage.status}`);
    assert.strictEqual(resLessonPage.status, 200);
    const lessonHtml = await resLessonPage.text();
    assert(lessonHtml.includes('VAAI Apex LMS Engine'), 'Page must contain VAAI Apex LMS Engine branding');
  } else {
    console.log('[INFO] Dev server offline. Verifying Route Handlers directly via NextRequest...');

    // 4.1 Direct invocation of grade-submission
    const reqGrade = new NextRequest('http://localhost:3000/api/lms/grade-submission', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validSubmission),
    });
    const resGrade = await gradeSubmissionHandler(reqGrade);
    assert.strictEqual(resGrade.status, 200);
    const gradeJson = await resGrade.json();
    assert.strictEqual(gradeJson.success, true);
    assert(gradeJson.gradeReport.scorePercentage >= 80);
    assert.strictEqual(resGrade.headers.get('x-zero-retention'), 'ACTIVE-NIST-800-171');
    console.log('✓ In-process grade-submission route verified (Status: 200).');

    // 4.2 Direct invocation with invalid payload
    const reqBadGrade = new NextRequest('http://localhost:3000/api/lms/grade-submission', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lessonId: '', code: 'short' }),
    });
    const resBadGrade = await gradeSubmissionHandler(reqBadGrade);
    assert.strictEqual(resBadGrade.status, 400);
    console.log('✓ In-process invalid submission validation verified (Status: 400).');

    // 4.3 Direct invocation of telemetry stream
    const reqTelemetry = new NextRequest('http://localhost:3000/api/lms/telemetry/stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        lessonId: 'ai-literacy-101/lesson-1',
        studentId: 'vet-student-demo',
        clientTimestamp: new Date().toISOString(),
        events: [
          {
            id: 'evt-1',
            eventType: 'CODE_EXECUTION_ATTEMPT',
            lessonId: 'ai-literacy-101/lesson-1',
            timestamp: new Date().toISOString(),
            payload: { language: 'python' },
          },
          {
            id: 'evt-2',
            eventType: 'VIDEO_CHECKPOINT_ANSWERED',
            lessonId: 'ai-literacy-101/lesson-1',
            timestamp: new Date().toISOString(),
            payload: { checkpointId: 'chk-1', correct: true },
          },
          {
            id: 'evt-3',
            eventType: 'TAB_FOCUS',
            lessonId: 'ai-literacy-101/lesson-1',
            timestamp: new Date().toISOString(),
            payload: { hidden: false },
          },
        ],
      }),
    });
    const resTelemetry = await telemetryStreamHandler(reqTelemetry);
    assert.strictEqual(resTelemetry.status, 200);
    const telemJson = await resTelemetry.json();
    assert.strictEqual(telemJson.success, true);
    assert.strictEqual(telemJson.receivedCount, 3);
    console.log('✓ In-process telemetry stream ingestion verified (Status: 200).');

    // 4.4 Verify CourseLessonPage export
    assert(typeof CourseLessonPage === 'function', 'CourseLessonPage component must be exported');
    console.log('✓ CourseLessonPage React component verified.');
  }

  console.log('✓ All REST APIs and Course Pages verified.\n');

  console.log('================================================================');
  console.log('=== ALL APEX LMS ENGINE SPECIFICATIONS VERIFIED (100% PASS)  ===');
  console.log('================================================================');
}

runApexLmsSuite().catch((err) => {
  console.error('Apex LMS Test Suite Failed:', err);
  process.exit(1);
});
