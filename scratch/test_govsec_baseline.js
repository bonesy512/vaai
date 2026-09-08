import assert from 'node:assert';

const testGovSecBaseline = async () => {
  const baseUrl = 'http://localhost:3000';

  console.log('====================================================');
  console.log('=== VAAI ENTERPRISE GOVSEC BASELINE AUDIT SUITE  ===');
  console.log('=== NIST SP 800-171 Rev. 3 / CMMC Level 2 Audit  ===');
  console.log('====================================================\n');

  // --- Part 1: CUI & DoD PII Shield Engine Tests ---
  console.log('--- 1. Testing CUI & DoD PII Shield Engine (lib/security/cui-guard.ts) ---');
  const {
    sanitizeText,
    scrubCuiAndPii,
    sanitizeObject,
    containsCui,
    validateSafeForLlm,
  } = await import('../lib/security/cui-guard.ts');

  const testString = `
Candidate: SSN 123-45-6789, Raw SSN 987654321, DoD ID: 1234567890.
Location: MGRS 18SUJ2348006470.
Notice: //CUI// FEDCON //CONTROLLED UNCLASSIFIED INFORMATION// DISTRIBUTION STATEMENT B
  `;

  const hasCui = containsCui(testString);
  console.log(`containsCui detected sensitive tokens: ${hasCui}`);
  assert.strictEqual(hasCui, true, 'containsCui must return true for testString');

  const sanitizeResult = sanitizeText(testString);
  console.log(`Redacted count: ${sanitizeResult.redactedCount}`);
  console.log(`Matched categories: ${sanitizeResult.matchedCategories.join(', ')}`);
  console.log(`Sanitized Output:\n${sanitizeResult.sanitized.trim()}`);

  assert(sanitizeResult.sanitized.includes('[REDACTED_DOD_PII]'), 'Must redact SSN and DoD ID');
  assert(sanitizeResult.sanitized.includes('[REDACTED_MGRS_COORDINATE]'), 'Must redact MGRS coordinate');
  assert(sanitizeResult.sanitized.includes('[REDACTED_CUI]'), 'Must redact CUI markings');
  assert(!sanitizeResult.sanitized.includes('123-45-6789'), 'Plaintext SSN must not appear');
  assert(!sanitizeResult.sanitized.includes('1234567890'), 'Plaintext DoD ID must not appear');

  // Deep Object Sanitization Test
  const nestedDoc = {
    title: 'Candidate Inprocessing',
    student: {
      name: 'Sgt. John Doe',
      ssn: '234-56-7890',
      clearance: 'Secret //CUI//',
      grid: '14RNU12345678',
    },
    meta: {
      tags: ['DOD ID: 0987654321', 'Public Trust'],
    },
  };

  const sanitizedDoc = sanitizeObject(nestedDoc);
  console.log('Sanitized Nested Object:', JSON.stringify(sanitizedDoc, null, 2));
  assert.strictEqual(sanitizedDoc.student.ssn, '[REDACTED_DOD_PII]');
  assert(sanitizedDoc.student.clearance.includes('[REDACTED_CUI]'));
  assert.strictEqual(sanitizedDoc.student.grid, '[REDACTED_MGRS_COORDINATE]');
  assert(sanitizedDoc.meta.tags[0].includes('[REDACTED_DOD_PII]'));

  const validation = validateSafeForLlm(testString);
  console.log(`LLM Validation isSafe: ${validation.isSafe}, violations count: ${validation.violations.length}`);
  assert.strictEqual(validation.isSafe, false, 'Unredacted CUI must fail LLM safety validation');

  console.log('✓ CUI & DoD PII Shield passed all checks.\n');

  // --- Part 2: AES-256-GCM Field Encryption Tests ---
  console.log('--- 2. Testing Authenticated AES-256-GCM Encryption (lib/security/encryption.ts) ---');
  const {
    encryptSensitiveField,
    decryptSensitiveField,
    encryptRecord,
    decryptRecord,
    FipsIntegrityViolationError,
  } = await import('../lib/security/encryption.ts');

  const secretRecord = 'CLASSIFICATION: CUI // RECIPIENT_SSN: 987-65-4321';
  const encrypted = encryptSensitiveField(secretRecord);
  console.log(`Ciphertext length: ${encrypted.ciphertext.length}, IV: ${encrypted.iv}, Tag: ${encrypted.tag}`);

  const decrypted = decryptSensitiveField(encrypted.ciphertext, encrypted.iv, encrypted.tag);
  assert.strictEqual(decrypted, secretRecord, 'Decrypted string must match original');

  // Tamper Verification (FipsIntegrityViolationError thrown on bit-flip)
  let fipsErrorCaught = false;
  try {
    const rawCipherBuf = Buffer.from(encrypted.ciphertext, 'base64');
    rawCipherBuf[0] ^= 0xff; // flip bit
    decryptSensitiveField(rawCipherBuf.toString('base64'), encrypted.iv, encrypted.tag);
  } catch (err) {
    if (err instanceof FipsIntegrityViolationError) {
      fipsErrorCaught = true;
      console.log(`Caught typed FipsIntegrityViolationError: "${err.message.slice(0, 75)}..."`);
    }
  }
  assert.strictEqual(fipsErrorCaught, true, 'AES-256-GCM must throw typed FipsIntegrityViolationError on tampered data');

  // Record Encryption & Decryption
  const userRecord = {
    username: 'marcus.vance',
    clearance: 'Top Secret / SCI',
    ssn: '123-45-6789',
    details: { branch: 'USMC', rank: 'Sgt' },
  };

  const encryptedRec = encryptRecord(userRecord, ['ssn', 'clearance']);
  console.log('Encrypted Record Keys:', Object.keys(encryptedRec));
  assert.notStrictEqual(encryptedRec.ssn, '123-45-6789');

  const decryptedRec = decryptRecord(encryptedRec, ['ssn', 'clearance']);
  console.log('Decrypted Record SSN:', decryptedRec.ssn, 'Clearance:', decryptedRec.clearance);
  assert.strictEqual(decryptedRec.ssn, '123-45-6789');
  assert.strictEqual(decryptedRec.clearance, 'Top Secret / SCI');

  console.log('✓ Authenticated AES-256-GCM encryption passed all checks.\n');

  // --- Part 3: Tamper-Evident Audit Logging Engine Tests ---
  console.log('--- 3. Testing Tamper-Evident Audit Logging (lib/security/audit-logger.ts) ---');
  const { logAuditEvent, verifyAuditChain, formatCef } = await import(
    '../lib/security/audit-logger.ts'
  );

  const event1 = logAuditEvent({
    eventType: 'AUTH_ATTEMPT',
    principalId: 'user-vet-101',
    clientIp: '192.0.2.1',
    action: 'MFA_AUTHENTICATION_SUCCESS',
    status: 'SUCCESS',
    details: { authMethod: 'CAC_PIV' },
  });

  const event2 = logAuditEvent({
    eventType: 'CUI_ACCESS',
    principalId: 'user-vet-101',
    clientIp: '192.0.2.1',
    action: 'INSPECT_CANDIDATE_ROSTER',
    status: 'SUCCESS',
    details: { rosterCount: 15, clearanceLevel: 'Secret' },
  });

  const event3 = logAuditEvent({
    eventType: 'SAFE_HARBOR_REFUSAL',
    principalId: 'anon-probe',
    clientIp: '198.51.100.99',
    action: 'REJECT_CLAIMS_PREPARATION_QUERY',
    status: 'INTERCEPTED',
    details: { promptTopic: 'VA Disability Claim Filing' },
  });

  assert.strictEqual(event2.previousEntryHash, event1.signature, 'Chain link 1->2 must match');
  assert.strictEqual(event3.previousEntryHash, event2.signature, 'Chain link 2->3 must match');

  const chainVerification = verifyAuditChain([event1, event2, event3]);
  console.log(`Initial Chain Verification Valid: ${chainVerification.valid}`);
  assert.strictEqual(chainVerification.valid, true, 'Audit chain must be cryptographically valid');

  // Tamper Verification: modify event 2 action
  const tamperedEvent2 = { ...event2, action: 'UNAUTHORIZED_ACCESS_INJECTION' };
  const tamperedVerification = verifyAuditChain([event1, tamperedEvent2, event3]);
  console.log(`Tampered Chain Verification Valid: ${tamperedVerification.valid}, Tampered Index: ${tamperedVerification.tamperedIndex}`);
  assert.strictEqual(tamperedVerification.valid, false, 'Chain verification must detect altered entry');

  console.log('✓ Tamper-evident audit logging engine passed all checks.\n');

  // --- Part 4: Edge Middleware HTTP Security Headers Tests ---
  console.log('--- 4. Testing Edge Middleware HTTP Headers (middleware.ts) ---');

  let isServerRunning = false;
  try {
    const probe = await fetch(`${baseUrl}/`, { signal: AbortSignal.timeout(1000) });
    if (probe) isServerRunning = true;
  } catch {
    isServerRunning = false;
  }

  let resHomeHeaders;
  if (isServerRunning) {
    const resHome = await fetch(`${baseUrl}/`);
    console.log(`GET / Status: ${resHome.status}`);
    resHomeHeaders = resHome.headers;
  } else {
    console.log('[INFO] Dev server offline. Verifying middleware.ts directly via NextRequest...');
    const { NextRequest } = await import('next/server');
    const { middleware } = await import('../middleware.ts');
    const req = new NextRequest('http://localhost:3000/', {
      headers: { 'user-agent': 'GovSec-Audit-Probe' },
    });
    const res = middleware(req);
    resHomeHeaders = res.headers;
  }

  const hsts = resHomeHeaders.get('strict-transport-security');
  const xfo = resHomeHeaders.get('x-frame-options');
  const xcto = resHomeHeaders.get('x-content-type-options');
  const refPol = resHomeHeaders.get('referrer-policy');
  const permPol = resHomeHeaders.get('permissions-policy');
  const csp = resHomeHeaders.get('content-security-policy');
  const traceId = resHomeHeaders.get('x-vaai-trace-id');
  const baseline = resHomeHeaders.get('x-compliance-baseline');

  console.log(`HSTS: ${hsts}`);
  console.log(`X-Frame-Options: ${xfo}`);
  console.log(`X-Content-Type-Options: ${xcto}`);
  console.log(`Referrer-Policy: ${refPol}`);
  console.log(`Permissions-Policy: ${permPol}`);
  console.log(`X-VAAI-Trace-Id: ${traceId}`);
  console.log(`X-Compliance-Baseline: ${baseline}`);
  console.log(`CSP: ${csp}`);

  assert.strictEqual(hsts, 'max-age=63072000; includeSubDomains; preload');
  assert.strictEqual(xfo, 'DENY');
  assert.strictEqual(xcto, 'nosniff');
  assert.strictEqual(refPol, 'strict-origin-when-cross-origin');
  assert(permPol?.includes('camera=()'));
  assert(traceId && traceId.length > 20, 'Trace ID must be present');
  assert.strictEqual(baseline, 'NIST-SP-800-171-REV3');

  // Verify CSP strict script directives
  assert(csp?.includes("default-src 'self'"));
  assert(csp?.includes("frame-ancestors 'none'"));
  assert(csp?.includes('nonce-'));
  assert(csp?.includes("'strict-dynamic'"));
  // Ensure script-src does not allow unsafe-inline
  const scriptSrcDirective = csp?.split(';').find((d) => d.trim().startsWith('script-src'));
  console.log(`Script-src directive: "${scriptSrcDirective?.trim()}"`);
  assert(!scriptSrcDirective?.includes("'unsafe-inline'"), 'script-src must NOT contain unsafe-inline');
  assert(!scriptSrcDirective?.includes("'unsafe-eval'"), 'script-src must NOT contain unsafe-eval');

  console.log('✓ Edge middleware strict CSP and federal security headers verified.\n');

  // --- Part 5: Audit Ingestion Route (POST /api/audit/log) ---
  console.log('--- 5. Testing Audit Ingestion API (/api/audit/log) ---');
  let auditStatus = 200;
  let jsonAudit;

  const auditPayload = {
    eventType: 'CUI_ACCESS',
    action: 'CANDIDATE_PORTFOLIO_INSPECTED',
    status: 'SUCCESS',
    principalId: 'recruiter-booz-allen-01',
    details: {
      candidateId: 'vet-001',
      clearanceLevel: 'Secret',
    },
  };

  if (isServerRunning) {
    const resAudit = await fetch(`${baseUrl}/api/audit/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auditPayload),
    });
    auditStatus = resAudit.status;
    jsonAudit = await resAudit.json();
  } else {
    console.log('[INFO] Dev server offline. Invoking POST /api/audit/log directly...');
    const { NextRequest } = await import('next/server');
    const { POST: auditRouteHandler } = await import('../app/api/audit/log/route.ts');
    const reqAudit = new NextRequest('http://localhost:3000/api/audit/log', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(auditPayload),
    });
    const resAudit = await auditRouteHandler(reqAudit);
    auditStatus = resAudit.status;
    jsonAudit = await resAudit.json();
  }

  console.log(`POST /api/audit/log status: ${auditStatus}, success: ${jsonAudit.success}`);
  assert.strictEqual(auditStatus, 200);
  assert.strictEqual(jsonAudit.success, true);
  assert(jsonAudit.sequence > 0);
  assert(jsonAudit.signature);

  console.log('✓ Audit ingestion API verified.\n');

  console.log('====================================================');
  console.log('=== ALL SPECIFICATIONS VERIFIED SUCCESSFULLY!    ===');
  console.log('====================================================');
};

testGovSecBaseline().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
