/**
 * Comprehensive Verification Suite for VAAI-201 Full Curriculum Codification
 * Validates Catalog, Assessment Data, Question Banks, Python AST, and WASM Capstone Evaluator
 */

import { INSTITUTIONAL_COURSES, getCourseById } from '../lib/courses-data';
import {
  VAAI_201_CAPSTONE_RUBRIC,
  VAAI_201_MODULE_EXAMS,
  VAAI_201_CAPSTONE_EXAM,
  VAAI_201_LABS,
  getVAAI201ModuleExam,
  gradeVAAI201ModuleExam,
} from '../lib/vaai-201-assessment-data';
import {
  SYNTHETIC_TACTICAL_MISSIONS,
  evaluateVAAI201CapstoneSubmission,
} from '../lib/vaai-201-capstone-evaluator';
import { getLessonContent } from '../lib/lesson-content-data';
import { ExamQuestionSchema, CapstoneRubricSchema } from '../lib/types/assessment';
import { execSync } from 'child_process';

let failures = 0;
function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failures++;
  }
}

async function runVerification() {
  console.log('================================================================');
  console.log('VAAI-201 FULL CURRICULUM & CAPSTONE EVALUATION VERIFICATION');
  console.log('================================================================\n');

  // 1. Catalog & Accreditation Metadata Checks
  console.log('[SECTION 1] Course Catalog & Accreditation Integrity');
  const course = getCourseById('VAAI-201');
  assert(!!course, 'VAAI-201 found in course catalog');
  if (course) {
    assert(course.clockHours === 45, `Clock hours is 45.0 (actual: ${course.clockHours})`);
    assert(course.ceuValue === 4.5, `CEU value is 4.5 (actual: ${course.ceuValue})`);
    assert(course.socCode === '15-1251.00', `SOC Code is 15-1251.00 (actual: ${course.socCode})`);
    assert(course.modules.length === 4, `Course contains 4 modules (actual: ${course.modules.length})`);
    
    const totalModHours = course.modules.reduce((sum, m) => sum + m.contactHours, 0);
    assert(totalModHours === 45, `Total module hours sum to 45.0 (actual: ${totalModHours})`);

    assert(course.capstone.rubric.length === 4, `Capstone rubric has 4 dimensions (actual: ${course.capstone.rubric.length})`);
    const totalRubricWeight = course.capstone.rubric.reduce((sum, r) => sum + r.weight, 0);
    assert(totalRubricWeight === 100, `Capstone rubric weights sum to 100% (actual: ${totalRubricWeight}%)`);
  }

  // 2. Capstone Rubric Formal Schema
  console.log('\n[SECTION 2] Capstone Rubric Formal Schema Validation');
  const parsedRubric = CapstoneRubricSchema.safeParse(VAAI_201_CAPSTONE_RUBRIC);
  assert(parsedRubric.success, 'VAAI_201_CAPSTONE_RUBRIC conforms to CapstoneRubricSchema');
  const dims = VAAI_201_CAPSTONE_RUBRIC.dimensions;
  assert(dims.schemaConformity.weightPercentage === 30, 'Dimension 1 weight is 30%');
  assert(dims.fallbackResilience.weightPercentage === 25, 'Dimension 2 weight is 25%');
  assert(dims.boundarySanitization.weightPercentage === 25, 'Dimension 3 weight is 25%');
  assert(dims.codeQuality.weightPercentage === 20, 'Dimension 4 weight is 20%');

  // 3. Question Bank Integrity & Answer Key Exactness
  console.log('\n[SECTION 3] Question Bank Schema & Verified Answer Keys');
  assert(VAAI_201_MODULE_EXAMS.length === 4, '4 Module Exams configured');

  const EXPECTED_EXAM_KEYS: Record<string, string> = {
    'vaai-201-q1-1': 'B',
    'vaai-201-q1-2': 'C',
    'vaai-201-q1-3': 'B',
    'vaai-201-q2-1': 'B',
    'vaai-201-q2-2': 'C',
    'vaai-201-q2-3': 'A',
    'vaai-201-q3-1': 'B',
    'vaai-201-q3-2': 'B',
    'vaai-201-q3-3': 'C',
    'vaai-201-q4-1': 'B',
    'vaai-201-q4-2': 'B',
    'vaai-201-q4-3': 'C',
  };

  let totalQuestionsVerified = 0;
  for (const exam of VAAI_201_MODULE_EXAMS) {
    for (const q of exam.questions) {
      const qParse = ExamQuestionSchema.safeParse(q);
      assert(qParse.success, `Question ${q.id} conforms to schema`);
      assert(
        q.correctAnswer === EXPECTED_EXAM_KEYS[q.id],
        `Question ${q.id} answer key verified (expected: ${EXPECTED_EXAM_KEYS[q.id]}, got: ${q.correctAnswer})`
      );
      assert(q.doctrinalRef.length > 5, `Question ${q.id} has doctrinal citation: "${q.doctrinalRef.slice(0, 30)}..."`);
      totalQuestionsVerified++;
    }
  }
  assert(totalQuestionsVerified === 12, `All 12 module questions verified (count: ${totalQuestionsVerified})`);

  // Capstone Exam
  assert(VAAI_201_CAPSTONE_EXAM.questions.length === 10, 'Capstone final exam has 10 questions');
  const EXPECTED_CAPSTONE_KEYS: Record<string, string> = {
    'vaai-201-cap-q1': 'B',
    'vaai-201-cap-q2': 'B',
    'vaai-201-cap-q3': 'C',
    'vaai-201-cap-q4': 'A',
    'vaai-201-cap-q5': 'B',
    'vaai-201-cap-q6': 'B',
    'vaai-201-cap-q7': 'B',
    'vaai-201-cap-q8': 'C',
    'vaai-201-cap-q9': 'B',
    'vaai-201-cap-q10': 'B',
  };

  for (const q of VAAI_201_CAPSTONE_EXAM.questions) {
    const qParse = ExamQuestionSchema.safeParse(q);
    assert(qParse.success, `Capstone Question ${q.id} conforms to schema`);
    assert(
      q.correctAnswer === EXPECTED_CAPSTONE_KEYS[q.id],
      `Capstone Question ${q.id} answer key verified (expected: ${EXPECTED_CAPSTONE_KEYS[q.id]}, got: ${q.correctAnswer})`
    );
  }

  // 4. Grading Engine Test
  console.log('\n[SECTION 4] Exam Grading Engine Execution');
  const sampleSubmission = {
    courseId: 'VAAI-201',
    moduleId: 'mod-1' as const,
    answers: {
      'vaai-201-q1-1': 'B' as const,
      'vaai-201-q1-2': 'C' as const,
      'vaai-201-q1-3': 'B' as const,
    },
    startedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
  };
  const gradeResult = gradeVAAI201ModuleExam('mod-1', sampleSubmission.answers);
  assert(gradeResult.passed === true, '100% submission passes');
  assert(gradeResult.scorePercentage === 100, `Score is 100% (got ${gradeResult.scorePercentage}%)`);

  // 5. Lesson Content Registry
  console.log('\n[SECTION 5] Lesson Registry & Aliases');
  for (let m = 1; m <= 4; m++) {
    const lesson = getLessonContent('VAAI-201', `M${m}`, 'L1');
    assert(!!lesson, `Lesson VAAI-201/M${m}/L1 found in registry`);
    if (lesson) {
      assert(lesson.learningObjectives.length >= 3, `M${m}/L1 has >= 3 learning objectives`);
      assert(lesson.theoryMarkdown.length > 200, `M${m}/L1 has robust theory brief (${lesson.theoryMarkdown.length} chars)`);
      assert(lesson.starterCode.length > 100, `M${m}/L1 has starter code`);
    }

    const aliasLesson = getLessonContent('VAAI-201', `mod-${m}`, 'les-1');
    assert(!!aliasLesson, `Alias VAAI-201/mod-${m}/les-1 resolves correctly`);
  }

  // 6. Python AST Validation
  console.log('\n[SECTION 6] Python AST Parsing for All Labs & Capstone');
  for (const [modKey, lab] of Object.entries(VAAI_201_LABS)) {
    try {
      execSync('python3 -c "import sys, ast; ast.parse(sys.stdin.read())"', {
        input: lab.starterCode,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      assert(true, `Python AST check passed for ${modKey} starter code`);
    } catch (err: unknown) {
      assert(false, `Python AST syntax error in ${modKey} starter code: ${String(err)}`);
    }
  }

  if (course) {
    try {
      execSync('python3 -c "import sys, ast; ast.parse(sys.stdin.read())"', {
        input: course.capstone.starterCode,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      assert(true, 'Python AST check passed for VAAI-201 Capstone starter code');
    } catch (err: unknown) {
      assert(false, `Python AST syntax error in Capstone starter code: ${String(err)}`);
    }
  }

  // 7. Capstone Evaluator Execution
  console.log('\n[SECTION 7] Automated Multi-Agent Capstone Evaluator');
  assert(SYNTHETIC_TACTICAL_MISSIONS.length === 10, `10 synthetic tactical missions loaded (actual: ${SYNTHETIC_TACTICAL_MISSIONS.length})`);

  if (course) {
    const evalResult = await evaluateVAAI201CapstoneSubmission(course.capstone.starterCode);
    assert(evalResult.passed === true, `Starter pipeline passes evaluation (score: ${evalResult.scorePercentage}/100)`);
    assert(evalResult.scorePercentage >= 80, `Score >= 80% passing threshold`);
    assert(evalResult.breakdown.schemaConformity.score === 30, `Dimension 1 scored 30/30`);
    assert(evalResult.breakdown.fallbackResilience.score === 25, `Dimension 2 scored 25/25`);
    assert(evalResult.breakdown.boundarySanitization.score === 25, `Dimension 3 scored 25/25`);
    assert(evalResult.breakdown.codeQuality.score === 20, `Dimension 4 scored 20/20`);
  }

  // Test defective code handling
  const defectiveCode = 'print("hello world without state machine or tools")';
  const defectiveResult = await evaluateVAAI201CapstoneSubmission(defectiveCode);
  assert(defectiveResult.passed === false, `Defective code correctly rejected (score: ${defectiveResult.scorePercentage}/100)`);
  assert(defectiveResult.scorePercentage < 80, `Defective code score < 80%`);

  console.log('\n================================================================');
  if (failures === 0) {
    console.log('✅ ALL VAAI-201 VERIFICATION SUITE CHECKS PASSED PERFECTLY!');
  } else {
    console.error(`❌ VERIFICATION FAILED WITH ${failures} ERRORS`);
    process.exit(1);
  }
  console.log('================================================================\n');
}

runVerification().catch((e) => {
  console.error('Unhandled test execution error:', e);
  process.exit(1);
});
