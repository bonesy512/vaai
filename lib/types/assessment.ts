import { z } from 'zod';

export type ExamOptionKey = 'A' | 'B' | 'C' | 'D';
export type ExamModuleId = 'mod-1' | 'mod-2' | 'mod-3' | 'mod-4' | 'capstone';

/**
 * Single multiple-choice exam question with doctrinal defense citation
 */
export interface ExamQuestion {
  id: string;
  moduleId: ExamModuleId;
  question: string;
  options: Record<ExamOptionKey, string>;
  correctAnswer: ExamOptionKey;
  explanation: string;
  doctrinalRef: string;
}

export const ExamOptionKeySchema = z.enum(['A', 'B', 'C', 'D']);
export const ExamModuleIdSchema = z.enum(['mod-1', 'mod-2', 'mod-3', 'mod-4', 'capstone']);

export const ExamQuestionSchema = z.object({
  id: z.string().min(1),
  moduleId: ExamModuleIdSchema,
  question: z.string().min(5),
  options: z.record(ExamOptionKeySchema, z.string().min(1)),
  correctAnswer: ExamOptionKeySchema,
  explanation: z.string().min(10),
  doctrinalRef: z.string().min(2),
});

/**
 * Module Examination specification
 */
export interface ModuleExam {
  moduleId: ExamModuleId;
  title: string;
  passingScorePercentage: number;
  questions: ExamQuestion[];
}

export const ModuleExamSchema = z.object({
  moduleId: ExamModuleIdSchema,
  title: z.string().min(3),
  passingScorePercentage: z.literal(80),
  questions: z.array(ExamQuestionSchema).min(1),
});

/**
 * Capstone 4-dimension rubric definition
 */
export interface CapstoneRubricDimension {
  id: 'schemaConformity' | 'fallbackResilience' | 'boundarySanitization' | 'codeQuality';
  title: string;
  weightPercentage: number;
  passingCriteria: string;
  doctrinalRef: string;
}

export interface CapstoneRubric {
  dimensions: {
    schemaConformity: CapstoneRubricDimension;
    fallbackResilience: CapstoneRubricDimension;
    boundarySanitization: CapstoneRubricDimension;
    codeQuality: CapstoneRubricDimension;
  };
  totalWeight: number;
  passingScorePercentage: number;
}

export const CapstoneRubricDimensionSchema = z.object({
  id: z.enum(['schemaConformity', 'fallbackResilience', 'boundarySanitization', 'codeQuality']),
  title: z.string().min(1),
  weightPercentage: z.number().positive(),
  passingCriteria: z.string().min(5),
  doctrinalRef: z.string().min(2),
});

export const CapstoneRubricSchema = z.object({
  dimensions: z.object({
    schemaConformity: CapstoneRubricDimensionSchema,
    fallbackResilience: CapstoneRubricDimensionSchema,
    boundarySanitization: CapstoneRubricDimensionSchema,
    codeQuality: CapstoneRubricDimensionSchema,
  }),
  totalWeight: z.literal(100),
  passingScorePercentage: z.literal(80),
});

/**
 * Student Exam Submission Payload
 */
export interface ExamSubmission {
  courseId: string;
  moduleId: ExamModuleId;
  studentId?: string;
  answers: Record<string, ExamOptionKey>;
  startedAt: string;
  submittedAt: string;
}

export const ExamSubmissionSchema = z.object({
  courseId: z.string().min(1),
  moduleId: ExamModuleIdSchema,
  studentId: z.string().optional(),
  answers: z.record(z.string(), ExamOptionKeySchema),
  startedAt: z.string().datetime({ offset: true }).or(z.string()),
  submittedAt: z.string().datetime({ offset: true }).or(z.string()),
});

/**
 * Graded Exam Result
 */
export interface ExamResult {
  examId: string;
  moduleId: ExamModuleId;
  scorePercentage: number;
  totalQuestions: number;
  correctCount: number;
  passed: boolean;
  questionResults: Array<{
    questionId: string;
    studentAnswer: ExamOptionKey | null;
    correctAnswer: ExamOptionKey;
    isCorrect: boolean;
    explanation: string;
    doctrinalRef: string;
  }>;
  evaluatedAt: string;
}

/**
 * Capstone Evaluation Result
 */
export interface CapstoneEvaluationResult {
  scorePercentage: number;
  passed: boolean;
  breakdown: {
    schemaConformity: { score: number; maxScore: number; passed: boolean; details: string };
    fallbackResilience: { score: number; maxScore: number; passed: boolean; details: string };
    boundarySanitization: { score: number; maxScore: number; passed: boolean; details: string };
    codeQuality: { score: number; maxScore: number; passed: boolean; details: string };
  };
  totalLatencyMs: number;
  evaluatedAt: string;
  logs: string[];
}
