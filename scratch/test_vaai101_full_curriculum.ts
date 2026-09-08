/**
 * VAAI-101 Full Curriculum Automated Verification Suite
 *
 * Verifies:
 * 1. Curriculum Completeness (40 Contact Hours, 4.0 CEU, SOC 15-1299.08)
 * 2. Assessment Question Bank Integrity (12 module questions + 10 capstone questions, options, keys, doctrine)
 * 3. Capstone Rubric Mathematics (30% + 25% + 25% + 20% = 100%, threshold >= 80%)
 * 4. Python AST Syntax Validation on all 4 laboratory starter codes
 * 5. End-to-End Capstone Evaluator execution against 10 synthetic noisy SITREPs
 */

import { execSync } from 'child_process';
import { INSTITUTIONAL_COURSES } from '../lib/courses-data';
import {
  VAAI_101_EXAMS,
  MODULE_1_QUESTIONS,
  MODULE_2_QUESTIONS,
  MODULE_3_QUESTIONS,
  MODULE_4_QUESTIONS,
  CAPSTONE_FINAL_QUESTIONS,
  CAPSTONE_RUBRIC,
  VAAI_101_LABS,
} from '../lib/vaai-101-assessment-data';
import { evaluateCapstoneSubmission, SYNTHETIC_TEST_SITREPS } from '../lib/capstone-evaluator';
import { getLessonContent } from '../lib/lesson-content-data';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('VAAI-101 FULL CURRICULUM AUTOMATED REGRESSION SUITE');
  console.log('Accreditation: TWC-ETPL-78752-VAAI-101 | WIOA Title I >= 90%');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: Curriculum Completeness & Regulatory Anchoring
  // --------------------------------------------------------------------------
  console.log('[TEST 1/5] Validating Course Definition in lib/courses-data.ts...');
  const course101 = INSTITUTIONAL_COURSES.find((c) => c.id === 'VAAI-101');
  assert(!!course101, 'Course VAAI-101 must exist in INSTITUTIONAL_COURSES');
  assert(course101!.clockHours === 40, `VAAI-101 clockHours must equal 40 (got ${course101?.clockHours})`);
  assert(course101!.ceuValue === 4.0, `VAAI-101 ceuValue must equal 4.0 (got ${course101?.ceuValue})`);
  assert(course101!.socCode === '15-1299.08', `VAAI-101 socCode must equal '15-1299.08' (got ${course101?.socCode})`);
  assert(course101!.modules.length === 4, `VAAI-101 must contain exactly 4 operational modules (got ${course101?.modules.length})`);

  // --------------------------------------------------------------------------
  // TEST 2: Assessment Question Bank Integrity & Doctrinal Answer Keys
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2/5] Validating Assessment Banks & Doctrinal Answer Keys...');
  const moduleExams = [
    { mod: 'mod-1', questions: MODULE_1_QUESTIONS, expectedAnswers: ['B', 'C', 'B'] },
    { mod: 'mod-2', questions: MODULE_2_QUESTIONS, expectedAnswers: ['B', 'C', 'A'] },
    { mod: 'mod-3', questions: MODULE_3_QUESTIONS, expectedAnswers: ['B', 'B', 'C'] },
    { mod: 'mod-4', questions: MODULE_4_QUESTIONS, expectedAnswers: ['B', 'B', 'B'] },
  ];

  let totalQuestionsVerified = 0;

  for (const m of moduleExams) {
    assert(m.questions.length === 3, `${m.mod} must contain exactly 3 examination questions`);
    m.questions.forEach((q, idx) => {
      assert(q.question.trim().length > 15, `Question ${q.id} prompt must be substantive`);
      assert(Object.keys(q.options).length === 4, `Question ${q.id} must provide 4 options (A, B, C, D)`);
      assert(['A', 'B', 'C', 'D'].includes(q.correctAnswer), `Question ${q.id} correctAnswer must be A/B/C/D`);
      assert(q.correctAnswer === m.expectedAnswers[idx], `Question ${q.id} answer key mismatch: expected ${m.expectedAnswers[idx]}, got ${q.correctAnswer}`);
      assert(q.explanation.trim().length > 20, `Question ${q.id} explanation must detail doctrinal rationale`);
      assert(q.doctrinalRef.trim().length > 5, `Question ${q.id} must include military doctrinal citation`);
      totalQuestionsVerified++;
    });
  }

  // Verify Capstone 10 Questions
  assert(CAPSTONE_FINAL_QUESTIONS.length === 10, `Capstone final must contain 10 questions (got ${CAPSTONE_FINAL_QUESTIONS.length})`);
  const capstoneExpected = ['B', 'B', 'B', 'A', 'B', 'B', 'B', 'A', 'B', 'B'];
  CAPSTONE_FINAL_QUESTIONS.forEach((q, idx) => {
    assert(q.question.trim().length > 15, `Capstone Q${idx + 1} prompt must be substantive`);
    assert(Object.keys(q.options).length === 4, `Capstone Q${idx + 1} must provide 4 options`);
    assert(q.correctAnswer === capstoneExpected[idx], `Capstone Q${idx + 1} answer key mismatch: expected ${capstoneExpected[idx]}, got ${q.correctAnswer}`);
    assert(q.doctrinalRef.trim().length > 5, `Capstone Q${idx + 1} must cite doctrinal reference`);
    totalQuestionsVerified++;
  });
  console.log(`  ✓ Verified all ${totalQuestionsVerified} assessment questions across 4 modules and capstone final.`);

  // --------------------------------------------------------------------------
  // TEST 3: Capstone Rubric Mathematics & Dimensions
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3/5] Validating Capstone Rubric Mathematics & Passing Floor...');
  const dims = CAPSTONE_RUBRIC.dimensions;
  assert(dims.schemaConformity.weightPercentage === 30, 'Schema Conformity weight must equal 30%');
  assert(dims.fallbackResilience.weightPercentage === 25, 'Fallback Resilience weight must equal 25%');
  assert(dims.boundarySanitization.weightPercentage === 25, 'Boundary Sanitization weight must equal 25%');
  assert(dims.codeQuality.weightPercentage === 20, 'Code Quality weight must equal 20%');

  const totalRubricWeight =
    dims.schemaConformity.weightPercentage +
    dims.fallbackResilience.weightPercentage +
    dims.boundarySanitization.weightPercentage +
    dims.codeQuality.weightPercentage;

  assert(totalRubricWeight === 100, `Capstone rubric weights must sum to exactly 100% (got ${totalRubricWeight}%)`);
  assert(CAPSTONE_RUBRIC.passingScorePercentage === 80, 'Capstone passing threshold must be standardized at >= 80%');

  // Also check course capstone rubric in courses-data.ts
  const courseRubricWeight = course101!.capstone.rubric.reduce((sum, r) => sum + r.weight, 0);
  assert(courseRubricWeight === 100, `Course capstone rubric in courses-data.ts must sum to 100% (got ${courseRubricWeight}%)`);

  // --------------------------------------------------------------------------
  // TEST 4: Python AST Syntax Validation on All 4 Laboratory Starter Codes
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4/5] Executing Python AST Syntax Checks on 4 Laboratory Starter Codes...');
  const labKeys = ['mod-1', 'mod-2', 'mod-3', 'mod-4'];

  for (const labKey of labKeys) {
    const lab = VAAI_101_LABS[labKey];
    assert(!!lab, `Lab spec for ${labKey} must exist`);
    assert(lab.clockHours === 10.0, `${labKey} must allocate 10.0 contact hours`);
    assert(lab.ceuValue === 1.0, `${labKey} must allocate 1.0 CEU`);

    // Verify Python AST parse
    try {
      execSync('python3 -c "import sys, ast; ast.parse(sys.stdin.read())"', {
        input: lab.starterCode,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      console.log(`  ✓ Python AST Syntax Check PASS for ${lab.title}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ Python AST Syntax check failed for ${labKey}:`, msg);
      process.exit(1);
    }
  }

  // --------------------------------------------------------------------------
  // TEST 5: Automated Capstone Evaluation Runner against 10 SITREPs
  // --------------------------------------------------------------------------
  console.log('\n[TEST 5/5] Executing Capstone Evaluation Suite against 10 Synthetic SITREPs...');
  assert(SYNTHETIC_TEST_SITREPS.length === 10, `Must provide exactly 10 synthetic test SITREPs (got ${SYNTHETIC_TEST_SITREPS.length})`);

  // Test student conforming capstone code
  const studentCode = `# Capstone Defense
import json
import re

def process_defense_briefing(raw_report: str) -> dict:
    ssn_regex = r'\\b\\d{3}-\\d{2}-\\d{4}\\b|\\b\\d{9}\\b'
    edipi_regex = r'\\b\\d{10}\\b'
    mgrs_regex = r'\\b(?:[1-5]?[0-9]|60)\\s*[C-HJ-NP-X]\\s*[A-HJ-NP-Z]{2}\\s*(?:\\d{5}\\s*\\d{5}|\\d{8}|\\d{10})\\b'
    sanitized = re.sub(ssn_regex, '[REDACTED]', raw_report)
    sanitized = re.sub(edipi_regex, '[REDACTED]', sanitized)
    sanitized = re.sub(mgrs_regex, '[REDACTED]', sanitized)

    return {
        "status": "SANITIZED",
        "sanitized_payload": sanitized,
        "circuit_breaker": "ENABLED_PACE_FALLBACK",
        "context_token_ceiling": 4096
    }
`;

  const evalResult = await evaluateCapstoneSubmission(studentCode);
  assert(evalResult.scorePercentage >= 80, `Conforming capstone code must score >= 80% (scored ${evalResult.scorePercentage}%)`);
  assert(evalResult.passed === true, 'Conforming capstone evaluation must yield passed = true');
  assert(evalResult.breakdown.schemaConformity.score > 0, 'Schema score must be > 0');
  assert(evalResult.breakdown.fallbackResilience.score > 0, 'Fallback resilience score must be > 0');
  assert(evalResult.breakdown.boundarySanitization.score > 0, 'Boundary sanitization score must be > 0');
  assert(evalResult.breakdown.codeQuality.score > 0, 'Code quality score must be > 0');

  // Check lesson content registry normalization
  console.log('\n[REGISTRY CHECK] Verifying Lesson Content Key Normalization...');
  const l1 = getLessonContent('VAAI-101', 'M1', 'L1');
  const l1Alt = getLessonContent('VAAI-101', 'mod-1', 'les-1');
  assert(!!l1, 'Lesson VAAI-101 M1/L1 must resolve in registry');
  assert(!!l1Alt, 'Lesson VAAI-101 mod-1/les-1 must resolve through normalized fallback');

  console.log('\n================================================================');
  console.log('✅ ALL 5 AUTOMATED VERIFICATION SUITES PASSED SUCCESSFULLY!');
  console.log('VAAI-101 Curriculum, Code Labs, Exams & Capstone Fully Verified.');
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
