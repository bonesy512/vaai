import { VeteranResumeData } from '../components/veteran-resume-document';
import { VETERAN_RESUME_REGISTRY, getAllResumeCandidates, getVeteranResumeData } from '../lib/resume-data';
import { CANDIDATES, VETERAN_CANDIDATES } from '../lib/candidates';
import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

function verifyResumeLayoutConstraints(data: VeteranResumeData): boolean {
  console.log(`\nVerifying resume constraints for: ${data.fullName} (${data.credentialUuid})...`);

  // 1. Verify Defense & Accreditation Identifiers
  if (!data.credentialUuid.startsWith('VAAI-2026-')) {
    throw new Error(`Invalid Credential UUID format: ${data.credentialUuid}`);
  }
  assert(data.credentialUuid.startsWith('VAAI-2026-'), `Credential UUID verified: ${data.credentialUuid}`);

  if (!data.socCode.startsWith('15-') && !data.socCode.startsWith('43-')) {
    throw new Error(`Invalid SOC Code classification: ${data.socCode}`);
  }
  assert(data.socCode.startsWith('15-') || data.socCode.startsWith('43-'), `SOC Crosswalk validated: ${data.socCode}`);

  if (data.verifiedSeatHours < 36.0) {
    throw new Error(`Seat hours violate WIOA threshold: ${data.verifiedSeatHours}h < 36.0h`);
  }
  assert(data.verifiedSeatHours >= 36.0, `WIOA Seat-Time Threshold satisfied: ${data.verifiedSeatHours}h >= 36.0h`);

  if (data.capstoneScore < 80.0) {
    throw new Error(`Capstone score below passing benchmark: ${data.capstoneScore}% < 80.0%`);
  }
  assert(data.capstoneScore >= 80.0, `Capstone score benchmark satisfied: ${data.capstoneScore}% >= 80.0%`);

  // 2. Character & Content Length Checks to Guarantee 1-Page Layout
  const summaryLength = data.summary.length;
  if (summaryLength > 450) {
    throw new Error(`Executive summary exceeds 1-page budget: ${summaryLength} chars (max 450)`);
  }
  assert(summaryLength <= 450, `Summary character count budget: ${summaryLength}/450 chars`);

  const bulletCount = data.militaryExperience.reduce((acc, exp) => acc + exp.bullets.length, 0);
  if (bulletCount > 6) {
    throw new Error(`Bullet count risks 2-page spill: ${bulletCount} bullets (max 6)`);
  }
  assert(bulletCount <= 6, `Bullet count budget: ${bulletCount}/6 bullets`);

  // 3. Core Competencies Budget
  assert(
    data.coreCompetencies.length >= 6 && data.coreCompetencies.length <= 12,
    `Core competencies count budget: ${data.coreCompetencies.length} items (3-column grid)`
  );

  return true;
}

console.log('\n================================================================');
console.log('📄  VAAI 1-PAGE VETERAN RESUME & ATS COMPLIANCE AUDIT');
console.log('================================================================\n');

// --------------------------------------------------------------------------
// TEST 1: User Specification Mock Candidate Verification
// --------------------------------------------------------------------------
console.log('TEST 1: Verifying Prompt Mock Data Specification...');

const promptMockData: VeteranResumeData = {
  fullName: 'Marcus Vance',
  phone: '(512) 555-0144',
  email: 'm.vance@defense-candidate.org',
  location: 'Austin, TX',
  securityClearance: 'Secret',
  branch: 'Army',
  mosCode: '25B',
  mosTitle: 'Information Technology Specialist',
  targetRole: 'AI Workflow Automation Specialist',
  socCode: '15-1299.08',
  credentialUuid: 'VAAI-2026-A1B2',
  issuedDate: 'August 14, 2026',
  verifiedSeatHours: 38.5,
  capstoneScore: 94.2,
  capstoneTitle: 'Automated Defense Intelligence & CUI Redaction Pipeline',
  summary:
    'Transitioning U.S. Army Information Technology Specialist (25B) with 6+ years managing tactical communications and enterprise zero-trust infrastructure. Certified Applied AI Operator (CAIO Level 1).',
  coreCompetencies: [
    'NIST SP 800-171',
    'Python & Pyodide',
    'CUI / PII Redaction',
    'Zod Schema Validation',
    'Docker',
    'PostgreSQL RLS',
  ],
  militaryExperience: [
    {
      roleTitle: 'Senior Tactical Network Specialist',
      unitAndBranch: '3rd Armored Brigade Combat Team, U.S. Army',
      dateRange: '2022 – 2026',
      bullets: [
        'Administered SIPR/NIPR tactical communication nodes supporting 1,200+ personnel.',
        'Engineered Python automation pipelines reducing hardware deployment time by 42%.',
      ],
    },
  ],
  educationAndCredentials: [
    {
      title: 'Certified Applied AI Operator (CAIO Level 1)',
      issuer: 'VAAI / TWC ETPL',
      date: 'Aug 2026',
      details: 'TWC-ETPL-78752-VAAI',
    },
  ],
};

verifyResumeLayoutConstraints(promptMockData);

// --------------------------------------------------------------------------
// TEST 2: All Registry Candidates Satisfy 1-Page Constraints
// --------------------------------------------------------------------------
console.log('\nTEST 2: Verifying All Registered Candidates in lib/resume-data.ts...');

const allCandidates = getAllResumeCandidates();
assert(allCandidates.length >= 5, `At least 5 veteran candidates registered (Actual: ${allCandidates.length})`);

for (const candidate of allCandidates) {
  verifyResumeLayoutConstraints(candidate);
}

// --------------------------------------------------------------------------
// TEST 3: Dynamic Loader getVeteranResumeData()
// --------------------------------------------------------------------------
console.log('\nTEST 3: Testing Async Candidate Loader getVeteranResumeData()...');

async function testLoader() {
  const resumeA1B2 = await getVeteranResumeData('VAAI-2026-A1B2');
  assert(!!resumeA1B2, 'Loaded Marcus Vance by UUID');
  assert(resumeA1B2?.fullName === 'Marcus Vance', 'Full name matches Marcus Vance');

  const resumeDemo = await getVeteranResumeData('VAAI-2026-DEMO');
  assert(!!resumeDemo, 'Loaded Alex Mercer by UUID');
  assert(resumeDemo?.branch === 'Army' && resumeDemo?.mosCode === '25B', 'Alex Mercer Army 25B verified');

  const resumeNavy = await getVeteranResumeData('VAAI-2026-N7D3');
  assert(!!resumeNavy, 'Loaded Elena Rodriguez Navy CTN');
  assert(resumeNavy?.branch === 'Navy' && resumeNavy?.securityClearance === 'Top Secret / SCI', 'Elena Rodriguez Top Secret / SCI verified');

  const resumeFallback = await getVeteranResumeData('VAAI-2026-CUSTOM99');
  assert(!!resumeFallback, 'Generated valid candidate for any valid VAAI-2026- prefix');
  assert(resumeFallback?.credentialUuid === 'VAAI-2026-CUSTOM99', 'UUID properly assigned to custom request');

  const resumeInvalid = await getVeteranResumeData('INVALID-UUID-123');
  assert(resumeInvalid === null, 'Returns null for unknown/invalid UUID');
}

testLoader().then(() => {
  // --------------------------------------------------------------------------
  // TEST 4: File Structure & Component Existence
  // --------------------------------------------------------------------------
  console.log('\nTEST 4: Checking File Structure and Component Integrity...');

  const resumeDocPath = path.join(process.cwd(), 'components/veteran-resume-document.tsx');
  assert(fs.existsSync(resumeDocPath), 'components/veteran-resume-document.tsx exists');

  const resumeDynamicPagePath = path.join(process.cwd(), 'app/(dashboard)/resume/[credentialUuid]/page.tsx');
  assert(fs.existsSync(resumeDynamicPagePath), 'app/(dashboard)/resume/[credentialUuid]/page.tsx exists');

  const resumeHubPagePath = path.join(process.cwd(), 'app/(dashboard)/resume/page.tsx');
  assert(fs.existsSync(resumeHubPagePath), 'app/(dashboard)/resume/page.tsx exists');

  const toolbarPath = path.join(process.cwd(), 'components/resume-action-toolbar.tsx');
  assert(fs.existsSync(toolbarPath), 'components/resume-action-toolbar.tsx exists');

  // --------------------------------------------------------------------------
  // TEST 5: Candidate Data Alignment & Employer Card Action Integration
  // --------------------------------------------------------------------------
  console.log('\nTEST 5: Checking Candidate Data Alignment & Employer Card Actions...');

  assert(Array.isArray(CANDIDATES) && CANDIDATES.length >= 5, 'CANDIDATES array is exported with >= 5 candidates');

  const vance = CANDIDATES.find((c: any) => c.name.includes('Vance'));
  assert(vance?.credentialUuid === 'VAAI-2026-A1B2', 'Marcus Vance mapped to VAAI-2026-A1B2');

  const mercer = CANDIDATES.find((c: any) => c.name.includes('Mercer'));
  assert(mercer?.credentialUuid === 'VAAI-2026-DEMO', 'Alex Mercer mapped to VAAI-2026-DEMO');

  const rodriguez = CANDIDATES.find((c: any) => c.name.includes('Rodriguez'));
  assert(rodriguez?.credentialUuid === 'VAAI-2026-N7D3', 'Elena Rodriguez mapped to VAAI-2026-N7D3');

  const washington = CANDIDATES.find((c: any) => c.name.includes('Washington'));
  assert(washington?.credentialUuid === 'VAAI-2026-AF42', 'Jamal Washington mapped to VAAI-2026-AF42');

  const oconnor = CANDIDATES.find((c: any) => c.name.includes("O'Connor"));
  assert(oconnor?.credentialUuid === 'VAAI-2026-MC81', "Liam O'Connor mapped to VAAI-2026-MC81");

  // Verify app/(enterprise)/employers/page.tsx contains required links and buttons
  const employersPageContent = fs.readFileSync(
    path.join(process.cwd(), 'app/(enterprise)/employers/page.tsx'),
    'utf-8'
  );
  assert(
    employersPageContent.includes('/resume/${candidate.credentialUuid || candidate.id}'),
    'Employer page links to /resume/${candidate.credentialUuid || candidate.id}'
  );
  assert(
    employersPageContent.includes('1-Page Resume (PDF)'),
    'Employer page renders 1-Page Resume (PDF) action button'
  );
  assert(
    employersPageContent.includes('Run Capstone Sandbox'),
    'Employer page renders Run Capstone Sandbox action button'
  );
  assert(
    employersPageContent.includes('Record Hire'),
    'Employer page renders Record Hire action button'
  );

  console.log('\n================================================================');
  console.log('🎉 ALL 1-PAGE RESUME & ATS VERIFICATION TESTS PASSED (100%)');
  console.log('================================================================\n');
});
