import { INSTITUTIONAL_COURSES, getCatalogSummary } from '../lib/courses-data';
import { CourseSchema, SocCodeRegex } from '../lib/types/course';

function runCourseCatalogTests() {
  console.log('====================================================');
  console.log('[TEST SUITE] VAAI Institutional 10-Course Catalog Verification');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${testName} - ${detail || 'Assertion failed'}`);
      failed++;
    }
  }

  // 1. Catalog Completeness
  assert(
    INSTITUTIONAL_COURSES.length === 10,
    'Catalog Completeness: Exactly 10 courses',
    `Found ${INSTITUTIONAL_COURSES.length} courses`
  );

  // 2. Cumulative Clock Hours Total (425 hours)
  const totalClockHours = INSTITUTIONAL_COURSES.reduce((sum, c) => sum + c.clockHours, 0);
  assert(
    totalClockHours === 425,
    'Cumulative Clock Hours Total: Exactly 425 hours',
    `Calculated ${totalClockHours} hours (expected 425)`
  );

  // 3. Track Partitioning
  const summary = getCatalogSummary();
  
  // Engineering Track: 5 courses (VAAI-101, 201, 203, 301, 302) = 220 hours
  const engCourses = INSTITUTIONAL_COURSES.filter((c) => c.track === 'engineering');
  const engIds = engCourses.map((c) => c.id).sort();
  const expectedEngIds = ['VAAI-101', 'VAAI-201', 'VAAI-203', 'VAAI-301', 'VAAI-302'].sort();
  assert(
    engCourses.length === 5 &&
      JSON.stringify(engIds) === JSON.stringify(expectedEngIds) &&
      summary.trackHours.engineering === 220,
    'Track Partitioning (Engineering): 5 courses, 220 cumulative hours',
    `Got ${engCourses.length} courses with ${summary.trackHours.engineering} hours`
  );

  // Security Track: 3 courses (VAAI-202, 401, 402) = 130 hours
  const secCourses = INSTITUTIONAL_COURSES.filter((c) => c.track === 'security');
  const secIds = secCourses.map((c) => c.id).sort();
  const expectedSecIds = ['VAAI-202', 'VAAI-401', 'VAAI-402'].sort();
  assert(
    secCourses.length === 3 &&
      JSON.stringify(secIds) === JSON.stringify(expectedSecIds) &&
      summary.trackHours.security === 130,
    'Track Partitioning (Security): 3 courses, 130 cumulative hours',
    `Got ${secCourses.length} courses with ${summary.trackHours.security} hours`
  );

  // Operations Track: 2 courses (VAAI-303, 403) = 75 hours
  const opsCourses = INSTITUTIONAL_COURSES.filter((c) => c.track === 'operations');
  const opsIds = opsCourses.map((c) => c.id).sort();
  const expectedOpsIds = ['VAAI-303', 'VAAI-403'].sort();
  assert(
    opsCourses.length === 2 &&
      JSON.stringify(opsIds) === JSON.stringify(expectedOpsIds) &&
      summary.trackHours.operations === 75,
    'Track Partitioning (Operations): 2 courses, 75 cumulative hours',
    `Got ${opsCourses.length} courses with ${summary.trackHours.operations} hours`
  );

  // 4. Taxonomy & SOC Code Validation
  let allSocValid = true;
  let allMosValid = true;
  for (const course of INSTITUTIONAL_COURSES) {
    if (!SocCodeRegex.test(course.socCode)) {
      allSocValid = false;
      console.error(`Invalid SOC code: ${course.id} has ${course.socCode}`);
    }
    if (!course.targetMos || course.targetMos.length < 2) {
      allMosValid = false;
      console.error(`Insufficient target MOS: ${course.id} has ${course.targetMos?.length}`);
    }
  }
  assert(allSocValid, 'Taxonomy Validation: Regex-compliant SOC labor codes on all courses');
  assert(allMosValid, 'Military Crosswalk: >= 2 target military ratings/MOS per course');

  // 5. Voucher Economics & Pricing
  let allPricingValid = true;
  for (const course of INSTITUTIONAL_COURSES) {
    const { etplVoucherPrice, enterpriseSeatPrice, fundingOptions } = course.pricing;
    if (
      etplVoucherPrice < 4000 ||
      etplVoucherPrice > 8500 ||
      enterpriseSeatPrice !== 12500 ||
      !fundingOptions.includes('WIOA Title I') ||
      !fundingOptions.includes('DoD SkillBridge')
    ) {
      allPricingValid = false;
      console.error(`Invalid pricing in ${course.id}: voucher=$${etplVoucherPrice}, enterprise=$${enterpriseSeatPrice}`);
    }
  }
  assert(
    allPricingValid,
    'Voucher Economics: ETPL voucher $4,000-$8,500, enterprise $12,500, compliant funding options'
  );

  // 6. Schema Conformance (Zod CourseSchema validation for all 10 courses)
  let allZodValid = true;
  for (const course of INSTITUTIONAL_COURSES) {
    const res = CourseSchema.safeParse(course);
    if (!res.success) {
      allZodValid = false;
      console.error(`Schema validation failed for ${course.id}:`, res.error.flatten());
    }
  }
  assert(allZodValid, 'Schema Integrity: All 10 courses strictly satisfy CourseSchema Zod definitions');

  // 7. Module Structure Check (Exactly 4 modules per course, module hours sum to course clockHours)
  let allModulesValid = true;
  for (const course of INSTITUTIONAL_COURSES) {
    if (course.modules.length !== 4) {
      allModulesValid = false;
      console.error(`${course.id} does not have exactly 4 modules`);
    }
    const moduleHours = course.modules.reduce((sum, m) => sum + m.contactHours, 0);
    if (moduleHours !== course.clockHours) {
      allModulesValid = false;
      console.error(`${course.id} module hours sum (${moduleHours}) != course clockHours (${course.clockHours})`);
    }
    // Check CEU computation
    if (course.ceuValue !== course.clockHours / 10) {
      allModulesValid = false;
      console.error(`${course.id} CEU value (${course.ceuValue}) != clockHours / 10 (${course.clockHours / 10})`);
    }
  }
  assert(
    allModulesValid,
    'Module Architecture: Exactly 4 modules per course with matching contact hour sums and CEU calculation'
  );

  console.log('\n----------------------------------------------------');
  console.log(`TOTAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('----------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCourseCatalogTests();
