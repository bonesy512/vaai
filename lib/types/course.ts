import { z } from 'zod';

export type TrackType = 'engineering' | 'security' | 'operations';

export type FundingOption =
  | 'WIOA Title I'
  | 'DoD SkillBridge'
  | 'VR&E Ch. 31'
  | 'GI Bill / VET TEC';

export interface RubricCriterion {
  name: string;
  weight: number; // Percentage, e.g., 25 for 25%
  description: string;
}

export interface CapstoneProject {
  title: string;
  briefing: string;
  rubric: RubricCriterion[];
  starterCode: string;
  language: 'python' | 'javascript';
  verificationAssertions?: string[];
}

export interface CourseExercise {
  id: string;
  title: string;
  instructions: string;
  starterCode: string;
  solutionCode?: string;
  language: 'python' | 'javascript';
}

export interface CourseModule {
  id: string;
  moduleNumber: number; // 1 to 4
  title: string;
  contactHours: number;
  learningObjectives: string[];
  exercises: CourseExercise[];
}

export interface PricingDetails {
  etplVoucherPrice: number;
  enterpriseSeatPrice: number; // Fixed at $12,500
  fundingOptions: FundingOption[];
}

export interface Course {
  id: string; // VAAI-101 through VAAI-403
  slug: string; // Kebab-case route slug
  title: string;
  track: TrackType;
  level: 1 | 2 | 3 | 4;
  clockHours: number; // 35 <= clockHours <= 50
  ceuValue: number; // clockHours / 10
  socCode: string; // Regex: ^\d{2}-\d{4}\.\d{2}$
  targetMos: string[]; // Crosswalk strings, >= 2 items
  pricing: PricingDetails;
  capstone: CapstoneProject;
  modules: [CourseModule, CourseModule, CourseModule, CourseModule]; // Exactly 4 modules
  prerequisites?: string[];
  nextCourses?: string[];
  description: string;
}

// Zod Validation Schemas
export const SocCodeRegex = /^\d{2}-\d{4}\.\d{2}$/;

export const CourseSchema = z.object({
  id: z.string().regex(/^VAAI-\d{3}$/, 'Course ID must match VAAI-XXX format'),
  slug: z.string().min(3),
  title: z.string().min(5),
  track: z.enum(['engineering', 'security', 'operations']),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  clockHours: z.number().int().min(35).max(50),
  ceuValue: z.number().positive(),
  socCode: z.string().regex(SocCodeRegex, 'SOC Code must match standard format (e.g. 15-1299.08)'),
  targetMos: z.array(z.string()).min(2, 'Must include at least 2 target military ratings/MOS codes'),
  pricing: z.object({
    etplVoucherPrice: z.number().min(4000).max(8500),
    enterpriseSeatPrice: z.literal(12500),
    fundingOptions: z.array(z.string()).min(1),
  }),
  capstone: z.object({
    title: z.string().min(5),
    briefing: z.string().min(20),
    rubric: z.array(
      z.object({
        name: z.string(),
        weight: z.number().positive(),
        description: z.string(),
      })
    ).min(3),
    starterCode: z.string().min(10),
    language: z.enum(['python', 'javascript']),
  }),
  modules: z.array(
    z.object({
      id: z.string(),
      moduleNumber: z.number().int().min(1).max(4),
      title: z.string().min(5),
      contactHours: z.number().positive(),
      learningObjectives: z.array(z.string()).min(2),
      exercises: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          instructions: z.string(),
          starterCode: z.string(),
          language: z.enum(['python', 'javascript']),
        })
      ).min(1),
    })
  ).length(4, 'Course must contain exactly 4 modules'),
  description: z.string().min(20),
});
