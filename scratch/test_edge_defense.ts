import assert from 'node:assert';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';
import {
  sanitizeText,
  validateSafeForLlm,
  sanitizeObject,
  containsCui,
} from '../lib/security/cui-guard';
import {
  encryptSensitiveField,
  decryptSensitiveField,
  encryptRecord,
  decryptRecord,
  FipsIntegrityViolationError,
} from '../lib/security/encryption';

async function runEdgeDefenseSuite() {
  console.log('================================================================');
  console.log('=== DEFENSE-GRADE EDGE SECURITY & CUI/PII SHIELD TEST SUITE  ===');
  console.log('=== NIST SP 800-171 Rev. 3 / CMMC 2.0 / FIPS 140-3 Validation ===');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // TEST 1: Edge Security Middleware
  // -------------------------------------------------------------
  console.log('--- TEST 1: Edge Security Middleware (middleware.ts) ---');
  const req = new NextRequest('https://vaai.us/courses', {
    headers: { 'user-agent': 'Defense-Audit-Probe' },
  });

  const res = middleware(req);
  assert(res, 'Middleware must return a NextResponse');

  // Verify Transport & Protection Headers
  assert.strictEqual(
    res.headers.get('Strict-Transport-Security'),
    'max-age=63072000; includeSubDomains; preload',
    'HSTS must be 2-year preload'
  );
  assert.strictEqual(res.headers.get('X-Frame-Options'), 'DENY', 'Anti-clickjacking must be DENY');
  assert.strictEqual(res.headers.get('X-Content-Type-Options'), 'nosniff', 'MIME sniffing disabled');
  assert.strictEqual(
    res.headers.get('Referrer-Policy'),
    'strict-origin-when-cross-origin',
    'Referrer policy must be strict-origin-when-cross-origin'
  );
  assert.strictEqual(
    res.headers.get('Permissions-Policy'),
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Permissions policy must restrict camera, mic, geo, payment, usb'
  );
  assert.strictEqual(
    res.headers.get('X-Compliance-Baseline'),
    'NIST-SP-800-171-REV3',
    'Compliance baseline header must match NIST SP 800-171 Rev. 3'
  );

  const traceId = res.headers.get('X-VAAI-Trace-Id');
  assert(traceId && traceId.length === 36, 'Trace ID must be a valid UUIDv4');

  // CSP Verification
  const csp = res.headers.get('Content-Security-Policy');
  assert(csp, 'Content-Security-Policy header must be present');
  console.log('Generated CSP Header:\n', csp);

  assert(csp.includes("default-src 'self'"), "CSP must include default-src 'self'");
  assert(csp.includes("'strict-dynamic'"), "CSP script-src must include 'strict-dynamic'");
  assert(csp.includes("style-src 'self' 'unsafe-inline'"), "CSP must include style-src 'self' 'unsafe-inline'");
  assert(csp.includes("img-src 'self' data: blob: https:"), "CSP must include img-src 'self' data: blob: https:");
  assert(csp.includes("font-src 'self' data:"), "CSP must include font-src 'self' data:");
  assert(csp.includes("connect-src 'self' https://*.supabase.co"), "CSP must include connect-src 'self' https://*.supabase.co");
  assert(csp.includes("object-src 'none'"), "CSP must include object-src 'none'");
  assert(csp.includes("base-uri 'self'"), "CSP must include base-uri 'self'");
  assert(csp.includes("form-action 'self'"), "CSP must include form-action 'self'");
  assert(csp.includes("frame-ancestors 'none'"), "CSP must include frame-ancestors 'none'");

  // Check script-src directive specifically
  const scriptDirective = csp.split(';').map(s => s.trim()).find(s => s.startsWith('script-src'));
  assert(scriptDirective, 'script-src directive must exist');
  assert(!scriptDirective.includes("'unsafe-inline'"), "script-src must NOT contain 'unsafe-inline'");
  assert(!scriptDirective.includes("'unsafe-eval'"), "script-src must NOT contain 'unsafe-eval'");
  assert(/nonce-[A-Za-z0-9+/=]{22,24}/.test(scriptDirective), 'script-src must contain a valid base64 nonce');

  // Check nonce uniqueness across separate requests
  const res2 = middleware(req);
  const csp2 = res2.headers.get('Content-Security-Policy')!;
  const nonce1 = scriptDirective.match(/nonce-([A-Za-z0-9+/=]+)/)![1];
  const nonce2 = csp2.match(/nonce-([A-Za-z0-9+/=]+)/)![1];
  assert.notStrictEqual(nonce1, nonce2, 'Nonces must be unique per request');
  console.log('✓ Edge Security Middleware passed all tests.\n');

  // -------------------------------------------------------------
  // TEST 2: CUI & DoD PII Shield Engine
  // -------------------------------------------------------------
  console.log('--- TEST 2: CUI & DoD PII Shield Engine (lib/security/cui-guard.ts) ---');

  // 2.1 Hyphenated & Spaced SSN
  const ssnTest = sanitizeText('Veteran SSN: 000-12-3456 and alternate 999 88 7777.');
  assert.strictEqual(
    ssnTest.sanitized,
    'Veteran SSN: [REDACTED_DOD_PII] and alternate [REDACTED_DOD_PII].'
  );
  assert(ssnTest.matchedCategories.includes('SSN'));

  // 2.2 Raw 9-digit SSN
  const rawSsnTest = sanitizeText('Candidate unformatted SSN is 987654321 for verification.');
  assert.strictEqual(
    rawSsnTest.sanitized,
    'Candidate unformatted SSN is [REDACTED_DOD_PII] for verification.'
  );
  assert(rawSsnTest.matchedCategories.includes('SSN'));

  // 2.3 10-digit DoD EDI-PI
  const edipiTest = sanitizeText('Service member EDI-PI: 1098765432.');
  assert.strictEqual(edipiTest.sanitized, 'Service member EDI-PI: [REDACTED_DOD_PII].');
  assert(edipiTest.matchedCategories.includes('DOD_ID_EDIPI'));

  // 2.4 MGRS coordinates (compact and spaced)
  const mgrsTest1 = sanitizeText('Patrol base grid: 14RNU12345678 in sector.');
  assert.strictEqual(mgrsTest1.sanitized, 'Patrol base grid: [REDACTED_MGRS_COORDINATE] in sector.');
  assert(mgrsTest1.matchedCategories.includes('MGRS_COORDINATE'));

  const mgrsTest2 = sanitizeText('FOB destination: 18S UJ 23480 06470 reached.');
  assert.strictEqual(mgrsTest2.sanitized, 'FOB destination: [REDACTED_MGRS_COORDINATE] reached.');
  assert(mgrsTest2.matchedCategories.includes('MGRS_COORDINATE'));

  // 2.5 CUI markings
  const cuiTest = sanitizeText(
    'Document marked //CUI// with //FEDCON// and CONTROLLED UNCLASSIFIED INFORMATION subject to DISTRIBUTION STATEMENT C.'
  );
  assert.strictEqual(
    cuiTest.sanitized,
    'Document marked [REDACTED_CUI] with [REDACTED_CUI] and [REDACTED_CUI] subject to [REDACTED_CUI].'
  );
  assert(cuiTest.matchedCategories.includes('CUI_MARKING'));

  // 2.6 LLM Gatekeeper Validation
  const unsafePrompt = 'Analyze the tactical mission log from grid 14RNU12345678 under //CUI// authority.';
  const unsafeResult = validateSafeForLlm(unsafePrompt);
  assert.strictEqual(unsafeResult.isSafe, false, 'Unsafe prompt must be rejected');
  assert(unsafeResult.violations.length >= 2, 'Should detect MGRS and CUI violations');

  const safePrompt = sanitizeText(unsafePrompt).sanitized;
  const safeResult = validateSafeForLlm(safePrompt);
  assert.strictEqual(safeResult.isSafe, true, 'Sanitized prompt must be accepted by LLM gatekeeper');
  assert.strictEqual(safeResult.violations.length, 0, 'No violations in sanitized prompt');

  // 2.7 Deep Object Traversal
  const rawPayload = {
    metadata: {
      classification: '//CUI//',
      recipientId: '1234567890',
    },
    students: [
      { name: 'Corporal Alex', ssn: '123-45-6789', rallyPoint: '18S UJ 23480 06470' },
      { name: 'Sergeant Sam', ssn: '987654321', rallyPoint: 'Safe House' },
    ],
  };

  const cleanPayload = sanitizeObject(rawPayload);
  assert.strictEqual(cleanPayload.metadata.classification, '[REDACTED_CUI]');
  assert.strictEqual(cleanPayload.metadata.recipientId, '[REDACTED_DOD_PII]');
  assert.strictEqual(cleanPayload.students[0].ssn, '[REDACTED_DOD_PII]');
  assert.strictEqual(cleanPayload.students[0].rallyPoint, '[REDACTED_MGRS_COORDINATE]');
  assert.strictEqual(cleanPayload.students[1].ssn, '[REDACTED_DOD_PII]');
  assert.strictEqual(cleanPayload.students[1].rallyPoint, 'Safe House');

  console.log('✓ CUI & DoD PII Shield passed all tests.\n');

  // -------------------------------------------------------------
  // TEST 3: Authenticated AES-256-GCM Encryption
  // -------------------------------------------------------------
  console.log('--- TEST 3: Authenticated AES-256-GCM Encryption (lib/security/encryption.ts) ---');

  const samplePlaintext = 'SECRET_VETERAN_DISABILITY_RATING: 100% P&T // SSN: 000-11-2222';
  const encResult = encryptSensitiveField(samplePlaintext);
  assert(encResult.ciphertext, 'Ciphertext must exist');
  assert(encResult.iv, 'IV must exist');
  assert(encResult.tag, 'Tag must exist');

  // Verify IV length is 12 bytes (base64 of 12 bytes is 16 chars)
  const ivBuf = Buffer.from(encResult.iv, 'base64');
  assert.strictEqual(ivBuf.length, 12, 'IV must be exactly 12 bytes (96 bits)');

  // Verify Auth Tag length is 16 bytes (base64 of 16 bytes is 24 chars)
  const tagBuf = Buffer.from(encResult.tag, 'base64');
  assert.strictEqual(tagBuf.length, 16, 'Auth tag must be exactly 16 bytes (128 bits)');

  // Decrypt and match
  const decResult = decryptSensitiveField(encResult.ciphertext, encResult.iv, encResult.tag);
  assert.strictEqual(decResult, samplePlaintext, 'Decrypted text must match original plaintext');

  // Tamper Protection: Bit-flip on Ciphertext
  let tamperCaught = false;
  try {
    const tamperedCipher = Buffer.from(encResult.ciphertext, 'base64');
    tamperedCipher[0] ^= 0x01; // flip 1 bit
    decryptSensitiveField(tamperedCipher.toString('base64'), encResult.iv, encResult.tag);
  } catch (err) {
    if (err instanceof FipsIntegrityViolationError) {
      tamperCaught = true;
      console.log('Successfully caught FipsIntegrityViolationError on ciphertext bit-flip');
    }
  }
  assert.strictEqual(tamperCaught, true, 'Tampered ciphertext must trigger FipsIntegrityViolationError');

  // Tamper Protection: Bit-flip on Auth Tag
  let tagTamperCaught = false;
  try {
    const tamperedTag = Buffer.from(encResult.tag, 'base64');
    tamperedTag[0] ^= 0x01; // flip 1 bit
    decryptSensitiveField(encResult.ciphertext, encResult.iv, tamperedTag.toString('base64'));
  } catch (err) {
    if (err instanceof FipsIntegrityViolationError) {
      tagTamperCaught = true;
      console.log('Successfully caught FipsIntegrityViolationError on auth tag bit-flip');
    }
  }
  assert.strictEqual(tagTamperCaught, true, 'Tampered auth tag must trigger FipsIntegrityViolationError');

  // Record Encryption & Decryption
  type VeteranProfile = Record<string, unknown> & {
    id: string;
    fullName: string;
    ssn: string;
    clearance: string;
    rating: number;
  };

  const profile: VeteranProfile = {
    id: 'vet-7788',
    fullName: 'Jordan Miller',
    ssn: '456-78-9012',
    clearance: 'Top Secret / SCI',
    rating: 90,
  };

  const encryptedProfile = encryptRecord(profile, ['ssn', 'clearance']);
  assert.notStrictEqual(encryptedProfile.ssn, profile.ssn, 'SSN must be encrypted');
  assert.notStrictEqual(encryptedProfile.clearance, profile.clearance, 'Clearance must be encrypted');
  assert.strictEqual(encryptedProfile.fullName, profile.fullName, 'Non-sensitive field must remain untouched');
  assert.strictEqual(encryptedProfile.rating, profile.rating, 'Non-sensitive field must remain untouched');

  const decryptedProfile = decryptRecord<VeteranProfile>(encryptedProfile, ['ssn', 'clearance']);
  assert.strictEqual(decryptedProfile.ssn, profile.ssn, 'Decrypted SSN must match');
  assert.strictEqual(decryptedProfile.clearance, profile.clearance, 'Decrypted clearance must match');
  assert.strictEqual(decryptedProfile.fullName, profile.fullName);

  console.log('✓ Authenticated AES-256-GCM encryption passed all tests.\n');

  console.log('================================================================');
  console.log('=== ALL DEFENSE-GRADE EDGE SECURITY TESTS PASSED (100%)      ===');
  console.log('================================================================');
}

runEdgeDefenseSuite().catch((err) => {
  console.error('Edge defense test suite failed:', err);
  process.exit(1);
});
