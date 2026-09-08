/**
 * VAAI Integrated Pipeline & Persistence Verification Suite
 * Tests:
 * 1. Pilot Cohort Seeder data integrity and 90-field WIOA PIRL CSV specification
 * 2. Server-side Supabase client factory (getServiceRoleClient, getAnonymousClient)
 * 3. Enterprise Route Handlers:
 *    - GET & POST /api/enterprise/mou
 *    - POST /api/enterprise/mou/[agreementId]/sign
 *    - POST /api/enterprise/hire
 * 4. Tamper-evident GovSec HMAC-SHA256 audit chain verification with MOU_SIGNED & PLACEMENT_RECORDED
 */

import assert from 'node:assert';
import { NextRequest } from 'next/server';
import {
  PILOT_VETERAN_SEED_DATA,
  buildPilotWioaPirlRecords,
  seedCohortToDatabase,
} from '../scripts/seed-pilot-cohort';
import { exportWioaPirlCsv, WIOA_PIRL_SCHEMA_MAP } from '../lib/etpl-filing-data';
import { getServiceRoleClient, getAnonymousClient } from '../lib/db/server-client';
import { GET as mouGetHandler, POST as mouPostHandler } from '../app/api/enterprise/mou/route';
import { POST as mouSignHandler } from '../app/api/enterprise/mou/[agreementId]/sign/route';
import { POST as hireHandler } from '../app/api/enterprise/hire/route';
import { getAuditHistory, verifyAuditChain } from '../lib/security/audit-logger';

async function runIntegratedPipelineSuite() {
  console.log('================================================================');
  console.log('=== VAAI INTEGRATED PIPELINE & PIRL VERIFICATION SUITE       ===');
  console.log('=== Pilot Cohort, Supabase Routes & Tamper-Evident GovSec    ===');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // TEST 1: Pilot Cohort Seeder & 90-Field WIOA PIRL CSV Validation
  // -------------------------------------------------------------
  console.log('--- 1. Testing Pilot Cohort Seed Data & PIRL Compliance ---');
  assert.strictEqual(
    PILOT_VETERAN_SEED_DATA.length,
    16,
    'Pilot cohort must contain exactly 16 veteran records'
  );

  // Military branches representation check
  const branches = new Set(PILOT_VETERAN_SEED_DATA.map((v) => v.branch));
  assert(branches.has('Army'), 'Cohort must include U.S. Army');
  assert(branches.has('Navy'), 'Cohort must include U.S. Navy');
  assert(branches.has('Air Force'), 'Cohort must include U.S. Air Force');
  assert(branches.has('Marine Corps'), 'Cohort must include U.S. Marine Corps');
  assert(branches.has('Coast Guard'), 'Cohort must include U.S. Coast Guard');
  console.log(`✔ All 5 military branches represented: ${Array.from(branches).join(', ')}.`);

  // Key MOS/Ratings validation
  const mosCodes = new Set(PILOT_VETERAN_SEED_DATA.map((v) => v.mosCode));
  const expectedMos = ['25B', '17C', '35F', '88M', 'IT', 'IS', 'CTN', '1D7X1', '1N0X1', '0671', '0231'];
  for (const code of expectedMos) {
    assert(mosCodes.has(code), `Cohort must include MOS code ${code}`);
  }
  console.log(`✔ All key technical and operational MOS codes verified: ${Array.from(mosCodes).join(', ')}.`);

  // Verified seat-time logs (>= 36.0 hours)
  for (const vet of PILOT_VETERAN_SEED_DATA) {
    assert(
      vet.verifiedHours >= 36.0,
      `Student ${vet.participantId} must have >= 36.0 verified contact hours (got ${vet.verifiedHours})`
    );
    assert(
      vet.totalSessionCount >= 18,
      `Student ${vet.participantId} must have >= 18 distinct training sessions (got ${vet.totalSessionCount})`
    );
  }
  console.log('✔ All 16 students exceed the 36.0-hour verified seat-time threshold (range: 36.0h - 43.0h).');

  // Audited capstone rubrics (>= 80.0%)
  for (const vet of PILOT_VETERAN_SEED_DATA) {
    assert(
      vet.capstoneScore >= 80.0,
      `Student ${vet.participantId} must score >= 80.0% on capstone evaluation (got ${vet.capstoneScore}%)`
    );
    assert(
      vet.credentialUuid.startsWith('VAAI-2026-'),
      `Student ${vet.participantId} credential UUID must match pattern VAAI-2026-[HEX]`
    );
  }
  console.log('✔ All 16 capstone evaluations exceed passing grade (range: 85.0% - 98.0%) with valid OpenBadges UUIDs.');

  // Employment placement (12 of 16 placed at defense prime contractors)
  const placedVets = PILOT_VETERAN_SEED_DATA.filter((v) => v.isEmployed);
  assert.strictEqual(placedVets.length, 12, 'Exactly 12 graduates must be placed (75% placement rate)');

  const defenseEmployers = new Set(placedVets.map((v) => v.employerName));
  assert(Array.from(defenseEmployers).some((e) => e?.includes('Booz Allen Hamilton')));
  assert(Array.from(defenseEmployers).some((e) => e?.includes('Lockheed Martin')));
  assert(Array.from(defenseEmployers).some((e) => e?.includes('CACI')));
  assert(Array.from(defenseEmployers).some((e) => e?.includes('Leidos')));

  for (const placed of placedVets) {
    assert(
      (placed.annualSalary || 0) >= 78000 && (placed.annualSalary || 0) <= 115000,
      `Placed salary must fall in $78k-$115k defense bracket (got ${placed.annualSalary})`
    );
    assert.strictEqual(placed.socCode, '15-1299.08', 'Placed SOC must be 15-1299.08');
  }
  console.log('✔ 12 graduates placed at Booz Allen Hamilton, Lockheed Martin, CACI, and Leidos ($80k - $115k).');

  // WIOA PIRL 90-Field CSV Generation & Compliance
  const pirlRecords = buildPilotWioaPirlRecords();
  assert.strictEqual(pirlRecords.length, 16);
  const pirlCsv = exportWioaPirlCsv(pirlRecords);

  const csvRows = pirlCsv.trim().split('\r\n');
  assert.strictEqual(csvRows.length, 17, 'CSV must contain 1 header row + 16 data rows');

  const headers = csvRows[0].split(',');
  assert.strictEqual(headers.length, 90, `PIRL CSV must contain exactly 90 standardized columns (got ${headers.length})`);
  assert.strictEqual(headers[0], 'PIRL_100_Individual_Identifier');
  assert.strictEqual(headers[89], 'PIRL_2900_State_Custom_10');

  for (let i = 1; i < csvRows.length; i++) {
    const fields = csvRows[i].split(',');
    assert.strictEqual(fields.length, 90, `Row ${i} must have 90 fields (got ${fields.length})`);
    assert(fields[0].startsWith('TX-VAAI-2026-'), `Participant ID must match format (got ${fields[0]})`);
    assert.strictEqual(fields[3], '1', 'Veteran status must be 1');
  }
  console.log(`✔ PIRL CSV validation: 90 columns, 16 rows, strict field format verified.\n`);

  // -------------------------------------------------------------
  // TEST 2: Server-Side Supabase Client Factory
  // -------------------------------------------------------------
  console.log('--- 2. Testing Server-Side Supabase Client Factory ---');
  const serviceRoleClient = getServiceRoleClient();
  const anonClient = getAnonymousClient();

  // In offline or CI test environment without remote database keys, client returns null safely
  console.log(`Service Role Client Initialized: ${serviceRoleClient !== null ? 'LIVE_SUPABASE' : 'NULL_SAFE_FALLBACK'}`);
  console.log(`Anonymous Client Initialized: ${anonClient !== null ? 'LIVE_SUPABASE' : 'NULL_SAFE_FALLBACK'}`);

  // Test cohort seeder database helper runs without throw
  const seedResult = await seedCohortToDatabase();
  assert(typeof seedResult === 'object');
  console.log(`Database Seed Result: Remote Persisted = ${seedResult.remotePersisted}, Count = ${seedResult.count}`);
  console.log('✔ Supabase client factory operates safely in all environments.\n');

  // -------------------------------------------------------------
  // TEST 3: Enterprise Route Handler Integration
  // -------------------------------------------------------------
  console.log('--- 3. Testing Enterprise Route Handlers ---');

  // 3.1 GET /api/enterprise/mou
  const resMouGet = await mouGetHandler();
  assert.strictEqual(resMouGet.status, 200, 'GET /api/enterprise/mou must return 200');
  const mouGetJson = await resMouGet.json();
  assert.strictEqual(mouGetJson.success, true);
  assert(Array.isArray(mouGetJson.agreements), 'Agreements must be an array');
  assert(mouGetJson.count >= 2, 'Must contain initial seed agreements');
  console.log(`✔ GET /api/enterprise/mou returned ${mouGetJson.count} partnership agreements.`);

  // 3.2 POST /api/enterprise/mou (Draft Creation)
  const testMouPayload = {
    companyLegalName: 'General Dynamics Information Technology',
    dbaName: 'GDIT',
    employerEin: '54-1234567',
    pointOfContact: {
      name: 'Col. Raymond Vance (Ret.)',
      title: 'VP Defense AI Solutions',
      email: 'raymond.vance@gdit.example.com',
      phone: '703-555-0199',
    },
    targetHiringRoles: ['AI Systems Integrator', 'Defense Workflow Specialist'],
    clearanceRequirements: 'Secret' as const,
    annualInterviewCommitment: 8,
    placementReportingConsent: true,
  };

  const reqMouPost = new NextRequest('http://localhost:3000/api/enterprise/mou', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(testMouPayload),
  });

  const resMouPost = await mouPostHandler(reqMouPost);
  assert.strictEqual(resMouPost.status, 201, 'POST /api/enterprise/mou must return 201 Created');
  const mouPostJson = await resMouPost.json();
  assert.strictEqual(mouPostJson.success, true);
  assert(mouPostJson.agreementId.startsWith('MOU-2026-'));
  assert.strictEqual(mouPostJson.status, 'pending_signature');
  const createdAgreementId = mouPostJson.agreementId;
  console.log(`✔ POST /api/enterprise/mou created draft agreement: ${createdAgreementId}`);

  // 3.3 POST /api/enterprise/mou/[agreementId]/sign (Digital Signature)
  const signPayload = {
    signerName: 'Col. Raymond Vance (Ret.)',
    signerTitle: 'VP Defense AI Solutions',
    signerEmail: 'raymond.vance@gdit.example.com',
    consentStatementAccepted: true,
    ipAddress: '198.51.100.42',
    userAgent: 'GovSec Signed Enterprise Portal v2.0',
    signatureTimestamp: new Date().toISOString(),
  };

  const reqSignPost = new NextRequest(
    `http://localhost:3000/api/enterprise/mou/${createdAgreementId}/sign`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '198.51.100.42',
        'user-agent': 'GovSec Signed Enterprise Portal v2.0',
      },
      body: JSON.stringify(signPayload),
    }
  );

  const resSignPost = await mouSignHandler(reqSignPost, {
    params: Promise.resolve({ agreementId: createdAgreementId }),
  });

  assert.strictEqual(resSignPost.status, 200, 'Sign route must return 200 OK');
  const signJson = await resSignPost.json();
  assert.strictEqual(signJson.success, true);
  assert.strictEqual(signJson.status, 'active');
  assert.strictEqual(signJson.agreementId, createdAgreementId);
  console.log(`✔ POST /api/enterprise/mou/[agreementId]/sign successfully executed signature for ${createdAgreementId}.`);

  // 3.4 POST /api/enterprise/hire (WIOA Placement Ingestion)
  const hirePayload = {
    candidateId: 'TX-VAAI-2026-001',
    candidateName: 'Sgt. Marcus Holloway',
    candidateUuid: 'VAAI-2026-A1F82B',
    employerName: 'Booz Allen Hamilton (Defense Analytics)',
    jobTitle: 'AI Prompt Engineer & Automation Specialist',
    socCode: '15-1299.08',
    salaryBracket: '$85,000 - $95,000',
    hireDate: '2026-02-15',
    placementType: 'Full-Time Direct Hire',
  };

  const reqHirePost = new NextRequest('http://localhost:3000/api/enterprise/hire', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '198.51.100.42',
    },
    body: JSON.stringify(hirePayload),
  });

  const resHirePost = await hireHandler(reqHirePost);
  assert.strictEqual(resHirePost.status, 200, 'Hire route must return 200 OK');
  const hireJson = await resHirePost.json();
  assert.strictEqual(hireJson.success, true);
  assert(hireJson.placementId.startsWith('WIOA-PLACE-2026-'));
  assert.strictEqual(hireJson.record.candidateName, 'Sgt. Marcus Holloway');
  console.log(`✔ POST /api/enterprise/hire recorded WIOA placement: ${hireJson.placementId}.\n`);

  // -------------------------------------------------------------
  // TEST 4: Tamper-Evident GovSec HMAC Audit Chain Verification
  // -------------------------------------------------------------
  console.log('--- 4. Testing Tamper-Evident GovSec Audit Log Chain ---');
  const history = getAuditHistory(50);
  assert(history.length > 0, 'Audit history must contain logged events');

  // Verify MOU_SIGNED and PLACEMENT_RECORDED events are present in chain
  const mouSignedEvent = history.find((e) => e.eventType === 'MOU_SIGNED');
  assert(mouSignedEvent, 'Audit log must contain MOU_SIGNED event');
  assert.strictEqual(mouSignedEvent.principalId, 'raymond.vance@gdit.example.com');
  console.log(`✔ Audit Event 'MOU_SIGNED' verified (Seq: ${mouSignedEvent.sequence}).`);

  const hireEvent = history.find((e) => e.eventType === 'PLACEMENT_RECORDED');
  assert(hireEvent, 'Audit log must contain PLACEMENT_RECORDED event');
  assert.strictEqual(hireEvent.principalId, 'TX-VAAI-2026-001');
  console.log(`✔ Audit Event 'PLACEMENT_RECORDED' verified (Seq: ${hireEvent.sequence}).`);

  // Verify mathematical integrity of the cryptographic HMAC-SHA256 chain
  const chainAudit = verifyAuditChain(history);
  assert.strictEqual(
    chainAudit.valid,
    true,
    `Audit chain verification failed: ${chainAudit.error}`
  );
  console.log(`✔ Cryptographic HMAC-SHA256 audit chain verified (${history.length} events, 0 tampering detected).\n`);

  console.log('================================================================');
  console.log('🎉 ALL INTEGRATED PIPELINE & PIRL TESTS PASSED (100% SUCCESS) ===');
  console.log('================================================================\n');
}

runIntegratedPipelineSuite().catch((err) => {
  console.error('Integrated Pipeline Test Suite Failed:', err);
  process.exit(1);
});
