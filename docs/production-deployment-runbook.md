# VAAI Production Deployment Runbook

**Document Identifier:** `VAAI-OPS-RUNBOOK-2026.1`  
**Target Release:** Production Baseline 1.0.0 (GovSec / NIST SP 800-171 Rev. 3 / CMMC L2)  
**Classification:** CONTROLLED UNCLASSIFIED INFORMATION // FEDCON  
**Effective Date:** September 8, 2026  
**Point of Contact:** DevSecOps & Enterprise Architecture (`devops@vaai.edu`)  

---

## 1. Pre-Deployment Flight Checks

Before initiating remote cloud infrastructure provisioning or production deployment, ensure all local compilation, security analysis, cryptographic verification, and state workforce testing suites exit cleanly with zero errors.

```bash
# 1. Verify strict TypeScript compliance (Zero errors allowed)
npx tsc --noEmit

# 2. Execute full automated GovSec, PIRL, and persistence test matrix
npx tsx scratch/test_edge_defense.ts
npx tsx scratch/test_govsec_baseline.js
npx tsx scratch/test_vsa_package.ts
npx tsx scratch/test_apex_lms.ts
npx tsx scratch/test_db_migration.ts
npx tsx scratch/test_integrated_pipeline.ts
npx tsx scratch/test_dpa_compliance.ts
npx tsx scratch/test_sprs_scorecard.ts
npx tsx scratch/test_resume_generator.ts

# 3. Verify clean Turbopack production compilation
npm run build
```

---

## 2. Supabase Production Database Provisioning & Migration

### Step 2.1: Infrastructure Initialization
1. Log in to the [Supabase Management Console](https://supabase.com/dashboard).
2. Select or create your GovCloud/Enterprise organization.
3. Provision a new production database project:
   - **Project Name:** `vaai-production-enclave`
   - **Database Password:** Generate a high-entropy 32-character password (store securely in enterprise KMS / 1Password).
   - **Region:** Select `US-East (N. Virginia)` or `US-Central (Texas)` to guarantee full compliance with DFARS CONUS data sovereignty mandates.
   - **Compute Size:** Minimum `Small` or `Medium` dedicated compute (dedicated CPU recommended for Row-Level Security evaluation under high concurrent student telemetry loads).

### Step 2.2: Apply Production DDL Migrations
Deploy the database schema, Row-Level Security (RLS) policies, immutable audit triggers, and seed defense partner records.

#### Option A: Supabase CLI (Recommended)
```bash
# Link project with Supabase Reference ID
npx supabase link --project-ref <YOUR_SUPABASE_PROJECT_REF>

# Apply the formal GovSec persistence migration
npx supabase db push

# Verify migration state against remote database
npx supabase migration list
```

#### Option B: SQL Editor / Direct Migration Runner
If applying directly through the console or via an automated runner:
1. Open the **SQL Editor** in the Supabase Dashboard.
2. Load the contents of [`supabase/migrations/20260908000000_enterprise_persistence_and_audit.sql`](file:///home/zeus/projects/vaai/supabase/migrations/20260908000000_enterprise_persistence_and_audit.sql).
3. Execute the script and verify successful creation of:
   - `public.employer_agreements` (Table, RLS Enabled)
   - `public.wioa_placements` (Table, RLS Enabled)
   - `public.audit_events` (Table, RLS Enabled, WORM trigger active)
   - Functions: `update_timestamp()`, `prevent_audit_tampering()`
   - Defense Partner Seed Records: Booz Allen Hamilton (`MOU-2026-BAH-01`), Lockheed Martin (`MOU-2026-LMT-02`), CACI International (`MOU-2026-CACI-03`), and Genesis Audit Entry (`0000000000000000`).

### Step 2.3: Verification of WORM Audit Integrity
In the Supabase SQL Editor, execute a test mutation to ensure the tamper-evident trigger prevents unauthorized record deletion or modification:

```sql
-- This query MUST fail with code P0001 (SECURITY AUDIT VIOLATION: Audit log records are immutable and append-only...)
UPDATE public.audit_events 
SET action = 'TAMPER_TEST' 
WHERE previous_entry_hash = '0000000000000000';
```

---

## 3. Environment Variable Configuration Matrix

Configure these variables within your continuous integration secrets vault and Vercel Project Settings (**Settings > Environment Variables**).

| Variable Name | Required Scope | Sensitivity | Purpose & Value Constraint |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Public | Supabase API Gateway URL (`https://<project-ref>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Public | Supabase public anonymous API key (JWT token). |
| `SUPABASE_SERVICE_ROLE_KEY` | Production Only | **CRITICAL** | Elevated service-role key for backend route actions and WORM audit ingestion. Never expose to client. |
| `ENCRYPTION_MASTER_KEY` | Production Only | **CRITICAL** | 64-character hexadecimal string (32 raw bytes) for FIPS 140-3 authenticated AES-256-GCM field encryption. |
| `AUDIT_HMAC_SECRET` | Production Only | **CRITICAL** | 64-character hexadecimal string for computing sequential HMAC-SHA256 audit entry signatures. |
| `ED25519_CREDENTIAL_PRIVATE_KEY` | Production Only | **CRITICAL** | PEM-encoded or Base64 Ed25519 private key for signing OpenBadges v3.0 JSON-LD assertions. |
| `NEXT_PUBLIC_ED25519_PUBLIC_KEY` | Production, Preview | Public | Ed25519 public key corresponding to the credential signing authority. |
| `NEXT_PUBLIC_APP_URL` | Production Only | Standard | Canonical base URL (`https://vaai.edu` or `https://app.vaai.edu`). |
| `NODE_ENV` | All | Standard | `production` |

### Key Generation Helper Commands
To generate cryptographically secure 256-bit hexadecimal keys and Ed25519 keypairs for production:

```bash
# Generate ENCRYPTION_MASTER_KEY (32 bytes hex)
openssl rand -hex 32

# Generate AUDIT_HMAC_SECRET (32 bytes hex)
openssl rand -hex 32

# Generate Ed25519 Keypair (if not already provisioned)
openssl genpkey -algorithm Ed25519 -out ed25519_private.pem
openssl pkey -in ed25519_private.pem -pubout -out ed25519_public.pem
```

---

## 4. Vercel Production Project Deployment

### Step 4.1: Project Setup & Git Repository Linkage
1. Navigate to the [Vercel Dashboard](https://vercel.com).
2. Select **Add New > Project**, then import your Git repository (`vaai`).
3. Configure Project Settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (or default `next build`)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm ci`
   - **Node.js Version:** `20.x` or `22.x` (LTS)

### Step 4.2: Security & Header Alignment
Ensure Vercel’s deployment pipeline does not strip or override the strict security baseline delivered by [`middleware.ts`](file:///home/zeus/projects/vaai/middleware.ts):
- **Deployment Protection:** Enable Vercel Authentication on Preview environments so staging builds containing seed military data are never publicly accessible without SSO/credential verification.
- **Edge Function Runtime:** Confirm Next.js Edge Middleware runs in primary US data center regions matching Supabase (`iad1` / Washington D.C. or `cle1` / Ohio).
- **Speed Insights & Analytics:** If external analytics telemetry is enabled, ensure the script domain is explicitly allowed in `connect-src` and `script-src` within [`middleware.ts`](file:///home/zeus/projects/vaai/middleware.ts), or keep external tracking disabled to preserve Zero-Telemetry GovSec isolation.

### Step 4.3: Custom Domain & HSTS Preload Activation
1. Navigate to **Settings > Domains**.
2. Add primary production domains:
   - `vaai.edu`
   - `www.vaai.edu` (redirects to `vaai.edu`)
3. Configure DNS records with your registrar:
   - **A Record:** `@` points to `76.76.21.21`
   - **CNAME Record:** `www` points to `cname.vercel-dns.com`
4. Confirm SSL Certificate issuance:
   - Vercel automatically provisions a Let's Encrypt / DigiCert certificate with TLS 1.3 support.
   - Verify that the HTTP response carries our middleware header:
     `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
5. Submit the root domain to the [HSTS Preload List](https://hstspreload.org/).

---

## 5. Post-Deployment Verification & Smoke Tests

Execute the following end-to-end curl checks and browser verifications against the live production deployment:

### 5.1 Edge Perimeter Security Smoke Test
```bash
# Verify edge headers, trace UUID, HSTS 2-year duration, and dynamic CSP nonce
curl -sI https://vaai.edu/employers | grep -Ei "(x-vaai-trace-id|x-compliance-baseline|strict-transport-security|content-security-policy|x-frame-options)"
```

**Expected Response Headers:**
```http
X-Compliance-Baseline: NIST-SP-800-171-REV3
X-VAAI-Trace-Id: [UUIDv4]
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...' ...
```

### 5.2 Critical Public Route Availability Test
Verify that all legal, accreditation, and resume endpoints respond with `HTTP 200 OK`:

```bash
PROD_URL="https://vaai.edu"

for endpoint in \
  "/etpl-dossier" \
  "/vendor-security-assessment" \
  "/sprs" \
  "/dpa" \
  "/employers" \
  "/employers/partnership" \
  "/resume" \
  "/resume/VAAI-2026-A1B2" \
  "/api/security/vsa" \
  "/api/security/sprs" \
  "/api/etpl/cover-letter"
do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL$endpoint")
  echo "Checking $endpoint -> HTTP $STATUS"
  if [ "$STATUS" -ne 200 ]; then
    echo "FAILED: $endpoint returned $STATUS"
    exit 1
  fi
done

echo "All production endpoints operational."
```

### 5.3 Live In-Browser Functional Checks
1. **Resume PDF Engine (`/resume/VAAI-2026-A1B2`):**
   - Click "Print / Save 1-Page PDF".
   - Confirm the browser print preview renders exactly 1 single page ($8.5 \times 11$ in Letter) with zero page spills or trailing blank pages.
2. **Employer MOU Generation (`/employers/partnership`):**
   - Fill out the 4-step partnership wizard with a test enterprise partner.
   - Sign and submit the MOU.
   - Confirm the agreement persists to Supabase (`public.employer_agreements`) and the complete agreement with Addendum A (DPA) renders at `/employers/partnership/[agreementId]`.
3. **PIRL Export Audit (`/etpl-dossier`):**
   - Click "WIOA PIRL (CSV)".
   - Confirm the downloaded CSV contains all 90 standard columns (`PIRL_100_Individual_Identifier` through `PIRL_2900_State_Custom_10`).
4. **WASM Sandboxes (`/courses/ai-literacy-101/lesson-1`):**
   - Open the Monaco Editor workspace.
   - Run the Python script.
   - Confirm code executes in the client-side WebAssembly thread with instant terminal output.

---

## 6. Rollback & Disaster Recovery Procedures

If a critical flaw or migration failure occurs during cutover:

1. **Immediate Traffic Reversion (Vercel):**
   - Open **Vercel Dashboard > Deployments**.
   - Locate the previously known good deployment.
   - Click the triple-dot menu and select **Instant Rollback**. Traffic shifts globally within $< 5\text{ seconds}$.
2. **Database State Rollback (Supabase):**
   - If a migration failed or data corruption occurred, navigate to **Supabase Dashboard > Database > Backups**.
   - Initiate a Point-In-Time Recovery (PITR) to a timestamp immediately prior to migration execution.
3. **Incident Reporting Threshold (DFARS 252.204-7012):**
   - If rollback was triggered by a confirmed cyber breach or unauthorized CUI exfiltration, execute the 72-hour reporting workflow documented in Schedule 3 of the DPA to DC3 DIBNet (`https://dibnet.dod.mil`).
