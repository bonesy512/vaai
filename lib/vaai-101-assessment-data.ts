/**
 * VAAI-101: Applied AI Foundations & LLM Operations
 * Assessment Data Bank, Question Banks, Doctrinal Citations, and Lab Definitions
 *
 * Compliance Anchor: TWC ETPL #TWC-ETPL-78752-VAAI-101
 * Accreditation: WIOA Title I (>= 90% Telemetry Floor / 36.0h active engagement)
 * SOC Crosswalk: 15-1299.08 (Computer Systems Engineers/Architects)
 */

import type {
  ExamQuestion,
  ModuleExam,
  CapstoneRubric,
  ExamModuleId,
} from './types/assessment';

// ============================================================================
// 1. CAPSTONE RUBRIC CONFIGURATION (Strict 100% Weight / 80% Threshold)
// ============================================================================

export const CAPSTONE_RUBRIC: CapstoneRubric = {
  dimensions: {
    schemaConformity: {
      id: 'schemaConformity',
      title: 'Schema Conformity & Determinism',
      weightPercentage: 30,
      passingCriteria:
        'Zero uncaught validation exceptions across 10 noisy SITREPs. Structured payload conforms to MIL-STD-2525D and Pydantic constraints.',
      doctrinalRef: 'MIL-STD-2525D Joint Military Symbology Data Structures',
    },
    fallbackResilience: {
      id: 'fallbackResilience',
      title: 'Fallback & Error Resilience',
      weightPercentage: 25,
      passingCriteria:
        'Sub-250ms failover execution upon simulated HTTP 429 (rate-limit) or 503 (provider outage) transitioning seamlessly to local offline fallback.',
      doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-7 Boundary Protection & PACE Circuit Architecture',
    },
    boundarySanitization: {
      id: 'boundarySanitization',
      title: 'Boundary Defense & Lexical Sanitization',
      weightPercentage: 25,
      passingCriteria:
        '100% precision redaction of military callsigns, personnel names, 10-digit EDIPIs, SSNs, and WGS-84/MGRS coordinates before any upstream dispatch.',
      doctrinalRef: 'DoD Instruction 5200.48 Controlled Unclassified Information & NIST SP 800-171 SC-13',
    },
    codeQuality: {
      id: 'codeQuality',
      title: 'Code Quality & Memory Budget',
      weightPercentage: 20,
      passingCriteria:
        'Memory allocation strictly bounded within the 4,096-token ceiling; clean modular architecture without unhandled runtime leaks.',
      doctrinalRef: 'CJCSM 6510.01B Tactical Edge Network Optimization & BPE Context Constraints',
    },
  },
  totalWeight: 100,
  passingScorePercentage: 80,
};

// ============================================================================
// 2. MODULE 1 QUESTION BANK: PROMPT ENGINEERING AS CODE & DETERMINISM
// ============================================================================

export const MODULE_1_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-101-q1-1',
    moduleId: 'mod-1',
    question:
      'In a mission-critical tactical messaging pipeline, what is the primary operational effect of setting the decoding temperature to T = 0.0?',
    options: {
      A: 'It compresses the context window by pruning infrequent tokens.',
      B: 'It enforces deterministic greedy token selection, eliminating probabilistic variance in output structure.',
      C: 'It disables safety filters and speeds up token generation across high-bandwidth links.',
      D: 'It caches the key-value (KV) attention matrix permanently in edge GPU memory.',
    },
    correctAnswer: 'B',
    explanation:
      'Setting T = 0.0 forces the model to select the highest-probability token at each generation step (greedy argmax decoding). Under FM 6-0 standards, operational outputs must be repeatable and deterministic rather than creative or variable.',
    doctrinalRef: 'FM 6-0 Commander and Staff Organization and Operations (Deterministic Command Communication)',
  },
  {
    id: 'vaai-101-q1-2',
    moduleId: 'mod-1',
    question:
      'According to defense LLM integration doctrine, why must System instructions and User prompts be segregated into distinct message channels rather than concatenated as plain text?',
    options: {
      A: 'To reduce billing cost by applying a lower per-token tariff to System instructions.',
      B: 'To allow the client browser to compress the User prompt with gzip before network dispatch.',
      C: 'To preserve execution privilege separation and defend against prompt injection or instruction hijacking.',
      D: 'To bypass mandatory Zero-Data-Retention (ZDR) validation on intermediate proxy gateways.',
    },
    correctAnswer: 'C',
    explanation:
      'Under NIST SP 800-171 SC-7 boundary protection and prompt engineering standards, system instructions establish immutable operational guardrails. Concatenating user text into the system channel allows user input to masquerade as privileged commands, inducing cognitive drift and instruction hijacking.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-7 & FM 6-0 Staff Writing Standards',
  },
  {
    id: 'vaai-101-q1-3',
    moduleId: 'mod-1',
    question:
      'Which phenomenon represents an unacceptable engineering failure when wrapping raw tactical transmissions into pure-function automated SITREPs?',
    options: {
      A: 'Parsing payload characters into UTF-8 byte streams.',
      B: 'Emitting conversational preambles ("Certainly, here is the report:") or closing affirmations.',
      C: 'Enforcing a strict JSON schema on extracted threat entities.',
      D: 'Stripping leading whitespace and carriage returns from the incoming radio log.',
    },
    correctAnswer: 'B',
    explanation:
      'Automated military data pipelines require pure structured data blocks. Conversational filler and conversational preambles corrupt downstream automated ingest parsers, breaking machine-to-machine interop under FM 6-0 doctrine.',
    doctrinalRef: 'FM 6-0 Section 4-3 (Standardized Operational Reporting Architecture)',
  },
];

// ============================================================================
// 3. MODULE 2 QUESTION BANK: SCHEMA ENFORCEMENT & PYDANTIC VALIDATION
// ============================================================================

export const MODULE_2_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-101-q2-1',
    moduleId: 'mod-2',
    question:
      'What is the architectural role of Pydantic v2 / Zod schema validation in an automated tactical symbology pipeline adhering to MIL-STD-2525D?',
    options: {
      A: 'To act as a lossy audio compressor for tactical edge radio links.',
      B: 'To serve as a deterministic gatekeeper trapping invalid enums, boundary errors, and malformed structures before database persistence.',
      C: 'To train a local small language model on historical casualty reports.',
      D: 'To automatically translate Russian military callsigns into NATO phonetic equivalents without regex.',
    },
    correctAnswer: 'B',
    explanation:
      'MIL-STD-2525D requires exact standard symbology identifiers (SIDC). Pydantic v2 acts as an immutable boundary filter, trapping hallucinated fields or out-of-spec enums as `ValidationError` exceptions before any corrupted record enters operational storage.',
    doctrinalRef: 'MIL-STD-2525D Joint Military Symbology Data Contracts',
  },
  {
    id: 'vaai-101-q2-2',
    moduleId: 'mod-2',
    question:
      'When implementing a self-correcting validation retry loop for LLM outputs, what must be injected into the retry prompt alongside the schema?',
    options: {
      A: 'The full training weights of the transformer model.',
      B: 'A request for the model to apologize and restart the entire session.',
      C: 'The exact parser error diagnostics and specific validation failures produced by the validator.',
      D: 'An increased temperature parameter (T >= 1.5) to introduce random token diversity.',
    },
    correctAnswer: 'C',
    explanation:
      'Providing exact validation error messages (e.g., "Field casualties_reported must be >= 0") gives the LLM precise programmatic feedback, allowing targeted self-correction without drifting into unrelated hallucinations.',
    doctrinalRef: 'MIL-STD-2525D & Automated Error Trapping in Command Systems',
  },
  {
    id: 'vaai-101-q2-3',
    moduleId: 'mod-2',
    question:
      'Which Pydantic field constraint correctly establishes planetary coordinate boundaries for WGS-84 latitude in a military unit status schema?',
    options: {
      A: '`latitude: float = Field(..., ge=-90.0, le=90.0, description="WGS-84 Latitude")`',
      B: '`latitude: int = Field(..., gt=0, lt=360)`',
      C: '`latitude: str = Field(..., regex="^[0-9]{2}$")`',
      D: '`latitude: float = Field(default=0.0, max_digits=2)`',
    },
    correctAnswer: 'A',
    explanation:
      'WGS-84 latitude spans from -90.0° (South Pole) to +90.0° (North Pole). Pydantic `ge=-90.0, le=90.0` strictly prevents hallucinated coordinates that could misdirect automated tactical tracking units.',
    doctrinalRef: 'WGS-84 / MIL-STD-2525D Geographic Entity Reference Standards',
  },
];

// ============================================================================
// 4. MODULE 3 QUESTION BANK: TOKENOMICS & CONTEXT BUDGETING
// ============================================================================

export const MODULE_3_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-101-q3-1',
    moduleId: 'mod-3',
    question:
      'What critical operational benefit does Server-Sent Events (SSE) streaming provide over high-latency tactical edge radio connections under CJCSM 6510.01B?',
    options: {
      A: 'It encrypts token payloads using proprietary radio frequencies.',
      B: 'It drastically minimizes Time-to-First-Token (TTFT), allowing human commanders to ingest immediate observations while generation completes.',
      C: 'It eliminates the need for tokenizers and BPE tables on the client terminal.',
      D: 'It increases the overall token context window beyond the theoretical model architecture limit.',
    },
    correctAnswer: 'B',
    explanation:
      'CJCSM 6510.01B emphasizes cognitive latency reduction in tactical edge networks. SSE streaming delivers tokens as they are decoded, providing immediate operational awareness without waiting for the full response completion.',
    doctrinalRef: 'CJCSM 6510.01B Tactical Communications & Bandwidth Optimization',
  },
  {
    id: 'vaai-101-q3-2',
    moduleId: 'mod-3',
    question:
      'When an automated sliding-window context manager trims historical messages to fit a 4,096-token edge budget, which element must ALWAYS be preserved?',
    options: {
      A: 'The oldest user greeting message.',
      B: 'The immutable system directive and commander’s operational intent.',
      C: 'Every intermediate tool call payload regardless of size.',
      D: 'The model’s internal hidden states.',
    },
    correctAnswer: 'B',
    explanation:
      'The system instruction encodes the operational guardrails, formatting rules, and commander’s intent. If trimmed, the model suffers severe cognitive drift and will violate output contracts.',
    doctrinalRef: 'CJCSM 6510.01B & FM 6-0 Context Preservation Doctrine',
  },
  {
    id: 'vaai-101-q3-3',
    moduleId: 'mod-3',
    question:
      'How does a Token-Bucket Rate Limiter defend an edge operational node from experiencing HTTP 429 quota exhaustion?',
    options: {
      A: 'By dropping all outbound packets permanently when traffic exceeds zero.',
      B: 'By spoofing user-agent headers to impersonate multiple client IP addresses.',
      C: 'By smoothing transmission bursts within a bounded capacity and continuously refilling tokens at a sustainable rate.',
      D: 'By converting all prompt text into Base64 before sending.',
    },
    correctAnswer: 'C',
    explanation:
      'The token-bucket algorithm permits controlled bursts up to bucket capacity while enforcing a steady long-term rate, preventing sudden traffic spikes from overwhelming API rate limits.',
    doctrinalRef: 'CJCSM 6510.01B Traffic Shaping and Network Throttling Controls',
  },
];

// ============================================================================
// 5. MODULE 4 QUESTION BANK: SECURE API ARCHITECTURE & FALLBACK CIRCUITS
// ============================================================================

export const MODULE_4_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-101-q4-1',
    moduleId: 'mod-4',
    question:
      'What fatal compliance and operational flaw occurs if a tactical edge system connects directly to a commercial cloud LLM endpoint without boundary defense?',
    options: {
      A: 'The token generation rate will drop below 1 token per minute.',
      B: 'It violates NIST SP 800-171 SC-7 boundary defense and risks exfiltrating raw CUI/PII into external model logs or training pools.',
      C: 'It invalidates the local browser’s TLS certificates permanently.',
      D: 'It prevents the Python runtime from importing standard library modules.',
    },
    correctAnswer: 'B',
    explanation:
      'Direct unmonitored egress to commercial APIs without an airlock or zero-data-retention (ZDR) verification leaks Controlled Unclassified Information (CUI), violating NIST SP 800-171 SC-7 and DoD Instruction 5200.48.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-7 (Boundary Protection) & DoD Instruction 5200.48',
  },
  {
    id: 'vaai-101-q4-2',
    moduleId: 'mod-4',
    question:
      'Under the PACE (Primary, Alternate, Contingency, Emergency) fallback circuit pattern, what must the pipeline do immediately when the primary cloud LLM returns an HTTP 503 error?',
    options: {
      A: 'Continuously poll the cloud provider every 10ms until the server recovers.',
      B: 'Trip the circuit and transition within <= 250ms to a verified local offline fallback runtime.',
      C: 'Terminate the operating system and erase all disk storage.',
      D: 'Prompt the operator to manually re-type the prompt text.',
    },
    correctAnswer: 'B',
    explanation:
      'PACE communications doctrine dictates that failures must trigger rapid, non-blocking failover to alternate paths. The circuit breaker must switch to local deterministic parsing within sub-250ms latency constraints.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-13 & Tactical PACE Communications Architecture',
  },
  {
    id: 'vaai-101-q4-3',
    moduleId: 'mod-4',
    question:
      'Why is Zero-Data-Retention (ZDR) configuration mandatory for defense contractors processing CUI through cloud API vendors?',
    options: {
      A: 'Because vendors charge double for retained tokens.',
      B: 'To contractually and technically guarantee that prompt payloads are not persisted in disk logs or used to fine-tune public models.',
      C: 'To ensure all model responses are deleted from student screens after 10 seconds.',
      D: 'To disable logging of HTTP status codes in cloud load balancers.',
    },
    correctAnswer: 'B',
    explanation:
      'ZDR prevents customer prompts containing defense or sensitive data from persisting in persistent storage or being consumed into foundational model training corpora, upholding CUI compliance.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-13 & DoD CUI Protection Mandates',
  },
];

// ============================================================================
// 6. CAPSTONE FINAL EXAMINATION: 10 COMPREHENSIVE QUESTIONS
// ============================================================================

export const CAPSTONE_FINAL_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-101-cap-q1',
    moduleId: 'capstone',
    question:
      'Prior to dispatching a raw tactical SITREP to an external inference endpoint, which operation must be verified with 100% precision?',
    options: {
      A: 'Translation of all numeric characters into hexadecimal format.',
      B: 'Lexical boundary redaction of all callsigns, military EDIPIs, SSNs, and coordinate grids.',
      C: 'Conversion of the message body into a WAV audio file.',
      D: 'Re-indexing of all sentences into reverse chronological order.',
    },
    correctAnswer: 'B',
    explanation:
      'DoD Instruction 5200.48 and NIST SP 800-171 SC-7 require comprehensive pre-dispatch sanitization. Redacting military identity attributes and tactical coordinates prevents CUI leakage before tokens leave the local trust boundary.',
    doctrinalRef: 'DoD Instruction 5200.48 & NIST SP 800-171 Rev. 3 SC-7',
  },
  {
    id: 'vaai-101-cap-q2',
    moduleId: 'capstone',
    question:
      'What immediate failure occurs if an LLM returns a non-conforming operational readiness enum (e.g., "PARTIALLY_READY") in an un-defended pipeline?',
    options: {
      A: 'The host CPU throttles clock speed by 50%.',
      B: 'Downstream command-and-control systems throw unhandled type exceptions or silently misclassify unit combat posture.',
      C: 'The browser WASM runtime shuts down the network socket.',
      D: 'The prompt token limit expands automatically.',
    },
    correctAnswer: 'B',
    explanation:
      'Military decision-support databases rely on strict enumeration sets (e.g., FULLY_MISSION_CAPABLE, DEGRADED, NON_MISSION_CAPABLE). Hallucinated enums cause downstream system crashes or tactical misrepresentation of combat power.',
    doctrinalRef: 'MIL-STD-2525D Symbology and Operational Readiness Standards',
  },
  {
    id: 'vaai-101-cap-q3',
    moduleId: 'capstone',
    question:
      'What is the primary role of an automated context-aware retry loop when receiving a malformed JSON payload from an LLM?',
    options: {
      A: 'It flags the model provider for a monetary refund.',
      B: 'It reprompts the model by appending the exact validation error traceback, enabling targeted self-correction without operator intervention.',
      C: 'It reverts the prompt to an unformatted plain English greeting.',
      D: 'It forces the client to download an alternate Python interpreter.',
    },
    correctAnswer: 'B',
    explanation:
      'A self-correcting retry loop isolates the specific schema defect (e.g., missing key, wrong type) and instructs the model to correct that specific error, achieving high autonomous reliability.',
    doctrinalRef: 'MIL-STD-2525D Automated Fault Recovery Standards',
  },
  {
    id: 'vaai-101-cap-q4',
    moduleId: 'capstone',
    question:
      'Why is the token ceiling strictly bounded to 4,096 tokens in tactical forward deployments?',
    options: {
      A: 'To respect low-bandwidth tactical edge transmission constraints and guarantee sub-second latency for critical alerts.',
      B: 'Because Python lists cannot store more than 4,096 elements.',
      C: 'Because NIST SP 800-171 prohibits numbers larger than 4,096.',
      D: 'To prevent the model from learning foreign languages.',
    },
    correctAnswer: 'A',
    explanation:
      'Tactical edge communication channels operate under Disconnected, Intermittent, and Limited (DIL) bandwidth. Bounding the context window to 4,096 tokens enforces low latency, tight serialization, and bounded memory consumption.',
    doctrinalRef: 'CJCSM 6510.01B Tactical Edge Communications Protocol',
  },
  {
    id: 'vaai-101-cap-q5',
    moduleId: 'capstone',
    question:
      'During a simulated HTTP 503 cloud outage in the capstone evaluation, what is the mandatory pass criterion for the fallback circuit?',
    options: {
      A: 'The test harness waits 30 seconds for the cloud server to restart.',
      B: 'The circuit breaker fails over to the local deterministic rule engine in <= 250.0 ms with zero uncaught exceptions.',
      C: 'The application prompts the user to enter a new credit card.',
      D: 'The system skips processing the tactical SITREP entirely.',
    },
    correctAnswer: 'B',
    explanation:
      'Under the PACE architecture and capstone rubric, cloud outages must never freeze tactical operations. The system must execute failover to local parsing logic in 250ms or less.',
    doctrinalRef: 'NIST SP 800-171 SC-13 & PACE Communications Protocol',
  },
  {
    id: 'vaai-101-cap-q6',
    moduleId: 'capstone',
    question:
      'How does adherence to FM 6-0 staff standards directly impact the software reliability of an AI briefing generator?',
    options: {
      A: 'It allows the AI to generate subjective opinions on tactical commander decisions.',
      B: 'It provides rigid, standardized message structures (SITREP, MEDEVAC, SALUTE) that translate into deterministic data schemas.',
      C: 'It eliminates the need for unit testing and code reviews.',
      D: 'It guarantees that all military hardware uses Python exclusively.',
    },
    correctAnswer: 'B',
    explanation:
      'FM 6-0 defines standard staff formats with fixed field layouts. Translating doctrinal reporting standards directly into schemas yields predictable, machine-parseable artifacts.',
    doctrinalRef: 'FM 6-0 Commander and Staff Organization and Operations',
  },
  {
    id: 'vaai-101-cap-q7',
    moduleId: 'capstone',
    question:
      'When pseudonymizing tactical personnel records, where must the secure reversible translation table be stored under NIST guidelines?',
    options: {
      A: 'Embedded directly into the public prompt text.',
      B: 'Inside an isolated, encrypted enclave segregated from external inference network egress.',
      C: 'In the client browser’s public cookies without encryption.',
      D: 'Uploaded to an unauthenticated public cloud bucket.',
    },
    correctAnswer: 'B',
    explanation:
      'NIST SP 800-171 requires separation of cryptographic keys and re-identification maps from processing pipelines. The lookup table must remain in an encrypted boundary enclave.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-7/SC-13 Boundary Segregation',
  },
  {
    id: 'vaai-101-cap-q8',
    moduleId: 'capstone',
    question:
      'Which Pydantic field definition correctly enforces a non-negative casualty count in a military unit status report?',
    options: {
      A: '`casualties_reported: int = Field(default=0, ge=0)`',
      B: '`casualties_reported: float = Field(default=-1)`',
      C: '`casualties_reported: str = Field(..., regex="^[0-9]+$")`',
      D: '`casualties_reported: list[int] = Field(min_items=1)`',
    },
    correctAnswer: 'A',
    explanation:
      'Casualties are whole non-negative integers. `int = Field(default=0, ge=0)` strictly ensures values cannot be negative numbers or fractional entities.',
    doctrinalRef: 'MIL-STD-2525D & Pydantic Data Contract Specifications',
  },
  {
    id: 'vaai-101-cap-q9',
    moduleId: 'capstone',
    question:
      'What advantage does a token-bucket rate limiter offer over a fixed-window counter during sudden tactical traffic surges?',
    options: {
      A: 'It allows infinite tokens with zero cost.',
      B: 'It prevents traffic boundary spikes at window reset boundaries by continuously replenishing capacity smoothly over time.',
      C: 'It automatically turns off all cryptographic encryption.',
      D: 'It replaces the HTTP transport layer with UDP.',
    },
    correctAnswer: 'B',
    explanation:
      'Fixed-window rate limiters can allow 2x bursts at the boundary between windows. The token bucket provides continuous smooth replenishment, protecting downstream inference services.',
    doctrinalRef: 'CJCSM 6510.01B Bandwidth Optimization & Rate Limiting',
  },
  {
    id: 'vaai-101-cap-q10',
    moduleId: 'capstone',
    question:
      'What are the four exact technical dimensions evaluated by the automated VAAI-101 WASM Capstone Rubric?',
    options: {
      A: 'HTML Layout, CSS Flexbox, JavaScript Callbacks, Python Comments.',
      B: 'Schema Conformity (30%), Fallback Resilience (25%), Boundary Sanitization (25%), Code Quality (20%).',
      C: 'Prompt Length (40%), Temperature Setting (30%), GPU Allocation (20%), Disk Usage (10%).',
      D: 'Vocabulary Size (50%), Grammar Correctness (30%), Reading Level (10%), Sentiment (10%).',
    },
    correctAnswer: 'B',
    explanation:
      'The VAAI-101 capstone rubric is weighted across Schema Conformity (30%), Fallback Resilience (25%), Boundary Sanitization (25%), and Code Quality/Memory Budget (20%), totaling 100% with an 80% passing floor.',
    doctrinalRef: 'VAAI-101 Capstone Accreditation Specification & TWC ETPL Standards',
  },
];

// ============================================================================
// 7. MASTER MODULE EXAMS REGISTRY
// ============================================================================

export const VAAI_101_EXAMS: Record<ExamModuleId, ModuleExam> = {
  'mod-1': {
    moduleId: 'mod-1',
    title: 'Module 1 Examination: Prompt Engineering as Code & Deterministic Output Shaping',
    passingScorePercentage: 80,
    questions: MODULE_1_QUESTIONS,
  },
  'mod-2': {
    moduleId: 'mod-2',
    title: 'Module 2 Examination: Schema Enforcement, Pydantic, & Zod Output Validation',
    passingScorePercentage: 80,
    questions: MODULE_2_QUESTIONS,
  },
  'mod-3': {
    moduleId: 'mod-3',
    title: 'Module 3 Examination: Tokenomics, Context Budgets, & High-Throughput Streaming',
    passingScorePercentage: 80,
    questions: MODULE_3_QUESTIONS,
  },
  'mod-4': {
    moduleId: 'mod-4',
    title: 'Module 4 Examination: Secure API Architecture, Rate Limiting, & Fallback Circuits',
    passingScorePercentage: 80,
    questions: MODULE_4_QUESTIONS,
  },
  capstone: {
    moduleId: 'capstone',
    title: 'VAAI-101 Comprehensive Final Examination & Capstone Defense',
    passingScorePercentage: 80,
    questions: CAPSTONE_FINAL_QUESTIONS,
  },
};

/**
 * Retrieve exam by module ID, supporting both 'mod-X' and 'MX' conventions.
 */
export function getModuleExam(moduleId: string): ModuleExam | null {
  const normalized = moduleId.toLowerCase().replace('m', 'mod-');
  if (normalized in VAAI_101_EXAMS) {
    return VAAI_101_EXAMS[normalized as ExamModuleId];
  }
  if (moduleId in VAAI_101_EXAMS) {
    return VAAI_101_EXAMS[moduleId as ExamModuleId];
  }
  return null;
}

/**
 * Get all VAAI-101 exams as an array.
 */
export function getAllVAAI101Exams(): ModuleExam[] {
  return Object.values(VAAI_101_EXAMS);
}

// ============================================================================
// 8. LABORATORY CODE AND STARTER SCRIPTS
// ============================================================================

export interface ModuleLabSpec {
  moduleId: ExamModuleId;
  lessonId: string;
  title: string;
  doctrinalBaseline: string;
  clockHours: number;
  ceuValue: number;
  theoreticalScope: string[];
  starterCode: string;
  solutionCode: string;
}

export const VAAI_101_LABS: Record<string, ModuleLabSpec> = {
  'mod-1': {
    moduleId: 'mod-1',
    lessonId: 'les-1',
    title: 'Laboratory 1: Pure-Function SITREP Formatter & Conversational Suppression',
    doctrinalBaseline: 'FM 6-0 Commander and Staff Organization and Operations',
    clockHours: 10.0,
    ceuValue: 1.0,
    theoreticalScope: [
      'Compiler Metaphor',
      'System vs. User Context Isolation',
      'Zero-Temperature Determinism (T = 0.0)',
      'Conversational Suppression',
      'Multi-Shot Exemplars',
    ],
    starterCode: `import re
from typing import Dict, Any

SYSTEM_DIRECTIVE = """You are an automated tactical message formatter adhering to FM 6-0 staff standards.
Convert raw field transmissions into standardized Markdown SITREPs.
DO NOT include conversational preambles, greetings, affirmations, or postscripts.
Emit ONLY the structured markdown block."""

def clean_conversational_filler(raw_output: str) -> str:
    """
    Suppresses conversational conversational filler using regex.
    """
    filler_patterns = [
        r"^(?:sure|understood|here is|certainly|reporting).*?:\\s*",
        r"^(?:roger|copy that|acknowledged).*?[\\n\\r]",
        r"\\n*(?:let me know|hope this helps|standing by).*?$"
    ]
    cleaned = raw_output.strip()
    for pattern in filler_patterns:
        cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE | re.MULTILINE)
    return cleaned.strip()

def build_sitrep_payload(raw_sitrep: str) -> Dict[str, Any]:
    """
    Constructs an immutable T=0.0 inference payload separating system & user contexts.
    """
    return {
        "temperature": 0.0,
        "messages": [
            {"role": "system", "content": SYSTEM_DIRECTIVE},
            {"role": "user", "content": f"FORMAT THIS SITREP:\\n{raw_sitrep}"}
        ]
    }

# Test execution
sample = "Roger that sir. SITREP: Unit Alpha-1 in position at Sector 4. Ammo: 85%. All quiet. Standing by."
cleaned = clean_conversational_filler(sample)
payload = build_sitrep_payload(cleaned)
print("CLEANED TEXT:", cleaned)
print("PAYLOAD READY:", payload["temperature"] == 0.0)
`,
    solutionCode: `import re
from typing import Dict, Any

SYSTEM_DIRECTIVE = """You are an automated tactical message formatter adhering to FM 6-0 staff standards.
Convert raw field transmissions into standardized Markdown SITREPs.
DO NOT include conversational preambles, greetings, affirmations, or postscripts.
Emit ONLY the structured markdown block."""

def clean_conversational_filler(raw_output: str) -> str:
    filler_patterns = [
        r"^(?:sure|understood|here is|certainly|reporting).*?:\\s*",
        r"^(?:roger|copy that|acknowledged).*?[\\n\\r]",
        r"\\n*(?:let me know|hope this helps|standing by).*?$"
    ]
    cleaned = raw_output.strip()
    for pattern in filler_patterns:
        cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE | re.MULTILINE)
    return cleaned.strip()

def build_sitrep_payload(raw_sitrep: str) -> Dict[str, Any]:
    return {
        "temperature": 0.0,
        "messages": [
            {"role": "system", "content": SYSTEM_DIRECTIVE},
            {"role": "user", "content": f"FORMAT THIS SITREP:\\n{raw_sitrep}"}
        ]
    }
`,
  },
  'mod-2': {
    moduleId: 'mod-2',
    lessonId: 'les-1',
    title: 'Laboratory 2: MIL-STD-2525D Schema Enforcement & Validation Retry Loop',
    doctrinalBaseline: 'MIL-STD-2525D Joint Military Symbology',
    clockHours: 10.0,
    ceuValue: 1.0,
    theoreticalScope: [
      'Deterministic Data Contracts',
      'MIL-STD-2525D Symbology Translation (SIDC)',
      'Pydantic v2 Type Constraints',
      'Exception Handling & ValidationError Trapping',
      'Self-Correcting Feedback Loops',
    ],
    starterCode: `from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
import re

class OperationalCapability(str, Enum):
    FULLY_MISSION_CAPABLE = "FULLY_MISSION_CAPABLE"
    DEGRADED = "DEGRADED"
    NON_MISSION_CAPABLE = "NON_MISSION_CAPABLE"

class UnitStatusReport(BaseModel):
    unit_designation: str = Field(..., description="Alphanumeric military unit identifier")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="WGS-84 Latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="WGS-84 Longitude")
    readiness_score: float = Field(..., ge=0.0, le=100.0, description="Readiness percentage")
    operational_status: OperationalCapability
    casualties_reported: int = Field(default=0, ge=0)

    @field_validator("unit_designation")
    @classmethod
    def validate_unit_format(cls, v: str) -> str:
        if not re.match(r"^[A-Z0-9\\-\\/]{2,15}$", v):
            raise ValueError("Unit designation must be 2-15 alphanumeric chars (hyphens/slashes allowed)")
        return v

def execute_validation_retry_loop(inference_client, prompt: str, max_retries: int = 3) -> UnitStatusReport:
    current_prompt = prompt
    for attempt in range(max_retries):
        raw_response = inference_client.generate(current_prompt)
        try:
            return UnitStatusReport.model_validate_json(raw_response)
        except Exception as err:
            if attempt == max_retries - 1:
                raise err
            current_prompt += f"\\n\\nERROR IN PREVIOUS ATTEMPT:\\n{str(err)}\\nEmit ONLY valid JSON fixing this error."
`,
    solutionCode: `from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
import re

class OperationalCapability(str, Enum):
    FULLY_MISSION_CAPABLE = "FULLY_MISSION_CAPABLE"
    DEGRADED = "DEGRADED"
    NON_MISSION_CAPABLE = "NON_MISSION_CAPABLE"

class UnitStatusReport(BaseModel):
    unit_designation: str = Field(..., description="Alphanumeric military unit identifier")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="WGS-84 Latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="WGS-84 Longitude")
    readiness_score: float = Field(..., ge=0.0, le=100.0, description="Readiness percentage")
    operational_status: OperationalCapability
    casualties_reported: int = Field(default=0, ge=0)

    @field_validator("unit_designation")
    @classmethod
    def validate_unit_format(cls, v: str) -> str:
        if not re.match(r"^[A-Z0-9\\-\\/]{2,15}$", v):
            raise ValueError("Unit designation must be 2-15 alphanumeric chars (hyphens/slashes allowed)")
        return v

def execute_validation_retry_loop(inference_client, prompt: str, max_retries: int = 3) -> UnitStatusReport:
    current_prompt = prompt
    for attempt in range(max_retries):
        raw_response = inference_client.generate(current_prompt)
        try:
            return UnitStatusReport.model_validate_json(raw_response)
        except Exception as err:
            if attempt == max_retries - 1:
                raise err
            current_prompt += f"\\n\\nERROR IN PREVIOUS ATTEMPT:\\n{str(err)}\\nEmit ONLY valid JSON fixing this error."
`,
  },
  'mod-3': {
    moduleId: 'mod-3',
    lessonId: 'les-1',
    title: 'Laboratory 3: Tactical Edge Context Trimmer & Token-Bucket Rate Limiter',
    doctrinalBaseline: 'CJCSM 6510.01B Tactical Communications & Bandwidth Optimization',
    clockHours: 10.0,
    ceuValue: 1.0,
    theoreticalScope: [
      'DIL Tactical Edge Network Constraints',
      'Byte-Pair Encoding (BPE)',
      'Sliding-Window Memory Buffers',
      'Token-Bucket Throttling',
      'Real-Time Server-Sent Events (SSE) Streaming',
    ],
    starterCode: `import time
import tiktoken
from typing import List, Dict

class TacticalContextManager:
    def __init__(self, max_token_ceiling: int = 4096, model_encoding: str = "cl100k_base"):
        self.max_ceiling = max_token_ceiling
        self.encoder = tiktoken.get_encoding(model_encoding)

    def count_tokens(self, text: str) -> int:
        return len(self.encoder.encode(text))

    def trim_context_window(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        if not messages:
            return []
        system_msg = messages[0] if messages[0]["role"] == "system" else None
        history = messages[1:] if system_msg else messages[:]
        system_tokens = self.count_tokens(system_msg["content"]) if system_msg else 0
        available_budget = self.max_ceiling - system_tokens - 128
        trimmed_history: List[Dict[str, str]] = []
        current_tokens = 0
        for msg in reversed(history):
            msg_tokens = self.count_tokens(msg["content"])
            if current_tokens + msg_tokens <= available_budget:
                trimmed_history.insert(0, msg)
                current_tokens += msg_tokens
            else:
                break
        return [system_msg] + trimmed_history if system_msg else trimmed_history

class TokenBucketRateLimiter:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.tokens = capacity
        self.last_refill = time.time()

    def consume(self, tokens_requested: int) -> bool:
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now
        if self.tokens >= tokens_requested:
            self.tokens -= tokens_requested
            return True
        return False
`,
    solutionCode: `import time
import tiktoken
from typing import List, Dict

class TacticalContextManager:
    def __init__(self, max_token_ceiling: int = 4096, model_encoding: str = "cl100k_base"):
        self.max_ceiling = max_token_ceiling
        self.encoder = tiktoken.get_encoding(model_encoding)

    def count_tokens(self, text: str) -> int:
        return len(self.encoder.encode(text))

    def trim_context_window(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        if not messages:
            return []
        system_msg = messages[0] if messages[0]["role"] == "system" else None
        history = messages[1:] if system_msg else messages[:]
        system_tokens = self.count_tokens(system_msg["content"]) if system_msg else 0
        available_budget = self.max_ceiling - system_tokens - 128
        trimmed_history: List[Dict[str, str]] = []
        current_tokens = 0
        for msg in reversed(history):
            msg_tokens = self.count_tokens(msg["content"])
            if current_tokens + msg_tokens <= available_budget:
                trimmed_history.insert(0, msg)
                current_tokens += msg_tokens
            else:
                break
        return [system_msg] + trimmed_history if system_msg else trimmed_history

class TokenBucketRateLimiter:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.tokens = capacity
        self.last_refill = time.time()

    def consume(self, tokens_requested: int) -> bool:
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now
        if self.tokens >= tokens_requested:
            self.tokens -= tokens_requested
            return True
        return False
`,
  },
  'mod-4': {
    moduleId: 'mod-4',
    lessonId: 'les-1',
    title: 'Laboratory 4: Asynchronous Fallback Circuit Breaker & Sub-250ms Failover',
    doctrinalBaseline: 'NIST SP 800-171 Rev. 3 (Controls SC-7 & SC-13)',
    clockHours: 10.0,
    ceuValue: 1.0,
    theoreticalScope: [
      'NIST Boundary Defense (SC-7)',
      'Zero-Data-Retention (ZDR) Controls',
      'Pre-Inference Regex Sanitization',
      'PACE Planning & Circuit Breakers',
      'Sub-250ms Failover Execution',
    ],
    starterCode: `import asyncio
import time
from typing import Optional

class CircuitState:
    CLOSED = "CLOSED"
    OPEN = "OPEN"
    HALF_OPEN = "HALF_OPEN"

class TacticalCircuitBreaker:
    def __init__(self, failure_threshold: int = 3, recovery_timeout: float = 10.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.state = CircuitState.CLOSED
        self.last_failure_time = 0.0

    async def execute_request(self, primary_coro, fallback_coro):
        start_time = time.perf_counter()
        if self.state == CircuitState.OPEN:
            if time.perf_counter() - self.last_failure_time > self.recovery_timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                result = await fallback_coro()
                elapsed = (time.perf_counter() - start_time) * 1000
                return result, f"FAILOVER_LOCAL (Latency: {elapsed:.2f}ms)"

        try:
            result = await primary_coro()
            if self.state == CircuitState.HALF_OPEN:
                self.state = CircuitState.CLOSED
                self.failure_count = 0
            elapsed = (time.perf_counter() - start_time) * 1000
            return result, f"PRIMARY_SUCCESS (Latency: {elapsed:.2f}ms)"
        except (asyncio.TimeoutError, ConnectionError):
            self.failure_count += 1
            self.last_failure_time = time.perf_counter()
            if self.failure_count >= self.failure_threshold:
                self.state = CircuitState.OPEN
            result = await fallback_coro()
            elapsed = (time.perf_counter() - start_time) * 1000
            assert elapsed <= 250.0, f"Breach of latency constraint: {elapsed}ms > 250ms"
            return result, f"CIRCUIT_TRIPPED_FALLBACK (Latency: {elapsed:.2f}ms)"
`,
    solutionCode: `import asyncio
import time
from typing import Optional

class CircuitState:
    CLOSED = "CLOSED"
    OPEN = "OPEN"
    HALF_OPEN = "HALF_OPEN"

class TacticalCircuitBreaker:
    def __init__(self, failure_threshold: int = 3, recovery_timeout: float = 10.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.state = CircuitState.CLOSED
        self.last_failure_time = 0.0

    async def execute_request(self, primary_coro, fallback_coro):
        start_time = time.perf_counter()
        if self.state == CircuitState.OPEN:
            if time.perf_counter() - self.last_failure_time > self.recovery_timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                result = await fallback_coro()
                elapsed = (time.perf_counter() - start_time) * 1000
                return result, f"FAILOVER_LOCAL (Latency: {elapsed:.2f}ms)"

        try:
            result = await primary_coro()
            if self.state == CircuitState.HALF_OPEN:
                self.state = CircuitState.CLOSED
                self.failure_count = 0
            elapsed = (time.perf_counter() - start_time) * 1000
            return result, f"PRIMARY_SUCCESS (Latency: {elapsed:.2f}ms)"
        except (asyncio.TimeoutError, ConnectionError):
            self.failure_count += 1
            self.last_failure_time = time.perf_counter()
            if self.failure_count >= self.failure_threshold:
                self.state = CircuitState.OPEN
            result = await fallback_coro()
            elapsed = (time.perf_counter() - start_time) * 1000
            assert elapsed <= 250.0, f"Breach of latency constraint: {elapsed}ms > 250ms"
            return result, f"CIRCUIT_TRIPPED_FALLBACK (Latency: {elapsed:.2f}ms)"
`,
  },
};
