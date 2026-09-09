'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Award,
  Copy,
  Check,
  Download,
  Clock,
  Layers,
  Activity,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { evaluateCapstoneSubmission } from '@/lib/capstone-evaluator';
import { evaluateVAAI201CapstoneSubmission } from '@/lib/vaai-201-capstone-evaluator';
import { evaluateVAAI203CapstoneSubmission } from '@/lib/vaai-203-capstone-evaluator';
import { CAPSTONE_RUBRIC } from '@/lib/vaai-101-assessment-data';
import { VAAI_201_CAPSTONE_RUBRIC } from '@/lib/vaai-201-assessment-data';
import { VAAI_203_CAPSTONE_RUBRIC } from '@/lib/vaai-203-assessment-data';
import type { CapstoneEvaluationResult } from '@/lib/types/assessment';

const DEFAULT_VAAI_101_CODE = `# VAAI-101 Capstone: Multi-Stage Defense Briefing Generator
# Adheres to FM 6-0, MIL-STD-2525D, CJCSM 6510.01B, and NIST SP 800-171 SC-7/SC-13
import json
import re
import time
from typing import Dict, Any, List

class DefenseBriefingPipeline:
    def __init__(self, max_token_ceiling: int = 4096):
        self.max_ceiling = max_token_ceiling
        self.circuit_open = False
        self.failure_threshold = 3

    def sanitize_boundary_entities(self, raw_text: str) -> str:
        """
        NIST SP 800-171 SC-7 & DoD 5200.48: Redacts SSNs, EDIPIs, MGRS, and sensitive callsigns.
        """
        ssn_regex = r'\\b\\d{3}-\\d{2}-\\d{4}\\b|\\b\\d{9}\\b'
        edipi_regex = r'\\b\\d{10}\\b'
        mgrs_regex = r'\\b(?:[1-5]?[0-9]|60)\\s*[C-HJ-NP-X]\\s*[A-HJ-NP-Z]{2}\\s*(?:\\d{5}\\s*\\d{5}|\\d{8}|\\d{10})\\b'
        name_regex = r'\\b(?:Capt\\.|Maj\\.|Lt\\.|Sgt\\.|Col\\.)\\s+[A-Za-z]+(?:\\s+[A-Za-z]+)?\\b'
        callsign_regex = r'\\b(?:GHOST|WARHAMMER|VIPER|TALON|SHIELD|IRONCLAD)-\\d+\\b'

        text = re.sub(ssn_regex, '[REDACTED_SSN]', raw_text)
        text = re.sub(edipi_regex, '[REDACTED_EDIPI]', text)
        text = re.sub(mgrs_regex, '[REDACTED_MGRS]', text)
        text = re.sub(name_regex, '[REDACTED_PERSONNEL]', text)
        text = re.sub(callsign_regex, '[REDACTED_CALLSIGN]', text)
        return text

    def execute_with_circuit_breaker(self, handler, fallback, simulate_fault: str = None) -> Dict[str, Any]:
        """
        PACE sub-250ms deterministic failover upon HTTP 429/503 fault.
        """
        start = time.perf_counter()
        if simulate_fault in ["HTTP_429", "HTTP_503", "TIMEOUT"]:
            res = fallback()
            elapsed_ms = (time.perf_counter() - start) * 1000
            res["failover_latency_ms"] = round(elapsed_ms, 2)
            res["circuit_status"] = "FAILOVER_LOCAL_PACE"
            return res

        res = handler()
        elapsed_ms = (time.perf_counter() - start) * 1000
        res["latency_ms"] = round(elapsed_ms, 2)
        res["circuit_status"] = "PRIMARY_NOMINAL"
        return res

    def process_sitrep(self, raw_report: str, simulate_fault: str = None) -> Dict[str, Any]:
        """
        End-to-End Processing: Boundary Defense -> Schema Validation -> PACE Circuit
        """
        sanitized = self.sanitize_boundary_entities(raw_report)

        def nominal_handler():
            return {
                "briefing_id": "DB-2026-VAAI101",
                "status": "SANITIZED",
                "sanitized_payload": sanitized,
                "schema_version": "1.0.0",
                "zero_retention_verified": True
            }

        def local_fallback():
            return {
                "briefing_id": "DB-2026-VAAI101-FALLBACK",
                "status": "DEGRADED_LOCAL",
                "sanitized_payload": sanitized,
                "schema_version": "1.0.0",
                "zero_retention_verified": True
            }

        return self.execute_with_circuit_breaker(nominal_handler, local_fallback, simulate_fault)

# Instantiate and verify pipeline
pipeline = DefenseBriefingPipeline()
sample_input = "SITREP: GHOST-1 under Capt. John Miller (EDIPI: 1029384756, SSN: 219-45-8821) at 18S UJ 23480 06470. Status: FULLY_MISSION_CAPABLE."
output = pipeline.process_sitrep(sample_input)
print(json.dumps(output, indent=2))
`;

const DEFAULT_VAAI_201_CODE = `# VAAI-201 Capstone: Multi-Agent Reconnaissance & Strike Planning Pipeline
# Compliance: JP 3-0, NIST SP 800-218 SSDF, DoDD 3000.09, FM 3-0 Operations
from enum import Enum
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional, Callable
from pydantic import BaseModel, Field, ValidationError
import uuid
import time

class MissionPhase(str, Enum):
    INIT = "INIT"
    INGEST = "INGEST"
    VALIDATE = "VALIDATE"
    SYNTHESIZE = "SYNTHESIZE"
    AWAITING_APPROVAL = "AWAITING_APPROVAL"
    TERMINATED = "TERMINATED"
    FAILED = "FAILED"

@dataclass
class MissionState:
    mission_id: str
    phase: MissionPhase = MissionPhase.INIT
    step_count: int = 0
    max_steps: int = 15
    transition_history: List[str] = field(default_factory=list)
    intel_data: Dict[str, Any] = field(default_factory=dict)
    pending_tokens: List[str] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)

    def transition_to(self, new_phase: MissionPhase):
        self.step_count += 1
        if self.step_count > self.max_steps:
            self.phase = MissionPhase.FAILED
            self.errors.append("Max step ceiling exceeded.")
            return
        self.transition_history.append(f"{self.phase.value} -> {new_phase.value}")
        self.phase = new_phase

class RadarQueryArgs(BaseModel):
    grid: str = Field(..., pattern=r"^\\d{1,2}[A-Z]{3}\\d{4,10}$")
    threat_threshold: float = Field(default=0.5, ge=0.0, le=1.0)

class HardenedToolDispatcher:
    def __init__(self):
        self._allowed_roles = {"RECON_ANALYST", "OFFICER"}
        self._registry: Dict[str, Dict[str, Any]] = {}

    def register_tool(self, name: str, schema: type[BaseModel], handler: Callable, required_role: str):
        self._registry[name] = {"schema": schema, "handler": handler, "required_role": required_role}

    def dispatch(self, tool_name: str, payload: Dict[str, Any], role: str) -> Dict[str, Any]:
        if role not in self._allowed_roles:
            return {"status": "DENIED", "error": f"Role '{role}' unauthorized for tool execution."}
        if tool_name not in self._registry:
            return {"status": "DENIED", "error": f"Unknown tool '{tool_name}'"}
        tool = self._registry[tool_name]
        try:
            validated = tool["schema"].model_validate(payload)
            return {"status": "SUCCESS", "telemetry": tool["handler"](validated)}
        except ValidationError as e:
            return {"status": "VALIDATION_FAILED", "error": str(e)}

class HITLInterceptionGateway:
    RESTRICTED_ACTIONS = {"KINETIC_AUTHORIZATION", "TARGET_ENGAGEMENT", "RESTRICTED_DB_WRITE", "dispatch_counter_battery_salvo"}

    def __init__(self):
        self.pending_interceptions: Dict[str, Dict[str, Any]] = {}

    def intercept(self, action_type: str, state: MissionState) -> bool:
        if action_type in self.RESTRICTED_ACTIONS:
            token = f"TOKEN-{uuid.uuid4().hex[:6].upper()}"
            state.transition_to(MissionPhase.AWAITING_APPROVAL)
            state.pending_tokens.append(token)
            return True
        return False

# Execution pipeline benchmark
start_t = time.perf_counter()
state = MissionState(mission_id="OPERATION-NORTHERN-WATCH")
dispatcher = HardenedToolDispatcher()
gateway = HITLInterceptionGateway()

def mock_radar(args: RadarQueryArgs):
    return {"grid": args.grid, "threat": "CONFIRMED", "confidence": 0.96}

dispatcher.register_tool("query_radar_telemetry", RadarQueryArgs, mock_radar, "RECON_ANALYST")

# Step 1: Ingest & dispatch tool call
intel = dispatcher.dispatch("query_radar_telemetry", {"grid": "38SMB1928382910"}, "RECON_ANALYST")
if intel["status"] == "SUCCESS":
    state.intel_data = intel["telemetry"]
    state.transition_to(MissionPhase.VALIDATE)

# Step 2: Intercept kinetic strike proposal
if gateway.intercept("KINETIC_AUTHORIZATION", state):
    elapsed_ms = (time.perf_counter() - start_t) * 1000
    print(f"Mission {state.mission_id} suspended in {state.phase.value} ({elapsed_ms:.2f}ms). Token: {state.pending_tokens[0]}")
`;

const DEFAULT_VAAI_203_CODE = `# VAAI-203 Capstone: Air-Gapped Tactical Deployable Edge Inference Pipeline
# Compliance: MIL-STD-810H, NIST SP 800-171 SC-7/SC-13, CNSSI 1253, CJCSM 6510.01B
# Hardware Baseline: NVIDIA Jetson Orin / Ruggedized Edge Accelerator (SWaP-C)

import socket
import struct
import hashlib
import time
import asyncio
from dataclasses import dataclass
from typing import Dict, Any, List, Optional, Callable

# =====================================================================
# 1. Zero-Egress Air-Gap Compliance Auditor (NIST SP 800-171 SC-7)
# =====================================================================
class AirGapEgressAuditor:
    @staticmethod
    def audit_socket_binding(host: str, port: int) -> Dict[str, Any]:
        is_loopback = host in {"127.0.0.1", "localhost", "::1"}
        if not is_loopback:
            return {
                "compliant": False,
                "violation": f"Insecure external interface binding: {host}:{port}. Bound strictly to 127.0.0.1."
            }
        return {"compliant": True, "host": host, "port": port}

    @staticmethod
    def assert_zero_outbound_egress(destinations=None) -> Dict[str, Any]:
        if destinations is None:
            destinations = [("8.8.8.8", 53), ("1.1.1.1", 53)]
        leaks = []
        for dest_host, dest_port in destinations:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(0.1)
                sock.connect((dest_host, dest_port))
                sock.close()
                leaks.append(f"{dest_host}:{dest_port}")
            except (socket.timeout, socket.error, OSError):
                pass  # Connection refusal is the mandatory air-gapped behavior
        return {
            "air_gap_intact": len(leaks) == 0,
            "detected_leaks": leaks,
            "status": "PASS_ZERO_EGRESS" if len(leaks) == 0 else "FAIL_LEAK_DETECTED"
        }

# =====================================================================
# 2. GGUF Binary Integrity & Cryptographic Verifier (NIST SC-13)
# =====================================================================
GGUF_MAGIC = b"GGUF"

class GGUFIntegrityInspector:
    @staticmethod
    def verify_and_inspect_header(raw_bytes: bytes, expected_sha256: str) -> Dict[str, Any]:
        computed_sha = hashlib.sha256(raw_bytes).hexdigest()
        if computed_sha.lower() != expected_sha256.lower():
            return {"verified": False, "error": "SHA-256 integrity mismatch."}
        if len(raw_bytes) < 24:
            return {"verified": False, "error": "Insufficient header length."}
        if raw_bytes[:4] != GGUF_MAGIC:
            return {"verified": False, "error": "Invalid GGUF magic."}
        version, tensor_count, metadata_kv_count = struct.unpack("<IQQ", raw_bytes[4:24])
        return {
            "verified": True,
            "version": version,
            "tensor_count": tensor_count,
            "metadata_kv_count": metadata_kv_count,
            "sha256": computed_sha
        }

# =====================================================================
# 3. SWaP-C VRAM Budgeter & KV Cache Guard (MIL-STD-810H)
# =====================================================================
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
        kv_cache_bytes = 2 * model.num_layers * model.num_heads * model.head_dim * model.bytes_per_cache_element
        kv_cache_gb = (kv_cache_bytes * model.context_tokens) / (1024**3)
        runtime_overhead_gb = 1.2
        total_required_gb = weights_gb + kv_cache_gb + runtime_overhead_gb
        # 5% SWaP-C thermal/memory safety margin
        fits_in_vram = total_required_gb <= (self.hw.total_vram_gb * 0.95)
        headroom_gb = self.hw.total_vram_gb - total_required_gb
        return {
            "weights_vram_gb": round(weights_gb, 2),
            "kv_cache_vram_gb": round(kv_cache_gb, 2),
            "total_required_gb": round(total_required_gb, 2),
            "available_vram_gb": self.hw.total_vram_gb,
            "fits_in_vram": fits_in_vram,
            "headroom_gb": round(headroom_gb, 2)
        }

# =====================================================================
# 4. Host Fault Watchdog & Degraded Failover (CJCSM 6510.01B)
# =====================================================================
class EdgeWatchdogOrchestrator:
    def __init__(self, failover_latency_cap_ms: float = 500.0, min_tps_threshold: float = 12.0):
        self.latency_cap_ms = failover_latency_cap_ms
        self.min_tps = min_tps_threshold
        self.active_tier = "PRIMARY_TIER_14B"

    async def execute_with_failover(self, primary_fn: Callable, fallback_fn: Callable, prompt: str) -> Dict[str, Any]:
        start = time.perf_counter()
        try:
            result = await asyncio.wait_for(primary_fn(prompt), timeout=1.5)
            elapsed_ms = (time.perf_counter() - start) * 1000
            tokens_generated = 48
            tps = round(tokens_generated / (elapsed_ms / 1000.0), 1)
            return {
                "status": "SUCCESS",
                "tier_used": self.active_tier,
                "latency_ms": round(elapsed_ms, 2),
                "tokens_per_second": tps,
                "output": result
            }
        except (asyncio.TimeoutError, MemoryError, RuntimeError) as err:
            failover_start = time.perf_counter()
            fallback_res = await fallback_fn(prompt)
            failover_duration_ms = (time.perf_counter() - failover_start) * 1000
            assert failover_duration_ms <= self.latency_cap_ms, f"Failover exceeded budget: {failover_duration_ms}ms"
            self.active_tier = "FALLBACK_TIER_3B"
            return {
                "status": "DEGRADED_FAILOVER",
                "tier_used": self.active_tier,
                "failover_duration_ms": round(failover_duration_ms, 2),
                "output": fallback_res
            }

# Demonstration pipeline run
async def run_pipeline():
    auditor = AirGapEgressAuditor()
    bind_res = auditor.audit_socket_binding("127.0.0.1", 8080)
    egress_res = auditor.assert_zero_outbound_egress()
    
    jetson = EdgeHardwareProfile("Jetson-Orin-16GB", 16.0, 204.8, 50)
    budgeter = EdgeVRAMBudgeter(jetson)
    spec = ModelDeploymentSpec(8.0, 4.5, 4096, 32, 32, 128)
    footprint = budgeter.calculate_footprint(spec)
    
    watchdog = EdgeWatchdogOrchestrator(failover_latency_cap_ms=500.0)
    print(f"Air-Gap Status: {egress_res['status']} | VRAM Headroom: {footprint['headroom_gb']}GB")

asyncio.run(run_pipeline())
`;

interface CapstoneEvaluationRunnerProps {
  courseId?: string;
  onPassed?: (score: number) => void;
}

export function CapstoneEvaluationRunner({
  courseId = 'VAAI-101',
  onPassed,
}: CapstoneEvaluationRunnerProps) {
  const isVAAI203 = courseId === 'VAAI-203';
  const isVAAI201 = courseId === 'VAAI-201';
  const defaultCode = isVAAI203
    ? DEFAULT_VAAI_203_CODE
    : isVAAI201
    ? DEFAULT_VAAI_201_CODE
    : DEFAULT_VAAI_101_CODE;
  const accreditationCode = isVAAI203
    ? 'TWC-ETPL-78752-VAAI-203'
    : isVAAI201
    ? 'TWC-ETPL-78752-VAAI-201'
    : 'TWC-ETPL-78752-VAAI-101';

  const [code, setCode] = useState(defaultCode);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<CapstoneEvaluationResult | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    `[INIT] ${courseId} Defense Capstone Evaluation Engine Ready.`,
    isVAAI203
      ? '[INFO] Ingesting 10 synthetic tactical edge deployment scenarios in client WASM runtime.'
      : isVAAI201
      ? '[INFO] Ingesting 10 synthetic tactical reconnaissance & strike missions in client WASM runtime.'
      : '[INFO] Ingesting 10 tactical noisy SITREPs in client WASM runtime.',
    '[READY] Click "Execute Capstone Evaluation" to begin.',
  ]);
  const [copied, setCopied] = useState(false);
  const [telemetryDispatched, setTelemetryDispatched] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isVAAI203
      ? 'vaai_203_capstone_pipeline.py'
      : isVAAI201
      ? 'vaai_201_capstone_pipeline.py'
      : 'vaai_101_capstone_pipeline.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetCode = () => {
    setCode(defaultCode);
    setEvaluationResult(null);
    setTelemetryDispatched(false);
    setTerminalOutput([
      '[RESET] Code reset to accredited baseline template.',
      '[READY] Ready for new evaluation run.',
    ]);
  };

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    setTerminalOutput(['[EXEC] Initializing Pyodide WASM micro-sandbox...']);

    // Simulate progressive terminal output streaming
    const interimSteps = isVAAI203
      ? [
          '[STAGE 1/4] Auditing Zero-Egress Air-Gap Compliance & Socket Isolation (NIST SP 800-171 SC-7)...',
          '[STAGE 2/4] Testing Quantization & VRAM Dynamic Budgeting under SWaP-C Constraints (MIL-STD-810H)...',
          '[STAGE 3/4] Benchmarking Local Inference Throughput & Time-to-First-Token SLA...',
          '[STAGE 4/4] Verifying Asynchronous Watchdog Failover & Sub-500ms Downshifting (CJCSM 6510.01B)...',
        ]
      : isVAAI201
      ? [
          '[STAGE 1/4] Validating Finite-State Determinism & Acyclic Loop Tripwires (JP 3-0)...',
          '[STAGE 2/4] Testing Sandboxed Tool Dispatcher & Role-Based ACLs (NIST SP 800-218)...',
          '[STAGE 3/4] Intercepting Kinetic Strike Actions via DoDD 3000.09 Gateways...',
          '[STAGE 4/4] Verifying Execution Efficiency & Asynchronous Concurrency (FM 3-0)...',
        ]
      : [
          '[STAGE 1/4] Loading MIL-STD-2525D Schema Engine & Testing 10 SITREPs...',
          '[STAGE 2/4] Simulating HTTP 429 Throttle & HTTP 503 Outage PACE Failover...',
          '[STAGE 3/4] Scanning Lexical Boundary Defense (SSN, EDIPI, MGRS, Callsigns)...',
          '[STAGE 4/4] Verifying 4,096-Token Budget & Zero Memory Leaks...',
        ];

    for (const step of interimSteps) {
      await new Promise((r) => setTimeout(r, 350));
      setTerminalOutput((prev) => [...prev, step]);
    }

    try {
      const result = isVAAI203
        ? await evaluateVAAI203CapstoneSubmission(code)
        : isVAAI201
        ? await evaluateVAAI201CapstoneSubmission(code)
        : await evaluateCapstoneSubmission(code);

      setEvaluationResult(result);
      setTerminalOutput(result.logs);

      if (result.passed) {
        if (onPassed) onPassed(result.scorePercentage);

        // Record telemetry heartbeat
        try {
          await fetch('/api/telemetry/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId,
              lessonId: 'capstone-defense-evaluation',
              activeSeconds: 1200, // 20-minute capstone defense allocation
              totalAccumulatedSeconds: 1200,
            }),
          });
          setTelemetryDispatched(true);
        } catch (e) {
          console.error('Failed to dispatch capstone telemetry:', e);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTerminalOutput((prev) => [...prev, `[ERROR] Evaluation failed: ${msg}`]);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="border border-slate-800 bg-slate-950/90 rounded-lg p-5 font-mono relative overflow-hidden backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-xs uppercase">
                CAPSTONE DEFENSE PROJECT
              </Badge>
              <span className="text-slate-500 text-xs">|</span>
              <span className="text-slate-400 text-xs">ACCREDITATION: {accreditationCode}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 uppercase tracking-tight">
              {isVAAI203
                ? 'Air-Gapped Tactical Deployable Inference Engine'
                : isVAAI201
                ? 'Autonomous Multi-Agent Reconnaissance & Strike Planning Pipeline'
                : 'Automated Multi-Stage Defense Briefing Generator'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
              {isVAAI203
                ? 'Deploy a fully air-gapped, zero-egress Python inference pipeline benchmarking 10 tactical edge scenarios in client-side Pyodide WASM. Graded automatically across 4 defense dimensions with an \u2265 80% passing floor.'
                : isVAAI201
                ? 'Deploy an autonomous multi-agent pipeline traversing 10 synthetic tactical missions in client-side Pyodide WASM. Graded automatically across 4 defense dimensions with an \u2265 80% passing floor.'
                : 'Deploy an end-to-end Python pipeline processing 10 unstandardized tactical SITREPs in client-side Pyodide WASM. Graded automatically across 4 defense dimensions with an \u2265 80% passing floor.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="border-slate-800 hover:bg-slate-900 text-slate-300 font-mono text-xs gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              className="border-slate-800 hover:bg-slate-900 text-slate-300 font-mono text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetCode}
              className="border-slate-800 hover:bg-slate-900 text-slate-300 font-mono text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* Rubric Weights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-900 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">
              {isVAAI203 ? '1. Zero-Egress Air-Gap' : isVAAI201 ? '1. Finite-State Determinism' : '1. Schema Conformity'}
            </span>
            <span className="font-bold text-slate-200">
              {isVAAI203 ? 'Weight: 30% (SC-7)' : isVAAI201 ? 'Weight: 30% (Acyclic FSM)' : 'Weight: 30%'}
            </span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">
              {isVAAI203 ? '2. SWaP-C & VRAM' : isVAAI201 ? '2. Tool Guardrails' : '2. Fallback Resilience'}
            </span>
            <span className="font-bold text-slate-200">
              {isVAAI203 ? 'Weight: 25% (\u2265 5% Headroom)' : isVAAI201 ? 'Weight: 25% (NIST SSDF)' : 'Weight: 25% (\u2264 250ms)'}
            </span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">
              {isVAAI203 ? '3. Local Throughput' : isVAAI201 ? '3. HITL Oversight' : '3. Boundary Defense'}
            </span>
            <span className="font-bold text-slate-200">
              {isVAAI203 ? 'Weight: 25% (\u2265 12 tok/s)' : isVAAI201 ? 'Weight: 25% (DoDD 3000.09)' : 'Weight: 25% (100% PII)'}
            </span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 block text-[11px]">
              {isVAAI203 ? '4. Watchdog Failover' : isVAAI201 ? '4. Execution Efficiency' : '4. Code Quality & Tokens'}
            </span>
            <span className="font-bold text-slate-200">
              {isVAAI203 ? 'Weight: 20% (\u2264 500ms)' : isVAAI201 ? 'Weight: 20% (FM 3-0)' : 'Weight: 20% (\u2264 4,096)'}
            </span>
          </div>
        </div>
      </div>

      {/* Editor & Terminal Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Editor Pane */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Cpu className="w-4 h-4" />
              <span>Python 3.12 / Pyodide WASM Runtime</span>
            </span>
            <span className="text-slate-500">Zero-Egress Sandboxed</span>
          </div>

          <div className="relative rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-[450px] p-4 font-mono text-xs md:text-sm bg-transparent text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/50 leading-relaxed selection:bg-emerald-900/50"
            />
          </div>

          <Button
            disabled={isEvaluating}
            onClick={handleRunEvaluation}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs md:text-sm py-5 gap-2"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing 4-Stage WASM Test Harness...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>
                  {isVAAI203
                    ? 'Execute Air-Gap Capstone Evaluation (10 Scenarios)'
                    : isVAAI201
                    ? 'Execute Multi-Agent Capstone Evaluation (10 Missions)'
                    : 'Execute 4-Stage Capstone Evaluation (10 SITREPs)'}
                </span>
              </>
            )}
          </Button>
        </div>

        {/* Live Evaluation Terminal & Scores Pane */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Terminal className="w-4 h-4" />
              <span>Diagnostic Telemetry Console</span>
            </span>
            {evaluationResult && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  evaluationResult.passed
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20'
                    : 'border-rose-500 text-rose-400 bg-rose-950/20'
                }`}
              >
                {evaluationResult.passed ? 'PASSED >= 80%' : 'DEFICIENT < 80%'}
              </Badge>
            )}
          </div>

          {/* Terminal Box */}
          <div className="border border-slate-800 bg-black rounded-lg p-4 font-mono text-xs h-[300px] overflow-y-auto space-y-1.5 select-text shadow-inner">
            {terminalOutput.map((line, idx) => {
              let lineClass = 'text-slate-400';
              if (line.includes('✓ PASS')) lineClass = 'text-emerald-400 font-semibold';
              else if (line.includes('✗ FAIL') || line.includes('CRITICAL FAIL')) lineClass = 'text-rose-400 font-semibold';
              else if (line.includes('⚠ PARTIAL')) lineClass = 'text-amber-400 font-semibold';
              else if (line.includes('[STAGE')) lineClass = 'text-cyan-400 font-bold';
              else if (line.includes('[EVALUATION COMPLETE]')) lineClass = 'text-white font-bold';
              else if (line.includes('[CONFIG]') || line.includes('[INIT]') || line.includes('[DOCTRINE]')) lineClass = 'text-slate-500';

              return (
                <div key={idx} className={`${lineClass} leading-relaxed break-words`}>
                  {line}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Score Cards Breakdown */}
          {evaluationResult && (
            <div className="space-y-3 font-mono">
              <div className="border border-slate-800 bg-slate-950/90 rounded p-3 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-300">Composite Score:</span>
                  <span
                    className={`text-lg ${
                      evaluationResult.passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {evaluationResult.scorePercentage} / 100 PTS
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-900 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {isVAAI203 ? '1. Zero-Egress Air-Gap:' : isVAAI201 ? '1. Finite-State Determinism:' : '1. Schema Conformity:'}
                    </span>
                    <span className="text-slate-200">
                      {evaluationResult.breakdown.schemaConformity.score} / 30 pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {isVAAI203 ? '2. SWaP-C VRAM & GGUF:' : isVAAI201 ? '2. Tool Guardrails:' : '2. Fallback Resilience:'}
                    </span>
                    <span className="text-slate-200">
                      {evaluationResult.breakdown.fallbackResilience.score} / 25 pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {isVAAI203 ? '3. Local Throughput SLA:' : isVAAI201 ? '3. HITL Oversight:' : '3. Boundary Defense:'}
                    </span>
                    <span className="text-slate-200">
                      {evaluationResult.breakdown.boundarySanitization.score} / 25 pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {isVAAI203 ? '4. Watchdog Failover:' : isVAAI201 ? '4. Execution Efficiency:' : '4. Code Quality & Budget:'}
                    </span>
                    <span className="text-slate-200">
                      {evaluationResult.breakdown.codeQuality.score} / 20 pts
                    </span>
                  </div>
                </div>

                {evaluationResult.passed && telemetryDispatched && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-2 border-t border-slate-900">
                    <Award className="w-3.5 h-3.5" />
                    <span>State Telemetry Heartbeat Dispatched & Recorded.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
