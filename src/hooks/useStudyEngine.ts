import { startTransition } from "react";
import { chapters } from "../data/chapters";
import { knowledgeBase } from "../data/knowledge-base";
import { mapChallenges, sprintPresets } from "../data/map-challenges";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";
import {
  applyReviewResult,
  buildMapDeck,
  buildReviewDeck,
  createRecentHistory,
  isDue,
  recordRecentCard
} from "../utils/review";
import type {
  ChapterRate,
  DashboardState,
  KnowledgeCard,
  RecentHistoryState,
  ReviewCard,
  ReviewProgress,
  SelfRating,
  StudyStats
} from "../types";

const defaultDashboard: DashboardState = {
  streakDays: 16,
  totalStudyMinutes: 310,
  todayMinutes: 25,
  lastStudyDate: new Date().toISOString()
};

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function createSeedProgress() {
  return knowledgeBase.reduce<Record<string, ReviewProgress>>((result, item, index) => {
    const mastery = index < 8 ? 4 : index < 16 ? 2 : 1;
    result[item.id] = {
      mastery,
      correctCount: mastery >= 4 ? 5 : 2,
      wrongCount: mastery <= 1 ? 2 : 0,
      blurCount: mastery === 2 ? 1 : 0,
      lastRating: mastery >= 4 ? "good" : mastery === 2 ? "hard" : "again",
      lastReviewedAt: daysAgo(index % 6),
      nextReviewAt:
        mastery >= 4
          ? daysAgo(-4)
          : mastery === 2
            ? daysAgo(0)
            : daysAgo(1)
    };
    return result;
  }, {});
}

function ensureToday(dashboard: DashboardState) {
  const today = new Date().toDateString();
  const lastStudyDay = dashboard.lastStudyDate
    ? new Date(dashboard.lastStudyDate).toDateString()
    : undefined;

  if (lastStudyDay === today) {
    return dashboard;
  }

  if (!lastStudyDay) {
    return {
      ...dashboard,
      todayMinutes: 0
    };
  }

  const daysBetween = Math.floor(
    (new Date(today).getTime() - new Date(lastStudyDay).getTime()) /
      (24 * 60 * 60 * 1000)
  );

  return {
    ...dashboard,
    streakDays: daysBetween === 1 ? dashboard.streakDays + 1 : 1,
    todayMinutes: 0
  };
}

function createChapterRates(progressMap: Record<string, ReviewProgress>) {
  return chapters.map<ChapterRate>((chapter) => {
    const chapterItems = knowledgeBase.filter((item) => item.chapter === chapter.chapter);
    const totalMastery = chapterItems.reduce(
      (sum, item) => sum + (progressMap[item.id]?.mastery ?? 0),
      0
    );
    const dueCount = chapterItems.filter((item) => isDue(progressMap[item.id])).length;

    return {
      book: chapter.book,
      chapter: chapter.chapter,
      masteryRate: Math.round((totalMastery / (chapterItems.length * 5)) * 100),
      dueCount
    };
  });
}

function createStats(
  progressMap: Record<string, ReviewProgress>,
  dashboard: DashboardState
): StudyStats {
  const chapterRates = createChapterRates(progressMap);
  const totalKnowledge = knowledgeBase.length;
  const masteredKnowledge = knowledgeBase.filter(
    (item) => (progressMap[item.id]?.mastery ?? 0) >= 4
  ).length;
  const dueKnowledge = knowledgeBase.filter((item) => isDue(progressMap[item.id])).length;
  const masteryRate = Math.round((masteredKnowledge / totalKnowledge) * 100);
  const mapKnowledgeIds = Array.from(
    new Set(mapChallenges.flatMap((challenge) => challenge.knowledgePointIds))
  );
  const mapMasteryRate = Math.round(
    (mapKnowledgeIds.reduce(
      (sum, id) => sum + (progressMap[id]?.mastery ?? 0),
      0
    ) /
      (Math.max(mapKnowledgeIds.length, 1) * 5)) *
      100
  );

  return {
    totalKnowledge,
    masteredKnowledge,
    dueKnowledge,
    masteryRate,
    mapMasteryRate,
    streakDays: dashboard.streakDays,
    todayMinutes: dashboard.todayMinutes,
    totalMinutes: dashboard.totalStudyMinutes,
    chapterRates
  };
}

function createWrongItems(progressMap: Record<string, ReviewProgress>) {
  return knowledgeBase
    .filter((item) => (progressMap[item.id]?.wrongCount ?? 0) > 0)
    .sort(
      (left, right) =>
        (progressMap[right.id]?.wrongCount ?? 0) - (progressMap[left.id]?.wrongCount ?? 0)
    )
    .map((item) => ({
      ...item,
      progress: progressMap[item.id]
    }));
}

export interface StudyEngine {
  chapters: typeof chapters;
  knowledgeBase: typeof knowledgeBase;
  mapChallenges: typeof mapChallenges;
  sprintPresets: typeof sprintPresets;
  progressMap: Record<string, ReviewProgress>;
  recentHistory: RecentHistoryState;
  stats: StudyStats;
  reviewDeck: ReviewCard[];
  mapDeck: ReviewCard[];
  wrongItems: Array<KnowledgeCard & { progress: ReviewProgress }>;
  reviewKnowledge: (card: ReviewCard, rating: SelfRating) => void;
  clearProgress: () => void;
}

export function useStudyEngine(): StudyEngine {
  const [progressMap, setProgressMap] = useLocalStorage(
    STORAGE_KEYS.progress,
    createSeedProgress()
  );
  const [dashboard, setDashboard] = useLocalStorage(
    STORAGE_KEYS.dashboard,
    defaultDashboard
  );
  const [recentHistory, setRecentHistory] = useLocalStorage(
    STORAGE_KEYS.history,
    createRecentHistory()
  );

  const normalizedDashboard = ensureToday(dashboard);
  const reviewDeck = buildReviewDeck(
    knowledgeBase,
    mapChallenges,
    progressMap,
    recentHistory,
    20
  );
  const mapDeck = buildMapDeck(mapChallenges, progressMap, recentHistory, 12);
  const stats = createStats(progressMap, normalizedDashboard);
  const wrongItems = createWrongItems(progressMap);

  const reviewKnowledge = (card: ReviewCard, rating: SelfRating) => {
    startTransition(() => {
      setProgressMap((currentMap) => {
        const previousProgress = currentMap[card.knowledgeId];
        const nextProgress = applyReviewResult(previousProgress, rating);

        return {
          ...currentMap,
          [card.knowledgeId]: {
            ...nextProgress,
            wrongCount:
              rating === "good"
                ? Math.max(0, (previousProgress?.wrongCount ?? 0) - 1)
                : nextProgress.wrongCount
          }
        };
      });

      setDashboard((currentDashboard) => {
        const prepared = ensureToday(currentDashboard);
        return {
          ...prepared,
          todayMinutes: prepared.todayMinutes + 2,
          totalStudyMinutes: prepared.totalStudyMinutes + 2,
          lastStudyDate: new Date().toISOString()
        };
      });

      setRecentHistory((currentHistory) => recordRecentCard(currentHistory, card));
    });
  };

  const clearProgress = () => {
    startTransition(() => {
      setProgressMap({});
      setDashboard({
        streakDays: 0,
        totalStudyMinutes: 0,
        todayMinutes: 0,
        lastStudyDate: new Date().toISOString()
      });
      setRecentHistory(createRecentHistory());
    });
  };

  return {
    chapters,
    knowledgeBase,
    mapChallenges,
    sprintPresets,
    progressMap,
    recentHistory,
    stats,
    reviewDeck,
    mapDeck,
    wrongItems,
    reviewKnowledge,
    clearProgress
  };
}
