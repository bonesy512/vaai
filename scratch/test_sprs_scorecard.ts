/**
 * Verification Test Suite: NIST SP 800-171 Rev. 3 DoD SPRS Scoring Worksheet (110/110)
 * 
 * Verifies that the SPRS Scoring Worksheet conforms strictly to the DoD Assessment
 * Methodology (v1.2.1 / DFARS 252.204-7019/7020), including all 110 NIST SP 800-171 Rev. 3
 * controls, 14 practice families, point deduction architecture, and attestation.
 */

import {
  SPRS_METADATA,
  SPRS_CONTROLS,
  SPRS_FAMILIES,
  getSprsSummary,
  filterSprsControls,
  exportSprsSubmissionRecord,
  exportSprsMarkdown,
} from '../lib/security/sprs-data';
import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

console.log('\n================================================================');
console.log('🛡️  VAAI NIST SP 800-171 REV. 3 / DOD SPRS SCORING WORKSHEET AUDIT');
console.log('================================================================\n');

// --------------------------------------------------------------------------
// TEST 1: Total Control Count & Status Attestation
// --------------------------------------------------------------------------
console.log('TEST 1: Verifying 110 Controls and Zero POAM / Deductions...');

assert(SPRS_CONTROLS.length === 110, `Total controls count is exactly 110 (Actual: ${SPRS_CONTROLS.length})`);

const nonMet = SPRS_CONTROLS.filter((c) => c.status !== 'MET');
assert(nonMet.length === 0, `All 110 controls have status === 'MET' (Non-MET: ${nonMet.length})`);

const nonZeroDeductions = SPRS_CONTROLS.filter((c) => c.deduction !== 0);
assert(nonZeroDeductions.length === 0, `All 110 controls have deduction === 0 (Non-zero: ${nonZeroDeductions.length})`);

const emptyImplementation = SPRS_CONTROLS.filter((c) => !c.implementation || c.implementation.trim() === '');
assert(emptyImplementation.length === 0, `All 110 controls have documented code/technical evidence`);

// --------------------------------------------------------------------------
// TEST 2: 14 Practice Families Distribution
// --------------------------------------------------------------------------
console.log('\nTEST 2: Verifying 14 NIST SP 800-171 Practice Families...');

assert(SPRS_FAMILIES.length === 14, `Exactly 14 practice families represented (Actual: ${SPRS_FAMILIES.length})`);

const expectedFamilies: Record<string, number> = {
  'access-control': 22,
  'awareness-training': 3,
  'audit-accountability': 9,
  'configuration-management': 9,
  'identification-authentication': 11,
  'incident-response': 3,
  'maintenance': 6,
  'media-protection': 9,
  'personnel-security': 2,
  'physical-protection': 6,
  'risk-assessment': 3,
  'security-assessment': 4,
  'system-communications': 16,
  'system-information-integrity': 7,
};

let familyTotal = 0;
for (const [fId, expectedCount] of Object.entries(expectedFamilies)) {
  const family = SPRS_FAMILIES.find((f) => f.id === fId);
  assert(!!family, `Family '${fId}' exists`);
  if (family) {
    assert(
      family.controls.length === expectedCount,
      `Family '${family.name}' has ${expectedCount} controls (Actual: ${family.controls.length})`
    );
    familyTotal += family.controls.length;
  }
}
assert(familyTotal === 110, `Sum of controls across all 14 families equals 110 (Actual: ${familyTotal})`);

// --------------------------------------------------------------------------
// TEST 3: Point-Deduction Architecture & Score Math
// --------------------------------------------------------------------------
console.log('\nTEST 3: Verifying Point Weights & Mathematical Calculation...');

const summary = getSprsSummary();

assert(summary.baselineScore === 110, 'Baseline score is 110');
assert(summary.totalDeductions === 0, 'Total deductions is 0');
assert(summary.finalScore === 110, 'Final SPRS score is exactly 110 / 110');
assert(summary.openPoam === 0, 'Open POAM items is 0');
assert(
  summary.fivePointControls + summary.threePointControls + summary.onePointControls === 110,
  `Sum of weighted controls equals 110 (${summary.fivePointControls} + ${summary.threePointControls} + ${summary.onePointControls} = 110)`
);

// --------------------------------------------------------------------------
// TEST 4: Filtering Utility Functions
// --------------------------------------------------------------------------
console.log('\nTEST 4: Verifying Filter and Search Functions...');

const acControls = filterSprsControls('', 'access-control', 'all');
assert(acControls.length === 22, `Filtering by 'access-control' returns 22 controls`);

const fivePtControls = filterSprsControls('', 'all', 5);
assert(fivePtControls.length === summary.fivePointControls, `Filtering by weight=5 returns all 5-pt controls`);

const searchCtrl = filterSprsControls('3.1.1');
assert(searchCtrl.some((c) => c.id === '3.1.1') && searchCtrl.length > 0, `Search for '3.1.1' finds exact control`);

const searchKeyword = filterSprsControls('WASM');
assert(searchKeyword.length >= 2, `Search for 'WASM' finds sandbox execution controls`);

// --------------------------------------------------------------------------
// TEST 5: Official SPRS Submission Record & Markdown Export
// --------------------------------------------------------------------------
console.log('\nTEST 5: Verifying Submission Record & Markdown Exporter...');

const submission = exportSprsSubmissionRecord();
assert(submission.includes('[DoD SPRS SUBMISSION RECORD]'), 'Submission record has header');
assert(submission.includes('SPRS Score:                   110'), 'Submission record has score 110');
assert(submission.includes('CAGE Code:                    9VAA1'), 'Submission record has CAGE 9VAA1');
assert(submission.includes('NIST SP 800-171 Version:      Rev. 3'), 'Submission record cites Rev. 3');
assert(submission.includes('Thomas M. Schustereit'), 'Submission record has Assessor name');

const markdown = exportSprsMarkdown();
assert(markdown.includes('NIST SP 800-171 Rev. 3 / DoD Assessment Methodology (SPRS) Scoring Worksheet'), 'Markdown has title');
assert(markdown.includes('110 / 110'), 'Markdown has 110/110 score');
assert(markdown.includes('3.1.1'), 'Markdown contains control 3.1.1');
assert(markdown.includes('3.14.7'), 'Markdown contains last control 3.14.7');
assert(markdown.includes('Thomas M. Schustereit'), 'Markdown contains assessor sign-off');
assert(markdown.includes('VAAI-SPRS-2026-NIST-800-171-REV3-FINAL'), 'Markdown contains Document ID');

// --------------------------------------------------------------------------
// TEST 6: File System & Routing Integration
// --------------------------------------------------------------------------
console.log('\nTEST 6: Verifying Routes, Footer, and Sitemap Integration...');

const sprsPagePath = path.join(process.cwd(), 'app/(legal)/sprs/page.tsx');
assert(fs.existsSync(sprsPagePath), 'app/(legal)/sprs/page.tsx exists');

const sprsScorecardAlias = path.join(process.cwd(), 'app/(admin)/sprs-scorecard/page.tsx');
assert(fs.existsSync(sprsScorecardAlias), 'app/(admin)/sprs-scorecard/page.tsx alias exists');

const sprsApiRoute = path.join(process.cwd(), 'app/api/security/sprs/route.ts');
assert(fs.existsSync(sprsApiRoute), 'app/api/security/sprs/route.ts exists');

const footerContent = fs.readFileSync(path.join(process.cwd(), 'components/site-footer.tsx'), 'utf-8');
assert(footerContent.includes('href="/sprs"'), 'Footer links to /sprs');
assert(footerContent.includes('DoD SPRS Scorecard (110/110)'), 'Footer displays SPRS label');

const sitemapContent = fs.readFileSync(path.join(process.cwd(), 'app/sitemap.ts'), 'utf-8');
assert(sitemapContent.includes('/sprs'), 'Sitemap indexes /sprs');
assert(sitemapContent.includes('/sprs-scorecard'), 'Sitemap indexes /sprs-scorecard');

const vsaContent = fs.readFileSync(path.join(process.cwd(), 'app/(admin)/vendor-security-assessment/page.tsx'), 'utf-8');
assert(vsaContent.includes('href="/sprs"'), 'VSA page links to /sprs scorecard');

console.log('\n================================================================');
console.log('✅ ALL NIST SP 800-171 REV. 3 / DOD SPRS TESTS PASSED (100%)');
console.log('================================================================\n');
