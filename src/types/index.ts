export type BookCode = "七上" | "七下";
export type Difficulty = "easy" | "medium" | "hard";
export type Importance = "high" | "medium" | "low";
export type QuestionType = "select" | "judge" | "fill" | "map" | "flashcard";
export type SelfRating = "again" | "hard" | "good";

export interface KnowledgeSource {
  label: string;
  page?: number;
  note?: string;
}

export interface KnowledgeCard {
  id: string;
  book: BookCode;
  chapter: string;
  section: string;
  knowledgePoint: string;
  question: string;
  answer: string;
  explanation: string;
  difficulty: Difficulty;
  importance: Importance;
  source: KnowledgeSource;
}

export interface ChapterInfo {
  book: BookCode;
  chapter: string;
  sections: string[];
  pageSpan: string;
}

export interface MapChallenge {
  id: string;
  title: string;
  book: BookCode;
  chapter: string;
  section: string;
  type: "select" | "click" | "region";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  sourceLabel: string;
  sourcePage?: number;
  assetPath?: string;
  extractionNote?: string;
  knowledgePointIds: string[];
}

export interface ReviewProgress {
  mastery: number;
  correctCount: number;
  wrongCount: number;
  blurCount: number;
  lastRating?: SelfRating;
  lastReviewedAt?: string;
  nextReviewAt?: string;
}

export interface DashboardState {
  streakDays: number;
  totalStudyMinutes: number;
  todayMinutes: number;
  lastStudyDate?: string;
}

export interface ReviewCard {
  id: string;
  knowledgeId: string;
  questionType: QuestionType;
  book: BookCode;
  chapter: string;
  section: string;
  prompt: string;
  answer: string;
  explanation: string;
  options?: string[];
  correctOption?: string;
  assetPath?: string;
  sourceLabel?: string;
  sourcePage?: number;
  extractionNote?: string;
}

export interface RecentCardEntry {
  cardId: string;
  knowledgeId: string;
  questionType: QuestionType;
  assetPath?: string;
  recordedAt: string;
}

export interface RecentHistoryState {
  entries: RecentCardEntry[];
}

export interface SprintPreset {
  minutes: 30 | 60 | 90;
  label: string;
  focus: string[];
  itemCount: number;
}

export interface ChapterRate {
  book: BookCode;
  chapter: string;
  masteryRate: number;
  dueCount: number;
}

export interface StudyStats {
  totalKnowledge: number;
  masteredKnowledge: number;
  dueKnowledge: number;
  masteryRate: number;
  mapMasteryRate: number;
  streakDays: number;
  todayMinutes: number;
  totalMinutes: number;
  chapterRates: ChapterRate[];
}
