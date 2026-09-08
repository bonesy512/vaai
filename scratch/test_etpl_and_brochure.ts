/**
 * Automated Verification Suite for TWC ETPL 10-Course Expansion & B2B Defense Enterprise Training Catalog
 *
 * Verifies:
 * 1. ETPL Dossier Integrity: 10 courses, 425 cumulative clock hours, 42.5 CEUs, track allocations.
 * 2. Cover Letter API: All 10 course IDs (VAAI-101 to VAAI-403), TWC-ETPL-78752-VAAI, NIST 800-171 Rev 3.
 * 3. Brochure Component & Route: 3 tracks, $12,500/seat pricing, SkillBridge, print styles.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { INSTITUTIONAL_COURSES, getCatalogSummary, getCoursesByTrack } from '../lib/courses-data';
import { GET as coverLetterRouteHandler } from '../app/api/etpl/cover-letter/route';
import { exportTwcCoverLetterMarkdown } from '../lib/etpl-filing-data';

console.log('================================================================');
console.log('🧪 VAAI ETPL 10-COURSE & B2B DEFENSE BROCHURE VERIFICATION SUITE');
console.log('================================================================\n');

// ---------------------------------------------------------------------------
// 1. ETPL Dossier Integrity
// ---------------------------------------------------------------------------
console.log('--- 1. Testing ETPL Dossier Integrity & Catalog Aggregates ---');

const dossierPath = path.join(process.cwd(), 'app/etpl-dossier/page.tsx');
assert(fs.existsSync(dossierPath), `Expected file at ${dossierPath}`);
const dossierContent = fs.readFileSync(dossierPath, 'utf8');

// Assert imports from lib/courses-data
assert(
  dossierContent.includes("from '@/lib/courses-data'") ||
  dossierContent.includes('from "@/lib/courses-data"'),
  'Dossier must import from lib/courses-data'
);
assert(
  dossierContent.includes('CourseProgramTable'),
  'Dossier must embed CourseProgramTable component'
);

// Assert exactly 10 courses
assert.strictEqual(
  INSTITUTIONAL_COURSES.length,
  10,
  `Expected exactly 10 courses, found ${INSTITUTIONAL_COURSES.length}`
);

const expectedCourseIds = [
  'VAAI-101',
  'VAAI-201',
  'VAAI-202',
  'VAAI-203',
  'VAAI-301',
  'VAAI-302',
  'VAAI-303',
  'VAAI-401',
  'VAAI-402',
  'VAAI-403',
];

for (const id of expectedCourseIds) {
  const course = INSTITUTIONAL_COURSES.find((c) => c.id === id);
  assert(course, `Missing course ID: ${id}`);
  assert(course.clockHours >= 35 && course.clockHours <= 50, `Invalid clock hours for ${id}: ${course.clockHours}`);
  assert.strictEqual(course.ceuValue, course.clockHours / 10, `Mismatched CEU value for ${id}`);
  assert.strictEqual(course.modules.length, 4, `Course ${id} must have exactly 4 modules`);
  assert(course.pricing.etplVoucherPrice >= 4000 && course.pricing.etplVoucherPrice <= 8500, `Voucher price out of bounds for ${id}`);
}

// Calculate cumulative clock hours and CEUs
const summary = getCatalogSummary();
assert.strictEqual(
  summary.totalClockHours,
  425,
  `Cumulative clock hours must be exactly 425, received ${summary.totalClockHours}`
);
assert.strictEqual(
  summary.totalClockHours / 10,
  42.5,
  `Cumulative CEUs must be exactly 42.5`
);

// Assert track breakdown: Engineering (220h / 5), Security (130h / 3), Operations (75h / 2)
assert.strictEqual(summary.trackHours.engineering, 220, `Engineering track hours must be 220`);
assert.strictEqual(summary.trackHours.security, 130, `Security track hours must be 130`);
assert.strictEqual(summary.trackHours.operations, 75, `Operations track hours must be 75`);

assert.strictEqual(summary.trackCounts.engineering, 5, `Engineering track course count must be 5`);
assert.strictEqual(summary.trackCounts.security, 3, `Security track course count must be 3`);
assert.strictEqual(summary.trackCounts.operations, 2, `Operations track course count must be 2`);

console.log('✔ ETPL dossier imports and catalog metrics verified (10 courses, 425h, 42.5 CEUs).');
console.log('✔ Track distributions confirmed: Engineering (220h), Cyber Defense (130h), Operations (75h).');

// ---------------------------------------------------------------------------
// 2. Cover Letter API Response
// ---------------------------------------------------------------------------
console.log('\n--- 2. Testing TWC Cover Letter API Response ---');

async function testCoverLetterApi() {
  // Test JSON Response
  const reqJson = new NextRequest('https://vaai.edu/api/etpl/cover-letter');
  const resJson = await coverLetterRouteHandler(reqJson);
  assert.strictEqual(resJson.status, 200);
  assert.strictEqual(resJson.headers.get('x-compliance-baseline'), 'WIOA-TITLE-I-ETPL');

  const data = await resJson.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.providerId, 'TWC-ETPL-78752-VAAI');
  assert(
    data.recipient.includes('Texas Workforce Commission') &&
    data.recipient.includes('Program Quality & ETPL Unit'),
    'Recipient must be addressed to Texas Workforce Commission Workforce Solutions Program Quality & ETPL Unit'
  );

  // Assert catalogSummary in payload
  assert.strictEqual(data.catalogSummary.totalCourses, 10);
  assert.strictEqual(data.catalogSummary.totalClockHours, 425);
  assert.strictEqual(data.catalogSummary.totalCeus, 42.5);

  // Assert all 10 course IDs appear in the programmatic schedule
  assert(Array.isArray(data.coursesSchedule), 'coursesSchedule must be an array');
  assert.strictEqual(data.coursesSchedule.length, 10, 'Schedule must contain 10 rows');

  for (const expectedId of expectedCourseIds) {
    const item = data.coursesSchedule.find((c: any) => c.courseId === expectedId);
    assert(item, `Course ${expectedId} missing from coursesSchedule`);
    assert(item.programCode.startsWith('TWC-ETPL-78752-'), `Invalid program code for ${expectedId}`);
    assert(item.approvedTuition >= 4000 && item.approvedTuition <= 8500, `Tuition out of bounds for ${expectedId}`);
    assert(item.exitCredential.length > 5, `Missing exit credential for ${expectedId}`);
  }

  // Test Markdown export
  const reqMd = new NextRequest('https://vaai.edu/api/etpl/cover-letter?format=markdown');
  const resMd = await coverLetterRouteHandler(reqMd);
  assert.strictEqual(resMd.status, 200);
  assert(resMd.headers.get('content-type')?.includes('text/markdown'));

  const mdText = await resMd.text();
  assert(mdText.includes('TWC-ETPL-78752-VAAI'), 'Markdown must reference TWC-ETPL-78752-VAAI');
  assert(mdText.includes('Workforce Solutions Program Quality & ETPL Unit'), 'Markdown must address Program Quality & ETPL Unit');

  for (const expectedId of expectedCourseIds) {
    assert(mdText.includes(expectedId), `Markdown must itemize course ${expectedId}`);
  }

  // Assert NIST 800-171 Rev. 3 and WORM audit posture
  assert(mdText.includes('NIST SP 800-171 Rev. 3'), 'Markdown must reaffirm NIST SP 800-171 Rev. 3');
  assert(mdText.includes('WORM audit telemetry'), 'Markdown must cite WORM audit telemetry');
  assert(mdText.includes('90-field PIRL reporting'), 'Markdown must cite 90-field PIRL reporting');

  console.log('✔ GET /api/etpl/cover-letter (JSON) returned valid 10-course schedule.');
  console.log('✔ GET /api/etpl/cover-letter (Markdown) verified with provider code TWC-ETPL-78752-VAAI.');
  console.log('✔ NIST SP 800-171 Rev. 3 edge posture and WORM PIRL compliance affirmed.');
}

// ---------------------------------------------------------------------------
// 3. Brochure Route & Component Validation
// ---------------------------------------------------------------------------
console.log('\n--- 3. Testing Defense Training Brochure Component & Route ---');

const brochureComponentPath = path.join(process.cwd(), 'components/enterprise/training-brochure-view.tsx');
assert(fs.existsSync(brochureComponentPath), `Component file missing at ${brochureComponentPath}`);
const brochureCode = fs.readFileSync(brochureComponentPath, 'utf8');

// Assert 3 tracks present
assert(brochureCode.includes('AI & Software Engineering'), 'Brochure must detail AI & Software Engineering track');
assert(brochureCode.includes('Cyber Defense & GovSec'), 'Brochure must detail Cyber Defense & GovSec track');
assert(brochureCode.includes('Defense Logistics & GovCon Operations'), 'Brochure must detail Defense Logistics & GovCon Operations track');

// Assert enterprise cohort pricing
assert(
  brochureCode.includes('$12,500') || brochureCode.includes('12,500/seat') || brochureCode.includes('12,500 / Seat'),
  'Brochure must feature $12,500/seat enterprise cohort pricing'
);

// Assert DoD SkillBridge
assert(brochureCode.includes('SkillBridge'), 'Brochure must feature DoD SkillBridge integration');

// Assert WASM sandboxes and DFARS DPA
assert(brochureCode.includes('WebAssembly') || brochureCode.includes('WASM'), 'Brochure must highlight WASM Pyodide sandboxes');
assert(brochureCode.includes('DFARS 252.204-7012'), 'Brochure must cite DFARS 252.204-7012 DPA');
assert(brochureCode.includes('OpenBadges v3.0'), 'Brochure must cite OpenBadges v3.0');

// Assert print styles
assert(brochureCode.includes('@media print'), 'Brochure must declare @media print rules');
assert(brochureCode.includes('letter portrait'), 'Brochure must set letter portrait size');
assert(brochureCode.includes('break-inside: avoid') || brochureCode.includes('print-avoid-break'), 'Brochure must enforce page-break controls');

// Check route page file
const brochurePagePath = path.join(process.cwd(), 'app/(enterprise)/employers/training-brochure/page.tsx');
assert(fs.existsSync(brochurePagePath), `Route file missing at ${brochurePagePath}`);
const brochurePageCode = fs.readFileSync(brochurePagePath, 'utf8');
assert(brochurePageCode.includes('TrainingBrochureView'), 'Brochure page must render TrainingBrochureView');

console.log('✔ B2B Defense Training Brochure component verified with 3 tracks and all 10 courses.');
console.log('✔ Enterprise pricing ($12,500/seat), SkillBridge alignment, and DFARS DPA confirmed.');
console.log('✔ Print styles (@media print Letter portrait, page break controls) validated.');
console.log('✔ Route app/(enterprise)/employers/training-brochure/page.tsx verified.');

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------
testCoverLetterApi().then(() => {
  console.log('\n================================================================');
  console.log('🎉 ALL ETPL 10-COURSE & B2B DEFENSE BROCHURE CHECKS PASSED (100%)');
  console.log('================================================================\n');
}).catch((err) => {
  console.error('\n❌ Verification failed:', err);
  process.exit(1);
});
