/**
 * VAAI-201: Autonomous Agent Architecture & Deterministic Workflows
 * Assessment Data Bank, Question Banks, Doctrinal Citations, and Lab Definitions
 *
 * Compliance Anchor: TWC ETPL #TWC-ETPL-78752-VAAI-201
 * Accreditation: WIOA Title I (>= 90% Telemetry Floor / 40.5h active engagement)
 * SOC Crosswalk: 15-1251.00 (Computer Programmers / Autonomous Systems Engineers)
 */

import type {
  ExamQuestion,
  ModuleExam,
  CapstoneRubric,
  ExamModuleId,
  ExamOptionKey,
  ExamResult,
} from './types/assessment';

// ============================================================================
// 1. VAAI-201 CAPSTONE RUBRIC (Strict 100% Weight / 80% Threshold)
// ============================================================================

export const VAAI_201_CAPSTONE_RUBRIC: CapstoneRubric = {
  dimensions: {
    schemaConformity: {
      id: 'schemaConformity',
      title: 'Finite-State Determinism & Acyclic Coordination',
      weightPercentage: 30,
      passingCriteria:
        'State machine strictly enforces acyclic execution without infinite loops; maximum step ceiling respected with zero unhandled state exceptions across 10 benchmark test missions.',
      doctrinalRef: 'Joint Publication JP 3-0 Joint Campaigns and Operations (Phased Operations Architecture)',
    },
    fallbackResilience: {
      id: 'fallbackResilience',
      title: 'Tool-Calling Guardrails & RPC Authorization',
      weightPercentage: 25,
      passingCriteria:
        '100% of tool invocations validated through typed Pydantic schemas; non-conforming parameters or unauthorized role dispatches caught and rejected without uncaught exceptions.',
      doctrinalRef: 'NIST SP 800-218 Secure Software Development Framework (Tool Verification & Sandboxing)',
    },
    boundarySanitization: {
      id: 'boundarySanitization',
      title: 'Human-in-the-Loop Oversight & Kinetic Interception',
      weightPercentage: 25,
      passingCriteria:
        'Every restricted/kinetic action trips the DoDD 3000.09 interceptor gateway; actions remain suspended in secure state until human approval token verification.',
      doctrinalRef: 'DoD Directive 3000.09 Autonomy in Weapon Systems & NIST SP 800-171 AC-2/AC-3',
    },
    codeQuality: {
      id: 'codeQuality',
      title: 'Execution Efficiency & Benchmarks',
      weightPercentage: 20,
      passingCriteria:
        'Multi-agent coordination completes within <= 5,000ms total execution budget; memory footprint strictly bounded within Pyodide WASM sandbox limits.',
      doctrinalRef: 'FM 3-0 Operations (Multi-Domain Operational Tempo and Execution Optimization)',
    },
  },
  totalWeight: 100,
  passingScorePercentage: 80,
};

// ============================================================================
// 2. MODULE 1 QUESTION BANK: FINITE STATE MACHINES & DETERMINISTIC AGENT GRAPHS
// ============================================================================

export const VAAI_201_MODULE_1_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-201-q1-1',
    moduleId: 'mod-1',
    question:
      'What is the fundamental architectural advantage of structuring an autonomous mission agent as a bounded Finite State Machine (FSM) rather than an open ReAct chain-of-thought loop?',
    options: {
      A: 'It allows the model to alter its own training parameters during runtime.',
      B: 'It enforces bounded, inspectable execution transitions and eliminates infinite recursive token spend and non-deterministic execution drift.',
      C: 'It increases the maximum token generation speed by a factor of ten.',
      D: 'It completely bypasses the need for system prompt isolation.',
    },
    correctAnswer: 'B',
    explanation:
      'Under JP 3-0 operational doctrine, military command processes require predictable, auditable phase transitions. An FSM defines explicit states and transition invariants, preventing agents from entering infinite runaway loops or spending unbounded context tokens.',
    doctrinalRef: 'JP 3-0 Joint Campaigns and Operations & Finite-State Mission Phasing',
  },
  {
    id: 'vaai-201-q1-2',
    moduleId: 'mod-1',
    question:
      'How does Joint Publication JP 3-0 operational art and phasing translate directly into agent graph topology?',
    options: {
      A: 'Every military unit must have an individual transformer model allocated in GPU RAM.',
      B: 'Agents are instructed to generate poetical briefings for staff meetings.',
      C: 'Each operational phase represents a discrete state with immutable entry/exit criteria that must be validated before transitioning to the next phase.',
      D: 'Tactical radio transmissions must be converted to MP3 audio before state transition.',
    },
    correctAnswer: 'C',
    explanation:
      'JP 3-0 divides campaigns into distinct phases (e.g., Shape, Deter, Seize Initiative). In an agent graph, each phase corresponds to a state whose exit criteria (e.g., intel validation, security clearance check) must be strictly verified before transitioning.',
    doctrinalRef: 'JP 3-0 Chapter V (Operational Art, Design, and Campaign Phasing)',
  },
  {
    id: 'vaai-201-q1-3',
    moduleId: 'mod-1',
    question:
      'When an autonomous agent coordinator encounters an unhandled runtime exception during a state transition, what is the mandatory defense protocol?',
    options: {
      A: 'Immediately re-prompt the LLM with higher sampling temperature.',
      B: 'Transition immediately to a predetermined fail-safe terminal state (e.g., FAILED or SUSPENDED) and log the failure diagnostics rather than allowing arbitrary re-prompting.',
      C: 'Delete the entire database and reboot the host server.',
      D: 'Continue executing subsequent steps pretending the error did not occur.',
    },
    correctAnswer: 'B',
    explanation:
      'In high-assurance military systems, unhandled state deviations must trigger a deterministic fail-safe transition. Falling back to an explicit terminal state prevents corrupted intermediate data from propagating downstream.',
    doctrinalRef: 'JP 3-0 & MIL-STD Fault Recovery Frameworks',
  },
];

// ============================================================================
// 3. MODULE 2 QUESTION BANK: TOOL EXECUTION CONTRACTS & CONSTRAINED CALLING
// ============================================================================

export const VAAI_201_MODULE_2_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-201-q2-1',
    moduleId: 'mod-2',
    question:
      'In accordance with NIST SP 800-218 (Secure Software Development Framework), how must tool invocations emitted by an LLM agent be treated before execution?',
    options: {
      A: 'As trusted system-level shell commands to be executed directly via `/bin/bash`.',
      B: 'As untrusted remote procedure calls (RPCs) requiring pre-execution authorization checks and strict typed schema validation.',
      C: 'As informational suggestions that should be ignored by the operating system.',
      D: 'As encrypted binary packages that do not require inspection.',
    },
    correctAnswer: 'B',
    explanation:
      'NIST SP 800-218 mandates that model outputs cannot be inherently trusted. Function/tool calls must be treated as untrusted network RPCs, validated against strict Pydantic/Zod schemas, and filtered against an access-control matrix prior to execution.',
    doctrinalRef: 'NIST SP 800-218 (SSDF Control PW.1.2 & PW.4.1 Tool Verification)',
  },
  {
    id: 'vaai-201-q2-2',
    moduleId: 'mod-2',
    question:
      'How does a hardened tool dispatcher defend against parameter injection attacks (e.g., an LLM attempting to pass `&& rm -rf /` in a coordinate field)?',
    options: {
      A: 'By running the command with root administrative privileges.',
      B: 'By asking the model if the command is safe before running.',
      C: 'By enforcing strict Pydantic regex patterns (e.g., MGRS coordinate format) and strongly typed data models that reject malformed string injections.',
      D: 'By converting all inputs into Roman numerals.',
    },
    correctAnswer: 'C',
    explanation:
      'Typed schema validation with strict regular expressions ensures that parameters conform to expected domain structures (e.g., MGRS grid coordinates). Injections containing shell metacharacters fail validation automatically.',
    doctrinalRef: 'NIST SP 800-218 & OWASP Top 10 for LLM Applications (LLM07 Tool Security)',
  },
  {
    id: 'vaai-201-q2-3',
    moduleId: 'mod-2',
    question:
      'Why must a tool registry verify the calling agent’s role against an access-control matrix before executing a tool handler?',
    options: {
      A: 'To enforce the principle of least privilege and prevent lower-tier agents (e.g., Recon Observer) from executing high-privilege actions (e.g., Kinetic Strike Dispatch).',
      B: 'To calculate billing fees for each agent team member.',
      C: 'To optimize the Python garbage collector.',
      D: 'To encrypt the agent’s memory in cloud cache.',
    },
    correctAnswer: 'A',
    explanation:
      'Enforcing Role-Based Access Control (RBAC) at the tool dispatcher layer guarantees that an agent compromised via prompt injection cannot invoke privileged actions outside its designated operational scope.',
    doctrinalRef: 'NIST SP 800-218 & NIST SP 800-171 Rev. 3 AC-2/AC-3 (Least Privilege)',
  },
];

// ============================================================================
// 4. MODULE 3 QUESTION BANK: MULTI-AGENT CONSENSUS, DEBATE, & SWARM PROTOCOLS
// ============================================================================

export const VAAI_201_MODULE_3_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-201-q3-1',
    moduleId: 'mod-3',
    question:
      'Under FM 3-0 (Operations / Multi-Domain Synchronization), what is the core operational purpose of implementing an adversarial multi-agent debate topology (Red Team vs. Blue Team)?',
    options: {
      A: 'To double the amount of GPU computation consumed per hour.',
      B: 'To systematically surface cognitive blind spots, assumption flaws, and adversary counter-moves prior to operational plan commitment.',
      C: 'To entertain staff officers with simulated warfare dialogues.',
      D: 'To replace human commanding officers entirely.',
    },
    correctAnswer: 'B',
    explanation:
      'FM 3-0 doctrine emphasizes red-teaming to challenge friendly assumptions. Pairing a Blue Team planning agent with a Red Team adversarial agent forces explicit evaluation of risk and adversary counters before final plan synthesis.',
    doctrinalRef: 'FM 3-0 Operations (Operational Framework & Adversarial Challenge)',
  },
  {
    id: 'vaai-201-q3-2',
    moduleId: 'mod-3',
    question:
      'Why is a supermajority consensus threshold (e.g., >= 67%) required in autonomous multi-agent operational evaluation?',
    options: {
      A: 'Because Python numbers cannot represent 50%.',
      B: 'To prevent a single hallucinating or compromised agent from forcing a critical operational decision.',
      C: 'To slow down agent execution to match manual human typing speeds.',
      D: 'To reduce the number of tokens emitted per minute.',
    },
    correctAnswer: 'B',
    explanation:
      'A simple majority (51%) can be vulnerable to tied votes or borderline cognitive variance. Requiring a 2/3 supermajority ensures robust consensus across diverse evaluator perspectives before recommending tactical actions.',
    doctrinalRef: 'FM 3-0 Multi-Domain Decision Synchronization Standards',
  },
  {
    id: 'vaai-201-q3-3',
    moduleId: 'mod-3',
    question:
      'How can an autonomous swarm architecture prevent confirmation bias and cognitive cascades when multiple LLM agents collaborate?',
    options: {
      A: 'By feeding the exact same prompt to all agents simultaneously with zero temperature.',
      B: 'By allowing the first agent to dictate all subsequent agent outputs.',
      C: 'By assigning isolated, diametrically opposed system directives and disparate information partitions (e.g., dedicated Blue Team vs. Red Team personas).',
      D: 'By removing all safety guidelines from the system directives.',
    },
    correctAnswer: 'C',
    explanation:
      'Agents sharing identical instructions suffer from cognitive clustering and cascade errors. Segregating system directives, roles, and context inputs ensures independent analysis and authentic dialectical debate.',
    doctrinalRef: 'FM 3-0 & Multi-Agent Swarm Dialectical Architecture',
  },
];

// ============================================================================
// 5. MODULE 4 QUESTION BANK: HUMAN-IN-THE-LOOP (HITL) INTERCEPTORS
// ============================================================================

export const VAAI_201_MODULE_4_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-201-q4-1',
    moduleId: 'mod-4',
    question:
      'What is the central regulatory mandate of DoD Directive 3000.09 (Autonomy in Weapon Systems)?',
    options: {
      A: 'All weapon systems must operate without any human communication links.',
      B: 'Autonomous and semi-autonomous systems shall be designed to allow commanders and operators to exercise appropriate levels of human judgment over the use of force.',
      C: 'Military software must be written in assembly language only.',
      D: 'Defense AI models must be trained on public civilian datasets exclusively.',
    },
    correctAnswer: 'B',
    explanation:
      'DoDD 3000.09 explicitly mandates that autonomous capabilities must never remove the human commander from exercising appropriate judgment over the use of force. Kinetic or high-consequence decisions require positive human authorization.',
    doctrinalRef: 'DoD Directive 3000.09 Section 1.2 (Policy on Autonomy in Weapon Systems)',
  },
  {
    id: 'vaai-201-q4-2',
    moduleId: 'mod-4',
    question:
      'Architecturally, how must a software pipeline implement a DoDD 3000.09-compliant HITL interceptor gate within an autonomous agent graph?',
    options: {
      A: 'By printing a message to stdout and immediately executing the kinetic action.',
      B: 'By suspending the execution state machine, generating an immutable approval ticket, and persisting state until an authenticated operator provides a valid cryptographic signature.',
      C: 'By generating a random password and attempting to brute-force it.',
      D: 'By routing the request through an unauthenticated public webhook.',
    },
    correctAnswer: 'B',
    explanation:
      'Compliant HITL requires a non-bypassable interruption hook. The agent state graph must enter a suspended state, emit an auditable ticket, and refuse resumption until a verified human operator resolves the ticket.',
    doctrinalRef: 'DoDD 3000.09 & NIST SP 800-171 Rev. 3 AC-2/AC-3 Access Controls',
  },
  {
    id: 'vaai-201-q4-3',
    moduleId: 'mod-4',
    question:
      'If an autonomous system submits a kinetic engagement ticket to an operator and the authorization request times out without response, what must occur?',
    options: {
      A: 'The action proceeds automatically under presumed consent.',
      B: 'The system queries a commercial web search engine for guidance.',
      C: 'The system must fail closed, aborting or suspending the sensitive action to preserve life and operational safety.',
      D: 'The system transfers authority to the lowest-ranking junior agent.',
    },
    correctAnswer: 'C',
    explanation:
      'Defense safety engineering requires fail-closed behavior. An expired or unacknowledged HITL authorization request must result in abortion of the restricted action, never presumed approval.',
    doctrinalRef: 'DoDD 3000.09 Section 3.1 & Defense Fail-Safe Architecture Standards',
  },
];

// ============================================================================
// 6. CAPSTONE FINAL EXAMINATION: 10 COMPREHENSIVE QUESTIONS
// ============================================================================

export const VAAI_201_CAPSTONE_FINAL_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-201-cap-q1',
    moduleId: 'capstone',
    question:
      'Why is the transition from free-form ReAct loops to deterministic Finite State Machines critical for defense autonomous systems?',
    options: {
      A: 'Because FSMs consume 100% more RAM.',
      B: 'Because FSMs enforce bounded execution limits, eliminate runaway recursive costs, and guarantee formal state transition invariants.',
      C: 'Because ReAct loops cannot process English text.',
      D: 'Because FSMs disable all logging.',
    },
    correctAnswer: 'B',
    explanation:
      'Free ReAct loops can hallucinate cyclic reasoning steps indefinitely. FSMs provide formal guarantees on state transitions, exit criteria, and step ceilings essential for military mission assurance.',
    doctrinalRef: 'JP 3-0 Operational Art & Deterministic FSM Architecture',
  },
  {
    id: 'vaai-201-cap-q2',
    moduleId: 'capstone',
    question:
      'What role do strongly typed state schemas (e.g., dataclasses or Pydantic models) play in multi-agent coordination?',
    options: {
      A: 'They convert Python code into C++ binaries automatically.',
      B: 'They act as deterministic contracts between agents, ensuring that data passed across state transitions conforms exactly to expected formats without silent data loss.',
      C: 'They allow agents to bypass clearance checks.',
      D: 'They prevent the use of version control systems.',
    },
    correctAnswer: 'B',
    explanation:
      'State schemas establish immutable interfaces between independent agent nodes. If an upstream agent emits non-conforming data, the schema traps the defect before it contaminates downstream planning nodes.',
    doctrinalRef: 'NIST SP 800-218 & Data Contract Engineering',
  },
  {
    id: 'vaai-201-cap-q3',
    moduleId: 'capstone',
    question:
      'How does a hardened tool dispatcher mitigate prompt injection payloads embedded inside tool arguments?',
    options: {
      A: 'By running all inputs directly in bash shell scripts.',
      B: 'By relying on the LLM’s good intentions.',
      C: 'By validating arguments against strict Pydantic schemas with regex constraints and type enforcement before invocation.',
      D: 'By printing the injection to the console and continuing execution.',
    },
    correctAnswer: 'C',
    explanation:
      'Pydantic validation rejects inputs that do not strictly match required formats (e.g., MGRS coordinate strings or positive integers), defusing injection attacks before handlers execute.',
    doctrinalRef: 'NIST SP 800-218 (SSDF PW.1.2) & OWASP LLM07',
  },
  {
    id: 'vaai-201-cap-q4',
    moduleId: 'capstone',
    question:
      'Where must Role-Based Access Control (RBAC) checks occur in a production agent tool execution pipeline?',
    options: {
      A: 'Inside the centralized tool dispatcher prior to executing the tool handler function.',
      B: 'Inside the model prompt text only.',
      C: 'After the tool has already modified the database.',
      D: 'In the client browser cookies without server validation.',
    },
    correctAnswer: 'A',
    explanation:
      'Prompt-level role instructions can be bypassed via jailbreaks. Authorization must be enforced programmatically inside the dispatcher before invoking any tool handler.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 AC-2/AC-3 Access Enforcement',
  },
  {
    id: 'vaai-201-cap-q5',
    moduleId: 'capstone',
    question:
      'In a tactical planning pipeline, what is the core responsibility of the Red Team Adversarial Agent during multi-agent debate?',
    options: {
      A: 'To format output as HTML tables.',
      B: 'To rigorously critique Blue Team operational proposals, surface enemy counter-action capabilities, and identify logistics vulnerabilities.',
      C: 'To agree with the Blue Team immediately to minimize token expenditure.',
      D: 'To deploy distributed denial-of-service attacks against friendly routers.',
    },
    correctAnswer: 'B',
    explanation:
      'Under FM 3-0, Red Team agents simulate enemy doctrine and analyze vulnerabilities, stress-testing proposed plans before submission for command arbitration.',
    doctrinalRef: 'FM 3-0 Operations (Red Teaming and Threat Synchronization)',
  },
  {
    id: 'vaai-201-cap-q6',
    moduleId: 'capstone',
    question:
      'Why is a 67% (2/3) supermajority consensus threshold preferred over a simple 50% majority for high-risk autonomous decisions?',
    options: {
      A: 'Because 67 is a prime number.',
      B: 'It ensures broad agreement across diverse evaluators and prevents a single rogue or hallucinating agent from tipping the decision balance.',
      C: 'It reduces the total number of evaluator agents needed to one.',
      D: 'It disables all human oversight requirements.',
    },
    correctAnswer: 'B',
    explanation:
      'A 67% threshold requires decisive multi-perspective consensus, preventing single-agent variance or edge-case hallucinations from committing forces or sensitive resources.',
    doctrinalRef: 'FM 3-0 Decision Synchronization Doctrine',
  },
  {
    id: 'vaai-201-cap-q7',
    moduleId: 'capstone',
    question:
      'Under DoD Directive 3000.09, what must happen when an autonomous strike planning agent synthesizes a kinetic target engagement recommendation?',
    options: {
      A: 'The system dispatches weapon release signals autonomously without delay.',
      B: 'The pipeline must suspend execution and route the target package to a Human-in-the-Loop approval gate requiring explicit operator confirmation.',
      C: 'The agent deletes all mission records to preserve operational security.',
      D: 'The system publishes the target coordinates to an unauthenticated public bulletin board.',
    },
    correctAnswer: 'B',
    explanation:
      'DoDD 3000.09 mandates that human commanders and operators maintain positive judgment over the use of force. Kinetic recommendations must be gated behind non-bypassable human approval.',
    doctrinalRef: 'DoD Directive 3000.09 (Autonomy in Weapon Systems)',
  },
  {
    id: 'vaai-201-cap-q8',
    moduleId: 'capstone',
    question:
      'What is the required fail-safe behavior when a Human-in-the-Loop authorization request exceeds its operational timeout window?',
    options: {
      A: 'Presumed approval: the action executes automatically.',
      B: 'Random coin flip: 50% chance of execution.',
      C: 'Fail-closed: the action is aborted or safely suspended, requiring re-initiation.',
      D: 'The system deletes the operator’s login credentials.',
    },
    correctAnswer: 'C',
    explanation:
      'Fail-closed operation is non-negotiable in defense safety engineering. In the absence of positive human affirmation within the timeout window, the system must abort the action.',
    doctrinalRef: 'DoDD 3000.09 & NIST SP 800-171 AC-2',
  },
  {
    id: 'vaai-201-cap-q9',
    moduleId: 'capstone',
    question:
      'When an individual agent node fails during a multi-agent state graph execution, how should the coordinator maintain system integrity?',
    options: {
      A: 'Crash the entire host process with an unhandled SIGKILL.',
      B: 'Record the node error into the shared state object, execute fallback/retry logic, or transition cleanly to a safe degraded state without crashing.',
      C: 'Ignore the node failure and send empty data to subsequent nodes.',
      D: 'Increase memory allocation until the node succeeds.',
    },
    correctAnswer: 'B',
    explanation:
      'Robust state graphs capture node errors as first-class state mutations, enabling targeted retry, fallback routing, or graceful degradation while preserving system stability.',
    doctrinalRef: 'NIST SP 800-218 & High-Assurance Agent Architecture',
  },
  {
    id: 'vaai-201-cap-q10',
    moduleId: 'capstone',
    question:
      'What are the four exact technical dimensions evaluated by the automated VAAI-201 Multi-Agent Capstone Rubric?',
    options: {
      A: 'HTML Layout (30%), CSS Flexbox (25%), React Hooks (25%), Node.js (20%).',
      B: 'Finite-State Determinism (30%), Tool-Calling Guardrails (25%), Human-in-the-Loop Oversight (25%), Execution Efficiency & Benchmarks (20%).',
      C: 'Prompt Length (40%), Token Cost (30%), Latency (20%), Disk Space (10%).',
      D: 'Grammar Accuracy (50%), Vocabulary (25%), Sentence Count (15%), Spelling (10%).',
    },
    correctAnswer: 'B',
    explanation:
      'The VAAI-201 capstone rubric evaluates Finite-State Determinism (30%), Tool-Calling Guardrails (25%), Human-in-the-Loop Oversight (25%), and Execution Efficiency & Benchmarks (20%), totaling 100% with an 80% passing floor.',
    doctrinalRef: 'VAAI-201 Capstone Accreditation Specification & TWC ETPL Standards',
  },
];

// ============================================================================
// 7. MASTER VAAI-201 MODULE EXAMS REGISTRY
// ============================================================================

export const VAAI_201_EXAMS: Record<ExamModuleId, ModuleExam> = {
  'mod-1': {
    moduleId: 'mod-1',
    title: 'Module 1 Examination: Finite State Machines & Deterministic Agent Graphs',
    passingScorePercentage: 80,
    questions: VAAI_201_MODULE_1_QUESTIONS,
  },
  'mod-2': {
    moduleId: 'mod-2',
    title: 'Module 2 Examination: Tool Execution Contracts & Constrained Function Calling',
    passingScorePercentage: 80,
    questions: VAAI_201_MODULE_2_QUESTIONS,
  },
  'mod-3': {
    moduleId: 'mod-3',
    title: 'Module 3 Examination: Multi-Agent Consensus, Debate, & Swarm Protocols',
    passingScorePercentage: 80,
    questions: VAAI_201_MODULE_3_QUESTIONS,
  },
  'mod-4': {
    moduleId: 'mod-4',
    title: 'Module 4 Examination: Human-in-the-Loop (HITL) Interceptors & Safety Enclaves',
    passingScorePercentage: 80,
    questions: VAAI_201_MODULE_4_QUESTIONS,
  },
  capstone: {
    moduleId: 'capstone',
    title: 'VAAI-201 Comprehensive Final Examination: Autonomous Agent Defense',
    passingScorePercentage: 80,
    questions: VAAI_201_CAPSTONE_FINAL_QUESTIONS,
  },
};

export function getVAAI201ModuleExam(moduleId: string): ModuleExam | null {
  const normalized = moduleId.toLowerCase().replace('m', 'mod-');
  if (normalized in VAAI_201_EXAMS) {
    return VAAI_201_EXAMS[normalized as ExamModuleId];
  }
  if (moduleId in VAAI_201_EXAMS) {
    return VAAI_201_EXAMS[moduleId as ExamModuleId];
  }
  return null;
}

export function getAllVAAI201Exams(): ModuleExam[] {
  return Object.values(VAAI_201_EXAMS);
}

export const VAAI_201_MODULE_EXAMS: ModuleExam[] = [
  VAAI_201_EXAMS['mod-1'],
  VAAI_201_EXAMS['mod-2'],
  VAAI_201_EXAMS['mod-3'],
  VAAI_201_EXAMS['mod-4'],
];

export const VAAI_201_CAPSTONE_EXAM: ModuleExam = VAAI_201_EXAMS.capstone;

export function gradeVAAI201ModuleExam(
  moduleId: string,
  answers: Record<string, ExamOptionKey>
): ExamResult {
  const exam = getVAAI201ModuleExam(moduleId);
  if (!exam) {
    throw new Error(`Invalid VAAI-201 module examination ID: '${moduleId}'`);
  }

  let correctCount = 0;
  const questionResults = exam.questions.map((q) => {
    const studentAnswer = answers[q.id] || null;
    const isCorrect = studentAnswer === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      studentAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      doctrinalRef: q.doctrinalRef,
    };
  });

  const totalQuestions = exam.questions.length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercentage >= exam.passingScorePercentage;

  return {
    examId: `VAAI-201-${exam.moduleId}`,
    moduleId: exam.moduleId,
    scorePercentage,
    totalQuestions,
    correctCount,
    passed,
    questionResults,
    evaluatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 8. VAAI-201 LABORATORY CODE AND STARTER SCRIPTS
// ============================================================================

export interface VAAI201ModuleLabSpec {
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

export const VAAI_201_LABS: Record<string, VAAI201ModuleLabSpec> = {
  'mod-1': {
    moduleId: 'mod-1',
    lessonId: 'les-1',
    title: 'Laboratory 1: Directed Acyclic Agent Graph Engine',
    doctrinalBaseline: 'Joint Publication JP 3-0 Joint Campaigns and Operations',
    clockHours: 11.25,
    ceuValue: 1.125,
    theoreticalScope: [
      'Transitioning from stochastic ReAct loops to bounded Finite State Machines',
      'Preventing infinite agent recursion loops',
      'Establishing strict state schemas with transition invariants',
      'Node execution guarantees and terminal state enforcement',
    ],
    starterCode: `from enum import Enum
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

class MissionPhase(str, Enum):
    INGEST = "INGEST"
    VALIDATE = "VALIDATE"
    SYNTHESIZE = "SYNTHESIZE"
    TERMINATED = "TERMINATED"
    FAILED = "FAILED"

@dataclass
class AgentMissionState:
    mission_id: str
    current_phase: MissionPhase = MissionPhase.INGEST
    intel_items: List[Dict[str, Any]] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    step_count: int = 0
    max_steps: int = 10

class DeterministicMissionCoordinator:
    def __init__(self, max_steps: int = 10):
        self.max_steps = max_steps

    def transition(self, state: AgentMissionState, action_result: Dict[str, Any]) -> AgentMissionState:
        state.step_count += 1
        if state.step_count > self.max_steps:
            state.current_phase = MissionPhase.FAILED
            state.errors.append("Max step ceiling exceeded: Execution aborted to prevent non-deterministic loop.")
            return state

        if state.current_phase == MissionPhase.INGEST:
            if action_result.get("intel_valid"):
                state.intel_items.append(action_result["data"])
                state.current_phase = MissionPhase.VALIDATE
            else:
                state.errors.append("Ingestion rejected: Invalid intel structure.")
                state.current_phase = MissionPhase.FAILED

        elif state.current_phase == MissionPhase.VALIDATE:
            if action_result.get("classification_verified"):
                state.current_phase = MissionPhase.SYNTHESIZE
            else:
                state.errors.append("Security clearance verification failed.")
                state.current_phase = MissionPhase.FAILED

        elif state.current_phase == MissionPhase.SYNTHESIZE:
            state.current_phase = MissionPhase.TERMINATED

        return state

# Test coordinator
coordinator = DeterministicMissionCoordinator()
mission_state = AgentMissionState(mission_id="MSN-2026-ALPHA")
res1 = {"intel_valid": True, "data": {"target": "Radar-9", "grid": "18SUJ2348006470"}}
mission_state = coordinator.transition(mission_state, res1)
print("Phase after Step 1:", mission_state.current_phase)
res2 = {"classification_verified": True}
mission_state = coordinator.transition(mission_state, res2)
print("Phase after Step 2:", mission_state.current_phase)
mission_state = coordinator.transition(mission_state, {})
print("Final Phase:", mission_state.current_phase)
`,
    solutionCode: `from enum import Enum
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

class MissionPhase(str, Enum):
    INGEST = "INGEST"
    VALIDATE = "VALIDATE"
    SYNTHESIZE = "SYNTHESIZE"
    TERMINATED = "TERMINATED"
    FAILED = "FAILED"

@dataclass
class AgentMissionState:
    mission_id: str
    current_phase: MissionPhase = MissionPhase.INGEST
    intel_items: List[Dict[str, Any]] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    step_count: int = 0
    max_steps: int = 10

class DeterministicMissionCoordinator:
    def __init__(self, max_steps: int = 10):
        self.max_steps = max_steps

    def transition(self, state: AgentMissionState, action_result: Dict[str, Any]) -> AgentMissionState:
        state.step_count += 1
        if state.step_count > self.max_steps:
            state.current_phase = MissionPhase.FAILED
            state.errors.append("Max step ceiling exceeded: Execution aborted to prevent non-deterministic loop.")
            return state

        if state.current_phase == MissionPhase.INGEST:
            if action_result.get("intel_valid"):
                state.intel_items.append(action_result["data"])
                state.current_phase = MissionPhase.VALIDATE
            else:
                state.errors.append("Ingestion rejected: Invalid intel structure.")
                state.current_phase = MissionPhase.FAILED

        elif state.current_phase == MissionPhase.VALIDATE:
            if action_result.get("classification_verified"):
                state.current_phase = MissionPhase.SYNTHESIZE
            else:
                state.errors.append("Security clearance verification failed.")
                state.current_phase = MissionPhase.FAILED

        elif state.current_phase == MissionPhase.SYNTHESIZE:
            state.current_phase = MissionPhase.TERMINATED

        return state
`,
  },
  'mod-2': {
    moduleId: 'mod-2',
    lessonId: 'les-1',
    title: 'Laboratory 2: Hardened Defense Tool Dispatcher & Constrained Function Calling',
    doctrinalBaseline: 'NIST SP 800-218 Secure Software Development Framework',
    clockHours: 11.25,
    ceuValue: 1.125,
    theoreticalScope: [
      'Treating tool calls as remote procedure calls (RPCs)',
      'Pre-execution authorization and Role-Based Access Control',
      'Pydantic schema validation of tool arguments before invocation',
      'Sandbox isolation of tool boundaries and injection defense',
    ],
    starterCode: `from typing import Callable, Dict, Any
from pydantic import BaseModel, Field, ValidationError

class CoordinateLookupArgs(BaseModel):
    mgrs_grid: str = Field(..., pattern=r"^\\d{1,2}[A-Z]{3}\\d{4,10}$")
    elevation_required: bool = Field(default=False)

class HardenedToolDispatcher:
    def __init__(self):
        self._registry: Dict[str, Dict[str, Any]] = {}

    def register_tool(self, name: str, schema: type[BaseModel], handler: Callable, required_role: str):
        self._registry[name] = {
            "schema": schema,
            "handler": handler,
            "required_role": required_role
        }

    def dispatch(self, tool_name: str, raw_args: Dict[str, Any], caller_role: str) -> Dict[str, Any]:
        if tool_name not in self._registry:
            return {"status": "ERROR", "error": f"Tool '{tool_name}' is not registered in secure enclave."}
        
        tool = self._registry[tool_name]
        if caller_role != tool["required_role"] and caller_role != "OFFICER":
            return {"status": "DENIED", "error": f"Role '{caller_role}' lacks permission for '{tool_name}'."}

        try:
            validated_args = tool["schema"].model_validate(raw_args)
            result = tool["handler"](validated_args)
            return {"status": "SUCCESS", "data": result}
        except ValidationError as err:
            return {"status": "VALIDATION_FAILED", "error": err.errors()}

# Test dispatcher
dispatcher = HardenedToolDispatcher()
def mock_coord_handler(args: CoordinateLookupArgs):
    return {"grid": args.mgrs_grid, "elevation_m": 420.5}

dispatcher.register_tool("lookup_mgrs", CoordinateLookupArgs, mock_coord_handler, "ANALYST")
call_success = dispatcher.dispatch("lookup_mgrs", {"mgrs_grid": "18SUJ2348006470"}, "ANALYST")
print("Valid Call:", call_success["status"])
call_denied = dispatcher.dispatch("lookup_mgrs", {"mgrs_grid": "18SUJ2348006470"}, "GUEST")
print("Denied Call:", call_denied["status"])
`,
    solutionCode: `from typing import Callable, Dict, Any
from pydantic import BaseModel, Field, ValidationError

class CoordinateLookupArgs(BaseModel):
    mgrs_grid: str = Field(..., pattern=r"^\\d{1,2}[A-Z]{3}\\d{4,10}$")
    elevation_required: bool = Field(default=False)

class HardenedToolDispatcher:
    def __init__(self):
        self._registry: Dict[str, Dict[str, Any]] = {}

    def register_tool(self, name: str, schema: type[BaseModel], handler: Callable, required_role: str):
        self._registry[name] = {
            "schema": schema,
            "handler": handler,
            "required_role": required_role
        }

    def dispatch(self, tool_name: str, raw_args: Dict[str, Any], caller_role: str) -> Dict[str, Any]:
        if tool_name not in self._registry:
            return {"status": "ERROR", "error": f"Tool '{tool_name}' is not registered in secure enclave."}
        
        tool = self._registry[tool_name]
        if caller_role != tool["required_role"] and caller_role != "OFFICER":
            return {"status": "DENIED", "error": f"Role '{caller_role}' lacks permission for '{tool_name}'."}

        try:
            validated_args = tool["schema"].model_validate(raw_args)
            result = tool["handler"](validated_args)
            return {"status": "SUCCESS", "data": result}
        except ValidationError as err:
            return {"status": "VALIDATION_FAILED", "error": err.errors()}
`,
  },
  'mod-3': {
    moduleId: 'mod-3',
    lessonId: 'les-1',
    title: 'Laboratory 3: Multi-Agent Red/Blue Tactical Consensus Engine',
    doctrinalBaseline: 'FM 3-0 Operations (Multi-Domain Synchronization)',
    clockHours: 11.25,
    ceuValue: 1.125,
    theoreticalScope: [
      'Red Team vs. Blue Team multi-agent debate topologies',
      'Consensus voting mechanisms with supermajority thresholds (>= 67%)',
      'Hierarchical commander/worker delegation',
      'Preventing confirmation cascades in autonomous agent swarms',
    ],
    starterCode: `import asyncio
from typing import List, Dict, Any, Callable

class TacticalDebateEngine:
    def __init__(self, required_consensus_threshold: float = 0.67):
        self.threshold = required_consensus_threshold

    async def evaluate_strike_proposal(self, blue_plan: Dict[str, Any], red_critique: Dict[str, Any], evaluators: List[Callable]) -> Dict[str, Any]:
        votes = []
        for evaluator in evaluators:
            vote = await evaluator(blue_plan, red_critique)
            votes.append(vote)

        favorable_votes = sum(1 for v in votes if v.get("approved"))
        approval_ratio = favorable_votes / len(votes) if votes else 0.0

        return {
            "approved": approval_ratio >= self.threshold,
            "consensus_ratio": round(approval_ratio, 3),
            "total_evaluators": len(votes),
            "critiques": [v.get("comment") for v in votes]
        }

# Test debate engine
async def mock_evaluator_1(b, r):
    return {"approved": True, "comment": "Low air-defense density"}

async def mock_evaluator_2(b, r):
    return {"approved": True, "comment": "Adequate standoff distance"}

async def mock_evaluator_3(b, r):
    return {"approved": False, "comment": "Civilian infrastructure nearby"}

async def run_test():
    engine = TacticalDebateEngine(required_consensus_threshold=0.67)
    res = await engine.evaluate_strike_proposal({}, {}, [mock_evaluator_1, mock_evaluator_2, mock_evaluator_3])
    print("Proposal Approved (2/3 = 67%):", res["approved"])
    print("Consensus Ratio:", res["consensus_ratio"])

asyncio.run(run_test())
`,
    solutionCode: `import asyncio
from typing import List, Dict, Any, Callable

class TacticalDebateEngine:
    def __init__(self, required_consensus_threshold: float = 0.67):
        self.threshold = required_consensus_threshold

    async def evaluate_strike_proposal(self, blue_plan: Dict[str, Any], red_critique: Dict[str, Any], evaluators: List[Callable]) -> Dict[str, Any]:
        votes = []
        for evaluator in evaluators:
            vote = await evaluator(blue_plan, red_critique)
            votes.append(vote)

        favorable_votes = sum(1 for v in votes if v.get("approved"))
        approval_ratio = favorable_votes / len(votes) if votes else 0.0

        return {
            "approved": approval_ratio >= self.threshold,
            "consensus_ratio": round(approval_ratio, 3),
            "total_evaluators": len(votes),
            "critiques": [v.get("comment") for v in votes]
        }
`,
  },
  'mod-4': {
    moduleId: 'mod-4',
    lessonId: 'les-1',
    title: 'Laboratory 4: DoDD 3000.09 Human-in-the-Loop Interceptor Gateway',
    doctrinalBaseline: 'DoD Directive 3000.09 & NIST SP 800-171 Rev. 3 AC-2/AC-3',
    clockHours: 11.25,
    ceuValue: 1.125,
    theoreticalScope: [
      'DoDD 3000.09 appropriate levels of human judgment over force',
      'Non-bypassable interruption hooks for kinetic and sensitive operations',
      'Cryptographic approval token generation and dual-custody authorization',
      'Fail-closed behavior on timeout or unacknowledged tickets',
    ],
    starterCode: `import uuid
import time
from typing import Dict, Any, Optional

class HITLInterceptionGateway:
    RESTRICTED_ACTIONS = {"KINETIC_AUTHORIZATION", "TARGET_ENGAGEMENT", "RESTRICTED_DB_WRITE"}

    def __init__(self):
        self.pending_interceptions: Dict[str, Dict[str, Any]] = {}

    def intercept_or_proceed(self, action_type: str, action_payload: Dict[str, Any], agent_id: str) -> Dict[str, Any]:
        if action_type not in self.RESTRICTED_ACTIONS:
            return {"status": "PROCEED", "requires_hitl": False}

        ticket_id = f"HITL-{uuid.uuid4().hex[:8].upper()}"
        self.pending_interceptions[ticket_id] = {
            "ticket_id": ticket_id,
            "action_type": action_type,
            "payload": action_payload,
            "agent_id": agent_id,
            "timestamp": time.time(),
            "status": "AWAITING_HUMAN_APPROVAL"
        }
        return {
            "status": "SUSPENDED",
            "requires_hitl": True,
            "ticket_id": ticket_id,
            "message": f"Action '{action_type}' requires DoDD 3000.09 human operator sign-off."
        }

    def resolve_ticket(self, ticket_id: str, operator_id: str, approved: bool) -> Dict[str, Any]:
        if ticket_id not in self.pending_interceptions:
            return {"status": "ERROR", "message": "Invalid ticket ID."}
        ticket = self.pending_interceptions[ticket_id]
        ticket["status"] = "APPROVED" if approved else "REJECTED"
        ticket["resolved_by"] = operator_id
        ticket["resolved_at"] = time.time()
        return {"status": "RESOLVED", "ticket": ticket}

# Test HITL Gateway
gateway = HITLInterceptionGateway()
non_kinetic = gateway.intercept_or_proceed("QUERY_INTEL", {"grid": "18SUJ2348006470"}, "AGENT-01")
print("Non-kinetic:", non_kinetic["status"])

kinetic = gateway.intercept_or_proceed("KINETIC_AUTHORIZATION", {"target_id": "TGT-994"}, "STRIKE-AGENT")
print("Kinetic action:", kinetic["status"], "| Ticket:", kinetic["ticket_id"])
resolved = gateway.resolve_ticket(kinetic["ticket_id"], "OPERATOR-CAPT-MILLER", True)
print("Resolved Ticket:", resolved["ticket"]["status"])
`,
    solutionCode: `import uuid
import time
from typing import Dict, Any, Optional

class HITLInterceptionGateway:
    RESTRICTED_ACTIONS = {"KINETIC_AUTHORIZATION", "TARGET_ENGAGEMENT", "RESTRICTED_DB_WRITE"}

    def __init__(self):
        self.pending_interceptions: Dict[str, Dict[str, Any]] = {}

    def intercept_or_proceed(self, action_type: str, action_payload: Dict[str, Any], agent_id: str) -> Dict[str, Any]:
        if action_type not in self.RESTRICTED_ACTIONS:
            return {"status": "PROCEED", "requires_hitl": False}

        ticket_id = f"HITL-{uuid.uuid4().hex[:8].upper()}"
        self.pending_interceptions[ticket_id] = {
            "ticket_id": ticket_id,
            "action_type": action_type,
            "payload": action_payload,
            "agent_id": agent_id,
            "timestamp": time.time(),
            "status": "AWAITING_HUMAN_APPROVAL"
        }
        return {
            "status": "SUSPENDED",
            "requires_hitl": True,
            "ticket_id": ticket_id,
            "message": f"Action '{action_type}' requires DoDD 3000.09 human operator sign-off."
        }

    def resolve_ticket(self, ticket_id: str, operator_id: str, approved: bool) -> Dict[str, Any]:
        if ticket_id not in self.pending_interceptions:
            return {"status": "ERROR", "message": "Invalid ticket ID."}
        ticket = self.pending_interceptions[ticket_id]
        ticket["status"] = "APPROVED" if approved else "REJECTED"
        ticket["resolved_by"] = operator_id
        ticket["resolved_at"] = time.time()
        return {"status": "RESOLVED", "ticket": ticket}
`,
  },
};
