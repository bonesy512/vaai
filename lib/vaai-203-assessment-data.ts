/**
 * VAAI-203: Air-Gapped Local AI & Edge Deployment
 * Assessment Data Bank, Question Banks, Doctrinal Citations, and Lab Definitions
 *
 * Compliance Anchor: TWC ETPL #TWC-ETPL-78752-VAAI-203
 * Accreditation: WIOA Title I (>= 90% Telemetry Floor / 36.0h active engagement)
 * SOC Crosswalk: 15-1252.00 (Software Developers, Edge & Systems Software)
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
// 1. VAAI-203 CAPSTONE RUBRIC (Strict 100% Weight / 80% Threshold)
// ============================================================================

export const VAAI_203_CAPSTONE_RUBRIC: CapstoneRubric = {
  dimensions: {
    schemaConformity: {
      id: 'schemaConformity',
      title: 'Zero-Egress Air-Gap Compliance & Socket Isolation',
      weightPercentage: 30,
      passingCriteria:
        'Zero external network calls; socket binds strictly to localhost (127.0.0.1) or unix domain socket; telemetry completely severed under container --network none isolation.',
      doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-7 (Boundary Protection) & CNSSI 1253',
    },
    fallbackResilience: {
      id: 'fallbackResilience',
      title: 'Quantization & VRAM Budgeting (SWaP-C)',
      weightPercentage: 25,
      passingCriteria:
        'Static weight footprint + dynamic KV cache fits strictly within physical hardware allocation with >= 5% safety headroom under thermal and memory constraints.',
      doctrinalRef: 'MIL-STD-810H (Environmental Engineering Considerations) & Edge Compute SWaP-C Constraints',
    },
    boundarySanitization: {
      id: 'boundarySanitization',
      title: 'Local Inference Throughput & Latency',
      weightPercentage: 25,
      passingCriteria:
        'Sustained throughput >= 12.0 tokens/second on primary tier; Time-to-First-Token (TTFT) <= 350ms across tactical prompt benchmarks in local runtime.',
      doctrinalRef: 'Tactical Edge Compute Benchmark Standards & Expeditionary Inference SLA',
    },
    codeQuality: {
      id: 'codeQuality',
      title: 'Host Fault Recovery & Degradation Resilience',
      weightPercentage: 20,
      passingCriteria:
        'Automatic downshift to fallback micro-model executed within <= 500ms upon simulated primary memory exhaustion, timeout, or thermal fault without process crash.',
      doctrinalRef: 'CJCSM 6510.01B (Tactical Communications & Degraded Network Protocols)',
    },
  },
  totalWeight: 100,
  passingScorePercentage: 80,
};

// ============================================================================
// 2. MODULE 1 EXAMINATION QUESTION BANK: Edge Hardware & VRAM Budgeting
// ============================================================================

export const VAAI_203_MODULE_1_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-203-q1-1',
    moduleId: 'mod-1',
    question:
      'What is the primary mathematical determinant of the static memory footprint when loading a quantized LLM into edge accelerator VRAM?',
    options: {
      A: 'Context window token length multiplied by the total number of attention heads.',
      B: 'Total parameter count multiplied by the quantized bit-width per parameter divided by 8.',
      C: 'Batch size multiplied by the embedding hidden dimension.',
      D: 'The clock speed of the host CPU divided by PCIe lane bandwidth.',
    },
    correctAnswer: 'B',
    explanation:
      'Static model memory is strictly determined by parameter volume and precision bit-width: (Parameters * Bits_Per_Param / 8), plus runtime CUDA memory buffers and framework allocations.',
    doctrinalRef: 'MIL-STD-810H & Edge Compute SWaP-C Memory Allocation Standards',
  },
  {
    id: 'vaai-203-q1-2',
    moduleId: 'mod-1',
    question:
      'What is the operational consequence of extending an edge model context window from 2,048 to 8,192 tokens on an embedded device?',
    options: {
      A: 'Increases static model weight size on disk by exactly 4x.',
      B: 'Reduces available compute shaders while keeping VRAM consumption invariant.',
      C: 'Linear expansion of the dynamic Key-Value (KV) cache memory footprint proportional to context length and layer depth.',
      D: 'Triggers automatic FP32 up-casting across all model weights.',
    },
    correctAnswer: 'C',
    explanation:
      'The Key-Value (KV) cache grows linearly with sequence length: 2 * num_layers * num_heads * head_dim * bytes_per_element * seq_len. In VRAM-constrained edge accelerators, this dynamic memory spike can induce Out-Of-Memory (OOM) faults.',
    doctrinalRef: 'MIL-STD-810H & Transformer KV-Cache Scaling Mechanics',
  },
  {
    id: 'vaai-203-q1-3',
    moduleId: 'mod-1',
    question:
      'Under MIL-STD-810H environmental testing, how does extreme ambient operational temperature impact edge AI hardware running sustained inference?',
    options: {
      A: 'Thermal considerations are irrelevant when utilizing passive heatsinks in sealed vehicle hulls.',
      B: 'Constrained thermal ceilings on edge hardware cause clock down-throttling that degrades inference tokens-per-second.',
      C: 'Fan speed modulation increases network packet drop rate across physical Ethernet interfaces.',
      D: 'Voltage fluctuations alter quantized model weights stored in non-volatile flash storage.',
    },
    correctAnswer: 'B',
    explanation:
      'Under MIL-STD-810H Method 501.7 (High Temperature), accelerators operating in sealed or ambient high-heat expeditionary housings hit thermal throttling ceilings, dynamically lowering core clocks and sharply reducing tokens-per-second generation throughput.',
    doctrinalRef: 'MIL-STD-810H Method 501.7 (High Temperature Operating Ceilings)',
  },
];

// ============================================================================
// 3. MODULE 2 EXAMINATION QUESTION BANK: GGUF & Post-Training Quantization
// ============================================================================

export const VAAI_203_MODULE_2_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-203-q2-1',
    moduleId: 'mod-2',
    question:
      'What core architectural advantages does the GGUF binary format provide over legacy formats like GGML and raw Python pickle files in tactical deployments?',
    options: {
      A: 'Disables all tensor quantization to preserve 64-bit IEEE floating-point fidelity.',
      B: 'Extensible key-value metadata tables, mmap-friendly tensor alignment, and single-file portable deployment.',
      C: 'Mandates live HTTP connections back to external package repositories during model initialization.',
      D: 'Converts neural weights into plain-text JSON arrays for human inspection.',
    },
    correctAnswer: 'B',
    explanation:
      'GGUF features extensible structured key-value metadata headers, strict memory-aligned tensor layouts designed for zero-copy memory mapping (mmap), and single-file self-contained packaging without Python runtime dependencies.',
    doctrinalRef: 'GGUF Binary Container Specification v3 & NIST SP 800-171 SC-13',
  },
  {
    id: 'vaai-203-q2-2',
    moduleId: 'mod-2',
    question:
      'When evaluating post-training quantization schemes for tactical edge deployment, what trade-off does Q4_K_M offer compared to FP16 baselines?',
    options: {
      A: '10% VRAM reduction accompanied by an 80% loss in factual accuracy.',
      B: 'Identical VRAM consumption as FP16 with 2x higher perplexity error.',
      C: 'Approximate 65–70% VRAM consumption reduction with minimal perplexity increase (0.1–0.2 over FP16).',
      D: 'Zero perplexity loss while eliminating 99% of all parameter weights.',
    },
    correctAnswer: 'C',
    explanation:
      'Medium 4-bit block quantization (Q4_K_M) compresses model size and VRAM by ~65-70% while preserving critical attention matrices at higher precision, incurring only negligible perplexity degradation (0.1 to 0.2 points).',
    doctrinalRef: 'NIST SP 800-171 SC-13 & Post-Training Quantization Benchmarks',
  },
  {
    id: 'vaai-203-q2-3',
    moduleId: 'mod-2',
    question:
      'Under NIST SP 800-171 Rev. 3 SC-13, what mandatory integrity procedure must precede loading model weights into execution memory in an air-gapped enclave?',
    options: {
      A: 'Cryptographic SHA-256 checksum verification against authorized supply-chain manifest.',
      B: 'Transmitting model weights over cleartext HTTP to an external testing server.',
      C: 'Disabling secure boot and executing weights under unconfined root privileges.',
      D: 'Renaming the file extension to bypass boundary firewall filters.',
    },
    correctAnswer: 'A',
    explanation:
      'NIST SP 800-171 SC-13 mandates cryptographic validation of sensitive binary artifacts. Before loading model weights into active GPU buffers, the runtime must verify the SHA-256 digest against an authorized, tamper-evident manifest.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-13 (Cryptographic Protection)',
  },
];

// ============================================================================
// 4. MODULE 3 EXAMINATION QUESTION BANK: Zero-Egress Network Isolation
// ============================================================================

export const VAAI_203_MODULE_3_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-203-q3-1',
    moduleId: 'mod-3',
    question:
      'How is zero-egress network isolation strictly enforced for local containerized inference nodes in accordance with NIST SP 800-171 SC-7?',
    options: {
      A: 'Permitting unrestricted outbound access on port 80 and 443.',
      B: 'Running containers with explicit `--network none` or dropping default routes to guarantee complete network isolation.',
      C: 'Relying exclusively on user self-policing without kernel namespace isolation.',
      D: 'Opening all UDP ports between 1024 and 65535 to improve DNS resolution speed.',
    },
    correctAnswer: 'B',
    explanation:
      'NIST SP 800-171 SC-7 mandates boundary protection and total isolation of sensitive enclaves. In container environments, this is enforced by running containers with `--network none` or stripping default routing gateways.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-7 (Boundary Protection) & CNSSI 1253',
  },
  {
    id: 'vaai-203-q3-2',
    moduleId: 'mod-3',
    question:
      'What critical operational security vulnerability is introduced if an edge inference daemon binds its listening socket to `0.0.0.0:8000` on a tactical server?',
    options: {
      A: 'Causes immediate kernel panic when localhost loopback is probed.',
      B: 'Prevents the GPU from allocating VRAM to the inference process.',
      C: 'Exposes the inference endpoint to all adjacent subnet nodes across tactical radio and Ethernet interfaces without authentication.',
      D: 'Reduces token generation speed by exactly 50% due to TCP window fragmentation.',
    },
    correctAnswer: 'C',
    explanation:
      'Binding to `0.0.0.0` binds the service across all network interfaces, exposing unauthenticated local inference APIs to all adjacent radio and field network nodes. Offline enclaves must bind exclusively to `127.0.0.1` or local Unix domain sockets.',
    doctrinalRef: 'NIST SP 800-171 SC-7 & Defense Switched Network Security Standards',
  },
  {
    id: 'vaai-203-q3-3',
    moduleId: 'mod-3',
    question:
      'How must third-party LLM runtime telemetry flags and phone-home hooks be handled when deploying to air-gapped defense enclaves?',
    options: {
      A: 'Configuring telemetry to transmit every 60 seconds over satellite uplinks.',
      B: 'Explicitly disabling all phone-home telemetry via environment variables and blocking DNS resolution.',
      C: 'Ignoring telemetry endpoints as long as TLS 1.3 is negotiated.',
      D: 'Rerouting telemetry traffic to public cloud logging buckets.',
    },
    correctAnswer: 'B',
    explanation:
      'Under CNSSI 1253 and NIST SP 800-171, unauthorized outbound signals are prohibited. All telemetry environment variables (e.g., HF_HUB_OFFLINE=1, DO_NOT_TRACK=1, OLLAMA_NOPRUNE=1) must be enforced and external DNS blocked.',
    doctrinalRef: 'CNSSI 1253 Appendix F & NIST SP 800-171 SC-7',
  },
];

// ============================================================================
// 5. MODULE 4 EXAMINATION QUESTION BANK: High-Availability Edge Failover
// ============================================================================

export const VAAI_203_MODULE_4_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-203-q4-1',
    moduleId: 'mod-4',
    question:
      'During sustained edge operations in expeditionary vehicles, what is the primary diagnostic symptom of accelerator thermal down-throttling?',
    options: {
      A: 'Increased GPU memory allocation with unchanged compute frequency.',
      B: 'Sudden drops in tokens-per-second (TPS) throughput accompanied by increased generation latency.',
      C: 'Automatic deletion of the model binary file from local NVMe storage.',
      D: 'Spontaneous inversion of model weights from INT4 back to FP32.',
    },
    correctAnswer: 'B',
    explanation:
      'When thermal thresholds are breached, hardware thermal protection scales down accelerator core clocks. This immediately manifests as a steep drop in tokens-per-second (TPS) and lengthened Time-to-First-Token (TTFT).',
    doctrinalRef: 'CJCSM 6510.01B & MIL-STD-810H Environmental Testing',
  },
  {
    id: 'vaai-203-q4-2',
    moduleId: 'mod-4',
    question:
      'What is the recommended PACE strategy for maintaining continuous local AI capabilities on tactical edge hardware?',
    options: {
      A: 'Terminating the application and awaiting satellite internet reconnection.',
      B: 'Overclocking the GPU accelerator to bypass thermal safety limits.',
      C: 'Maintaining a smaller, pre-warmed quantized micro-model in system RAM for instantaneous failover if the primary engine exceeds memory.',
      D: 'Discarding all incoming tactical queries until hardware cools down.',
    },
    correctAnswer: 'C',
    explanation:
      'CJCSM 6510.01B mandates Primary, Alternate, Contingency, and Emergency (PACE) capabilities. In edge inference, this entails having a lightweight fallback model (e.g., 3B or 1B) ready for sub-500ms failover when the primary tier (e.g., 14B) suffers OOM or thermal faults.',
    doctrinalRef: 'CJCSM 6510.01B (Degraded Network Operations & PACE Planning)',
  },
  {
    id: 'vaai-203-q4-3',
    moduleId: 'mod-4',
    question:
      'What operational benefit does memory-mapped I/O (`mmap`) provide when serving large quantized models on memory-constrained edge hardware?',
    options: {
      A: 'Allows the operating system to page weight tensors directly from disk on-demand without duplicating weights in system RAM.',
      B: 'Automatically encrypts all network packets leaving the physical Ethernet adapter.',
      C: 'Multiplies GPU tensor core bandwidth by a factor of 4.',
      D: 'Converts floating-point weights into binary neural spiking signals.',
    },
    correctAnswer: 'A',
    explanation:
      'With mmap, the OS kernel maps the file into the process virtual address space. Tensors are paged directly from NVMe on demand, eliminating full duplicate memory copies in RAM and enabling near-instant cold starts.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 & POSIX Memory Management Standards',
  },
];

// ============================================================================
// 6. VAAI-203 COMPREHENSIVE CAPSTONE FINAL EXAMINATION BANK
// ============================================================================

export const VAAI_203_CAPSTONE_FINAL_QUESTIONS: ExamQuestion[] = [
  {
    id: 'vaai-203-cap-q1',
    moduleId: 'capstone',
    question:
      'When sizing physical VRAM allocations for edge deployments, how is the static weight footprint calculated for an 8-billion parameter model at 4-bit precision?',
    options: {
      A: '8 * 10^9 * 16 / 8 = 16 GB exactly.',
      B: '(8 * 10^9 * 4 / 8) / (1024^3) ≈ 3.73 GB, plus framework CUDA overhead.',
      C: '8 * 10^9 * 32 / 8 = 32 GB.',
      D: 'VRAM is unconstrained because weights reside entirely on disk.',
    },
    correctAnswer: 'B',
    explanation:
      'An 8B model quantized to 4 bits requires (8,000,000,000 * 4 / 8) bytes = 4,000,000,000 bytes ≈ 3.73 GB for weights, plus ~1.0-1.5 GB CUDA runtime buffers.',
    doctrinalRef: 'MIL-STD-810H & Edge Compute SWaP-C Profiling',
  },
  {
    id: 'vaai-203-cap-q2',
    moduleId: 'capstone',
    question:
      'What primary dynamic factor causes VRAM consumption to expand during multi-turn tactical dialogue on edge hardware?',
    options: {
      A: 'The tokenizer binary re-compiling in GPU cache.',
      B: 'The operating system allocating extra swap memory to flash storage.',
      C: 'The dynamic Key-Value (KV) cache linearly expanding with sequence length and layer depth.',
      D: 'Thermal throttling down-shifting model weights to 1-bit representations.',
    },
    correctAnswer: 'C',
    explanation:
      'As dialogue turns accumulate, the KV cache stores past key and value vectors for every token across all attention heads and layers, expanding dynamic VRAM requirements.',
    doctrinalRef: 'Transformer KV-Cache Scaling Architecture & MIL-STD-810H',
  },
  {
    id: 'vaai-203-cap-q3',
    moduleId: 'capstone',
    question:
      'Why is GGUF the standard container format for offline tactical edge deployments rather than Python pickle-based checkpoints?',
    options: {
      A: 'GGUF requires continuous cloud internet connection to verify license keys.',
      B: 'Single-file container with metadata key-value tables and page-aligned tensors optimized for memory-mapped I/O.',
      C: 'GGUF is an uncompressed audio transmission protocol.',
      D: 'Pickle files execute faster on specialized military microchips.',
    },
    correctAnswer: 'B',
    explanation:
      'GGUF stores all model architecture, tokenizer vocabularies, and page-aligned quantized tensors in a single structured binary file that can be memory-mapped directly without running insecure arbitrary Python code.',
    doctrinalRef: 'GGUF Format Specification v3 & NIST SP 800-171 SC-13',
  },
  {
    id: 'vaai-203-cap-q4',
    moduleId: 'capstone',
    question:
      'Under NIST SP 800-171 SC-13, how is the supply-chain cryptographic integrity of an air-gapped GGUF model binary verified before mounting?',
    options: {
      A: 'Checking whether the filename ends in ".gguf".',
      B: 'Calculating the SHA-256 hash of the binary file and asserting exact match against signed deployment manifest.',
      C: 'Pinging public DNS servers to verify domain ownership.',
      D: 'Inspecting the file creation timestamp in the local filesystem.',
    },
    correctAnswer: 'B',
    explanation:
      'Cryptographic provenance mandates generating a SHA-256 checksum over the raw binary bytes and confirming an identical match against a trusted, cryptographically signed supply-chain manifest.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-13 (Cryptographic Protection)',
  },
  {
    id: 'vaai-203-cap-q5',
    moduleId: 'capstone',
    question:
      'What technical mechanism guarantees zero outbound network egress for containerized edge inference runtimes under NIST SP 800-171 SC-7?',
    options: {
      A: 'Setting container environment variable `HTTP_PROXY="http://localhost"` without network namespace changes.',
      B: 'Deploying containers with --network none or stripping default gateway routes to prevent data exfiltration.',
      C: 'Relying on software developers to avoid writing network calls in Python.',
      D: 'Encrypting egress packets with an expired SSL certificate.',
    },
    correctAnswer: 'B',
    explanation:
      'Configuring the container engine with `--network none` strips all virtual network interfaces except loopback (lo), rendering any socket connection outside the container physically impossible at the kernel level.',
    doctrinalRef: 'NIST SP 800-171 Rev. 3 SC-7 & CNSSI 1253',
  },
  {
    id: 'vaai-203-cap-q6',
    moduleId: 'capstone',
    question:
      'Why is binding an edge inference service to `0.0.0.0` strictly prohibited in tactical air-gapped enclaves?',
    options: {
      A: 'It limits the number of concurrent connections to 1.',
      B: 'It causes immediate GPU overheating and hardware damage.',
      C: 'Binding to 0.0.0.0 exposes the inference RPC API to all adjacent network interfaces without perimeter authentication.',
      D: 'It changes the endianness of model tensors during load.',
    },
    correctAnswer: 'C',
    explanation:
      'Binding to `0.0.0.0` listens on all attached interfaces (Ethernet, tactical Wi-Fi, radio subnets), exposing an unauthenticated inference API to any device on the network segment. Secure enclaves must bind only to `127.0.0.1` or unix domain sockets.',
    doctrinalRef: 'NIST SP 800-171 SC-7 & Enclave Boundary Security',
  },
  {
    id: 'vaai-203-cap-q7',
    moduleId: 'capstone',
    question:
      'Under MIL-STD-810H environmental testing, how should an edge inference architecture adapt to severe thermal throttling in high-heat combat zones?',
    options: {
      A: 'Increase batch sizes to force maximum power dissipation.',
      B: 'Downclock GPU cores and dynamic load-shedding to prevent hardware shutdown in sealed expeditionary enclosures.',
      C: 'Switch from local inference to cloud APIs over SATCOM.',
      D: 'Disable thermal safety sensors in the motherboard BIOS.',
    },
    correctAnswer: 'B',
    explanation:
      'In sealed expeditionary chassis, thermal throttling protects silicon from destruction by lowering frequencies. The inference pipeline must implement dynamic load-shedding and tiered failover to smaller models to maintain service stability.',
    doctrinalRef: 'MIL-STD-810H Method 501.7 & High Temperature Operations',
  },
  {
    id: 'vaai-203-cap-q8',
    moduleId: 'capstone',
    question:
      'What is the fundamental operating system advantage of memory-mapped (`mmap`) weights in edge devices with limited system RAM?',
    options: {
      A: 'Enables instant process initialization and zero-copy paging directly from non-volatile storage without consuming system RAM.',
      B: 'Overwrites existing operating system memory with synthetic weights.',
      C: 'Disables all filesystem permission checks on the host computer.',
      D: 'Bypasses hardware memory management units (MMU) entirely.',
    },
    correctAnswer: 'A',
    explanation:
      '`mmap` maps disk files directly into the virtual address space, letting the OS kernel page tensors on-demand. This eliminates the multi-gigabyte RAM copy overhead of traditional file reads and allows instant cold-start.',
    doctrinalRef: 'POSIX System Architecture & Memory Constraint Optimization',
  },
  {
    id: 'vaai-203-cap-q9',
    moduleId: 'capstone',
    question:
      'In tactical PACE communications planning (CJCSM 6510.01B), how should edge AI architectures implement failover resilience?',
    options: {
      A: 'Halt execution until an engineer physically replaces the hardware.',
      B: 'Continuously retry the failing request until the server crashes.',
      C: 'Automatic degradation from primary high-parameter model to local micro-model within 500ms upon memory exhaustion or thermal alarm.',
      D: 'Fallback to cleartext SMS transmissions across civilian cell towers.',
    },
    correctAnswer: 'C',
    explanation:
      'A resilient PACE edge architecture maintains a warm secondary micro-model (e.g., 3B or 1B) ready to immediately absorb traffic within <= 500ms if the primary 14B engine hits memory exhaustion, timeout, or thermal failure.',
    doctrinalRef: 'CJCSM 6510.01B & Tactical Network PACE Doctrine',
  },
  {
    id: 'vaai-203-cap-q10',
    moduleId: 'capstone',
    question:
      'What are the four exact technical evaluation dimensions defined in the accredited VAAI-203 Capstone Rubric?',
    options: {
      A: 'Code Formatting (40%), Unit Tests (30%), Git Commits (20%), Comments (10%).',
      B: 'Zero-Egress Air-Gap Compliance (30%), Quantization & VRAM Budgeting (25%), Local Inference Throughput (25%), Host Fault Recovery (20%).',
      C: 'Cloud Integration (50%), Web Scraping (20%), Data Mining (20%), Streaming (10%).',
      D: 'HTML Layout (30%), CSS Design (25%), React State (25%), Tailwind Styling (20%).',
    },
    correctAnswer: 'B',
    explanation:
      'The VAAI-203 capstone rubric is mathematically weighted across Zero-Egress Air-Gap Compliance (30%), Quantization & VRAM Budgeting (25%), Local Inference Throughput & Latency (25%), and Host Fault Recovery & Resilience (20%), totaling 100% with an 80% passing floor.',
    doctrinalRef: 'TWC ETPL #TWC-ETPL-78752-VAAI-203 Accreditation Standards',
  },
];

export const VAAI_203_CAPSTONE_QUESTIONS = VAAI_203_CAPSTONE_FINAL_QUESTIONS;

// ============================================================================
// 7. MASTER MODULE EXAMS REGISTRY
// ============================================================================

export const VAAI_203_EXAMS: Record<ExamModuleId, ModuleExam> = {
  'mod-1': {
    moduleId: 'mod-1',
    title: 'Module 1 Examination: Edge Hardware Profiling & VRAM Budgeting (MIL-STD-810H)',
    passingScorePercentage: 80,
    questions: VAAI_203_MODULE_1_QUESTIONS,
  },
  'mod-2': {
    moduleId: 'mod-2',
    title: 'Module 2 Examination: GGUF, AWQ, & Post-Training Quantization (NIST SP 800-171 SC-13)',
    passingScorePercentage: 80,
    questions: VAAI_203_MODULE_2_QUESTIONS,
  },
  'mod-3': {
    moduleId: 'mod-3',
    title: 'Module 3 Examination: Zero-Egress Network Isolation & Air-Gapped Hosting (NIST SP 800-171 SC-7)',
    passingScorePercentage: 80,
    questions: VAAI_203_MODULE_3_QUESTIONS,
  },
  'mod-4': {
    moduleId: 'mod-4',
    title: 'Module 4 Examination: High-Availability Local Failover & Degraded Edge Processing (CJCSM 6510.01B)',
    passingScorePercentage: 80,
    questions: VAAI_203_MODULE_4_QUESTIONS,
  },
  capstone: {
    moduleId: 'capstone',
    title: 'VAAI-203 Comprehensive Final Examination: Air-Gapped Local AI & Edge Deployment',
    passingScorePercentage: 80,
    questions: VAAI_203_CAPSTONE_FINAL_QUESTIONS,
  },
};

export function getVAAI203ModuleExam(moduleId: string): ModuleExam | null {
  const normalized = moduleId.toLowerCase().replace('m', 'mod-');
  if (normalized in VAAI_203_EXAMS) {
    return VAAI_203_EXAMS[normalized as ExamModuleId];
  }
  if (moduleId in VAAI_203_EXAMS) {
    return VAAI_203_EXAMS[moduleId as ExamModuleId];
  }
  return null;
}

export function getAllVAAI203Exams(): ModuleExam[] {
  return Object.values(VAAI_203_EXAMS);
}

export const VAAI_203_MODULE_EXAMS: ModuleExam[] = [
  VAAI_203_EXAMS['mod-1'],
  VAAI_203_EXAMS['mod-2'],
  VAAI_203_EXAMS['mod-3'],
  VAAI_203_EXAMS['mod-4'],
];

export const VAAI_203_CAPSTONE_EXAM: ModuleExam = VAAI_203_EXAMS.capstone;

export function gradeVAAI203ModuleExam(
  moduleId: string,
  answers: Record<string, ExamOptionKey>
): ExamResult {
  const exam = getVAAI203ModuleExam(moduleId);
  if (!exam) {
    throw new Error(`Invalid VAAI-203 module examination ID: '${moduleId}'`);
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
    examId: `VAAI-203-${exam.moduleId}`,
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
// 8. VAAI-203 LABORATORY CODE AND STARTER SCRIPTS
// ============================================================================

export interface VAAI203ModuleLabSpec {
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

export const VAAI_203_LABS: Record<string, VAAI203ModuleLabSpec> = {
  'mod-1': {
    moduleId: 'mod-1',
    lessonId: 'les-1',
    title: 'Laboratory 1: Edge Hardware Profiling & VRAM Budgeting (SWaP-C)',
    doctrinalBaseline: 'MIL-STD-810H & SWaP-C Constraints',
    clockHours: 10.0,
    ceuValue: 1.0,
    theoreticalScope: [
      'Precision bit-width calculations (FP16, BF16, INT8, INT4)',
      'Static weight memory vs. dynamic KV-cache scaling',
      'Size, Weight, Power, and Cost (SWaP-C) thermal ceilings',
      'Deployability safety margin thresholds (>= 5% headroom)',
    ],
    starterCode: `from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class EdgeHardwareProfile:
    name: str
    total_vram_gb: float
    bandwidth_gb_s: float
    max_tdp_watts: int

@dataclass
class ModelDeploymentSpec:
    param_billions: float
    quant_bits_per_param: float
    context_tokens: int
    num_layers: int
    num_heads: int
    head_dim: int
    bytes_per_cache_element: int = 2  # FP16 KV cache

class EdgeVRAMBudgeter:
    def __init__(self, hardware: EdgeHardwareProfile):
        self.hw = hardware

    def calculate_footprint(self, model: ModelDeploymentSpec) -> Dict[str, Any]:
        # Weight memory in GB
        weights_gb = (model.param_billions * 1e9 * (model.quant_bits_per_param / 8.0)) / (1024**3)
        # KV cache per token per layer = 2 * layers * heads * head_dim * bytes
        kv_cache_bytes_per_token = 2 * model.num_layers * model.num_heads * model.head_dim * model.bytes_per_cache_element
        total_kv_gb = (kv_cache_bytes_per_token * model.context_tokens) / (1024**3)
        # CUDA / Runtime buffer overhead
        runtime_overhead_gb = 1.2
        total_required_gb = weights_gb + total_kv_gb + runtime_overhead_gb
        
        fits_in_vram = total_required_gb <= (self.hw.total_vram_gb * 0.95) # 5% safety margin
        return {
            "weights_vram_gb": round(weights_gb, 2),
            "kv_cache_vram_gb": round(total_kv_gb, 2),
            "runtime_overhead_gb": runtime_overhead_gb,
            "total_required_gb": round(total_required_gb, 2),
            "available_vram_gb": self.hw.total_vram_gb,
            "deployable": fits_in_vram,
            "headroom_gb": round(self.hw.total_vram_gb - total_required_gb, 2)
        }

# Test execution with NVIDIA Jetson Orin 16GB profile
jetson = EdgeHardwareProfile(name="Jetson Orin 16GB", total_vram_gb=16.0, bandwidth_gb_s=204.8, max_tdp_watts=50)
budgeter = EdgeVRAMBudgeter(jetson)

# 8B Model quantized to 4-bit at 4096 context tokens
model_8b = ModelDeploymentSpec(
    param_billions=8.0,
    quant_bits_per_param=4.5,
    context_tokens=4096,
    num_layers=32,
    num_heads=32,
    head_dim=128
)

result = budgeter.calculate_footprint(model_8b)
print(f"Deployable: {result['deployable']} | Required VRAM: {result['total_required_gb']} GB / {result['available_vram_gb']} GB (Headroom: {result['headroom_gb']} GB)")
`,
    solutionCode: `from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class EdgeHardwareProfile:
    name: str
    total_vram_gb: float
    bandwidth_gb_s: float
    max_tdp_watts: int

@dataclass
class ModelDeploymentSpec:
    param_billions: float
    quant_bits_per_param: float
    context_tokens: int
    num_layers: int
    num_heads: int
    head_dim: int
    bytes_per_cache_element: int = 2

class EdgeVRAMBudgeter:
    def __init__(self, hardware: EdgeHardwareProfile):
        self.hw = hardware

    def calculate_footprint(self, model: ModelDeploymentSpec) -> Dict[str, Any]:
        weights_gb = (model.param_billions * 1e9 * (model.quant_bits_per_param / 8.0)) / (1024**3)
        kv_cache_bytes_per_token = 2 * model.num_layers * model.num_heads * model.head_dim * model.bytes_per_cache_element
        total_kv_gb = (kv_cache_bytes_per_token * model.context_tokens) / (1024**3)
        runtime_overhead_gb = 1.2
        total_required_gb = weights_gb + total_kv_gb + runtime_overhead_gb
        fits_in_vram = total_required_gb <= (self.hw.total_vram_gb * 0.95)
        return {
            "weights_vram_gb": round(weights_gb, 2),
            "kv_cache_vram_gb": round(total_kv_gb, 2),
            "runtime_overhead_gb": runtime_overhead_gb,
            "total_required_gb": round(total_required_gb, 2),
            "available_vram_gb": self.hw.total_vram_gb,
            "deployable": fits_in_vram,
            "headroom_gb": round(self.hw.total_vram_gb - total_required_gb, 2)
        }
`,
  },
  'mod-2': {
    moduleId: 'mod-2',
    lessonId: 'les-1',
    title: 'Laboratory 2: GGUF Header Inspector & SHA-256 Enclave Verifier',
    doctrinalBaseline: 'NIST SP 800-171 Rev. 3 SC-13 Cryptographic Protection',
    clockHours: 10.0,
    ceuValue: 1.0,
    theoreticalScope: [
      'GGUF container binary structure and magic bytes (0x46554747)',
      'Header metadata parsing (version, tensor count, metadata kv count)',
      'Cryptographic SHA-256 supply-chain checksum verification',
      'Air-gapped artifact integrity gate before GPU allocation',
    ],
    starterCode: `import struct
import hashlib
from typing import Dict, Any

GGUF_MAGIC = b"GGUF"
VALID_VERSIONS = {2, 3}

class GGUFIntegrityInspector:
    @staticmethod
    def verify_and_inspect_header(raw_bytes: bytes, expected_sha256: str) -> Dict[str, Any]:
        # 1. Compute SHA-256 to verify air-gapped chain of custody
        computed_sha = hashlib.sha256(raw_bytes).hexdigest()
        if computed_sha.lower() != expected_sha256.lower():
            return {
                "verified": False,
                "error": f"Cryptographic integrity mismatch. Expected: {expected_sha256}, Computed: {computed_sha}"
            }

        # 2. Check header length (Magic: 4, Version: 4, TensorCount: 8, MetadataCount: 8 = 24 bytes)
        if len(raw_bytes) < 24:
            return {"verified": False, "error": "Insufficient binary length for GGUF header."}

        magic = raw_bytes[:4]
        if magic != GGUF_MAGIC:
            return {"verified": False, "error": f"Invalid GGUF magic identifier: {magic!r}"}

        # GGUF v2/v3 header format: uint32 version, uint64 tensor_count, uint64 metadata_kv_count
        version, tensor_count, metadata_kv_count = struct.unpack("<IQQ", raw_bytes[4:24])

        if version not in VALID_VERSIONS:
            return {"verified": False, "error": f"Unsupported GGUF version: {version}"}

        return {
            "verified": True,
            "version": version,
            "tensor_count": tensor_count,
            "metadata_kv_count": metadata_kv_count,
            "sha256": computed_sha,
            "status": "PASS_INTEGRITY_VERIFIED"
        }

# Construct synthetic compliant GGUF header for testing
synthetic_header = GGUF_MAGIC + struct.pack("<IQQ", 3, 291, 42) + b"\\x00" * 32
expected_hash = hashlib.sha256(synthetic_header).hexdigest()

inspector = GGUFIntegrityInspector()
result = inspector.verify_and_inspect_header(synthetic_header, expected_hash)
print(f"Verified: {result['verified']} | Version: {result.get('version')} | Tensors: {result.get('tensor_count')} | KV Metadata: {result.get('metadata_kv_count')}")
`,
    solutionCode: `import struct
import hashlib
from typing import Dict, Any

GGUF_MAGIC = b"GGUF"
VALID_VERSIONS = {2, 3}

class GGUFIntegrityInspector:
    @staticmethod
    def verify_and_inspect_header(raw_bytes: bytes, expected_sha256: str) -> Dict[str, Any]:
        computed_sha = hashlib.sha256(raw_bytes).hexdigest()
        if computed_sha.lower() != expected_sha256.lower():
            return {
                "verified": False,
                "error": f"Cryptographic integrity mismatch. Expected: {expected_sha256}, Computed: {computed_sha}"
            }

        if len(raw_bytes) < 24:
            return {"verified": False, "error": "Insufficient binary length for GGUF header."}

        magic = raw_bytes[:4]
        if magic != GGUF_MAGIC:
            return {"verified": False, "error": f"Invalid GGUF magic identifier: {magic!r}"}

        version, tensor_count, metadata_kv_count = struct.unpack("<IQQ", raw_bytes[4:24])

        if version not in VALID_VERSIONS:
            return {"verified": False, "error": f"Unsupported GGUF version: {version}"}

        return {
            "verified": True,
            "version": version,
            "tensor_count": tensor_count,
            "metadata_kv_count": metadata_kv_count,
            "sha256": computed_sha,
            "status": "PASS_INTEGRITY_VERIFIED"
        }
`,
  },
  'mod-3': {
    moduleId: 'mod-3',
    lessonId: 'les-1',
    title: 'Laboratory 3: Zero-Egress Network Isolation & Air-Gapped Gateway Auditor',
    doctrinalBaseline: 'NIST SP 800-171 Rev. 3 SC-7 & CNSSI 1253',
    clockHours: 10.0,
    ceuValue: 1.0,
    theoreticalScope: [
      'Container network namespace isolation (--network none)',
      'Enforcing strict loopback (127.0.0.1) and unix domain socket bindings',
      'Active egress probe detection against external public IP/DNS targets',
      'Blocking phone-home telemetry hooks and remote dependency downloads',
    ],
    starterCode: `import socket
from typing import Dict, Any, List

class AirGapEgressAuditor:
    @staticmethod
    def audit_socket_binding(host: str, port: int) -> Dict[str, Any]:
        is_loopback = host in {"127.0.0.1", "localhost", "::1"}
        if not is_loopback:
            return {
                "compliant": False,
                "violation": f"Insecure binding on external interface {host}:{port}. Must bind exclusively to 127.0.0.1 or unix socket."
            }
        return {"compliant": True, "host": host, "port": port}

    @staticmethod
    def assert_zero_outbound_egress(test_destinations=None) -> Dict[str, Any]:
        if test_destinations is None:
            test_destinations = [("8.8.8.8", 53), ("1.1.1.1", 53), ("github.com", 443)]
        
        leaks = []
        for dest_host, dest_port in test_destinations:
            try:
                # Attempt connection with 200ms timeout
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(0.2)
                sock.connect((dest_host, dest_port))
                sock.close()
                leaks.append(f"{dest_host}:{dest_port}")
            except (socket.timeout, socket.error, OSError):
                pass  # Connection failure is the required air-gap behavior
        
        return {
            "air_gap_intact": len(leaks) == 0,
            "detected_leaks": leaks,
            "status": "PASS_ZERO_EGRESS" if len(leaks) == 0 else "FAIL_LEAK_DETECTED"
        }

# Test execution
auditor = AirGapEgressAuditor()
bind_check = auditor.audit_socket_binding("127.0.0.1", 8080)
print(f"Loopback Binding Compliant: {bind_check['compliant']}")

insecure_check = auditor.audit_socket_binding("0.0.0.0", 8080)
print(f"Insecure 0.0.0.0 Binding Compliant: {insecure_check['compliant']} | Reason: {insecure_check.get('violation')}")
`,
    solutionCode: `import socket
from typing import Dict, Any, List

class AirGapEgressAuditor:
    @staticmethod
    def audit_socket_binding(host: str, port: int) -> Dict[str, Any]:
        is_loopback = host in {"127.0.0.1", "localhost", "::1"}
        if not is_loopback:
            return {
                "compliant": False,
                "violation": f"Insecure binding on external interface {host}:{port}. Must bind exclusively to 127.0.0.1 or unix socket."
            }
        return {"compliant": True, "host": host, "port": port}

    @staticmethod
    def assert_zero_outbound_egress(test_destinations=None) -> Dict[str, Any]:
        if test_destinations is None:
            test_destinations = [("8.8.8.8", 53), ("1.1.1.1", 53), ("github.com", 443)]
        
        leaks = []
        for dest_host, dest_port in test_destinations:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(0.2)
                sock.connect((dest_host, dest_port))
                sock.close()
                leaks.append(f"{dest_host}:{dest_port}")
            except (socket.timeout, socket.error, OSError):
                pass
        
        return {
            "air_gap_intact": len(leaks) == 0,
            "detected_leaks": leaks,
            "status": "PASS_ZERO_EGRESS" if len(leaks) == 0 else "FAIL_LEAK_DETECTED"
        }
`,
  },
  'mod-4': {
    moduleId: 'mod-4',
    lessonId: 'les-1',
    title: 'Laboratory 4: Tiered Edge Failover & Health Watchdog',
    doctrinalBaseline: 'CJCSM 6510.01B Tactical Communications & Degraded Network Protocols',
    clockHours: 10.0,
    ceuValue: 1.0,
    theoreticalScope: [
      'Asynchronous health monitoring and tokens-per-second (TPS) watchdog',
      'Dynamic downshift from 14B primary tier to 3B local micro-model',
      'Sub-500ms failover latency SLA enforcement',
      'Graceful degradation under simulated GPU thermal throttling and memory pressure',
    ],
    starterCode: `import asyncio
import time
from typing import Dict, Any, Callable

class EdgeWatchdogOrchestrator:
    def __init__(self, min_tps_threshold: float = 8.0, failover_latency_cap_ms: float = 500.0):
        self.min_tps = min_tps_threshold
        self.latency_cap_ms = failover_latency_cap_ms
        self.active_tier = "PRIMARY_TIER_14B"

    async def execute_with_failover(self, primary_engine: Callable, fallback_engine: Callable, prompt: str) -> Dict[str, Any]:
        start = time.perf_counter()
        try:
            # Attempt primary tier with execution timeout
            result = await asyncio.wait_for(primary_engine(prompt), timeout=1.5)
            elapsed_ms = (time.perf_counter() - start) * 1000
            return {
                "status": "SUCCESS",
                "tier_used": self.active_tier,
                "elapsed_ms": round(elapsed_ms, 2),
                "output": result
            }
        except (asyncio.TimeoutError, MemoryError, RuntimeError) as fault:
            failover_start = time.perf_counter()
            # Downshift to local micro edge model
            fallback_result = await fallback_engine(prompt)
            failover_duration_ms = (time.perf_counter() - failover_start) * 1000
            total_elapsed_ms = (time.perf_counter() - start) * 1000
            
            assert failover_duration_ms <= self.latency_cap_ms, f"Failover exceeded budget: {failover_duration_ms}ms"
            self.active_tier = "FALLBACK_TIER_3B"
            return {
                "status": "DEGRADED_FAILOVER",
                "tier_used": self.active_tier,
                "failover_duration_ms": round(failover_duration_ms, 2),
                "total_elapsed_ms": round(total_elapsed_ms, 2),
                "fault_reason": str(fault) or "Timeout",
                "output": fallback_result
            }

# Test execution
async def mock_primary(prompt: str) -> str:
    # Simulate primary timeout
    await asyncio.sleep(2.0)
    return "Primary completed"

async def mock_fallback(prompt: str) -> str:
    # Fast micro-model response in 25ms
    await asyncio.sleep(0.025)
    return "Fallback 3B response: SITREP processed in degraded mode."

async def main():
    watchdog = EdgeWatchdogOrchestrator(failover_latency_cap_ms=500.0)
    res = await watchdog.execute_with_failover(mock_primary, mock_fallback, "SITREP: Unit TALON active.")
    print(f"Status: {res['status']} | Tier: {res['tier_used']} | Failover Latency: {res['failover_duration_ms']}ms (Cap: 500ms)")

asyncio.run(main())
`,
    solutionCode: `import asyncio
import time
from typing import Dict, Any, Callable

class EdgeWatchdogOrchestrator:
    def __init__(self, min_tps_threshold: float = 8.0, failover_latency_cap_ms: float = 500.0):
        self.min_tps = min_tps_threshold
        self.latency_cap_ms = failover_latency_cap_ms
        self.active_tier = "PRIMARY_TIER_14B"

    async def execute_with_failover(self, primary_engine: Callable, fallback_engine: Callable, prompt: str) -> Dict[str, Any]:
        start = time.perf_counter()
        try:
            result = await asyncio.wait_for(primary_engine(prompt), timeout=1.5)
            elapsed_ms = (time.perf_counter() - start) * 1000
            return {
                "status": "SUCCESS",
                "tier_used": self.active_tier,
                "elapsed_ms": round(elapsed_ms, 2),
                "output": result
            }
        except (asyncio.TimeoutError, MemoryError, RuntimeError) as fault:
            failover_start = time.perf_counter()
            fallback_result = await fallback_engine(prompt)
            failover_duration_ms = (time.perf_counter() - failover_start) * 1000
            total_elapsed_ms = (time.perf_counter() - start) * 1000
            
            assert failover_duration_ms <= self.latency_cap_ms, f"Failover exceeded budget: {failover_duration_ms}ms"
            self.active_tier = "FALLBACK_TIER_3B"
            return {
                "status": "DEGRADED_FAILOVER",
                "tier_used": self.active_tier,
                "failover_duration_ms": round(failover_duration_ms, 2),
                "total_elapsed_ms": round(total_elapsed_ms, 2),
                "fault_reason": str(fault) or "Timeout",
                "output": fallback_result
            }
`,
  },
};
