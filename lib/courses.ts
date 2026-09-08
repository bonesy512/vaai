import type { LessonData, SyllabusModule } from './schemas';

export const SYLLABUS_MODULES: SyllabusModule[] = [
  {
    slug: 'ai-literacy-101',
    title: 'Module 1: Title 38 Safe Harbor & Ethical AI Boundaries',
    contactHours: 12,
    lessons: [
      {
        slug: 'lesson-1',
        title: 'Title 38 Compliance & Non-Advocacy Guardrails',
        durationMinutes: 30,
        completed: false,
        active: true,
      },
      {
        slug: 'lesson-2',
        title: 'PII De-Identification & DoD ID Sanitization',
        durationMinutes: 30,
        completed: false,
        active: false,
      },
    ],
  },
  {
    slug: 'workforce-translation',
    title: 'Module 2: Military Occupational Translation & Data Extraction',
    contactHours: 14,
    lessons: [
      {
        slug: 'lesson-1',
        title: 'MOS Crosswalk to High-Demand Civilian Tech Competencies',
        durationMinutes: 45,
        completed: false,
        active: false,
      },
      {
        slug: 'lesson-2',
        title: 'Structured Chronological Record Parsing',
        durationMinutes: 45,
        completed: false,
        active: false,
      },
    ],
  },
  {
    slug: 'etpl-capstone',
    title: 'Module 3: WIOA Capstone & Evaluation Audit',
    contactHours: 10,
    lessons: [
      {
        slug: 'lesson-1',
        title: 'Final Practicum & State Credential Verification',
        durationMinutes: 60,
        completed: false,
        active: false,
      },
    ],
  },
];

export const LESSONS_DATABASE: Record<string, LessonData> = {
  'ai-literacy-101/lesson-1': {
    id: 'a7b3c291-81f4-4d2b-9238-1a982df401aa',
    moduleSlug: 'ai-literacy-101',
    lessonSlug: 'lesson-1',
    title: 'Title 38 Compliance & Non-Advocacy Guardrails',
    moduleTitle: 'Module 1: Title 38 Safe Harbor & Ethical AI Boundaries',
    wioaContactMinutes: 30,
    learningObjectives: [
      'Understand the statutory restrictions of Title 38 U.S.C. §§ 5901–5905 and 38 C.F.R. § 14.629.',
      'Differentiate between permissible educational digital literacy vs. unauthorized legal representation/claims preparation.',
      'Recognize automated AI guardrails preventing speculative disability percentage calculations and nexus letter generation.',
      'Apply prompt safety principles to protect veteran privacy and institutional compliance.',
    ],
    markdownContent: `
### Regulatory Framework Overview

Under federal law, **Title 38 of the United States Code (U.S.C.) §§ 5901–5905** establishes strict qualifications for individuals and organizations permitted to assist veterans in the preparation, presentation, and prosecution of claims for veterans' benefits before the Department of Veterans Affairs.

Pursuant to **38 C.F.R. § 14.629**, only representatives accredited by VA (e.g., Veterans Service Organizations, recognized claims agents, and licensed attorneys) may represent claimants.

#### The Safe Harbor Mandate for Workforce Technology

The **VAAI Workforce LMS** operates exclusively as an educational digital literacy and technical enablement platform funded under **WIOA (Workforce Innovation and Opportunity Act)**. It does not provide legal representation.

To maintain strict regulatory compliance:
1. **Zero Nexus Generation:** AI models must refuse prompts requesting causation or "nexus" opinion letters linking service events to disabilities.
2. **Zero Rating Speculation:** Systems must not generate estimated disability rating percentages or financial payout projections.
3. **Pure Factual Synthesis:** Trainees learn to use AI solely for administrative data sanitization, timeline organization, and civilian resume competency translation.

> **Key Rule of Engagement:** If an automated prompt attempts to draft claim appeals or legal affidavits, the system activates the Title 38 Safe Harbor circuit breaker and blocks execution.
    `,
    quizQuestions: [
      {
        id: '11111111-1111-4111-8111-111111111111',
        questionText:
          'Under 38 U.S.C. §§ 5901–5905 and 38 C.F.R. § 14.629, which entity is legally authorized to represent veterans in filing benefit claims?',
        options: [
          'Any AI-powered digital literacy software platform',
          'Only accredited VSO representatives, approved claims agents, or licensed attorneys',
          'Unlicensed third-party commercial consulting agencies',
          'State workforce agency technical trainers',
        ],
        correctOptionIndex: 1,
        explanation:
          'Title 38 U.S.C. explicitly restricts representation in VA claims to accredited VSOs, recognized claims agents, and licensed attorneys. Educational software platforms are strictly prohibited from acting as representatives.',
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        questionText:
          'What must an educational AI system do when asked to draft a medical "nexus letter" or calculate an estimated disability rating percentage?',
        options: [
          'Generate the letter with a disclaimer at the bottom',
          'Calculate an approximate disability rating based on public charts',
          'Refuse the request immediately under the Title 38 Safe Harbor guardrail',
          'Forward the request to an unaccredited commercial vendor',
        ],
        correctOptionIndex: 2,
        explanation:
          'Under Title 38 Safe Harbor policies, educational AI tools must hard-block and refuse any prompt attempting to draft medical nexus letters or calculate speculative disability ratings.',
      },
      {
        id: '33333333-3333-4333-8333-333333333333',
        questionText:
          'How does WIOA seat-time compliance regulate digital classroom contact hours?',
        options: [
          'It allows passive background tabs to log continuous hours indefinitely',
          'It requires verifiable active engagement and pauses when user is idle > 180s or tab is hidden',
          'It relies entirely on self-reported honor code logs without verification',
          'It only counts time if a video is playing at 2x speed',
        ],
        correctOptionIndex: 1,
        explanation:
          'WIOA and state ETPL credentials mandate active instructional contact. The VAAI engine pauses seat-time accumulation if the user is inactive for more than 180 seconds or navigates away from the active tab.',
      },
    ],
  },
};

export function getLesson(moduleSlug: string, lessonSlug: string): LessonData {
  const key = `${moduleSlug}/${lessonSlug}`;
  if (LESSONS_DATABASE[key]) {
    return LESSONS_DATABASE[key];
  }

  // Fallback dynamic lesson
  return {
    id: 'f9c8d7e6-5b4a-4321-8765-1234567890ab',
    moduleSlug,
    lessonSlug,
    title: `${lessonSlug.replace('-', ' ').toUpperCase()}: Advanced Technical Literacy`,
    moduleTitle: `${moduleSlug.replace('-', ' ').toUpperCase()}`,
    wioaContactMinutes: 30,
    learningObjectives: [
      'Understand enterprise AI workflows within workforce training standards.',
      'Demonstrate zero-retention data protection across sensitive records.',
      'Achieve 80% passing threshold on gated knowledge verification.',
    ],
    markdownContent: `
### Specialized WIOA Technical Training

This instructional unit provides targeted competencies for high-demand civilian technology roles.

#### Core Competencies:
- Safe handling of veteran and personnel data adhering to NIST standards.
- Utilizing machine-assisted timeline synthesis without legal advocacy.
- Translating austere operational leadership into civilian agile workflows.
    `,
    quizQuestions: [
      {
        id: '44444444-4444-4444-8444-444444444444',
        questionText:
          'What is the minimum passing score required to unlock WIOA lesson completion credentials in VAAI?',
        options: ['50%', '65%', '75%', '80%'],
        correctOptionIndex: 3,
        explanation:
          'VAAI enforces an 80% passing threshold across all assessment modules to verify mastery.',
      },
      {
        id: '55555555-5555-4555-8555-555555555555',
        questionText:
          'What data retention policy does the VAAI prompt sandbox enforce for privacy?',
        options: [
          'Stores all prompts for 10 years in public databases',
          'Zero-data-retention (in-memory execution with no persistent storage)',
          'Sells data to commercial marketing agencies',
          'Permanent unencrypted backups on local drives',
        ],
        correctOptionIndex: 1,
        explanation:
          'The VAAI sandbox enforces zero data retention, discarding all prompt inputs and outputs from memory immediately after execution.',
      },
    ],
  };
}
