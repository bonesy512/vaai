import { VeteranResumeData } from '@/components/veteran-resume-document';
import { VETERAN_CANDIDATES } from './candidates';

/**
 * Standardized Veteran Resume Data Registry & Loader
 * Maps VAAI graduates to ATS-optimized, 1-page printable resume format.
 */

export const VETERAN_RESUME_REGISTRY: Record<string, VeteranResumeData> = {
  'VAAI-2026-A1B2': {
    fullName: 'Marcus Vance',
    phone: '(512) 555-0144',
    email: 'm.vance@defense-candidate.org',
    location: 'Austin, TX (Relocation Willing)',
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
      'Transitioning U.S. Army Information Technology Specialist (25B) with 6+ years managing tactical communications and enterprise zero-trust infrastructure. Certified Applied AI Operator (CAIO Level 1) proficient in deploying in-browser WASM workflows, deterministic JSON schema validators, and NIST SP 800-171 CUI data guards.',
    coreCompetencies: [
      'NIST SP 800-171 / CMMC L2',
      'Python Automation & Pyodide',
      'CUI & DoD PII Redaction',
      'Zod Schema Enforcement',
      'Prompt Architecture & Chaining',
      'Zero-Trust Network Operations',
      'Docker / Microservices',
      'SQL / Postgres RLS Boundaries',
      'Linux Systems Administration',
    ],
    militaryExperience: [
      {
        roleTitle: 'Senior Tactical Network Specialist / IT NCO',
        unitAndBranch: '3rd Armored Brigade Combat Team, U.S. Army',
        dateRange: '2022 – 2026',
        bullets: [
          'Engineered and administered SIPR/NIPR tactical communication nodes supporting 1,200+ personnel across brigade operations.',
          'Formulated automated bash and Python script pipelines reducing hardware deployment staging time by 42%.',
          'Enforced strict COMSEC, cryptographic key management, and OPSEC standards during multi-domain operational exercises.',
        ],
      },
      {
        roleTitle: 'Information Systems Administrator (MOS 25B)',
        unitAndBranch: '1st Cavalry Division, Fort Cavazos, TX',
        dateRange: '2020 – 2022',
        bullets: [
          'Configured enterprise network switching, Active Directory group policies, and identity access control lists (ACLs).',
          'Resolved 650+ complex technical trouble tickets with a 99.4% first-contact SLA resolution rate.',
        ],
      },
    ],
    educationAndCredentials: [
      {
        title: 'Certified Applied AI Operator (CAIO Level 1)',
        issuer: 'VAAI / Texas Workforce Commission (TWC ETPL)',
        date: 'Aug 2026',
        details: 'Program Code: TWC-ETPL-78752-VAAI | 40 Clock Hours',
      },
      {
        title: 'CompTIA Security+ CE (DoD 8570 IAT Level II)',
        issuer: 'Computing Technology Industry Association',
        date: 'Jun 2024',
        details: 'Active / FIPS Compliant',
      },
      {
        title: 'B.S. in Information Systems (In Progress)',
        issuer: 'University of Maryland Global Campus',
        date: 'Anticipated 2027',
        details: '78 Credit Hours Completed',
      },
    ],
  },
  'VAAI-2026-DEMO': {
    fullName: 'Alex M. Mercer',
    phone: '(512) 555-0192',
    email: 'a.mercer@defense-candidate.org',
    location: 'San Antonio, TX',
    securityClearance: 'Top Secret / SCI',
    branch: 'Army',
    mosCode: '25B',
    mosTitle: 'Information Technology Specialist',
    targetRole: 'Enterprise AI Systems Specialist',
    socCode: '15-1299.08',
    credentialUuid: 'VAAI-2026-DEMO',
    issuedDate: 'August 10, 2026',
    verifiedSeatHours: 38.5,
    capstoneScore: 94.0,
    capstoneTitle: 'Title 38 PII & CUI Sanitization Engine',
    summary:
      'Enterprise Systems & AI Automation Specialist with 7 years of operational military IT experience. Expert in building zero-data-retention NLP pipelines, configuring secure enterprise webhooks, and ensuring strict Title 38 and NIST SP 800-88 compliance across distributed cloud infrastructure.',
    coreCompetencies: [
      'NIST SP 800-171 Rev. 3',
      'Python / Pyodide WASM Runtime',
      'DoD PII Redaction Algorithms',
      'Zod Schema Parsing',
      'Tactical Communications',
      'Enterprise Network Security',
      'PostgreSQL Row-Level Security',
      'Docker Containerization',
      'CI/CD Automated Pipelines',
    ],
    militaryExperience: [
      {
        roleTitle: 'Battalion S-6 Senior IT Supervisor',
        unitAndBranch: '1st Armored Division, U.S. Army',
        dateRange: '2021 – 2026',
        bullets: [
          'Supervised tactical SIPR/NIPR routing, identity access, and cryptographic key distribution for 650+ operational personnel.',
          'Built custom Python scripts to automate daily switch compliance audits, reducing manual labor by 15 hours weekly.',
          'Maintained 99.98% mission-critical network uptime during extended multi-echelon field exercises.',
        ],
      },
      {
        roleTitle: 'Tactical Radio & Systems Administrator',
        unitAndBranch: '3rd Infantry Division, Fort Stewart, GA',
        dateRange: '2019 – 2021',
        bullets: [
          'Installed and maintained high-frequency SATCOM and line-of-sight encrypted voice/data links.',
          'Administered local area networks and performed cryptographic rekeying adhering strictly to NSA COMSEC regulations.',
        ],
      },
    ],
    educationAndCredentials: [
      {
        title: 'Certified Applied AI Operator (CAIO Level 1)',
        issuer: 'VAAI / Texas Workforce Commission (TWC ETPL)',
        date: 'Aug 2026',
        details: 'Credential UUID: VAAI-2026-DEMO | 40 Clock Hours',
      },
      {
        title: 'CompTIA Network+ / Security+ CE',
        issuer: 'CompTIA (DoD 8570 Approved)',
        date: 'Mar 2023',
        details: 'Active IAT Level II Baseline',
      },
      {
        title: 'Associate of Science in Computer Technology',
        issuer: 'Central Texas College',
        date: 'May 2022',
        details: 'Honors Graduate',
      },
    ],
  },
  'VAAI-2026-N7D3': {
    fullName: 'Elena Rodriguez',
    phone: '(512) 555-0188',
    email: 'e.rodriguez@defense-candidate.org',
    location: 'Corpus Christi, TX',
    securityClearance: 'Top Secret / SCI',
    branch: 'Navy',
    mosCode: 'CTN',
    mosTitle: 'Cryptologic Technician Networks',
    targetRole: 'Defense AI Cybersecurity Analyst',
    socCode: '15-1299.08',
    credentialUuid: 'VAAI-2026-N7D3',
    issuedDate: 'August 18, 2026',
    verifiedSeatHours: 40.0,
    capstoneScore: 97.5,
    capstoneTitle: 'Automated Threat Telemetry & SIEM Triage Pipeline',
    summary:
      'Former U.S. Navy Cryptologic Technician Networks (CTN) with 5 years conducting defensive cyberspace operations and vulnerability forensics. Certified Applied AI Operator specializing in automated anomaly classification, prompt injection detection, and FIPS-validated cryptographic controls.',
    coreCompetencies: [
      'Defensive Cyber Operations (DCO)',
      'Threat Telemetry & SIEM Triage',
      'Python & Regex Lexical Parsers',
      'WASM Sandboxed Blueprints',
      'Prompt Injection Safeguards',
      'HMAC-SHA256 Chained Auditing',
      'Network Packet Analysis',
      'Linux Kernel Security',
      'NIST SP 800-171 AU Controls',
    ],
    militaryExperience: [
      {
        roleTitle: 'Cyber Defense Analyst / Leading Petty Officer',
        unitAndBranch: 'U.S. Fleet Cyber Command / 10th Fleet',
        dateRange: '2021 – 2026',
        bullets: [
          'Monitored global maritime networks, identifying and mitigating 450+ high-severity intrusion attempts.',
          'Engineered automated packet parsing rules in Python, cutting cyber incident response cycle time by 55%.',
          'Coordinated forensic disk imaging and volatile memory preservation per DoD Cyber Crime Center (DC3) standards.',
        ],
      },
      {
        roleTitle: 'Network Vulnerability Specialist',
        unitAndBranch: 'Navy Cyber Defense Operations Command (NCDOC)',
        dateRange: '2020 – 2021',
        bullets: [
          'Executed weekly vulnerability scans across shipboard tactical command databases and verified patch integrity.',
        ],
      },
    ],
    educationAndCredentials: [
      {
        title: 'Certified Applied AI Operator (CAIO Level 1)',
        issuer: 'VAAI / Texas Workforce Commission',
        date: 'Aug 2026',
        details: 'TWC-ETPL-78752-VAAI | Capstone Grade: 97.5%',
      },
      {
        title: 'GIAC Certified Incident Handler (GCIH)',
        issuer: 'SANS Institute',
        date: 'Jan 2024',
        details: 'Active Cyber Defense Certification',
      },
      {
        title: 'CompTIA Security+ CE',
        issuer: 'CompTIA',
        date: 'Nov 2021',
        details: 'DoD 8570 IAT Level II',
      },
    ],
  },
  'VAAI-2026-AF42': {
    fullName: 'Jamal Washington',
    phone: '(512) 555-0177',
    email: 'j.washington@defense-candidate.org',
    location: 'San Angelo, TX',
    securityClearance: 'Secret',
    branch: 'Air Force',
    mosCode: '1D7X1',
    mosTitle: 'Cyber Defense Operations Specialist',
    targetRole: 'Cloud Automation Architect',
    socCode: '15-1299.08',
    credentialUuid: 'VAAI-2026-AF42',
    issuedDate: 'August 12, 2026',
    verifiedSeatHours: 37.0,
    capstoneScore: 92.0,
    capstoneTitle: 'Air Force Logistics & Spares LLM Query Engine',
    summary:
      'Transitioning U.S. Air Force Cyber Defense Operations Specialist (1D7X1) with 6 years configuring mission systems, cloud infrastructure, and automated orchestration workflows. Skilled in building zero-trust API proxies, LLM function calling, and containerized microservices.',
    coreCompetencies: [
      'Cloud Architecture (AWS GovCloud)',
      'Zod Schema Guardrails',
      'Infrastructure as Code (Terraform)',
      'Prompt Optimization & RAG',
      'Python Automation',
      'Identity Federation & OAuth2',
      'Zero-Trust Network Access',
      'PostgreSQL RLS Multi-Tenancy',
      'DFARS 252.204-7012 Compliance',
    ],
    militaryExperience: [
      {
        roleTitle: 'Non-Commissioned Officer in Charge (NCOIC), Cyber Systems',
        unitAndBranch: '17th Communications Squadron, Goodfellow AFB, TX',
        dateRange: '2022 – 2026',
        bullets: [
          'Led a 14-person technical team operating base communications and enterprise cloud computing instances.',
          'Built automated workflow scripts that reduced server provisioning latency from 3 days to under 45 minutes.',
          'Spearheaded the unit transition to modern multi-factor authentication (MFA) across 2,400 user accounts.',
        ],
      },
      {
        roleTitle: 'Mission Defense Systems Technician',
        unitAndBranch: '67th Cyberspace Wing, Lackland AFB, TX',
        dateRange: '2020 – 2022',
        bullets: [
          'Monitored real-time system performance and remediated operating system security vulnerabilities.',
        ],
      },
    ],
    educationAndCredentials: [
      {
        title: 'Certified Applied AI Operator (CAIO Level 1)',
        issuer: 'VAAI / Texas Workforce Commission',
        date: 'Aug 2026',
        details: 'TWC Program Code: TWC-ETPL-78752-VAAI',
      },
      {
        title: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: 'Apr 2024',
        details: 'GovCloud & Federal Systems Specialization',
      },
      {
        title: 'CompTIA Security+ CE',
        issuer: 'CompTIA',
        date: 'Aug 2021',
        details: 'DoD 8570 Baseline',
      },
    ],
  },
  'VAAI-2026-MC81': {
    fullName: 'Liam O\'Connor',
    phone: '(512) 555-0163',
    email: 'l.oconnor@defense-candidate.org',
    location: 'Dallas, TX',
    securityClearance: 'Secret',
    branch: 'Marine Corps',
    mosCode: '0671',
    mosTitle: 'Data Systems Administrator',
    targetRole: 'Enterprise Data Operations Engineer',
    socCode: '15-1299.08',
    credentialUuid: 'VAAI-2026-MC81',
    issuedDate: 'August 16, 2026',
    verifiedSeatHours: 39.0,
    capstoneScore: 91.5,
    capstoneTitle: 'Tactical Readiness & Maintenance Predictive Parser',
    summary:
      'U.S. Marine Corps Data Systems Administrator (MOS 0671) bringing disciplined experience in tactical data operations, server virtualization, and disaster recovery. CAIO Level 1 graduate skilled in Python workflow pipelines, structured Zod schemas, and defensive NIST SP 800-171 controls.',
    coreCompetencies: [
      'Linux & Windows Systems Admin',
      'Virtualization (VMware / KVM)',
      'Data Pipelines & ETL Scripts',
      'Zod Schema Enforcement',
      'WASM In-Browser Workflows',
      'CUI Sanitization & OPSEC',
      'Storage Area Networks (SAN)',
      'Disaster Recovery Architecture',
      'Agile Team Leadership',
    ],
    militaryExperience: [
      {
        roleTitle: 'Data Systems Section Leader / Sergeant',
        unitAndBranch: '1st Marine Logistics Group, Camp Pendleton, CA',
        dateRange: '2022 – 2026',
        bullets: [
          'Engineered resilient tactical server enclaves supporting amphibious logistics and combat service support operations.',
          'Created automated backup validation pipelines reducing database recovery time objectives (RTO) by 60%.',
          'Trained 28 junior Marines in systems administration, network hardening, and DoD security technical implementation guides (STIGs).',
        ],
      },
      {
        roleTitle: 'Data Systems Specialist',
        unitAndBranch: 'Combat Logistics Battalion 7, 29 Palms, CA',
        dateRange: '2020 – 2022',
        bullets: [
          'Deployed tactical data servers in harsh desert field environments with 99.7% power-on reliability.',
        ],
      },
    ],
    educationAndCredentials: [
      {
        title: 'Certified Applied AI Operator (CAIO Level 1)',
        issuer: 'VAAI / Texas Workforce Commission',
        date: 'Aug 2026',
        details: 'TWC-ETPL-78752-VAAI | Verified Seat Hours: 39.0h',
      },
      {
        title: 'Cisco Certified Network Associate (CCNA)',
        issuer: 'Cisco Systems',
        date: 'Oct 2023',
        details: 'Enterprise Routing & Switching',
      },
      {
        title: 'CompTIA Security+ CE',
        issuer: 'CompTIA',
        date: 'Jul 2022',
        details: 'DoD 8570 IAT II',
      },
    ],
  },
};

/**
 * Loads a candidate's ATS-optimized printable resume data.
 */
export async function getVeteranResumeData(uuid: string): Promise<VeteranResumeData | null> {
  const normalizedUuid = uuid.trim().toUpperCase();

  // 1. Check directly in registry
  if (VETERAN_RESUME_REGISTRY[normalizedUuid]) {
    return VETERAN_RESUME_REGISTRY[normalizedUuid];
  }

  // 2. Check candidate profiles in candidates.ts
  const matchedCandidate = VETERAN_CANDIDATES.find(
    (c) => c.credentialUuid.toUpperCase() === normalizedUuid || c.id.toUpperCase() === normalizedUuid
  );

  if (matchedCandidate) {
    const branchName =
      matchedCandidate.branch === 'Space Force' ? 'Air Force' : matchedCandidate.branch;

    return {
      fullName: matchedCandidate.name,
      phone: '(512) 555-0199',
      email: `${matchedCandidate.name.toLowerCase().replace(/[^a-z]/g, '.')}@defense-candidate.org`,
      location: 'Austin, TX',
      securityClearance: matchedCandidate.securityClearance,
      branch: branchName,
      mosCode: matchedCandidate.mosCode,
      mosTitle: matchedCandidate.mosTitle,
      targetRole: 'AI Workflow Automation Specialist',
      socCode: '15-1299.08',
      credentialUuid: matchedCandidate.credentialUuid,
      issuedDate: 'August 14, 2026',
      verifiedSeatHours: matchedCandidate.contactHours,
      capstoneScore: matchedCandidate.capstoneGrade,
      capstoneTitle: matchedCandidate.artifacts[0]?.title || 'Automated Defense AI Workflow Pipeline',
      summary: matchedCandidate.civilianCareerSummary.slice(0, 420),
      coreCompetencies: [
        'NIST SP 800-171 Rev. 3',
        'Zod Schema Enforcement',
        'Python & Pyodide WASM',
        'CUI & DoD PII Redaction',
        'Zero-Retention LLM Pipelines',
        'Docker / Microservices',
        'PostgreSQL Row-Level Security',
        'Tactical Systems Operations',
        'OpenBadges v3.0 Verification',
      ],
      militaryExperience: [
        {
          roleTitle: `Senior ${matchedCandidate.mosTitle} (${matchedCandidate.rank})`,
          unitAndBranch: `U.S. ${branchName} Operational Command`,
          dateRange: '2021 – 2026',
          bullets: [
            matchedCandidate.militaryExperienceHighlight.slice(0, 180),
            'Engineered automated script pipelines improving tactical data processing speed by 38%.',
            'Enforced COMSEC, cryptographic key management, and OPSEC procedures for 500+ personnel.',
          ],
        },
      ],
      educationAndCredentials: [
        {
          title: 'Certified Applied AI Operator (CAIO Level 1)',
          issuer: 'VAAI / Texas Workforce Commission (TWC ETPL)',
          date: 'Aug 2026',
          details: `Program: TWC-ETPL-78752-VAAI | Grade: ${matchedCandidate.capstoneGrade}%`,
        },
        {
          title: 'CompTIA Security+ CE (DoD 8570 Approved)',
          issuer: 'CompTIA',
          date: 'Jun 2023',
          details: 'Active IAT Level II Certification',
        },
      ],
    };
  }

  // 3. If UUID starts with VAAI-2026-, generate mock candidate matching Marcus Vance
  if (normalizedUuid.startsWith('VAAI-2026-')) {
    const base = VETERAN_RESUME_REGISTRY['VAAI-2026-A1B2'];
    return {
      ...base,
      credentialUuid: normalizedUuid,
    };
  }

  return null;
}

/**
 * Returns all registered resumes for the interactive candidate switcher.
 */
export function getAllResumeCandidates(): VeteranResumeData[] {
  return Object.values(VETERAN_RESUME_REGISTRY);
}
