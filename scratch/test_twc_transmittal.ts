/**
 * Automated Verification Suite for TWC ETPL Formal Transmittal Cover Letter & Exhibits
 */
import assert from 'node:assert';
import {
  VAAI_TWC_COVER_LETTER,
  exportTwcCoverLetterMarkdown,
} from '../lib/etpl-filing-data';
import { GET as coverLetterRouteHandler } from '../app/api/etpl/cover-letter/route';
import { NextRequest } from 'next/server';

console.log('--- 1. Testing TWC Transmittal Cover Letter Data Model ---');

// Validate Date & Recipients
assert.strictEqual(VAAI_TWC_COVER_LETTER.date, 'September 8, 2026');
assert.strictEqual(
  VAAI_TWC_COVER_LETTER.recipient.title,
  'Eligible Training Provider System (ETPS) Coordinator'
);
assert.strictEqual(
  VAAI_TWC_COVER_LETTER.recipient.agency,
  'Texas Workforce Commission (TWC)'
);
assert.strictEqual(
  VAAI_TWC_COVER_LETTER.coordination.boardName,
  'Workforce Solutions Capital Area'
);
assert.strictEqual(
  VAAI_TWC_COVER_LETTER.coordination.boardId,
  'Local Workforce Development Board #14'
);
assert.strictEqual(VAAI_TWC_COVER_LETTER.programCode, 'TWC-ETPL-78752-VAAI');
assert(VAAI_TWC_COVER_LETTER.subject.includes('TWC-ETPL-78752-VAAI'));
console.log('✔ Cover letter recipient and board coordination verified.');

// Validate Instructional Rigor & Telemetry
assert(VAAI_TWC_COVER_LETTER.instructionalRigor.seatTimeEngine.includes('36.0 verified contact hour'));
assert(VAAI_TWC_COVER_LETTER.instructionalRigor.gatedAssessments.includes('80% passing standard'));
assert(VAAI_TWC_COVER_LETTER.instructionalRigor.safeHarborGuardrails.includes('Title 38 U.S.C. §§ 5901–5905'));
console.log('✔ Instructional rigor, 36.0h telemetry, and Title 38 safe harbor verified.');

// Validate Employer Demand & Executed Partners
assert.deepStrictEqual(VAAI_TWC_COVER_LETTER.employerDemand.executedPartners, [
  'Booz Allen Hamilton',
  'Lockheed Martin',
  'CACI',
]);
assert(VAAI_TWC_COVER_LETTER.employerDemand.commitments.length >= 3);
console.log('✔ Executed employer partners and hiring commitments verified.');

// Validate Exhibits A through F
assert.strictEqual(VAAI_TWC_COVER_LETTER.exhibits.length, 6);
const expectedExhibits = ['Exhibit A', 'Exhibit B', 'Exhibit C', 'Exhibit D', 'Exhibit E', 'Exhibit F'];
for (const id of expectedExhibits) {
  const found = VAAI_TWC_COVER_LETTER.exhibits.find((e) => e.id === id);
  assert(found, `Missing exhibit ${id}`);
  assert(found.title.length > 5, `Missing title for ${id}`);
  assert(found.href.length > 0, `Missing href for ${id}`);
  assert(found.status.length > 0, `Missing status for ${id}`);
}
console.log('✔ All 6 Exhibits (A through F) verified.');

// Validate Signatory
assert.strictEqual(VAAI_TWC_COVER_LETTER.signatory.name, 'Thomas M. Schustereit');
assert.strictEqual(
  VAAI_TWC_COVER_LETTER.signatory.title,
  'Co-Founder & Chief Technology Officer'
);
assert.strictEqual(
  VAAI_TWC_COVER_LETTER.signatory.address,
  '6101 Highland Campus Dr, Building 3000, Austin, TX 78752'
);
assert.strictEqual(VAAI_TWC_COVER_LETTER.signatory.email, 'twc-coordination@vaai.edu');
console.log('✔ Executive signatory block verified.');

// Validate Markdown Generation
const markdown = exportTwcCoverLetterMarkdown();
assert(markdown.includes('September 8, 2026'));
assert(markdown.includes('Texas Workforce Commission (TWC)'));
assert(markdown.includes('Workforce Solutions Capital Area'));
assert(markdown.includes('TWC-ETPL-78752-VAAI'));
assert(markdown.includes('Thomas M. Schustereit'));
assert(markdown.includes('Exhibit A:'));
assert(markdown.includes('Exhibit F:'));
console.log(`✔ Markdown generator validated successfully (${markdown.length} characters).`);

console.log('\n--- 2. Testing API Route Handler (/api/etpl/cover-letter) ---');
async function testCoverLetterApi() {
  // JSON format
  const reqJson = new NextRequest('https://vaai.edu/api/etpl/cover-letter');
  const resJson = await coverLetterRouteHandler(reqJson);
  assert.strictEqual(resJson.status, 200);
  const data = await resJson.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.coverLetter.programCode, 'TWC-ETPL-78752-VAAI');
  assert.strictEqual(resJson.headers.get('x-compliance-baseline'), 'WIOA-TITLE-I-ETPL');
  console.log('✔ GET /api/etpl/cover-letter (JSON) returned valid 200 payload.');

  // Markdown format
  const reqMd = new NextRequest('https://vaai.edu/api/etpl/cover-letter?format=markdown');
  const resMd = await coverLetterRouteHandler(reqMd);
  assert.strictEqual(resMd.status, 200);
  assert(resMd.headers.get('content-type')?.includes('text/markdown'));
  assert(resMd.headers.get('content-disposition')?.includes('VAAI-TWC-ETPL-Transmittal-Cover-Letter.md'));
  const mdText = await resMd.text();
  assert(mdText.includes('SUBJECT: Application for Statewide Eligible Training Provider List (ETPL) Inclusion'));
  console.log('✔ GET /api/etpl/cover-letter?format=markdown returned valid 200 attachment.');
}

testCoverLetterApi().then(() => {
  console.log('\n======================================================');
  console.log('🎉 ALL TWC TRANSMITTAL COVER LETTER TESTS PASSED!');
  console.log('======================================================\n');
}).catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
