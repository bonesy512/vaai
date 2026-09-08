import { MouDraftData, MouSignatureData, EmployerAgreement } from './schemas/mou';

/**
 * Standard Legal Agreement Template Engine for VAAI Employer Partnerships
 * Formulated for Defense Contractors, Federal Systems Integrators, and WIOA State Compliance
 */

export function compileMouText(
  draft: MouDraftData,
  signature?: MouSignatureData
): string {
  const dateStr = signature?.signatureTimestamp
    ? new Date(signature.signatureTimestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const rolesList = draft.targetHiringRoles.map((r) => `  * ${r}`).join('\n');
  const dbaClause = draft.dbaName ? ` (doing business as "${draft.dbaName}")` : '';

  return `# MEMORANDUM OF UNDERSTANDING (MOU)
## VETERAN WORKFORCE TALENT PIPELINE & AFFIRMATIVE ACTION PARTNERSHIP
**Document Control Reference:** VAAI-MOU-${new Date().getFullYear()}-${draft.employerEin.replace('-', '')}
**Effective Date:** ${dateStr}

---

### PARTIES & RECITALS
This Memorandum of Understanding ("Agreement" or "MOU") is entered into by and between:

1. **Veteran AI Enablement Platform (VAAI)**, operated by Veteran AI Enablement Initiative LLC, a state-approved workforce education provider accredited under the Texas Workforce Commission (TWC ETPL Provider ID: \`TWC-ETPL-78752-VAAI\`) and Workforce Solutions Capital Area Board #14, having its principal facility at 6101 Highland Campus Dr, Austin, TX 78752 ("VAAI" or "Provider"); and

2. **${draft.companyLegalName}**${dbaClause}, a registered corporation with Employer Identification Number (EIN) \`${draft.employerEin}\`, having its primary recruitment contact at ${draft.pointOfContact.email} ("Employer" or "Corporate Partner").

#### RECITALS
* **WHEREAS**, VAAI provides intensive, 40-clock-hour workforce enablement training for transitioning U.S. military service members and veterans, delivering verifiable competencies in automated enterprise AI workflows, zero-retention data sanitization, and Title 38 U.S.C. Safe Harbor compliance;
* **WHEREAS**, VAAI graduates earn W3C Verifiable Credentials and OpenBadges v3.0 digital diplomas audited against state attendance telemetry (requiring $\\ge 36.0$ verified non-idle contact hours) and rigorous capstone examination benchmarks ($\\ge 80.0\\%$);
* **WHEREAS**, Employer operates as a commercial, defense, or federal contractor with recurring demand for technical talent and desires prioritized, zero-placement-fee access to security-cleared veteran candidates;
* **WHEREAS**, Employer seeks to fulfill its affirmative action outreach obligations under the Vietnam Era Veterans' Readjustment Assistance Act (VEVRAA, 38 U.S.C. § 4212) and U.S. Department of Labor Office of Federal Contract Compliance Programs (OFCCP) standards;

**NOW, THEREFORE**, the Parties mutually agree to the following terms:

---

### SECTION 1: TALENT CLEARINGHOUSE ACCESS & PORTFOLIO INSPECTION
1.1 **Talent Dashboard Access:** VAAI grants Employer authorized recruiter access to the VAAI Enterprise Talent Portal (\`/employers\`) to search, filter, and inspect verified veteran candidate profiles.  
1.2 **Security Clearance Alignment:** VAAI will identify candidates meeting Employer's requested clearance threshold (\`${draft.clearanceRequirements}\`), including Secret, Top Secret / SCI, and clearance-eligible veterans.  
1.3 **Sanitized Artifact Verification:** Employer recruiters shall have full authority to inspect students' actual capstone blueprints (regex PII sanitization pipelines, document extraction models, and webhook orchestrators) through the interactive VAAI sandbox.

---

### SECTION 2: EMPLOYER COMMITMENTS & INTERVIEW GUARANTEE
2.1 **Good-Faith Annual Interview Target:** Employer commits to reviewing portfolios and conducting technical or behavioral screening interviews for a minimum of **${draft.annualInterviewCommitment} qualified VAAI graduates** per twelve-month calendar term.  
2.2 **Target Occupational Alignment:** Interviews shall be targeted at roles aligned with the VAAI curriculum, including but not limited to:
${rolesList}
2.3 **Curriculum Relevance Feedback:** Employer agrees to provide semi-annual qualitative feedback to the VAAI Academic Council regarding technical tooling, model security standards, and federal contractor hiring requirements.  
2.4 **Affirmative Action (VEVRAA/OFCCP):** VAAI will provide Employer with documented proof of targeted veteran outreach to support Employer's annual VEVRAA hiring benchmarks and affirmative action compliance audits.

---

### SECTION 3: WIOA PLACEMENT VERIFICATION & PIRL REPORTING MANDATE
3.1 **Mandatory Placement Confirmation:** Pursuant to U.S. Department of Labor Workforce Innovation and Opportunity Act (WIOA Title I, 20 CFR Part 680) regulations, Employer agrees to report to VAAI any verified hire of a VAAI graduate within thirty (30) calendar days of offer acceptance.  
3.2 **Required Telemetry Fields:** Reported placement data shall include: candidate name, start date, formal job title, and base starting wage bracket.  
3.3 **PIRL Audit Transmission:** Employer explicitly consents to VAAI transmitting de-identified cohort placement metrics into the Texas Workforce Commission WIOA Participant Individual Record Layout (PIRL) Quarter 2 and Quarter 4 quarterly outcome submissions.

---

### SECTION 4: TITLE 38 U.S.C. SAFE HARBOR STATUTORY BOUNDARY
4.1 **Educational Scope Affirmation:** Both Parties acknowledge that VAAI operates strictly as an educational technical enablement institution under Title 38 U.S.C. §§ 5901–5905 and 38 C.F.R. § 14.629.  
4.2 **No Claims Representation:** VAAI is not a Veteran Service Organization (VSO), claims agent, or legal representative. Nothing in this Agreement shall be construed as authorizing VAAI or Employer to engage in VA benefits advocacy or claims preparation.

---

### SECTION 5: ZERO PLACEMENT FEES & COST DISCLOSURE
5.1 **No Placement or Headhunter Fees:** VAAI provides candidate clearinghouse access to Employer at **zero direct cost**. All training, certification, and credentialing infrastructure is funded through state WIOA Title I grants, ETPL allocations, and philanthropic veteran enablement sponsorships.  
5.2 **Direct Employment:** All candidates hired under this MOU shall be direct W2 employees, 1099 contractors, or defense subcontractor personnel of Employer, without staffing agency markup or conversion fees.

---

### SECTION 6: TERM, RENEWAL & TERMINATION
6.1 **Term:** This MOU becomes effective on the date of final signature and remains in effect for twelve (12) consecutive months.  
6.2 **Automatic Renewal:** Unless terminated in writing by either party, this MOU automatically renews for successive one-year periods to maintain continuous state ETPL partnership standing.  
6.3 **Termination Notice:** Either Party may terminate this MOU without penalty upon thirty (30) calendar days advance written notice. Termination shall not affect the status or employment of candidates already hired or extended offers prior to the effective termination date.

---

### SECTION 7: EXECUTION & DIGITAL SIGNATURES

#### FOR VETERAN AI ENABLEMENT PLATFORM (VAAI):
* **Authorized Official:** Dr. Marcus Vance, Ph.D.  
* **Title:** Director of Academic Standards & Workforce Compliance  
* **Organization:** Veteran AI Enablement Initiative LLC  
* **State Accreditation:** Texas Workforce Commission ETPL # \`TWC-ETPL-78752-VAAI\`  
* **Date:** ${dateStr}

#### FOR EMPLOYER (${draft.companyLegalName}):
* **Authorized Signer:** ${signature?.signerName || '[PENDING AUTHORIZED SIGNATURE]'}  
* **Corporate Title:** ${signature?.signerTitle || '[PENDING TITLE]'}  
* **Signer Email:** ${signature?.signerEmail || draft.pointOfContact.email}  
* **EIN:** \`${draft.employerEin}\`  
* **Digital Authentication Status:** ${signature ? 'CRYPTOGRAPHICALLY SIGNED & VERIFIED' : 'PENDING CORPORATE EXECUTION'}  
* **Timestamp:** ${signature?.signatureTimestamp || '[AWAITING TIMESTAMP]'}  
* **Signer IP Reference:** ${signature?.ipAddress ? `\`${signature.ipAddress}\`` : '[AWAITING CLIENT AUDIT LOG]'}

---

# ADDENDUM A: DATA PROTECTION ADDENDUM (DPA)
${compileDpaText(draft.companyLegalName, draft.employerEin, signature)}
`;
}

/**
 * Compiles the formal Defense-Grade Data Protection Addendum (DPA)
 * Conforming to DFARS 252.204-7012/7020/7021, NIST SP 800-171 Rev. 3, CMMC 2.0 Level 2,
 * Title 38 U.S.C. §§ 5901–5905, and WIOA Title I outcome verification.
 */
export function compileDpaText(
  companyLegalName = '[ENTERPRISE PARTNER LEGAL NAME]',
  employerEin = '[PENDING EIN]',
  signature?: MouSignatureData
): string {
  const dateStr = signature?.signatureTimestamp
    ? new Date(signature.signatureTimestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'September 8, 2026';

  return `## Safeguarding Covered Defense Information, Controlled Unclassified Information, and Workforce Participant Records

**Addendum Effective Date:** ${dateStr}  
**Governing Agreement:** Master Employer Partnership Agreement / Hiring Memorandum of Understanding (MOU)  
**Provider / Contractor:** Schustereit & Co. LLC d/b/a VAAI ("Provider")  
**Customer / Enterprise Partner:** ${companyLegalName} ("Partner") (EIN: \`${employerEin}\`)  
**Regulatory Baseline:** Defense Federal Acquisition Regulation Supplement (DFARS) 252.204-7012, 252.204-7020, 252.204-7021; National Institute of Standards and Technology (NIST) Special Publication (SP) 800-171 Rev. 3; Cybersecurity Maturity Model Certification (CMMC) 2.0 Level 2; Title 38 U.S.C. §§ 5901–5905; Workforce Innovation and Opportunity Act (WIOA) Title I (20 U.S.C. § 3101 et seq.).

---

### 1. Purpose, Scope, and Order of Precedence
This Data Protection Addendum ("DPA") supplements and amends the Master Agreement between Provider and Partner. It establishes binding data protection, cybersecurity controls, and incident response requirements governing Partner access to the VAAI Talent Clearinghouse, candidate technical portfolios, military service evaluation extracts, and WIOA outcome tracking systems.

To the extent that Provider processes, stores, or transmits Covered Defense Information (CDI), Controlled Unclassified Information (CUI), or defense workforce Personally Identifiable Information (PII) on behalf of or in collaboration with Partner, the terms of this DPA shall govern. In the event of any conflict between the Master Agreement and this DPA, the terms of this DPA shall control.

---

### 2. Definitions
* **"Controlled Unclassified Information" (CUI)** has the meaning given in 32 C.F.R. Part 2002 and DoD Instruction 5200.48, encompassing unclassified information that requires safeguarding or dissemination controls pursuant to applicable laws, regulations, and government-wide policies.
* **"Covered Defense Information" (CDI)** has the meaning defined in DFARS 252.204-7012, including unclassified Controlled Technical Information (CTI) or other information marked or identified in a contract, task order, or delivery order that requires safeguarding under defense regulations.
* **"Candidate Portfolio Data"** means technical workflow artifacts, automated script configurations, capstone rubrics, military occupational specialty (MOS) crosswalks, security clearance assertions, and contact data relating to veteran candidates.
* **"Cyber Incident"** means actions taken through the use of computer networks that result in a compromise or an actual or potentially adverse effect on an information system and/or the information residing therein, specifically meeting the reporting thresholds of DFARS 252.204-7012(c).
* **"DoD PII"** means individual identifiers unique to military service, including Department of Defense Identification Numbers (EDI-PI), Social Security Numbers (SSN), and service record evaluations.
* **"FIPS Validated Cryptography"** means cryptographic modules tested and approved under FIPS 140-2 or FIPS 140-3 standards.

---

### 3. Cybersecurity Standards and Security Controls

#### 3.1 Implementation of NIST SP 800-171 Rev. 3
Provider warrants and represents that its covered information systems, including the VAAI Apex LMS Engine, edge infrastructure, and talent clearinghouse, implement and maintain all one hundred ten (110) security requirements specified in **NIST SP 800-171 Rev. 3** (and CMMC 2.0 Level 2). Provider maintains a Supplier Performance Risk System (SPRS) self-assessment score of 110/110.

#### 3.2 Technical Safeguards
Provider shall enforce the following technical controls across all operational environments:
* **Perimeter Edge Defense:** Strict Content Security Policy (CSP) enforcing cryptographic per-request nonces (\`script-src 'self' 'nonce-...'\`), two-year HTTP Strict Transport Security (\`max-age=63072000; includeSubDomains; preload\`), and frame embedding denial (\`X-Frame-Options: DENY\`).
* **Cryptographic Data Protection at Rest:** Field-level encryption using FIPS-validated authenticated AES-256-GCM with randomized 96-bit initialization vectors (IVs) and 128-bit authentication tags.
* **Data in Transit:** Mandatory TLS 1.3 encryption (TLS 1.2 minimum fallback with approved ECDHE suites). Unencrypted cleartext transit is strictly blocked.
* **Automated CUI & DoD PII Shield:** Server-side lexical and pattern-matching parsers that detect, sanitize, and redact SSNs, EDI-PIs, and Military Grid Reference System (MGRS) tactical coordinates prior to database writes or transmission to processing models.
* **Session Termination (NIST AC-11/12):** Automatic session invalidation and re-authentication requirements after fifteen (15) minutes of user inactivity.
* **Tenant Isolation:** Multi-tenant separation enforced through PostgreSQL Row-Level Security (RLS) policies requiring cryptographic user context verification on every query.

---

### 4. Client-Side Code Execution & Zero-Retention Architecture

#### 4.1 In-Browser WebAssembly Sandbox Execution
Candidate workflow evaluations and prompt automation testing shall execute exclusively within client-side WebAssembly (WASM) sandboxes operating on the user's local hardware thread. No untrusted candidate scripts, blueprints, or workflow payloads shall execute directly on host infrastructure.

#### 4.2 Zero Data Retention for Foundation Model Processing
Provider maintains zero-data-retention agreements with downstream inference providers. User input strings, candidate assessment data, and workflow artifacts shall:
1. Never be logged or retained by external AI platform providers.
2. Never be utilized for model training, fine-tuning, or algorithmic weight adjustment.
3. Be processed in volatile memory and purged immediately upon response generation and Zod schema verification.

#### 4.3 Title 38 U.S.C. Statutory Safe Harbor Enforcement
Partner acknowledges that Provider operates solely as a workforce training and technical education institution. Platform services are technically constrained to prevent unauthorized claims assistance. Prompts attempting to generate VA disability rating claims, nexus letters, or formal administrative submissions under Title 38 U.S.C. §§ 5901–5905 shall trigger automated HTTP 403 statutory refusals and immutable audit events.

---

### 5. Audit Logging and Tamper-Proof Evidence

#### 5.1 RFC 5424 and Common Event Format (CEF:0) Ingestion
Provider shall maintain continuous audit telemetry logging security-relevant events, including authentication attempts, CUI access, credential issuances, administrative changes, and MOU executions. Audit entries must record UTC millisecond timestamps, actor UUIDs, salted SHA-256 anonymized IP hashes, resource targets, and execution status.

#### 5.2 Cryptographic HMAC-SHA256 Chaining
To comply with NIST SP 800-171 AU-9 (Protection of Audit Information), all audit records shall be cryptographically linked using an HMAC-SHA256 signature chain. Every log entry must compute its signature using the preceding entry’s hash, creating an immutable, append-only log ledger that programmatically exposes any manual modification or deletion attempt.

#### 5.3 Audit Retention
Audit ledgers and compliance validation records shall be maintained on write-once-read-many (WORM) storage for a mandatory period of not less than seven (7) years to satisfy federal contract review standards.

---

### 6. Cyber Incident Reporting and DFARS Compliance

#### 6.1 Incident Thresholds
A reportable Cyber Incident includes any unauthorized access, malicious exfiltration, data spillage, or compromise impacting Covered Defense Information, Candidate Portfolio Data containing DoD PII, or the system integrity of the talent clearinghouse.

#### 6.2 72-Hour DoD Notification (DFARS 252.204-7012)
In the event of a confirmed Cyber Incident affecting defense-related infrastructure:
1. **DoD Reporting:** Provider shall submit an official incident report to the Department of Defense Cyber Crime Center (DC3) via https://dibnet.dod.mil within **seventy-two (72) hours** of confirmation.
2. **Partner Notification:** Provider shall notify Partner’s designated Enterprise Partner Security Officer (PSO) in writing within **twenty-four (24) hours** of confirmation, detailing the scope of impacted records, indicators of compromise (IOCs), and initial mitigation measures.

#### 6.3 Forensic Preservation
Provider shall isolate and preserve complete forensic images of affected systems, volatile memory captures, packet logs, and cryptographic audit records for a minimum of ninety (90) days following the incident to facilitate Department of Defense and federal forensic investigations.

---

### 7. WIOA PIRL Data Exchange & Employment Placement Verification

#### 7.1 Statutory Reporting Mandate
To maintain Provider’s listing on the Texas Statewide Eligible Training Provider List (ETPL) under WIOA Title I, Partner agrees to fulfill its placement verification obligations as set forth in the Master Agreement.

#### 7.2 Data Elements Transmitted
Within thirty (30) days of hiring a candidate sourced through Provider, Partner shall securely report the following data fields via Provider’s verified hiring API or secure portal:
* Candidate Verification UUID (e.g., \`VAAI-2026-XXXX\`).
* Job Title and Standard Occupational Classification (SOC) code (e.g., \`15-1299.08\`).
* Confirmed Hire / Start Date.
* Annual Base Salary Tier / Bracket (e.g., \`$80,000 - $95,000\`).
* Partner Employer Identification Number (EIN).

#### 7.3 Data Minimization and Privacy Protection
Provider shall utilize Partner-submitted placement data exclusively for mandatory state reporting under the 90-field WIOA Participant Individual Record Layout (PIRL) submitted to the Texas Workforce Commission (TWC) and the U.S. Department of Labor. Provider shall never sell, commercialize, or disclose Partner compensation models to unauthorized third parties.

---

### 8. Subcontractor Flow-Down Requirements (DFARS 252.204-7020 / DFARS 252.204-7021 / CMMC)
Provider shall not engage any subcontractor or third-party cloud service provider to process, store, or transmit CUI or CDI unless such entity:
1. Operates within the continental United States (CONUS).
2. Holds an active FedRAMP Moderate (or higher) authorization.
3. Contractually commits to data protection terms substantially equivalent to this DPA, including DFARS 252.204-7012, DFARS 252.204-7020, and DFARS 252.204-7021 flow-down provisions.

---

### 9. Term, Termination, and Cryptographic Sanitization

#### 9.1 Term
This DPA shall remain in full force and effect concurrently with the Master Agreement until all candidate and defense data in Provider's or Partner's possession is destroyed or sanitized.

#### 9.2 Media Sanitization (NIST SP 800-88 Rev. 1)
Upon termination of the Master Agreement or written request by either party, each party shall securely purge all confidential candidate records, military evaluation extracts, and proprietary technical blueprints in accordance with NIST SP 800-88 Rev. 1 guidelines for cryptographic erasure. Provider shall retain only those immutable audit records, credential verification entries, and WIOA placement logs strictly required by applicable state and federal compliance statutes.

---

### 10. Execution and Attestation

IN WITNESS WHEREOF, the parties have caused this Data Protection Addendum to be executed by their duly authorized corporate officers.

\`\`\`
+---------------------------------------------------------------------------------------------------+
|  SCHUSTEREIT & CO. LLC d/b/a VAAI                 |  ENTERPRISE PARTNER:                          |
|                                                   |                                               |
|  Signature:  /s/ Thomas M. Schustereit            |  Signature:  ${(signature?.signerName ? `/s/ ${signature.signerName}` : '_______________________________').padEnd(31, ' ')}  |
|  Name:       Thomas M. Schustereit                |  Name:       ${(signature?.signerName || '_______________________________').padEnd(31, ' ')}  |
|  Title:      Co-Founder & Chief Technology Officer|  Title:      ${(signature?.signerTitle || '_______________________________').padEnd(31, ' ')}  |
|  Date:       September 8, 2026                    |  Date:       ${dateStr.padEnd(31, ' ')}  |
|  Address:    6101 Highland Campus Dr, Bldg 3000   |  Address:    ${(signature?.ipAddress ? `IP Audit: ${signature.ipAddress}` : '_______________________________').padEnd(31, ' ')}  |
|              Austin, TX 78752                     |              _______________________________  |
|  Contact:    govsec@vaai.edu                      |  Contact:    ${(signature?.signerEmail || '_______________________________').padEnd(31, ' ')}  |
+---------------------------------------------------------------------------------------------------+
\`\`\`

---

### Addendum Schedules

* **Schedule 1:** Technical & Organizational Security Measures (TOMs) Matrix (NIST SP 800-171 Rev. 3 / CMMC 2.0 Level 2 Controls)
* **Schedule 2:** CUI Category Crosswalk & Permitted Dissemination Lists (DoD Instruction 5200.48 / CTI / Defense Personnel PII)
* **Schedule 3:** Form of DFARS 72-Hour Cyber Incident Report Notification (DC3 DIBNet Standard Notification Template)
`;
}

/**
 * Seed registry of established employer partnership agreements
 */
export const SEED_EMPLOYER_AGREEMENTS: EmployerAgreement[] = [
  {
    id: 'MOU-2026-BAH-01',
    companyLegalName: 'Booz Allen Hamilton Inc.',
    dbaName: 'Booz Allen Defense Solutions',
    employerEin: '54-0892014',
    pointOfContact: {
      name: 'Jennifer K. Vance',
      title: 'Senior Director of Veteran Talent Acquisition',
      email: 'vance_jennifer@bah.com',
      phone: '703-902-5000',
    },
    targetHiringRoles: [
      'AI Prompt Engineer',
      'Automation Workflow Specialist',
      'Defense Data Operations Analyst',
    ],
    clearanceRequirements: 'Top Secret / SCI',
    annualInterviewCommitment: 15,
    placementReportingConsent: true,
    status: 'active',
    compiledContractText: '',
    signedAt: '2026-01-15T14:30:00.000Z',
    signature: {
      signerName: 'Jennifer K. Vance',
      signerTitle: 'Senior Director of Veteran Talent Acquisition',
      signerEmail: 'vance_jennifer@bah.com',
      signatureTimestamp: '2026-01-15T14:30:00.000Z',
      ipAddress: '198.24.10.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      consentStatementAccepted: true,
    },
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-15T14:30:00.000Z',
  },
  {
    id: 'MOU-2026-LMT-02',
    companyLegalName: 'Lockheed Martin Corporation',
    dbaName: 'Lockheed Martin Missiles and Fire Control',
    employerEin: '52-1893632',
    pointOfContact: {
      name: 'Col. Robert Delgado (Ret.)',
      title: 'Director of Military Workforce Development',
      email: 'robert.m.delgado@lmco.com',
      phone: '301-897-6000',
    },
    targetHiringRoles: [
      'Mission Systems AI Integrator',
      'Logistics Automation Architect',
      'Defense IT Operations Technician',
    ],
    clearanceRequirements: 'Secret',
    annualInterviewCommitment: 20,
    placementReportingConsent: true,
    status: 'active',
    compiledContractText: '',
    signedAt: '2026-02-01T11:15:00.000Z',
    signature: {
      signerName: 'Col. Robert Delgado (Ret.)',
      signerTitle: 'Director of Military Workforce Development',
      signerEmail: 'robert.m.delgado@lmco.com',
      signatureTimestamp: '2026-02-01T11:15:00.000Z',
      ipAddress: '155.178.4.12',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      consentStatementAccepted: true,
    },
    createdAt: '2026-01-20T09:30:00.000Z',
    updatedAt: '2026-02-01T11:15:00.000Z',
  },
  {
    id: 'MOU-2026-CACI-03',
    companyLegalName: 'CACI International Inc.',
    employerEin: '54-1345888',
    pointOfContact: {
      name: 'Andrea Simmons',
      title: 'VP of National Security Staffing',
      email: 'andrea.simmons@caci.com',
      phone: '703-841-7800',
    },
    targetHiringRoles: [
      'Adversarial Prompt Defense Analyst',
      'Automated Intelligence Fusion Specialist',
    ],
    clearanceRequirements: 'Top Secret / SCI',
    annualInterviewCommitment: 10,
    placementReportingConsent: true,
    status: 'active',
    compiledContractText: '',
    signedAt: '2026-02-18T16:45:00.000Z',
    signature: {
      signerName: 'Andrea Simmons',
      signerTitle: 'VP of National Security Staffing',
      signerEmail: 'andrea.simmons@caci.com',
      signatureTimestamp: '2026-02-18T16:45:00.000Z',
      ipAddress: '199.173.224.8',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      consentStatementAccepted: true,
    },
    createdAt: '2026-02-10T14:00:00.000Z',
    updatedAt: '2026-02-18T16:45:00.000Z',
  },
];

// In-memory registry cache shared across Next.js bundles via globalThis singleton
const globalStore = globalThis as unknown as {
  __vaai_agreement_store?: Map<string, EmployerAgreement>;
};

if (!globalStore.__vaai_agreement_store) {
  globalStore.__vaai_agreement_store = new Map<string, EmployerAgreement>();
  SEED_EMPLOYER_AGREEMENTS.forEach((agreement) => {
    agreement.compiledContractText = compileMouText(agreement, agreement.signature);
    globalStore.__vaai_agreement_store!.set(agreement.id, agreement);
  });
}

const DYNAMIC_AGREEMENT_STORE: Map<string, EmployerAgreement> =
  globalStore.__vaai_agreement_store;

export function getAgreementById(id: string): EmployerAgreement | undefined {
  return DYNAMIC_AGREEMENT_STORE.get(id);
}

export function getAllAgreements(): EmployerAgreement[] {
  return Array.from(DYNAMIC_AGREEMENT_STORE.values());
}

export function saveAgreement(agreement: EmployerAgreement): void {
  DYNAMIC_AGREEMENT_STORE.set(agreement.id, agreement);
}

export function signAgreement(
  id: string,
  signature: MouSignatureData
): EmployerAgreement | null {
  const agreement = DYNAMIC_AGREEMENT_STORE.get(id);
  if (!agreement) return null;

  const updated: EmployerAgreement = {
    ...agreement,
    status: 'active',
    signedAt: signature.signatureTimestamp,
    signature,
    compiledContractText: compileMouText(agreement, signature),
    updatedAt: new Date().toISOString(),
  };

  DYNAMIC_AGREEMENT_STORE.set(id, updated);
  return updated;
}
