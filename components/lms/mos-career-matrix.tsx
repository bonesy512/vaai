'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Shield,
  ArrowRight,
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  crosswalkMilitaryProfile,
  getAvailableBranches,
  getMosListForBranch,
  type ServiceBranch,
  type RankBracket,
  type SkillsGraphOutput,
} from '@/lib/lms/skills-graph';

export interface MosCareerMatrixProps {
  initialBranch?: ServiceBranch;
  initialMosCode?: string;
  initialRank?: RankBracket;
}

export function MosCareerMatrix({
  initialBranch = 'Army',
  initialMosCode = '25B',
  initialRank = 'E-5_to_E-6',
}: MosCareerMatrixProps) {
  const [branch, setBranch] = useState<ServiceBranch>(initialBranch);
  const [mosCode, setMosCode] = useState<string>(initialMosCode);
  const [rankBracket, setRankBracket] = useState<RankBracket>(initialRank);
  const [copied, setCopied] = useState(false);

  // Recompute crosswalk on change
  const crosswalk: SkillsGraphOutput = crosswalkMilitaryProfile({
    branch,
    mosCode,
    rankBracket,
  });

  const availableBranches = getAvailableBranches();
  const availableMosList = getMosListForBranch(branch);

  const handleBranchChange = (newBranch: ServiceBranch) => {
    setBranch(newBranch);
    const mosOptions = getMosListForBranch(newBranch);
    if (mosOptions.length > 0) {
      setMosCode(mosOptions[0].code);
    }
  };

  const handleCopyBullets = () => {
    const text = crosswalk.civilianizedResumeBullets.join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPassport = () => {
    const passportData = {
      title: 'VAAI Civilianized Tech Skill Passport',
      veteranService: {
        branch: crosswalk.branch,
        mos: `${crosswalk.mosCode} - ${crosswalk.mosTitle}`,
        rankBracket: crosswalk.rankBracket,
      },
      targetCivilianOccupation: {
        title: crosswalk.primarySocTitle,
        socCode: crosswalk.primarySocCode,
        secondarySocCode: crosswalk.secondarySocCode,
        medianSalaryAnnual: `$${crosswalk.medianSalary.toLocaleString()}`,
      },
      certifiedCompetencies: crosswalk.nodes
        .filter((n) => n.category === 'vaai_competency')
        .map((n) => n.label),
      civilianizedResumeBullets: crosswalk.civilianizedResumeBullets,
      wioaPirlCompliant: true,
      issuer: 'Texas Workforce Commission ETPL # TWC-ETPL-78752-VAAI',
      issuedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(passportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VAAI-Skill-Passport-${crosswalk.branch}-${crosswalk.mosCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Military-to-Civilian Skills Matrix Engine
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Crosswalks tactical NCOER/OER service records to high-demand civilian AI &amp; systems engineering roles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyBullets}
            className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
            {copied ? 'Copied Bullets' : 'Copy Resume Bullets'}
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadPassport}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-mono"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Skill Passport
          </Button>
        </div>
      </div>

      {/* Military Profile Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
        {/* Branch Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300">
            1. Service Branch:
          </label>
          <select
            value={branch}
            onChange={(e) => handleBranchChange(e.target.value as ServiceBranch)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 font-sans focus:outline-none focus:border-blue-500"
          >
            {availableBranches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* MOS / Rating Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300">
            2. Primary MOS / AFSC / Rating:
          </label>
          <select
            value={mosCode}
            onChange={(e) => setMosCode(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 font-sans focus:outline-none focus:border-blue-500"
          >
            {availableMosList.map((m) => (
              <option key={m.code} value={m.code}>
                {m.code} - {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* Rank Bracket Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300">
            3. Rank Seniority:
          </label>
          <select
            value={rankBracket}
            onChange={(e) => setRankBracket(e.target.value as RankBracket)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 font-sans focus:outline-none focus:border-blue-500"
          >
            <option value="E-1_to_E-4">Junior Enlisted (E-1 to E-4)</option>
            <option value="E-5_to_E-6">Non-Commissioned Officer (E-5 to E-6, NCOER)</option>
            <option value="E-7_to_E-9">Senior NCO (E-7 to E-9)</option>
            <option value="W-1_to_W-5">Warrant Officer (W-1 to W-5)</option>
            <option value="O-1_to_O-6">Commissioned Officer (O-1 to O-6, OER)</option>
          </select>
        </div>
      </div>

      {/* Target Civilian Career & Salary Benchmark Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-emerald-950/30 border border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px] bg-blue-500/20 text-blue-300 border-blue-500/30">
              Primary O*NET Target
            </Badge>
            <span className="font-mono text-xs text-slate-400">SOC {crosswalk.primarySocCode}</span>
          </div>
          <h4 className="text-base font-bold text-white tracking-tight">
            {crosswalk.primarySocTitle}
          </h4>
          <p className="text-xs text-slate-400 font-sans">
            Secondary Crosswalk: {crosswalk.secondarySocTitle} ({crosswalk.secondarySocCode})
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              National Median Wage
            </span>
            <span className="text-xl font-extrabold font-mono text-emerald-400">
              ${crosswalk.medianSalary.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Skills Graph: Duty -> VAAI Competency -> SOC Target */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive Skills Transformation Graph</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-500">
            {crosswalk.nodes.length} Ontology Nodes • {crosswalk.edges.length} Crosswalk Vectors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Tactical Military Duties */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 border-b border-slate-800 pb-2">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Tactical Military Duties ({branch})</span>
            </div>
            <div className="space-y-2">
              {crosswalk.nodes
                .filter((n) => n.category === 'military_duty')
                .map((node) => (
                  <div
                    key={node.id}
                    className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed"
                  >
                    {node.description}
                  </div>
                ))}
            </div>
          </div>

          {/* Column 2: VAAI Certified Competencies */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 border-b border-slate-800 pb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VAAI Certified AI Competencies</span>
            </div>
            <div className="space-y-2">
              {crosswalk.nodes
                .filter((n) => n.category === 'vaai_competency')
                .map((node) => (
                  <div
                    key={node.id}
                    className="p-2.5 rounded bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300 font-medium flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{node.label}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Column 3: Direct Civilian SOC Target */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400 border-b border-slate-800 pb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Civilian SOC Job Targets</span>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 rounded bg-blue-950/30 border border-blue-800/40 space-y-1">
                <span className="text-[10px] font-mono text-blue-400 font-semibold block">PRIMARY ROLE</span>
                <h5 className="text-xs font-bold text-white font-sans">{crosswalk.primarySocTitle}</h5>
                <p className="text-[11px] font-mono text-slate-400">SOC Code: {crosswalk.primarySocCode}</p>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 font-semibold block">SECONDARY ROLE</span>
                <h5 className="text-xs font-bold text-slate-200 font-sans">{crosswalk.secondarySocTitle}</h5>
                <p className="text-[11px] font-mono text-slate-500">SOC Code: {crosswalk.secondarySocCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Civilianized Resume Bullets Box */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400">
            <Award className="w-4 h-4" />
            <span>Civilianized Defense Tech Resume Bullets (Ready for USAJOBS &amp; ATS)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">NCOER / OER Aligned</span>
        </div>

        <div className="space-y-2">
          {crosswalk.civilianizedResumeBullets.map((bullet, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200 font-sans leading-relaxed flex items-start gap-2.5"
            >
              <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
