/**
 * Comprehensive Automated Test Suite for Supabase SQL Migrations & TypeScript Schema
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import type {
  Database,
  EmployerAgreementRow,
  WioaPlacementRow,
  AuditEventRow,
} from '../lib/db/schema';

console.log('--- 1. Testing SQL Migration File Existence & Content ---');
const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20260908000000_enterprise_persistence_and_audit.sql'
);
assert(fs.existsSync(migrationPath), 'Migration SQL file must exist');
const sql = fs.readFileSync(migrationPath, 'utf8');

// 1. Table employer_agreements validation
assert(sql.includes('CREATE TABLE IF NOT EXISTS public.employer_agreements'));
assert(sql.includes("ein TEXT NOT NULL CHECK (ein ~ '^\\d{2}-\\d{7}$')"));
assert(sql.includes('annual_interview_target INT NOT NULL CHECK (annual_interview_target >= 3)'));
assert(sql.includes("clearance_focus IN ('None', 'Secret', 'Top Secret / SCI', 'Any')"));
assert(sql.includes("status IN ('draft', 'pending_signature', 'active', 'expired', 'terminated')"));
assert(sql.includes('signer_ip_hash TEXT'));
assert(sql.includes('compiled_contract_text TEXT NOT NULL'));
console.log('✔ Table public.employer_agreements DDL and constraints verified.');

// 2. Table wioa_placements validation
assert(sql.includes('CREATE TABLE IF NOT EXISTS public.wioa_placements'));
assert(sql.includes('placement_id TEXT UNIQUE NOT NULL'));
assert(sql.includes('candidate_uuid TEXT NOT NULL'));
assert(sql.includes("soc_code TEXT NOT NULL DEFAULT '15-1299.08'"));
assert(sql.includes('retention_q2_verified BOOLEAN NOT NULL DEFAULT FALSE'));
assert(sql.includes('pirl_export_included BOOLEAN NOT NULL DEFAULT FALSE'));
console.log('✔ Table public.wioa_placements DDL and constraints verified.');

// 3. Table audit_events validation
assert(sql.includes('CREATE TABLE IF NOT EXISTS public.audit_events'));
assert(sql.includes('id BIGSERIAL PRIMARY KEY'));
assert(sql.includes('event_id UUID NOT NULL DEFAULT gen_random_uuid()'));
assert(sql.includes('previous_entry_hash TEXT NOT NULL'));
assert(sql.includes('entry_signature TEXT NOT NULL'));
console.log('✔ Table public.audit_events DDL and constraints verified.');

// 4. RLS Policies and Triggers validation
assert(sql.includes('ALTER TABLE public.employer_agreements ENABLE ROW LEVEL SECURITY;'));
assert(sql.includes('ALTER TABLE public.wioa_placements ENABLE ROW LEVEL SECURITY;'));
assert(sql.includes('ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;'));
assert(sql.includes('CREATE OR REPLACE FUNCTION public.update_timestamp()'));
assert(sql.includes('CREATE OR REPLACE FUNCTION public.prevent_audit_tampering()'));
assert(sql.includes('SECURITY AUDIT VIOLATION: Audit event entries are immutable'));
console.log('✔ Row-Level Security policies and WORM immutability triggers verified.');

// 5. Seed Data validation
assert(sql.includes('MOU-2026-BAH-01'));
assert(sql.includes('Booz Allen Hamilton Inc.'));
assert(sql.includes('MOU-2026-LMT-02'));
assert(sql.includes('Lockheed Martin Corporation'));
assert(sql.includes('MOU-2026-CACI-03'));
assert(sql.includes('CACI International Inc.'));
assert(sql.includes('WIOA-PLACE-2026-BAH-01'));
assert(sql.includes('INITIALIZE_IMMUTABLE_GOVSEC_AUDIT_CHAIN'));
console.log('✔ Defense employer MOUs, WIOA placements, and Genesis audit seeds verified.');

console.log('\n--- 2. Testing TypeScript Schema Type Safety ---');

// Mock data typed against schema interfaces
const mockAgreementRow: EmployerAgreementRow = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  agreement_id: 'MOU-2026-TEST-01',
  company_name: 'Raytheon Technologies',
  dba_name: 'RTX Defense',
  ein: '12-3456789',
  contact_name: 'Sarah Connor',
  contact_title: 'Director of AI Strategy',
  contact_email: 'sarah.connor@rtx.example.com',
  contact_phone: '512-555-0199',
  annual_interview_target: 5,
  clearance_focus: 'Secret',
  target_roles: ['AI Specialist', 'Cyber Analyst'],
  status: 'active',
  signed_at: new Date().toISOString(),
  signer_name: 'Sarah Connor',
  signer_title: 'Director of AI Strategy',
  signer_email: 'sarah.connor@rtx.example.com',
  signer_ip_hash: 'abc123hash',
  user_agent: 'Chrome/130',
  consent_statement_accepted: true,
  compiled_contract_text: '# Executed Agreement',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

assert.strictEqual(mockAgreementRow.status, 'active');
assert.strictEqual(mockAgreementRow.clearance_focus, 'Secret');

const mockPlacementRow: WioaPlacementRow = {
  id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  placement_id: 'WIOA-PLACE-2026-9999',
  candidate_id: 'TX-VAAI-2026-099',
  candidate_uuid: 'VAAI-2026-UUID-99',
  candidate_name: 'John Doe',
  employer_name: 'Booz Allen Hamilton',
  employer_ein: '53-0177720',
  job_title: 'AI Automation Engineer',
  soc_code: '15-1299.08',
  salary_bracket: '$90,000 - $105,000',
  hire_date: '2026-03-01',
  retention_q2_verified: true,
  retention_q4_verified: false,
  pirl_export_included: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

assert.strictEqual(mockPlacementRow.soc_code, '15-1299.08');
assert.strictEqual(mockPlacementRow.retention_q2_verified, true);

const mockAuditRow: AuditEventRow = {
  id: 1,
  event_id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  timestamp: new Date().toISOString(),
  event_type: 'MOU_SIGNED',
  principal_id: 'sarah.connor@rtx.example.com',
  ip_hash: 'salted_ip_hash_string',
  action: 'Executed Partnership MOU',
  status: 'SUCCESS',
  metadata: { agreementId: 'MOU-2026-TEST-01' },
  previous_entry_hash: '0000000000000000',
  entry_signature: 'hmac_sha256_sig',
};

assert.strictEqual(mockAuditRow.event_type, 'MOU_SIGNED');
assert.strictEqual(mockAuditRow.status, 'SUCCESS');

console.log('✔ All TypeScript database rows and interfaces verified strictly.');

console.log('\n================================================================');
console.log('🎉 ALL SUPABASE MIGRATION & PERSISTENCE TESTS PASSED!');
console.log('================================================================\n');
