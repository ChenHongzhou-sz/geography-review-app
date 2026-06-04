export type BookCode = "grade7-semester1" | "grade7-semester2";
export type Difficulty = "easy" | "medium" | "hard";
export type Importance = "high" | "medium" | "low";
export type QuestionType =
  | "flashcard"
  | "choice"
  | "judge"
  | "analysis"
  | "match"
  | "map";
export type SelfRating = "again" | "hard" | "good";
export type UnitStatus = "ready" | "planned";
export type MapMode = "select" | "click" | "region";

export interface KnowledgeSource {
  label: string;
  file?: string;
  slide?: number;
  note?: string;
}

export interface BaseUnitItem {
  id: string;
  type: QuestionType;
  bookCode: BookCode;
  bookLabel: string;
  chapter: string;
  section: string;
  knowledgePoint: string;
  prompt: string;
  answer: string;
  explanation: string;
  difficulty: Difficulty;
  importance: Importance;
  source: KnowledgeSource;
}

export interface KnowledgeCard extends BaseUnitItem {
  type: "flashcard";
}

export interface ChoiceQuestion extends BaseUnitItem {
  type: "choice";
  options: string[];
  correctOption: string;
  assetPath?: string;
}

export interface JudgeQuestion extends BaseUnitItem {
  type: "judge";
  statement: string;
  options: ["正确", "错误"];
  correctOption: "正确" | "错误";
  assetPath?: string;
}

export interface AnalysisQuestion extends BaseUnitItem {
  type: "analysis";
  options?: string[];
  correctOption?: string;
  assetPath?: string;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface MatchQuestion extends BaseUnitItem {
  type: "match";
  pairs: MatchPair[];
}

export type UnitQuestion =
  | ChoiceQuestion
  | JudgeQuestion
  | AnalysisQuestion
  | MatchQuestion;

export interface MapChallenge extends BaseUnitItem {
  type: "map";
  mode: MapMode;
  options?: string[];
  correctOption?: string;
  assetPath: string;
  extractionNote?: string;
  relatedIds?: string[];
}

export type UnitItem = KnowledgeCard | UnitQuestion | MapChallenge;

export interface ChallengeStage {
  id: string;
  title: string;
  description: string;
  focus: string;
  itemIds: string[];
  passThreshold: number;
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
  itemId: string;
  questionType: QuestionType;
  bookLabel: string;
  chapter: string;
  section: string;
  knowledgePoint: string;
  prompt: string;
  answer: string;
  explanation: string;
  options?: string[];
  correctOption?: string;
  assetPath?: string;
  sourceLabel?: string;
  sourceFile?: string;
  sourceSlide?: number;
  sourceNote?: string;
  extractionNote?: string;
  pairs?: MatchPair[];
}

export interface WrongItem extends ReviewCard {
  progress: ReviewProgress;
}

export interface RecentCardEntry {
  cardId: string;
  itemId: string;
  questionType: QuestionType;
  assetPath?: string;
  recordedAt: string;
}

export interface RecentHistoryState {
  entries: RecentCardEntry[];
}

export interface UnitCatalogEntry {
  unitId: string;
  bookCode: BookCode;
  bookLabel: string;
  chapter: string;
  chapterName: string;
  title: string;
  description: string;
  status: UnitStatus;
  accent: "ocean" | "mint" | "sand" | "slate";
}

export interface UnitData {
  unitId: string;
  bookCode: BookCode;
  bookLabel: string;
  chapter: string;
  chapterName: string;
  title: string;
  description: string;
  sections: string[];
  knowledgePoints: KnowledgeCard[];
  questions: UnitQuestion[];
  maps: MapChallenge[];
  stages: ChallengeStage[];
}

export interface UnitSummary extends UnitCatalogEntry {
  knowledgeCount: number;
  questionCount: number;
  mapCount: number;
  masteryRate: number;
  dueCount: number;
  ready: boolean;
}

export interface StudyStats {
  totalKnowledge: number;
  totalQuestions: number;
  masteredKnowledge: number;
  dueKnowledge: number;
  masteryRate: number;
  mapMasteryRate: number;
  streakDays: number;
  todayMinutes: number;
  totalMinutes: number;
  readyUnits: number;
  totalUnits: number;
}
