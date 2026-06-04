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
  buildFocusedDeck,
  buildMapDeck,
  buildReviewDeck,
  createMapReviewCard,
  createRecentHistory,
  createReviewCard,
  isMistakeActive,
  isDue,
  recordRecentCard
} from "../utils/review";
import type {
  ChallengeStage,
  DashboardState,
  ReviewCard,
  ReviewProgress,
  ReviewSource,
  SelfRating,
  StudyStats,
  UnitData,
  UnitItem,
  UnitSummary,
  WrongItem
} from "../types";

const defaultDashboard: DashboardState = {
  streakDays: 0,
  totalStudyMinutes: 0,
  todayMinutes: 0
};

const activeUnitData = getActiveUnitData();
const allKnowledgeBase = activeUnitData.flatMap((unit) => unit.knowledgePoints);
const allQuestions = activeUnitData.flatMap((unit) => unit.questions);
const allMapChallenges = activeUnitData.flatMap((unit) => unit.maps);
const allReviewItems = activeUnitData.flatMap<UnitItem>((unit) => [
  ...unit.knowledgePoints,
  ...unit.questions,
  ...unit.maps
]);

function getUnitItems(unit: UnitData) {
  return [...unit.knowledgePoints, ...unit.questions, ...unit.maps] as UnitItem[];
}

function normalizeCard(item: UnitItem) {
  return item.type === "map" ? createMapReviewCard(item) : createReviewCard(item);
}

function createSeedProgress() {
  return allReviewItems.reduce<Record<string, ReviewProgress>>((result, item) => {
    result[item.id] = {
      mastery: 0,
      correctCount: 0,
      wrongCount: 0,
      blurCount: 0,
      inMistakeBook: false
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

function masteryRateFor(itemIds: string[], progressMap: Record<string, ReviewProgress>) {
  if (!itemIds.length) {
    return 0;
  }

  const total = itemIds.reduce(
    (sum, itemId) => sum + (progressMap[itemId]?.mastery ?? 0),
    0
  );

  return Math.round((total / (itemIds.length * 5)) * 100);
}

function createUnitSummaries(progressMap: Record<string, ReviewProgress>) {
  return unitCatalog.map<UnitSummary>((unit) => {
    const data = getUnitContent(unit.unitId);
    const knowledge = data?.knowledgePoints ?? [];
    const questions = data?.questions ?? [];
    const maps = data?.maps ?? [];
    const itemIds = data ? getUnitItems(data).map((item) => item.id) : [];
    const dueCount = itemIds.filter((itemId) => isDue(progressMap[itemId])).length;

    return {
      ...unit,
      knowledgeCount: knowledge.length,
      questionCount: questions.length,
      mapCount: maps.length,
      masteryRate: masteryRateFor(itemIds, progressMap),
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
  const dueKnowledge = allReviewItems.filter((item) => isDue(progressMap[item.id])).length;

  return {
    totalKnowledge,
    totalQuestions: allQuestions.length,
    masteredKnowledge,
    dueKnowledge,
    masteryRate: totalKnowledge
      ? Math.round((masteredKnowledge / totalKnowledge) * 100)
      : 0,
    mapMasteryRate: masteryRateFor(
      allMapChallenges.map((item) => item.id),
      progressMap
    ),
    streakDays: dashboard.streakDays,
    todayMinutes: dashboard.todayMinutes,
    totalMinutes: dashboard.totalStudyMinutes,
    readyUnits: units.filter((unit) => unit.ready).length,
    totalUnits: units.length
  };
}

function createWrongItems(progressMap: Record<string, ReviewProgress>) {
  return allReviewItems
    .filter((item) => isMistakeActive(progressMap[item.id]))
    .sort(
      (left, right) =>
        (progressMap[right.id]?.wrongCount ?? 0) - (progressMap[left.id]?.wrongCount ?? 0)
    )
    .map<WrongItem>((item) => ({
      ...normalizeCard(item),
      progress:
        progressMap[item.id] ??
        {
          mastery: 0,
          correctCount: 0,
          wrongCount: 0,
          blurCount: 0,
          inMistakeBook: false
        }
    }));
}

function getUnitWrongItems(unitId: string, wrongItems: WrongItem[]) {
  const data = getUnitContent(unitId);

  if (!data) {
    return [];
  }

  const itemIds = new Set(getUnitItems(data).map((item) => item.id));
  return wrongItems.filter((item) => itemIds.has(item.itemId));
}

function getStageProgress(
  data: UnitData | undefined,
  stageId: string,
  progressMap: Record<string, ReviewProgress>
) {
  const stage = data?.stages.find((item) => item.id === stageId);

  if (!data || !stage) {
    return 0;
  }

  return masteryRateFor(stage.itemIds, progressMap);
}

export interface StudyEngine {
  units: UnitSummary[];
  featuredUnit: UnitSummary;
  progressMap: Record<string, ReviewProgress>;
  stats: StudyStats;
  recentHistory: ReturnType<typeof createRecentHistory>;
  reviewDeck: ReviewCard[];
  wrongItems: WrongItem[];
  reviewKnowledge: (
    card: ReviewCard,
    rating: SelfRating,
    meta?: {
      answeredCorrectly?: boolean;
      source?: ReviewSource;
    }
  ) => void;
  clearProgress: () => void;
  getUnit: (unitId: string) => UnitSummary | undefined;
  getUnitData: (unitId: string) => UnitData | undefined;
  getUnitStages: (unitId: string) => ChallengeStage[];
  getUnitReviewDeck: (unitId: string, targetSize?: number) => ReviewCard[];
  getUnitMapDeck: (unitId: string, targetSize?: number) => ReviewCard[];
  getUnitChallengeDeck: (unitId: string, stageId: string, targetSize?: number) => ReviewCard[];
  getUnitWrongItems: (unitId: string) => WrongItem[];
  getStageMastery: (unitId: string, stageId: string) => number;
  setFeaturedUnit: (unitId: string) => void;
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
  const [featuredUnitId, setFeaturedUnitId] = useLocalStorage(
    STORAGE_KEYS.featuredUnit,
    DEFAULT_UNIT_ID
  );

  const normalizedDashboard = ensureToday(dashboard);
  const units = createUnitSummaries(progressMap);
  const featuredUnit =
    units.find((unit) => unit.unitId === featuredUnitId) ??
    units.find((unit) => unit.unitId === DEFAULT_UNIT_ID) ??
    units.find((unit) => unit.ready) ??
    units[0];

  if (!featuredUnit) {
    throw new Error("At least one unit must be configured.");
  }

  const reviewDeck = buildReviewDeck(
    allKnowledgeBase,
    allQuestions,
    allMapChallenges,
    progressMap,
    recentHistory,
    18
  );
  const stats = createStats(progressMap, normalizedDashboard, units);
  const wrongItems = createWrongItems(progressMap);

  const reviewKnowledge = (
    card: ReviewCard,
    rating: SelfRating,
    meta?: {
      answeredCorrectly?: boolean;
      source?: ReviewSource;
    }
  ) => {
    startTransition(() => {
      setProgressMap((currentMap) => ({
        ...currentMap,
        [card.itemId]: applyReviewResult(currentMap[card.itemId], rating, meta)
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
    progressMap,
    recentHistory,
    stats,
    reviewDeck,
    wrongItems,
    reviewKnowledge,
    clearProgress,
    getUnit: (unitId) => units.find((unit) => unit.unitId === unitId),
    getUnitData: (unitId) => getUnitContent(unitId),
    getUnitStages: (unitId) => getUnitContent(unitId)?.stages ?? [],
    getUnitReviewDeck: (unitId, targetSize = 18) => {
      const data = getUnitContent(unitId);

      if (!data) {
        return [];
      }

      return buildReviewDeck(
        data.knowledgePoints,
        data.questions,
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
    getUnitChallengeDeck: (unitId, stageId, targetSize = 12) => {
      const data = getUnitContent(unitId);
      const stage = data?.stages.find((item) => item.id === stageId);

      if (!data || !stage) {
        return [];
      }

      const itemLookup = new Map(getUnitItems(data).map((item) => [item.id, item]));
      const stageItems = stage.itemIds
        .map((itemId) => itemLookup.get(itemId))
        .filter((item): item is UnitItem => Boolean(item));

      return buildFocusedDeck(stageItems, progressMap, recentHistory, targetSize);
    },
    getUnitWrongItems: (unitId) => getUnitWrongItems(unitId, wrongItems),
    getStageMastery: (unitId, stageId) =>
      getStageProgress(getUnitContent(unitId), stageId, progressMap),
    setFeaturedUnit: (unitId) => {
      if (featuredUnitId === unitId || !units.some((unit) => unit.unitId === unitId)) {
        return;
      }

      startTransition(() => {
        setFeaturedUnitId(unitId);
      });
    }
  };
}
