'use client';

import React from 'react';

export interface VeteranResumeData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  securityClearance: 'Top Secret / SCI' | 'Secret' | 'Clearance Eligible' | 'None';
  branch: 'Army' | 'Navy' | 'Air Force' | 'Marine Corps' | 'Coast Guard';
  mosCode: string;
  mosTitle: string;
  targetRole: string;
  socCode: string;
  credentialUuid: string;
  issuedDate: string;
  verifiedSeatHours: number;
  capstoneScore: number;
  capstoneTitle: string;
  summary: string;
  coreCompetencies: string[];
  militaryExperience: {
    roleTitle: string;
    unitAndBranch: string;
    dateRange: string;
    bullets: string[];
  }[];
  educationAndCredentials: {
    title: string;
    issuer: string;
    date: string;
    details: string;
  }[];
}

interface VeteranResumeProps {
  data: VeteranResumeData;
  onPrint?: () => void;
}

export function VeteranResumeDocument({ data }: VeteranResumeProps) {
  return (
    <div className="mx-auto w-full max-w-[850px] bg-slate-900/50 p-4 print:max-w-none print:bg-white print:p-0">
      {/* 
        Single-page Letter Dimension Container: 
        8.5in x 11in (816px x 1056px at 96dpi). 
        Print styling strips headers/nav and fixes print padding to exactly 0.5 inches.
      */}
      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0.45in 0.5in;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-resume-page {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
          }
        }
      `}</style>

      <div className="print-resume-page relative mx-auto flex min-h-[1056px] w-full flex-col justify-between rounded-lg border border-slate-700 bg-white p-8 text-slate-900 shadow-2xl print:border-none print:shadow-none">
        
        {/* Top Header & Defense Metadata Banner */}
        <header className="border-b-2 border-slate-900 pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {data.fullName}
              </h1>
              <p className="text-sm font-bold text-sky-800 tracking-wide uppercase">
                {data.targetRole} | SOC {data.socCode}
              </p>
            </div>
            
            {/* Clearance & Defense Verification Badge */}
            <div className="text-right">
              <span className="inline-block rounded border border-emerald-700 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 uppercase tracking-wider print:border-slate-800 print:bg-transparent print:text-slate-900">
                CLEARANCE: {data.securityClearance}
              </span>
              <p className="mt-1 font-mono text-[10px] text-slate-600">
                BRANCH: {data.branch.toUpperCase()} (MOS {data.mosCode})
              </p>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2 text-[11px] text-slate-700">
            <span>{data.location}</span>
            <span>•</span>
            <span>{data.phone}</span>
            <span>•</span>
            <span>{data.email}</span>
            <span>•</span>
            <span className="font-mono font-medium text-slate-900">
              VAAI ID: {data.credentialUuid}
            </span>
          </div>
        </header>

        {/* Professional Executive Summary */}
        <section className="mt-3">
          <h2 className="border-b border-slate-300 pb-0.5 text-xs font-black uppercase tracking-wider text-slate-900">
            Professional Summary
          </h2>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-800">
            {data.summary}
          </p>
        </section>

        {/* Certified Technical & Military Competencies */}
        <section className="mt-3">
          <h2 className="border-b border-slate-300 pb-0.5 text-xs font-black uppercase tracking-wider text-slate-900">
            Core Competencies &amp; Defense Crosswalk
          </h2>
          <div className="mt-1.5 grid grid-cols-3 gap-x-2 gap-y-1 text-[10.5px]">
            {data.coreCompetencies.map((comp, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                <span className="font-medium text-slate-800">{comp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Primary Military & Technical Experience */}
        <section className="mt-3">
          <h2 className="border-b border-slate-300 pb-0.5 text-xs font-black uppercase tracking-wider text-slate-900">
            Professional &amp; Military Experience
          </h2>
          <div className="mt-2 space-y-3">
            {data.militaryExperience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between text-[11.5px]">
                  <span className="font-bold text-slate-900">{exp.roleTitle}</span>
                  <span className="font-medium text-slate-600 text-[10.5px]">{exp.dateRange}</span>
                </div>
                <div className="text-[10.5px] font-semibold text-sky-800">
                  {exp.unitAndBranch}
                </div>
                <ul className="mt-1 list-outside list-disc space-y-0.5 pl-4 text-[10.5px] leading-normal text-slate-700">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Applied AI Capstone & WIOA Credential Project */}
        <section className="mt-3">
          <h2 className="border-b border-slate-300 pb-0.5 text-xs font-black uppercase tracking-wider text-slate-900">
            Certified Applied AI Capstone Practicum
          </h2>
          <div className="mt-1.5 rounded border border-slate-200 bg-slate-50/70 p-2 print:border-slate-400 print:bg-transparent">
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="font-bold text-slate-900">
                {data.capstoneTitle}
              </span>
              <span className="font-mono text-[10px] font-bold text-emerald-800">
                SCORE: {data.capstoneScore}% | VERIFIED CONTACT: {data.verifiedSeatHours}h
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-700">
              Constructed, containerized, and audited an automated multi-step LLM workflow pipeline utilizing Zod schema gates, zero-retention API wrappers, and regex-driven CUI/PII redaction compliant with NIST SP 800-171 Rev. 3 and DoD Instruction 5200.48.
            </p>
          </div>
        </section>

        {/* Education & State/Federal Credentials */}
        <section className="mt-3">
          <h2 className="border-b border-slate-300 pb-0.5 text-xs font-black uppercase tracking-wider text-slate-900">
            Education &amp; Industry Certifications
          </h2>
          <div className="mt-1.5 space-y-1.5 text-[10.5px]">
            {data.educationAndCredentials.map((item, idx) => (
              <div key={idx} className="flex items-baseline justify-between">
                <div>
                  <span className="font-bold text-slate-900">{item.title}</span>
                  <span className="text-slate-600"> — {item.issuer}</span>
                  <span className="ml-2 italic text-slate-500 text-[9.5px]">({item.details})</span>
                </div>
                <span className="text-[10px] font-medium text-slate-600">{item.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Cryptographic Verification Footer */}
        <footer className="mt-4 border-t-2 border-slate-900 pt-2 text-[9px] text-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-900">
                Official Credential Verification:
              </span>{' '}
              <span className="font-mono">https://vaai.edu/verify/{data.credentialUuid}</span>
            </div>
            <div className="font-mono font-medium text-slate-800">
              OpenBadges v3.0 | Ed25519 Verified | TWC-ETPL-78752-VAAI
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
