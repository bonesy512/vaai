'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  Terminal,
  Shield,
  Award,
  FileCode2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Command,
  X,
  Play,
  Briefcase,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectPreset?: (presetId: string) => void;
  onRunCode?: () => void;
  onSubmitGrade?: () => void;
  onSwitchTab?: (tabId: string) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: 'Quick Actions' | 'Curriculum Lessons' | 'Lab Presets' | 'Compliance & Credentials';
  description?: string;
  badge?: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette({
  isOpen: controlledIsOpen,
  onClose,
  onSelectPreset,
  onRunCode,
  onSubmitGrade,
  onSwitchTab,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const isVisible = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  // Global keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (controlledIsOpen !== undefined && onClose) {
          if (controlledIsOpen) onClose();
          else setInternalOpen(true);
        } else {
          setInternalOpen((prev) => !prev);
        }
      } else if (e.key === 'Escape' && isVisible) {
        e.preventDefault();
        closePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controlledIsOpen, onClose, isVisible]);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isVisible]);

  const closePalette = () => {
    if (onClose) onClose();
    setInternalOpen(false);
  };

  const executeItem = (item: PaletteItem) => {
    closePalette();
    item.action();
  };

  const paletteItems: PaletteItem[] = [
    // Quick Actions
    {
      id: 'act-run',
      title: 'Run In-Browser Lab Script',
      category: 'Quick Actions',
      description: 'Execute Python/JavaScript in the local client sandbox',
      badge: 'WASM',
      icon: <Play className="w-4 h-4 text-emerald-400" />,
      action: () => {
        if (onRunCode) onRunCode();
      },
    },
    {
      id: 'act-grade',
      title: 'Submit Lab for Automated Grading',
      category: 'Quick Actions',
      description: 'Trigger dual-agent rubric assessment with zero retention',
      badge: 'Dual-Agent',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: () => {
        if (onSubmitGrade) onSubmitGrade();
      },
    },
    {
      id: 'act-skills',
      title: 'Open Military-to-Civilian Skills Matrix',
      category: 'Quick Actions',
      description: 'Crosswalk military MOS/Rating to O*NET & civilian SOC roles',
      badge: 'O*NET',
      icon: <Briefcase className="w-4 h-4 text-blue-400" />,
      action: () => {
        if (onSwitchTab) onSwitchTab('skills');
      },
    },

    // Lab Presets
    {
      id: 'pre-pii',
      title: 'Load Preset: DoD PII & CUI Lexical Sanitizer',
      category: 'Lab Presets',
      description: 'Regex redactor for SSN, 10-digit EDI-PI, MGRS, and CUI tokens',
      badge: 'Python',
      icon: <FileCode2 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        if (onSelectPreset) onSelectPreset('pii-scrubber');
        if (onSwitchTab) onSwitchTab('lab');
      },
    },
    {
      id: 'pre-mos',
      title: 'Load Preset: NCOER to SOC Crosswalk Pipeline',
      category: 'Lab Presets',
      description: 'Extract civilian competencies from military duty evaluations',
      badge: 'Python',
      icon: <FileCode2 className="w-4 h-4 text-blue-400" />,
      action: () => {
        if (onSelectPreset) onSelectPreset('mos-translator');
        if (onSwitchTab) onSwitchTab('lab');
      },
    },
    {
      id: 'pre-pirl',
      title: 'Load Preset: WIOA Attendance & PIRL Transformer',
      category: 'Lab Presets',
      description: 'Construct TWC WIOA Quarter 2 placement reporting payload',
      badge: 'JavaScript',
      icon: <FileCode2 className="w-4 h-4 text-amber-400" />,
      action: () => {
        if (onSelectPreset) onSelectPreset('wioa-webhook');
        if (onSwitchTab) onSwitchTab('lab');
      },
    },

    // Curriculum Lessons
    {
      id: 'les-1',
      title: 'Lesson 1: Title 38 Compliance & Non-Advocacy',
      category: 'Curriculum Lessons',
      description: 'Module 1 - Safe Harbor, 38 U.S.C. §§ 5901-5905 bounds',
      badge: '30 min',
      icon: <BookOpen className="w-4 h-4 text-slate-300" />,
      action: () => router.push('/courses/ai-literacy-101/lesson-1'),
    },
    {
      id: 'les-2',
      title: 'Lesson 2: PII De-Identification & DoD ID Sanitization',
      category: 'Curriculum Lessons',
      description: 'Module 1 - Military record redaction & defense token filtering',
      badge: '30 min',
      icon: <BookOpen className="w-4 h-4 text-slate-300" />,
      action: () => router.push('/courses/ai-literacy-101/lesson-2'),
    },
    {
      id: 'les-3',
      title: 'Lesson 3: MOS Crosswalk to High-Demand Tech Competencies',
      category: 'Curriculum Lessons',
      description: 'Module 2 - Civilian labor market translation & O*NET',
      badge: '45 min',
      icon: <BookOpen className="w-4 h-4 text-slate-300" />,
      action: () => router.push('/courses/workforce-translation/lesson-1'),
    },
    {
      id: 'les-4',
      title: 'Lesson 4: Structured Chronological Record Parsing',
      category: 'Curriculum Lessons',
      description: 'Module 2 - Extraction of clinical & service timelines',
      badge: '45 min',
      icon: <BookOpen className="w-4 h-4 text-slate-300" />,
      action: () => router.push('/courses/workforce-translation/lesson-2'),
    },
    {
      id: 'les-5',
      title: 'Lesson 5: Final Practicum & Credential Verification',
      category: 'Curriculum Lessons',
      description: 'Module 3 - 40h WIOA Capstone & OpenBadges graduation',
      badge: '60 min',
      icon: <Award className="w-4 h-4 text-amber-400" />,
      action: () => router.push('/courses/etpl-capstone/lesson-1'),
    },

    // Compliance & Credentials
    {
      id: 'com-dossier',
      title: 'Inspect State ETPL Accreditation Dossier',
      category: 'Compliance & Credentials',
      description: 'TWC institutional capacity package & PIRL CSV exporter',
      badge: 'TWC-ETPL',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      action: () => router.push('/etpl-dossier'),
    },
    {
      id: 'com-employers',
      title: 'Access Defense Talent Clearinghouse',
      category: 'Compliance & Credentials',
      description: 'Recruiter portal with security clearance & MOS filters',
      badge: 'B2B Portal',
      icon: <Briefcase className="w-4 h-4 text-blue-400" />,
      action: () => router.push('/employers'),
    },
    {
      id: 'com-mou',
      title: 'View Corporate Partnership MOUs',
      category: 'Compliance & Credentials',
      description: 'Defense employer hiring commitments and VEVRAA outreach',
      badge: 'Defense MOU',
      icon: <ExternalLink className="w-4 h-4 text-purple-400" />,
      action: () => router.push('/employers/partnership'),
    },
    {
      id: 'com-vsa',
      title: 'Defense Vendor Security Assessment (VSA)',
      category: 'Compliance & Credentials',
      description: 'NIST SP 800-171 Rev. 3, CMMC 2.0 L2, SOC 2 Type II attestation package',
      badge: 'NIST-800-171',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      action: () => router.push('/vendor-security-assessment'),
    },
    {
      id: 'com-badge',
      title: 'Verify OpenBadges v3.0 Digital Credential',
      category: 'Compliance & Credentials',
      description: 'Cryptographic Ed25519 verifiable diploma verification',
      badge: 'OpenBadges',
      icon: <Award className="w-4 h-4 text-amber-400" />,
      action: () => router.push('/verify/VAAI-2026-DEMO'),
    },
  ];

  const filteredItems = paletteItems.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) executeItem(selected);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl shadow-emerald-950/20 overflow-hidden flex flex-col"
        onKeyDown={handleKeyDownList}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to lesson, preset, or dossier... (Press Esc to exit)"
            className="w-full py-3.5 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-800 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No matching commands, lessons, or presets found for &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors group ${
                    isSelected
                      ? 'bg-emerald-600/20 border border-emerald-500/30 text-white'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div
                      className={`p-2 rounded-md mt-0.5 shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-slate-100 tracking-tight">
                          {item.title}
                        </span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0 px-1.5 bg-slate-800 text-slate-300 border-slate-700"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate font-sans">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block">
                      {item.category}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 mr-1 text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 mr-1 text-[10px]">
                ↓
              </kbd>
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 mr-1 text-[10px]">
                ↵
              </kbd>
              to select
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>VAAI Command Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
}
