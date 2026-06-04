import { startTransition } from "react";
import {
  DEFAULT_UNIT_ID,
  getActiveUnitData,
  getUnitData as getUnitContent,
  unitCatalog
} from "../data/units";
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
  DashboardState,
  KnowledgeCard,
  RecentHistoryState,
  ReviewCard,
  ReviewProgress,
  SelfRating,
  SprintPreset,
  StudyStats,
  UnitData,
  UnitSummary
} from "../types";

const sprintPresets: SprintPreset[] = [
  {
    minutes: 30,
    label: "30 分钟快速复盘",
    focus: ["高频知识点", "基础选择题", "错题回看"],
    itemCount: 14
  },
  {
    minutes: 60,
    label: "60 分钟单元强化",
    focus: ["今日复习", "地图挑战", "易错题回炉"],
    itemCount: 26
  },
  {
    minutes: 90,
    label: "90 分钟考前冲刺",
    focus: ["整章串联", "地图识图", "核心问答"],
    itemCount: 40
  }
];

const defaultDashboard: DashboardState = {
  streakDays: 5,
  totalStudyMinutes: 48,
  todayMinutes: 0,
  lastStudyDate: new Date().toISOString()
};

const activeUnitData = getActiveUnitData();
const allKnowledgeBase = activeUnitData.flatMap((unit) => unit.knowledgePoints);
const allMapChallenges = activeUnitData.flatMap((unit) => unit.maps);

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function createSeedProgress() {
  return allKnowledgeBase.reduce<Record<string, ReviewProgress>>((result, item, index) => {
    const mastery = index < 4 ? 4 : index < 8 ? 2 : 1;

    result[item.id] = {
      mastery,
      correctCount: mastery >= 4 ? 4 : 1,
      wrongCount: mastery <= 1 ? 2 : 0,
      blurCount: mastery === 2 ? 1 : 0,
      lastRating: mastery >= 4 ? "good" : mastery === 2 ? "hard" : "again",
      lastReviewedAt: daysAgo(index % 5),
      nextReviewAt:
        mastery >= 4 ? daysAgo(-3) : mastery === 2 ? daysAgo(0) : daysAgo(1)
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

function createUnitSummaries(progressMap: Record<string, ReviewProgress>) {
  return unitCatalog.map<UnitSummary>((unit) => {
    const data = getUnitContent(unit.unitId);
    const knowledge = data?.knowledgePoints ?? [];
    const maps = data?.maps ?? [];
    const masteredKnowledge = knowledge.filter(
      (item) => (progressMap[item.id]?.mastery ?? 0) >= 4
    ).length;
    const dueCount = knowledge.filter((item) => isDue(progressMap[item.id])).length;

    return {
      ...unit,
      knowledgeCount: knowledge.length,
      questionCount: knowledge.length * 4,
      mapCount: maps.length,
      masteryRate: knowledge.length
        ? Math.round((masteredKnowledge / knowledge.length) * 100)
        : 0,
      dueCount,
      ready: Boolean(data)
    };
  });
}

function createStats(
  progressMap: Record<string, ReviewProgress>,
  dashboard: DashboardState,
  units: UnitSummary[]
): StudyStats {
  const totalKnowledge = allKnowledgeBase.length;
  const masteredKnowledge = allKnowledgeBase.filter(
    (item) => (progressMap[item.id]?.mastery ?? 0) >= 4
  ).length;
  const dueKnowledge = allKnowledgeBase.filter((item) => isDue(progressMap[item.id])).length;
  const masteryRate = totalKnowledge
    ? Math.round((masteredKnowledge / totalKnowledge) * 100)
    : 0;
  const mapKnowledgeIds = Array.from(
    new Set(allMapChallenges.flatMap((challenge) => challenge.knowledgePointIds))
  );
  const mapMasteryRate = mapKnowledgeIds.length
    ? Math.round(
        (mapKnowledgeIds.reduce(
          (sum, id) => sum + (progressMap[id]?.mastery ?? 0),
          0
        ) /
          (mapKnowledgeIds.length * 5)) *
          100
      )
    : 0;

  return {
    totalKnowledge,
    masteredKnowledge,
    dueKnowledge,
    masteryRate,
    mapMasteryRate,
    streakDays: dashboard.streakDays,
    todayMinutes: dashboard.todayMinutes,
    totalMinutes: dashboard.totalStudyMinutes,
    readyUnits: units.filter((unit) => unit.ready).length,
    totalUnits: units.length
  };
}

function createWrongItems(progressMap: Record<string, ReviewProgress>) {
  return allKnowledgeBase
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

function getUnitWrongItems(
  unitId: string,
  wrongItems: Array<KnowledgeCard & { progress: ReviewProgress }>
) {
  const data = getUnitContent(unitId);

  if (!data) {
    return [];
  }

  const knowledgeIds = new Set(data.knowledgePoints.map((item) => item.id));
  return wrongItems.filter((item) => knowledgeIds.has(item.id));
}

export interface StudyEngine {
  units: UnitSummary[];
  featuredUnit: UnitSummary;
  sprintPresets: SprintPreset[];
  progressMap: Record<string, ReviewProgress>;
  recentHistory: RecentHistoryState;
  stats: StudyStats;
  reviewDeck: ReviewCard[];
  wrongItems: Array<KnowledgeCard & { progress: ReviewProgress }>;
  reviewKnowledge: (card: ReviewCard, rating: SelfRating) => void;
  clearProgress: () => void;
  getUnit: (unitId: string) => UnitSummary | undefined;
  getUnitData: (unitId: string) => UnitData | undefined;
  getUnitReviewDeck: (unitId: string, targetSize?: number) => ReviewCard[];
  getUnitMapDeck: (unitId: string, targetSize?: number) => ReviewCard[];
  getUnitWrongItems: (unitId: string) => Array<KnowledgeCard & { progress: ReviewProgress }>;
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
  const units = createUnitSummaries(progressMap);
  const featuredUnit =
    units.find((unit) => unit.unitId === DEFAULT_UNIT_ID) ??
    units.find((unit) => unit.ready) ??
    units[0];

  if (!featuredUnit) {
    throw new Error("At least one unit must be configured.");
  }
  const reviewDeck = buildReviewDeck(
    allKnowledgeBase,
    allMapChallenges,
    progressMap,
    recentHistory,
    18
  );
  const stats = createStats(progressMap, normalizedDashboard, units);
  const wrongItems = createWrongItems(progressMap);

  const reviewKnowledge = (card: ReviewCard, rating: SelfRating) => {
    startTransition(() => {
      setProgressMap((currentMap) => ({
        ...currentMap,
        [card.knowledgeId]: applyReviewResult(currentMap[card.knowledgeId], rating)
      }));

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
      setProgressMap(createSeedProgress());
      setDashboard(defaultDashboard);
      setRecentHistory(createRecentHistory());
    });
  };

  return {
    units,
    featuredUnit,
    sprintPresets,
    progressMap,
    recentHistory,
    stats,
    reviewDeck,
    wrongItems,
    reviewKnowledge,
    clearProgress,
    getUnit: (unitId) => units.find((unit) => unit.unitId === unitId),
    getUnitData: (unitId) => getUnitContent(unitId),
    getUnitReviewDeck: (unitId, targetSize = 18) => {
      const data = getUnitContent(unitId);

      if (!data) {
        return [];
      }

      return buildReviewDeck(
        data.knowledgePoints,
        data.maps,
        progressMap,
        recentHistory,
        targetSize
      );
    },
    getUnitMapDeck: (unitId, targetSize = 10) => {
      const data = getUnitContent(unitId);

      if (!data) {
        return [];
      }

      return buildMapDeck(data.maps, progressMap, recentHistory, targetSize);
    },
    getUnitWrongItems: (unitId) => getUnitWrongItems(unitId, wrongItems)
  };
}
