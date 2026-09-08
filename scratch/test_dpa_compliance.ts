/**
 * Verification Test Suite: Defense-Grade Data Protection Addendum (DPA)
 * 
 * Verifies that the Data Protection Addendum (DPA) meets all defense compliance
 * standards: DFARS 252.204-7012/7020/7021, NIST SP 800-171 Rev. 3, CMMC 2.0 Level 2,
 * Title 38 U.S.C. §§ 5901-5905 Safe Harbor, and WIOA Title I PIRL outcome tracking.
 */

import { compileDpaText, compileMouText, SEED_EMPLOYER_AGREEMENTS, getAgreementById } from '../lib/mou-template';
import { MouDraftData, MouSignatureData } from '../lib/schemas/mou';
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
console.log('🛡️  VAAI DEFENSE-GRADE DATA PROTECTION ADDENDUM (DPA) AUDIT');
console.log('================================================================\n');

// --------------------------------------------------------------------------
// TEST 1: Standalone DPA Text Compilation & Variable Substitution
// --------------------------------------------------------------------------
console.log('TEST 1: Verifying standalone compileDpaText() with Partner parameters...');

const partnerName = 'Northrop Grumman Mission Systems';
const partnerEin = '13-3948571';
const mockSignature: MouSignatureData = {
  signerName: 'VADM Gregory Harris (Ret.)',
  signerTitle: 'VP of Defense Strategic Talent',
  signerEmail: 'gregory.harris@ngc.com',
  signatureTimestamp: '2026-09-08T14:15:00.000Z',
  ipAddress: '199.106.103.55',
  userAgent: 'Mozilla/5.0 (Defense Enterprise Client)',
  consentStatementAccepted: true,
};

const dpaText = compileDpaText(partnerName, partnerEin, mockSignature);

assert(dpaText.includes('Safeguarding Covered Defense Information'), 'DPA title present');
assert(dpaText.includes(partnerName), 'Partner legal name correctly interpolated');
assert(dpaText.includes(partnerEin), 'Partner EIN correctly interpolated');
assert(dpaText.includes(mockSignature.signerName), 'Partner signer name interpolated in execution block');
assert(dpaText.includes('Thomas M. Schustereit'), 'VAAI CTO Thomas M. Schustereit present in execution block');
assert(dpaText.includes('govsec@vaai.edu'), 'VAAI GovSec contact point present');

// --------------------------------------------------------------------------
// TEST 2: Regulatory Baseline & Compliance Framework References
// --------------------------------------------------------------------------
console.log('\nTEST 2: Verifying Regulatory Mandates & Legal Baselines...');

assert(dpaText.includes('DFARS 252.204-7012'), 'DFARS 252.204-7012 covered');
assert(dpaText.includes('DFARS 252.204-7020'), 'DFARS 252.204-7020 covered');
assert(dpaText.includes('DFARS 252.204-7021'), 'DFARS 252.204-7021 covered');
assert(dpaText.includes('NIST SP 800-171 Rev. 3'), 'NIST SP 800-171 Rev. 3 standard cited');
assert(dpaText.includes('CMMC 2.0 Level 2'), 'CMMC 2.0 Level 2 baseline cited');
assert(dpaText.includes('Title 38 U.S.C. §§ 5901–5905') || dpaText.includes('Title 38 U.S.C. §§ 5901-5905'), 'Title 38 U.S.C. Safe Harbor cited');
assert(dpaText.includes('Workforce Innovation and Opportunity Act (WIOA) Title I'), 'WIOA Title I cited');
assert(dpaText.includes('110/110'), '110/110 SPRS score represented');

// --------------------------------------------------------------------------
// TEST 3: All 10 Legal Articles
// --------------------------------------------------------------------------
console.log('\nTEST 3: Verifying Presence of All 10 Legal Articles...');

const requiredArticles = [
  '1. Purpose, Scope, and Order of Precedence',
  '2. Definitions',
  '3. Cybersecurity Standards and Security Controls',
  '4. Client-Side Code Execution & Zero-Retention Architecture',
  '5. Audit Logging and Tamper-Proof Evidence',
  '6. Cyber Incident Reporting and DFARS Compliance',
  '7. WIOA PIRL Data Exchange & Employment Placement Verification',
  '8. Subcontractor Flow-Down Requirements',
  '9. Term, Termination, and Cryptographic Sanitization',
  '10. Execution and Attestation',
];

for (const article of requiredArticles) {
  assert(dpaText.includes(article), `Article present: ${article}`);
}

// Check detailed sub-clauses
assert(dpaText.includes('https://dibnet.dod.mil'), 'DC3 DIBNet incident reporting URL present');
assert(dpaText.includes('seventy-two (72) hours'), '72-Hour DoD incident reporting mandate specified');
assert(dpaText.includes('twenty-four (24) hours'), '24-Hour partner notification mandate specified');
assert(dpaText.includes('WebAssembly (WASM)'), 'WASM sandbox execution specified');
assert(dpaText.includes('Zero Data Retention'), 'Zero data retention on foundation models specified');
assert(dpaText.includes('HMAC-SHA256'), 'Cryptographic HMAC-SHA256 log chaining specified');
assert(dpaText.includes('seven (7) years'), '7-year WORM audit retention specified');
assert(dpaText.includes('ninety (90) days'), '90-day forensic image retention specified');
assert(dpaText.includes('NIST SP 800-88 Rev. 1'), 'NIST SP 800-88 Rev. 1 cryptographic erasure specified');
assert(dpaText.includes('Row-Level Security (RLS)'), 'PostgreSQL RLS tenant isolation specified');

// --------------------------------------------------------------------------
// TEST 4: Addendum Schedules 1, 2, and 3
// --------------------------------------------------------------------------
console.log('\nTEST 4: Verifying Addendum Schedules...');

assert(dpaText.includes('Schedule 1') && dpaText.includes('Technical & Organizational Security Measures (TOMs) Matrix'), 'Schedule 1 present');
assert(dpaText.includes('Schedule 2') && dpaText.includes('CUI Category Crosswalk & Permitted Dissemination Lists'), 'Schedule 2 present');
assert(dpaText.includes('Schedule 3') && dpaText.includes('Form of DFARS 72-Hour Cyber Incident Report Notification'), 'Schedule 3 present');

// --------------------------------------------------------------------------
// TEST 5: Master MOU Integration (compileMouText)
// --------------------------------------------------------------------------
console.log('\nTEST 5: Verifying DPA integration inside compileMouText()...');

const testDraft: MouDraftData = {
  companyLegalName: 'General Dynamics Information Technology',
  dbaName: 'GDIT Federal Operations',
  employerEin: '53-0196580',
  pointOfContact: {
    name: 'Sarah Jenkins',
    title: 'VP Defense Personnel Solutions',
    email: 'sarah.jenkins@gdit.com',
    phone: '703-555-4000',
  },
  targetHiringRoles: ['Applied AI Specialist', 'DoD Cloud Architect'],
  clearanceRequirements: 'Top Secret / SCI',
  annualInterviewCommitment: 25,
  placementReportingConsent: true,
};

const fullContract = compileMouText(testDraft, mockSignature);

assert(fullContract.includes('MEMORANDUM OF UNDERSTANDING (MOU)'), 'Master MOU header present');
assert(fullContract.includes('ADDENDUM A: DATA PROTECTION ADDENDUM (DPA)'), 'Addendum A DPA header present');
assert(fullContract.includes('General Dynamics Information Technology'), 'Draft company name present in both MOU and DPA');
assert(fullContract.includes('53-0196580'), 'Draft EIN present in both MOU and DPA');
assert(fullContract.includes('https://dibnet.dod.mil'), 'DPA incident response preserved in compiled MOU');

// --------------------------------------------------------------------------
// TEST 6: Seed Agreements Contain Compiled Addendum A
// --------------------------------------------------------------------------
console.log('\nTEST 6: Verifying Seed Agreements have Addendum A in compiled text...');

assert(SEED_EMPLOYER_AGREEMENTS.length >= 3, 'At least 3 seed agreements registered');
for (const seed of SEED_EMPLOYER_AGREEMENTS) {
  const agreement = getAgreementById(seed.id);
  assert(!!agreement, `Retrieved agreement: ${seed.id}`);
  if (agreement) {
    assert(
      agreement.compiledContractText.includes('ADDENDUM A: DATA PROTECTION ADDENDUM (DPA)'),
      `Seed agreement ${seed.id} has compiled Addendum A (DPA)`
    );
    assert(
      agreement.compiledContractText.includes('DFARS 252.204-7012'),
      `Seed agreement ${seed.id} has DFARS 252.204-7012`
    );
  }
}

// --------------------------------------------------------------------------
// TEST 7: Static Files & Routing Consistency Check
// --------------------------------------------------------------------------
console.log('\nTEST 7: Checking Public DPA Route, Footer, and Sitemap...');

const dpaPagePath = path.join(process.cwd(), 'app/(legal)/dpa/page.tsx');
assert(fs.existsSync(dpaPagePath), 'Legal page app/(legal)/dpa/page.tsx exists');

const dpaPageContent = fs.readFileSync(dpaPagePath, 'utf-8');
assert(dpaPageContent.includes('Data Protection Addendum'), 'dpa/page.tsx renders title');
assert(dpaPageContent.includes('compileDpaText'), 'dpa/page.tsx uses compileDpaText');

const footerPath = path.join(process.cwd(), 'components/site-footer.tsx');
const footerContent = fs.readFileSync(footerPath, 'utf-8');
assert(footerContent.includes('href="/dpa"'), 'Footer links to /dpa');
assert(footerContent.includes('Data Protection Addendum (DPA)'), 'Footer displays DPA label');

const sitemapPath = path.join(process.cwd(), 'app/sitemap.ts');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
assert(sitemapContent.includes('/dpa'), 'Sitemap indexes /dpa');

const viewerPath = path.join(process.cwd(), 'components/mou-document-viewer.tsx');
const viewerContent = fs.readFileSync(viewerPath, 'utf-8');
assert(viewerContent.includes('Data Protection Addendum'), 'mou-document-viewer.tsx renders DPA');
assert(viewerContent.includes('compileDpaText'), 'mou-document-viewer.tsx imports compileDpaText');

console.log('\n================================================================');
console.log('✅ ALL DEFENSE DATA PROTECTION ADDENDUM (DPA) TESTS PASSED (100%)');
console.log('================================================================\n');
