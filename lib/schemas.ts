import { z } from 'zod';

export const HeartbeatPayloadSchema = z.object({
  lessonId: z.string().uuid(),
  activeSeconds: z.number().int().min(1).max(120),
});

export type HeartbeatPayload = z.infer<typeof HeartbeatPayloadSchema>;

export const PromptExecutionSchema = z.object({
  template: z.enum(['pii_sanitize', 'date_extract', 'mos_translate']),
  rawInput: z.string().min(5).max(4000),
});

export type PromptExecutionInput = z.infer<typeof PromptExecutionSchema>;

export const QuizQuestionSchema = z.object({
  id: z.string().uuid(),
  questionText: z.string(),
  options: z.array(z.string()).min(2),
  correctOptionIndex: z.number().int(),
  explanation: z.string(),
});

export const QuizSubmissionSchema = z.object({
  moduleId: z.string().uuid(),
  lessonId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      selectedOptionIndex: z.number().int(),
    })
  ),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizSubmission = z.infer<typeof QuizSubmissionSchema>;

export interface LessonData {
  id: string;
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  moduleTitle: string;
  wioaContactMinutes: number;
  learningObjectives: string[];
  markdownContent: string;
  quizQuestions: QuizQuestion[];
}

export interface SyllabusModule {
  slug: string;
  title: string;
  contactHours: number;
  lessons: {
    slug: string;
    title: string;
    durationMinutes: number;
    completed?: boolean;
    active?: boolean;
  }[];
}
