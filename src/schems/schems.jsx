
import * as z from 'zod';

export const questionSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.enum(["multiple-choice", "truth-sentence", "paragraph"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  truthAnswers: z.array(z.string()).optional(),
  paragraphAnswer: z.string().optional(),
});

export const quizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  questions: z.array(questionSchema),
});

export const lectureSchema = z.object({
  id: z.string().or(z.number()),
  title: z.string().min(3, "Title must be at least 3 characters"),
  Duration: z.string().min(2, "Duration is required"),
  videoUrl: z.any().optional(),
  pdfUrl: z.any().optional(),
  freePreview: z.boolean().default(false),
  quiz: quizSchema.nullable().optional(),
});

export const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().min(10, "Subtitle must be at least 10 characters"),
  welcomeMessage: z.string().min(1, "Welcome message is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  language: z.string().min(1, "Language is required"),
  image: z.any().nullable().optional(),
  curriculum: z.array(lectureSchema).default([]),
  quiz: quizSchema.optional(),
});