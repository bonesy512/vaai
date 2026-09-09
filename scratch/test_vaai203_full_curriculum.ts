/**
 * VAAI-203 Full Curriculum Verification Suite
 * Tests course catalog, lesson data, exam question banks, answer keys,
 * rubric mathematical integrity, Python syntax, and capstone evaluator.
 */

import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { INSTITUTIONAL_COURSES, getCourseById } from '../lib/courses-data';
import {
  VAAI_203_CAPSTONE_RUBRIC,
  VAAI_203_MODULE_1_QUESTIONS,
  VAAI_203_MODULE_2_QUESTIONS,
  VAAI_203_MODULE_3_QUESTIONS,
  VAAI_203_MODULE_4_QUESTIONS,
  VAAI_203_CAPSTONE_QUESTIONS,
  VAAI_203_MODULE_EXAMS,
  VAAI_203_CAPSTONE_EXAM,
  VAAI_203_LABS,
  getVAAI203ModuleExam,
  gradeVAAI203ModuleExam,
} from '../lib/vaai-203-assessment-data';
import {
  getLessonContent,
  getCourseModules,
  LESSON_REGISTRY,
} from '../lib/lesson-content-data';
import {
  evaluateVAAI203CapstoneSubmission,
  SYNTHETIC_EDGE_SCENARIOS,
} from '../lib/vaai-203-capstone-evaluator';
import { VAAI_203_PROGRESSION_MODULES } from '../components/lms/course-progression-tree';

console.log('🧪 ========================================================');
console.log('🧪 VAAI-203 FULL CURRICULUM VERIFICATION SUITE');
console.log('🧪 Compliance: TWC-ETPL-78752-VAAI-203 | WIOA Title I');
console.log('🧪 ========================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: Course Catalog Metadata & Rubric
// ----------------------------------------------------------------------------
console.log('👉 [TEST 1] Verifying VAAI-203 Course Catalog & Accreditation Metadata...');
const course = getCourseById('VAAI-203');
assert(course, 'VAAI-203 must exist in INSTITUTIONAL_COURSES');
assert.strictEqual(course.id, 'VAAI-203');
assert.strictEqual(course.clockHours, 40);
assert.strictEqual(course.ceuValue, 4.0);
assert.strictEqual(course.socCode, '15-1252.00');
assert.strictEqual(course.level, 2);
assert.strictEqual(course.track, 'engineering');

assert(course.capstone, 'VAAI-203 must define capstone project');
assert.strictEqual(course.capstone.rubric.length, 4, 'Capstone rubric must define exactly 4 dimensions');
const rubricSum = course.capstone.rubric.reduce((acc, r) => acc + r.weight, 0);
assert.strictEqual(rubricSum, 100, `Capstone rubric weights must sum to 100% (got ${rubricSum})`);
assert(course.capstone.starterCode && course.capstone.starterCode.length > 200, 'Capstone starter code must be populated');

assert.strictEqual(course.modules.length, 4, 'VAAI-203 must define exactly 4 modules');
let modIdx = 1;
for (const mod of course.modules) {
  assert.strictEqual(mod.contactHours, 10, `Module ${modIdx} must be 10 contact hours`);
  assert(mod.learningObjectives.length >= 3, `Module ${modIdx} must have >= 3 learning objectives`);
  assert(mod.exercises.length >= 1, `Module ${modIdx} must have exercises`);
  assert(mod.exercises[0].starterCode.length > 50, `Module ${modIdx} exercise must have starter code`);
  modIdx++;
}
console.log('   ✓ Course catalog metadata, modules, and rubric verified.\n');

// ----------------------------------------------------------------------------
// TEST 2: Rubric & Question Bank Integrity
// ----------------------------------------------------------------------------
console.log('👉 [TEST 2] Verifying VAAI-203 Question Banks & Answer Keys...');

// Rubric Check
const dimWeights = Object.values(VAAI_203_CAPSTONE_RUBRIC.dimensions).reduce((sum, d) => sum + d.weightPercentage, 0);
assert.strictEqual(dimWeights, 100, `VAAI_203_CAPSTONE_RUBRIC weights must total 100% (got ${dimWeights})`);
assert.strictEqual(VAAI_203_CAPSTONE_RUBRIC.passingScorePercentage, 80);

// Module Questions
assert.strictEqual(VAAI_203_MODULE_1_QUESTIONS.length, 3);
assert.strictEqual(VAAI_203_MODULE_2_QUESTIONS.length, 3);
assert.strictEqual(VAAI_203_MODULE_3_QUESTIONS.length, 3);
assert.strictEqual(VAAI_203_MODULE_4_QUESTIONS.length, 3);
assert.strictEqual(VAAI_203_CAPSTONE_QUESTIONS.length, 10);

// Answer Keys verification against spec
const m1Answers = VAAI_203_MODULE_1_QUESTIONS.map(q => q.correctAnswer);
assert.deepStrictEqual(m1Answers, ['B', 'C', 'B'], `Module 1 answers must be B, C, B (got ${m1Answers.join(', ')})`);

const m2Answers = VAAI_203_MODULE_2_QUESTIONS.map(q => q.correctAnswer);
assert.deepStrictEqual(m2Answers, ['B', 'C', 'A'], `Module 2 answers must be B, C, A (got ${m2Answers.join(', ')})`);

const m3Answers = VAAI_203_MODULE_3_QUESTIONS.map(q => q.correctAnswer);
assert.deepStrictEqual(m3Answers, ['B', 'C', 'B'], `Module 3 answers must be B, C, B (got ${m3Answers.join(', ')})`);

const m4Answers = VAAI_203_MODULE_4_QUESTIONS.map(q => q.correctAnswer);
assert.deepStrictEqual(m4Answers, ['B', 'C', 'A'], `Module 4 answers must be B, C, A (got ${m4Answers.join(', ')})`);

const capstoneAnswers = VAAI_203_CAPSTONE_QUESTIONS.map(q => q.correctAnswer);
const expectedCapstoneAnswers = ['B', 'C', 'B', 'B', 'B', 'C', 'B', 'A', 'C', 'B'];
assert.deepStrictEqual(
  capstoneAnswers,
  expectedCapstoneAnswers,
  `Capstone exam answers must match spec (got ${capstoneAnswers.join(', ')})`
);

// Verify all questions have doctrinal references and valid options
const allQuestions = [
  ...VAAI_203_MODULE_1_QUESTIONS,
  ...VAAI_203_MODULE_2_QUESTIONS,
  ...VAAI_203_MODULE_3_QUESTIONS,
  ...VAAI_203_MODULE_4_QUESTIONS,
  ...VAAI_203_CAPSTONE_QUESTIONS,
];

for (const q of allQuestions) {
  assert(q.question.length > 10, `Question ${q.id} missing text`);
  assert(q.options.A && q.options.B && q.options.C && q.options.D, `Question ${q.id} must have options A, B, C, D`);
  assert(['A', 'B', 'C', 'D'].includes(q.correctAnswer), `Question ${q.id} invalid correct answer`);
  assert(q.explanation.length > 20, `Question ${q.id} missing explanation`);
  assert(q.doctrinalRef.length > 5, `Question ${q.id} missing doctrinal citation`);
}

// Test grading function
const m1Grade = gradeVAAI203ModuleExam('mod-1', {
  'vaai-203-q1-1': 'B',
  'vaai-203-q1-2': 'C',
  'vaai-203-q1-3': 'B',
});
assert.strictEqual(m1Grade.scorePercentage, 100);
assert.strictEqual(m1Grade.passed, true);

const m1FailedGrade = gradeVAAI203ModuleExam('mod-1', {
  'vaai-203-q1-1': 'A',
  'vaai-203-q1-2': 'A',
  'vaai-203-q1-3': 'A',
});
assert.strictEqual(m1FailedGrade.scorePercentage, 0);
assert.strictEqual(m1FailedGrade.passed, false);

console.log('   ✓ Question banks, doctrinal citations, answer keys, and grading verified.\n');

// ----------------------------------------------------------------------------
// TEST 3: Lesson Registry & WIOA Hours
// ----------------------------------------------------------------------------
console.log('👉 [TEST 3] Verifying Lesson Registry & Progression Tree for VAAI-203...');

const m1 = getLessonContent('VAAI-203', 'M1', 'L1');
const m2 = getLessonContent('VAAI-203', 'M2', 'L1');
const m3 = getLessonContent('VAAI-203', 'M3', 'L1');
const m4 = getLessonContent('VAAI-203', 'M4', 'L1');

assert(m1, 'VAAI-203 M1/L1 must be registered');
assert(m2, 'VAAI-203 M2/L1 must be registered');
assert(m3, 'VAAI-203 M3/L1 must be registered');
assert(m4, 'VAAI-203 M4/L1 must be registered');

// Test alias resolution: mod-1 / les-1
const m1Alias = getLessonContent('VAAI-203', 'mod-1', 'les-1');
assert(m1Alias, 'VAAI-203 mod-1/les-1 alias must resolve');
assert.strictEqual(m1Alias.lessonTitle, m1.lessonTitle);

const lessons = [m1, m2, m3, m4];
let totalMinutes = 0;
for (const les of lessons) {
  totalMinutes += les.contactMinutes;
  assert.strictEqual(les.contactMinutes, 600, 'Each module must have 600 contact minutes (10h)');
  assert(les.theoryMarkdown.length > 500, `Lesson ${les.moduleId} theory must be comprehensive`);
  assert(les.starterCode.length > 100, `Lesson ${les.moduleId} starter code must be non-empty`);
  assert(les.keyTakeaways.length >= 3, `Lesson ${les.moduleId} must have >= 3 takeaways`);
  assert(les.militaryCrosswalkNote && les.militaryCrosswalkNote.length > 20, `Lesson ${les.moduleId} must have military crosswalk`);
}
assert.strictEqual(totalMinutes, 2400, 'Total contact minutes must be 2400 (40 hours)');

const courseModules = getCourseModules('VAAI-203');
assert.strictEqual(courseModules.length, 4, 'getCourseModules must return 4 modules for VAAI-203');

assert.strictEqual(VAAI_203_PROGRESSION_MODULES.length, 4, 'VAAI_203_PROGRESSION_MODULES must define 4 modules');
console.log('   ✓ Lesson registry, WIOA contact hours (40.0h / 2400min), and progression tree verified.\n');

// ----------------------------------------------------------------------------
// TEST 4: Capstone Evaluator Execution
// ----------------------------------------------------------------------------
console.log('👉 [TEST 4] Benchmarking Capstone Evaluator against 10 Synthetic Scenarios...');
assert.strictEqual(SYNTHETIC_EDGE_SCENARIOS.length, 10, 'Must have 10 synthetic edge deployment scenarios');

const capstoneEvalPromise = evaluateVAAI203CapstoneSubmission(course.capstone.starterCode);
const capstoneResult = await capstoneEvalPromise;

console.log(`   Evaluation Score: ${capstoneResult.scorePercentage}/100 PTS (Passed: ${capstoneResult.passed})`);
console.log(`   - Schema Conformity: ${capstoneResult.breakdown.schemaConformity.score}/30`);
console.log(`   - Fallback Resilience: ${capstoneResult.breakdown.fallbackResilience.score}/25`);
console.log(`   - Boundary Sanitization: ${capstoneResult.breakdown.boundarySanitization.score}/25`);
console.log(`   - Code Quality: ${capstoneResult.breakdown.codeQuality.score}/20`);

assert(capstoneResult.passed, 'Capstone starter code must pass evaluation (>= 80%)');
assert(capstoneResult.scorePercentage >= 80, `Expected score >= 80, got ${capstoneResult.scorePercentage}`);
assert.strictEqual(capstoneResult.breakdown.schemaConformity.score, 30, 'Should earn 30/30 on zero-egress air-gap');
assert.strictEqual(capstoneResult.breakdown.fallbackResilience.score, 25, 'Should earn 25/25 on SWaP-C VRAM');

// Test that broken code fails
const brokenCode = `print("Hello World")`;
const failResult = await evaluateVAAI203CapstoneSubmission(brokenCode);
assert.strictEqual(failResult.passed, false, 'Non-compliant code must fail capstone evaluation');
assert(failResult.scorePercentage < 80, `Non-compliant code score should be < 80, got ${failResult.scorePercentage}`);
console.log('   ✓ Capstone evaluation engine verified (compliant code passes >= 80%, stub fails).\n');

// ----------------------------------------------------------------------------
// TEST 5: Python AST / Syntax Verification
// ----------------------------------------------------------------------------
console.log('👉 [TEST 5] Checking Python Syntax of all 4 Laboratories and Capstone Pipeline...');

const pythonSnippets = [
  { name: 'Lab 1: EdgeVRAMBudgeter', code: VAAI_203_LABS['mod-1'].starterCode },
  { name: 'Lab 2: GGUFIntegrityInspector', code: VAAI_203_LABS['mod-2'].starterCode },
  { name: 'Lab 3: AirGapEgressAuditor', code: VAAI_203_LABS['mod-3'].starterCode },
  { name: 'Lab 4: EdgeWatchdogOrchestrator', code: VAAI_203_LABS['mod-4'].starterCode },
  { name: 'Capstone Starter Code', code: course.capstone.starterCode },
];

for (const snippet of pythonSnippets) {
  // Check AST validity in python3 via stdin
  try {
    execSync('python3 -c "import sys, ast; ast.parse(sys.stdin.read())"', {
      input: snippet.code,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    console.log(`   ✓ ${snippet.name}: Python AST Parse OK`);
  } catch (err: any) {
    const stderr = err.stderr ? err.stderr.toString() : String(err);
    assert.fail(`Python syntax error in ${snippet.name}: ${stderr}`);
  }
}

console.log('\n🎉 ALL VAAI-203 CURRICULUM & ENGINE TESTS PASSED PERFECTLY!');
