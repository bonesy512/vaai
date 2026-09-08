/**
 * VAAI Military Skills Graph & MOS Crosswalk Engine
 *
 * Maps military service records (Branch, MOS/AFSC/Rating, Rank Bracket)
 * to in-demand civilian tech competencies, O*NET SOC classifications,
 * and VAAI certified curriculum learning objectives.
 */

export type ServiceBranch = 'Army' | 'Navy' | 'Air Force' | 'Marine Corps' | 'Coast Guard';

export type RankBracket =
  | 'E-1_to_E-4' // Junior Enlisted
  | 'E-5_to_E-6' // Non-Commissioned Officer (NCOER)
  | 'E-7_to_E-9' // Senior NCO
  | 'W-1_to_W-5' // Warrant Officer
  | 'O-1_to_O-6'; // Commissioned Officer (OER)

export interface MilitaryMosDefinition {
  code: string;
  branch: ServiceBranch;
  title: string;
  category: 'Cyber & IT' | 'Intelligence & Analysis' | 'Logistics & Supply Chain' | 'Combat Arms & Operations';
  tacticalDuties: string[];
  associatedCompetencies: string[];
  primarySocCode: string;
  primarySocTitle: string;
  secondarySocCode: string;
  secondarySocTitle: string;
  medianCivilianSalary: number;
}

export interface SkillNode {
  id: string;
  label: string;
  category: 'military_duty' | 'vaai_competency' | 'civilian_soc' | 'tooling';
  description: string;
}

export interface SkillEdge {
  source: string;
  target: string;
  relationship: 'transforms_to' | 'demonstrates' | 'qualifies_for';
}

export interface SkillsGraphOutput {
  branch: ServiceBranch;
  mosCode: string;
  mosTitle: string;
  rankBracket: RankBracket;
  civilianTitleTarget: string;
  primarySocCode: string;
  primarySocTitle: string;
  secondarySocCode: string;
  secondarySocTitle: string;
  medianSalary: number;
  nodes: SkillNode[];
  edges: SkillEdge[];
  civilianizedResumeBullets: string[];
  recommendedModules: string[];
}

export interface MilitaryProfileInput {
  branch: ServiceBranch;
  mosCode: string;
  rankBracket: RankBracket;
  securityClearance?: 'Secret' | 'Top Secret' | 'TS/SCI' | 'None';
}

/**
 * Military MOS Database across Army, Navy, Air Force, Marine Corps, and Coast Guard
 */
export const MILITARY_MOS_DATABASE: Record<string, MilitaryMosDefinition> = {
  // Army
  'ARMY-25B': {
    code: '25B',
    branch: 'Army',
    title: 'Information Technology Specialist',
    category: 'Cyber & IT',
    tacticalDuties: [
      'Configured and administered tactical tactical LAN/WAN, SIPRNet, and NIPRNet infrastructure.',
      'Supervised cryptographic key generation and distribution under NSA COMSEC directives.',
      'Resolved enterprise hardware/software incident tickets under strict SLA time limits.',
    ],
    associatedCompetencies: [
      'Enterprise Network Security & Guardrails',
      'DoD PII / CUI Data Sanitization',
      'Workflow Automation & Shell Scripting',
      'API & Cloud Gateway Administration',
    ],
    primarySocCode: '15-1299.08',
    primarySocTitle: 'Computer Systems Engineers/Architects (AI Automation Specialist)',
    secondarySocCode: '15-1212.00',
    secondarySocTitle: 'Information Security Analyst',
    medianCivilianSalary: 118000,
  },
  'ARMY-17C': {
    code: '17C',
    branch: 'Army',
    title: 'Cyber Operations Specialist',
    category: 'Cyber & IT',
    tacticalDuties: [
      'Conducted offensive and defensive cyberspace operations in contested electromagnetic environments.',
      'Audited network packet captures and identified zero-day heuristic anomalies.',
      'Engineered automated intrusion response rules and vulnerability remediation playbooks.',
    ],
    associatedCompetencies: [
      'Zero-Retention LLM Architecture',
      'Adversarial Prompt Injection Defense',
      'Automated Vulnerability Remediation Workflows',
      'FIPS 140-3 Cryptographic Integrity',
    ],
    primarySocCode: '15-1212.00',
    primarySocTitle: 'Information Security Analyst',
    secondarySocCode: '15-1299.08',
    secondarySocTitle: 'Computer Systems Engineers/Architects',
    medianCivilianSalary: 125000,
  },
  'ARMY-35F': {
    code: '35F',
    branch: 'Army',
    title: 'Intelligence Analyst',
    category: 'Intelligence & Analysis',
    tacticalDuties: [
      'Synthesized multi-source intelligence (HUMINT, SIGINT, OSINT) into tactical operational briefs.',
      'Identified enemy order-of-battle timelines and predictive threat vectors.',
      'Maintained strict compliance with security classification marking guides (DoD 5200.48).',
    ],
    associatedCompetencies: [
      'Context Window Optimization & Prompt Chaining',
      'Structured Chronological Record Parsing',
      'CUI Security Classification Banners & Markings',
      'Data Extraction from Unstructured Dispatches',
    ],
    primarySocCode: '15-2051.00',
    primarySocTitle: 'Data Scientists / Natural Language Processing Specialist',
    secondarySocCode: '43-9199.00',
    secondarySocTitle: 'Automated Systems & Intelligence Operations Analyst',
    medianCivilianSalary: 104000,
  },
  'ARMY-88M': {
    code: '88M',
    branch: 'Army',
    title: 'Motor Transport Operator',
    category: 'Logistics & Supply Chain',
    tacticalDuties: [
      'Executed tactical convoy movements transporting critical materiel across hostile operational zones.',
      'Managed preventive maintenance checks and services (PMCS) for heavy vehicular fleets.',
      'Logged freight manifests and route coordinates in defense logistics management software.',
    ],
    associatedCompetencies: [
      'Logistics Workflow Automation & Make/Zapier Blueprints',
      'MGRS Tactical Coordinates & Geocoding Integration',
      'WIOA Attendance & Telemetry Data Formatting',
    ],
    primarySocCode: '43-9199.00',
    primarySocTitle: 'Office and Administrative Support Workers (Automated Systems Operator)',
    secondarySocCode: '15-1251.00',
    secondarySocTitle: 'Computer Programmer / Workflow Operator',
    medianCivilianSalary: 78500,
  },
  'ARMY-11B': {
    code: '11B',
    branch: 'Army',
    title: 'Infantryman / Team Leader',
    category: 'Combat Arms & Operations',
    tacticalDuties: [
      'Directed 4-8 personnel in high-stress tactical maneuvers under ambiguous, fast-moving conditions.',
      'Formulated Operation Orders (OPORDs) and standardized communication protocols.',
      'Managed accountability of $2.4M in optical, night-vision, and communications equipment.',
    ],
    associatedCompetencies: [
      'Standard Operating Procedure (SOP) Automation',
      'Prompt Architecture & Chain-of-Thought Reasoning',
      'High-Stress Project Leadership & Quality Assurance',
    ],
    primarySocCode: '15-1251.00',
    primarySocTitle: 'Computer Programmer / Applied AI Automation Operator',
    secondarySocCode: '43-9199.00',
    secondarySocTitle: 'Automated Operations Coordinator',
    medianCivilianSalary: 82000,
  },

  // Navy
  'NAVY-IT': {
    code: 'IT',
    branch: 'Navy',
    title: 'Information Systems Technician',
    category: 'Cyber & IT',
    tacticalDuties: [
      'Administered shipboard automated communications and satellite transmission links.',
      'Supervised automated vulnerability scans and STIG compliance implementations.',
      'Managed multi-domain directory services for afloat combatant strike groups.',
    ],
    associatedCompetencies: [
      'Enterprise Network Security & Guardrails',
      'Cloud Architecture & Webhook Integration',
      'DoD CUI De-Identification Protocols',
    ],
    primarySocCode: '15-1299.08',
    primarySocTitle: 'Computer Systems Engineers/Architects (AI Specialist)',
    secondarySocCode: '15-1212.00',
    secondarySocTitle: 'Information Security Analyst',
    medianCivilianSalary: 116000,
  },
  'NAVY-IS': {
    code: 'IS',
    branch: 'Navy',
    title: 'Intelligence Specialist',
    category: 'Intelligence & Analysis',
    tacticalDuties: [
      'Compiled maritime operational intelligence dossiers for strike warfare planners.',
      'Assessed satellite reconnaissance imagery and acoustic sensor feeds.',
      'Redacted classified operational summaries for coalition dissemination.',
    ],
    associatedCompetencies: [
      'LLM Document Synthesis & Retrieval',
      'Multi-Modal Vision & Sensor Parsing',
      'CUI Markings & Federal Disclosure Guardrails',
    ],
    primarySocCode: '15-2051.00',
    primarySocTitle: 'Data Scientists & NLP Operators',
    secondarySocCode: '15-1299.08',
    secondarySocTitle: 'AI Systems Architect',
    medianCivilianSalary: 108000,
  },

  // Air Force
  'USAF-1D7X1': {
    code: '1D7X1',
    branch: 'Air Force',
    title: 'Cyber Defense Operations',
    category: 'Cyber & IT',
    tacticalDuties: [
      'Sustained global aerospace mission command networks and airborne relay links.',
      'Engineered automated configuration management scripts for enterprise endpoints.',
      'Conducted continuous threat hunting and automated SIEM log correlation.',
    ],
    associatedCompetencies: [
      'Zero-Retention LLM Architecture',
      'Workflow Automation & Python Scripting',
      'NIST SP 800-171 Rev. 3 Boundary Enforcements',
    ],
    primarySocCode: '15-1212.00',
    primarySocTitle: 'Information Security Analyst',
    secondarySocCode: '15-1299.08',
    secondarySocTitle: 'AI Automation Systems Engineer',
    medianCivilianSalary: 122000,
  },
  'USAF-1N0X1': {
    code: '1N0X1',
    branch: 'Air Force',
    title: 'All Source Intelligence Analyst',
    category: 'Intelligence & Analysis',
    tacticalDuties: [
      'Analyzed adversary air defense batteries and electronic countermeasure vectors.',
      'Formulated air tasking order threat assessments for combat pilots.',
      'Synthesized complex unstructured intelligence streams into operational decision matrices.',
    ],
    associatedCompetencies: [
      'Prompt Chaining & Structured Synthesis',
      'Schema Validation & Extraction Pipelines',
      'Safe Harbor Non-Advocacy Boundaries',
    ],
    primarySocCode: '15-2051.00',
    primarySocTitle: 'Data Scientist / NLP Prompt Specialist',
    secondarySocCode: '43-9199.00',
    secondarySocTitle: 'Automated Systems Operator',
    medianCivilianSalary: 106000,
  },

  // Marine Corps
  'USMC-0671': {
    code: '0671',
    branch: 'Marine Corps',
    title: 'Information Security Technician',
    category: 'Cyber & IT',
    tacticalDuties: [
      'Deployed austere forward operating base (FOB) virtualized servers and secure gateways.',
      'Maintained physical and logical perimeter defense over marine expeditionary data.',
      'Scripted automated configuration backups under tactical field constraints.',
    ],
    associatedCompetencies: [
      'DoD PII & Tactical Grid Sanitization',
      'WASM In-Browser Zero-Installation Execution',
      'Enterprise AI Security & Compliance Guardrails',
    ],
    primarySocCode: '15-1299.08',
    primarySocTitle: 'Computer Systems Architect / Applied AI Operator',
    secondarySocCode: '15-1212.00',
    secondarySocTitle: 'Information Security Analyst',
    medianCivilianSalary: 114000,
  },
  'USMC-0231': {
    code: '0231',
    branch: 'Marine Corps',
    title: 'Intelligence Specialist',
    category: 'Intelligence & Analysis',
    tacticalDuties: [
      'Drafted intelligence preparation of the battlefield (IPB) products for battalion commanders.',
      'Correlated ground reconnaissance reports with drone surveillance data.',
      'Managed declassification and red-line reviews of tactical threat intelligence.',
    ],
    associatedCompetencies: [
      'Unstructured Record Parsing & Entity Extraction',
      'CUI Defense Token Filtering & Redaction',
      'Multi-Agent Synthesis Pipelines',
    ],
    primarySocCode: '15-2051.00',
    primarySocTitle: 'Data Scientist / AI Analyst',
    secondarySocCode: '43-9199.00',
    secondarySocTitle: 'Automated Systems Operator',
    medianCivilianSalary: 102000,
  },

  // Coast Guard
  'USCG-IT': {
    code: 'IT',
    branch: 'Coast Guard',
    title: 'Information Systems Technician',
    category: 'Cyber & IT',
    tacticalDuties: [
      'Maintained coastal search-and-rescue radar data networks and maritime telemetry.',
      'Monitored maritime port security communications and cybersecurity perimeter defenses.',
      'Managed distributed maritime data links across cutter fleet operations.',
    ],
    associatedCompetencies: [
      'Telemetry Stream Ingestion & Processing',
      'API Integration & Webhook Automation',
      'DoD/DHS Compliance Boundary Protection',
    ],
    primarySocCode: '15-1299.08',
    primarySocTitle: 'Computer Systems Engineers / AI Specialist',
    secondarySocCode: '15-1212.00',
    secondarySocTitle: 'Information Security Analyst',
    medianCivilianSalary: 110000,
  },
};

/**
 * Generates civilianized resume bullets based on military profile and rank seniority.
 */
function generateResumeBullets(
  mos: MilitaryMosDefinition,
  rank: RankBracket
): string[] {
  const isLeader = rank === 'E-5_to_E-6' || rank === 'E-7_to_E-9' || rank === 'O-1_to_O-6' || rank === 'W-1_to_W-5';

  if (mos.category === 'Cyber & IT') {
    return [
      `Engineered and secured multi-tier enterprise systems and data networks supporting ${isLeader ? 'over 400 personnel with 99.9% availability' : 'mission-critical joint operations'}, implementing strict NIST SP 800-171 and DISA STIG controls.`,
      `Designed and deployed automated Python scripts cutting manual data verification times by 35% while eliminating unredacted PII/CUI transmission risks.`,
      `${isLeader ? 'Led a technical team of specialists' : 'Collaborated across technical teams'} in integrating enterprise LLMs and prompt chaining pipelines for automated incident response and structured data processing.`,
    ];
  }

  if (mos.category === 'Intelligence & Analysis') {
    return [
      `Synthesized vast unstructured datasets into actionable operational intelligence briefs using modern prompt engineering and context-window optimization techniques.`,
      `Enforced rigorous data sanitization and classification protocols under DoD Instruction 5200.48, safeguarding sensitive records with zero leakage incidents.`,
      `${isLeader ? 'Directed intelligence analysis teams' : 'Applied advanced analytical reasoning'} to transform ambiguous operational reports into structured JSON schemas for executive decision-making.`,
    ];
  }

  if (mos.category === 'Logistics & Supply Chain') {
    return [
      `Orchestrated complex logistics workflows and resource allocation pipelines utilizing automated API integrations and webhook blueprint automations.`,
      `Maintained 100% accountability over multi-million dollar operational assets through automated telemetry tracking and real-time inventory verification.`,
      `${isLeader ? 'Supervised cross-functional teams' : 'Coordinated operational logistics'} ensuring complete adherence to state and federal compliance audit frameworks.`,
    ];
  }

  return [
    `Led and executed mission-critical operations in high-consequence environments, applying structured standard operating procedures (SOPs) and rigorous risk mitigation protocols.`,
    `Leveraged applied AI automation tools to streamline administrative documentation, reducing operational overhead by 40%.`,
    `${isLeader ? 'Mentored and trained teams' : 'Excelled in cross-functional units'} in adopting modern digital workflows and AI-driven productivity platforms.`,
  ];
}

/**
 * Builds the interactive skill graph (nodes & edges) mapping duties to competencies to SOC roles.
 */
export function crosswalkMilitaryProfile(input: MilitaryProfileInput): SkillsGraphOutput {
  // Key format: BRANCH-MOS (e.g. ARMY-25B, NAVY-IT, USAF-1D7X1)
  const lookupKey = `${input.branch.replace(/\s+/g, '').toUpperCase()}-${input.mosCode.toUpperCase()}`;
  let mos = MILITARY_MOS_DATABASE[lookupKey];

  // Fallback to Army 25B if specific code not found
  if (!mos) {
    const matchingBranchMos = Object.values(MILITARY_MOS_DATABASE).find(
      (m) => m.branch.toLowerCase() === input.branch.toLowerCase()
    );
    mos = matchingBranchMos || MILITARY_MOS_DATABASE['ARMY-25B'];
  }

  const nodes: SkillNode[] = [];
  const edges: SkillEdge[] = [];

  // 1. Military Duty Nodes
  mos.tacticalDuties.forEach((duty, idx) => {
    const dutyId = `duty-${idx + 1}`;
    nodes.push({
      id: dutyId,
      label: duty.length > 40 ? duty.slice(0, 37) + '...' : duty,
      category: 'military_duty',
      description: duty,
    });
  });

  // 2. VAAI Competency Nodes
  mos.associatedCompetencies.forEach((comp, idx) => {
    const compId = `comp-${idx + 1}`;
    nodes.push({
      id: compId,
      label: comp,
      category: 'vaai_competency',
      description: `VAAI Certified Core Competency: ${comp}`,
    });

    // Link duties to competencies
    const dutyId = `duty-${(idx % mos.tacticalDuties.length) + 1}`;
    edges.push({
      source: dutyId,
      target: compId,
      relationship: 'transforms_to',
    });
  });

  // 3. Civilian SOC Target Node
  const socNodeId = `soc-${mos.primarySocCode}`;
  nodes.push({
    id: socNodeId,
    label: `${mos.primarySocTitle} (${mos.primarySocCode})`,
    category: 'civilian_soc',
    description: `Target Civilian Occupation: ${mos.primarySocTitle}. National Median Salary: $${mos.medianCivilianSalary.toLocaleString()}.`,
  });

  // Connect competencies to SOC node
  mos.associatedCompetencies.forEach((_, idx) => {
    edges.push({
      source: `comp-${idx + 1}`,
      target: socNodeId,
      relationship: 'qualifies_for',
    });
  });

  const civilianizedResumeBullets = generateResumeBullets(mos, input.rankBracket);

  return {
    branch: input.branch,
    mosCode: mos.code,
    mosTitle: mos.title,
    rankBracket: input.rankBracket,
    civilianTitleTarget: mos.primarySocTitle,
    primarySocCode: mos.primarySocCode,
    primarySocTitle: mos.primarySocTitle,
    secondarySocCode: mos.secondarySocCode,
    secondarySocTitle: mos.secondarySocTitle,
    medianSalary: mos.medianCivilianSalary,
    nodes,
    edges,
    civilianizedResumeBullets,
    recommendedModules: [
      'ai-literacy-101 (Title 38 Safe Harbor & Ethical AI)',
      'workforce-translation (Military Occupational Translation & Data Extraction)',
      'etpl-capstone (WIOA Capstone & Evaluation Audit)',
    ],
  };
}

/**
 * Returns list of distinct branches available in the matrix.
 */
export function getAvailableBranches(): ServiceBranch[] {
  return ['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard'];
}

/**
 * Returns available MOS options for a given branch.
 */
export function getMosListForBranch(branch: ServiceBranch): Array<{ code: string; title: string }> {
  return Object.values(MILITARY_MOS_DATABASE)
    .filter((m) => m.branch === branch)
    .map((m) => ({ code: m.code, title: m.title }));
}
