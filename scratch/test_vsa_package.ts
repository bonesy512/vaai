/**
 * Automated Verification Suite for Defense Contractor Vendor Security Assessment (VSA)
 */
import assert from 'node:assert';
import {
  VSA_METADATA,
  VSA_DOMAINS,
  CMMC_PRACTICE_FAMILIES,
  VSA_SOC2_ATTESTATION,
  VSA_DFARS_INCIDENT_RESPONSE,
  VSA_ATTACHMENTS,
  exportVsaMarkdown,
} from '../lib/security/vsa-data';
import { GET as vsaRouteHandler } from '../app/api/security/vsa/route';
import { NextRequest } from 'next/server';

console.log('--- 1. Testing VSA Data Integrity ---');

// Verify metadata
assert.strictEqual(
  VSA_METADATA.vendorLegalEntity,
  'VAAI (Veteran AI Enablement Platform) / Schustereit & Co. LLC'
);
assert.strictEqual(
  VSA_METADATA.systemEvaluated,
  'VAAI Apex LMS & Talent Clearinghouse Infrastructure'
);
assert.strictEqual(VSA_METADATA.authorizedSigner.name, 'Thomas M. Schustereit');
assert.strictEqual(VSA_METADATA.authorizedSigner.sprsScore, '110 / 110 (Target)');
assert.strictEqual(
  VSA_METADATA.authorizedSigner.auditReference,
  'VAAI-SEC-2026-NIST-800-171-REV3-VSA'
);
console.log('✔ VSA Metadata successfully validated.');

// Verify Domains
assert.strictEqual(VSA_DOMAINS.length, 4, 'Expected 4 SIG Core questionnaire domains');
const totalControls = VSA_DOMAINS.reduce((acc, d) => acc + d.controls.length, 0);
assert(totalControls >= 11, `Expected at least 11 controls, got ${totalControls}`);
for (const domain of VSA_DOMAINS) {
  assert(domain.id && domain.title && domain.frameworkRef, `Domain ${domain.id} missing fields`);
  for (const ctrl of domain.controls) {
    assert(ctrl.id, 'Control missing ID');
    assert(ctrl.controlRef, 'Control missing NIST reference');
    assert(ctrl.question.length > 5, 'Control missing question text');
    assert(ctrl.response.length > 10, 'Control missing response text');
    assert.strictEqual(ctrl.complianceStatus, 'Fully Implemented');
  }
}
console.log(`✔ All ${VSA_DOMAINS.length} Domains & ${totalControls} Controls verified.`);

// Verify CMMC Practice Families
assert.strictEqual(CMMC_PRACTICE_FAMILIES.length, 13, 'Expected 13 CMMC Practice Families');
const requiredCodes = ['AC', 'AT', 'AU', 'CM', 'IA', 'IR', 'MP', 'PS', 'PE', 'RA', 'CA', 'SC', 'SI'];
for (const code of requiredCodes) {
  const found = CMMC_PRACTICE_FAMILIES.find((f) => f.familyCode === code);
  assert(found, `Missing required CMMC practice family code: ${code}`);
  assert(found.nistControls.length > 0, `NIST controls missing for ${code}`);
  assert(found.implementedControls.length > 0, `Implemented controls missing for ${code}`);
  assert(found.evidenceReference.length > 0, `Evidence reference missing for ${code}`);
}
console.log('✔ All 13 CMMC 2.0 Level 2 Practice Families verified.');

// Verify SOC 2 and DFARS
assert(VSA_SOC2_ATTESTATION.security.perimeterDefense.includes('HSTS'));
assert(VSA_DFARS_INCIDENT_RESPONSE.dodNotification.includes('72 hours'));
assert(VSA_ATTACHMENTS.length === 5, 'Expected 5 Attachments in checklist');
console.log('✔ SOC 2 Criteria, DFARS 72h Incident Plan, and Attachments validated.');

// Verify Markdown Generation
const markdown = exportVsaMarkdown();
assert(markdown.includes('# Defense Contractor Vendor Security Assessment Response Package'));
assert(markdown.includes('Thomas M. Schustereit'));
assert(markdown.includes('VAAI-SEC-2026-NIST-800-171-REV3-VSA'));
assert(markdown.includes('**Attachment A:** Architectural Data Flow & Threat Boundary Diagram'));
console.log(`✔ Markdown export generated successfully (${markdown.length} characters).`);

console.log('\n--- 2. Testing API Route Handler ---');
async function testApiRoute() {
  // Test JSON GET
  const reqJson = new NextRequest('https://vaai.edu/api/security/vsa');
  const resJson = await vsaRouteHandler(reqJson);
  assert.strictEqual(resJson.status, 200);
  const data = await resJson.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.domains.length, 4);
  assert.strictEqual(data.cmmcFamilies.length, 13);
  assert.strictEqual(resJson.headers.get('x-compliance-baseline'), 'NIST-800-171-REV3');
  console.log('✔ GET /api/security/vsa (JSON) returned valid 200 payload.');

  // Test Markdown GET
  const reqMd = new NextRequest('https://vaai.edu/api/security/vsa?format=markdown');
  const resMd = await vsaRouteHandler(reqMd);
  assert.strictEqual(resMd.status, 200);
  assert(resMd.headers.get('content-type')?.includes('text/markdown'));
  assert(resMd.headers.get('content-disposition')?.includes('VAAI-Defense-Vendor-Security-Assessment.md'));
  const textMd = await resMd.text();
  assert(textMd.includes('DEFENSE PERIMETER & DATA BOUNDARY'));
  console.log('✔ GET /api/security/vsa?format=markdown returned valid 200 attachment.');
}

testApiRoute().then(() => {
  console.log('\n======================================================');
  console.log('🎉 ALL VENDOR SECURITY ASSESSMENT TESTS PASSED!');
  console.log('======================================================\n');
}).catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
