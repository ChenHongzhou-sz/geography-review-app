import type {
  MapChallenge,
  RecentHistoryState,
  ReviewCard,
  ReviewProgress,
  SelfRating,
  UnitItem,
  UnitQuestion
} from "../types";

export const REVIEW_INTERVALS = [0, 1, 3, 7, 15, 30] as const;
export const QUESTION_PATTERN: ReviewCard["questionType"][] = [
  "flashcard",
  "choice",
  "map",
  "choice",
  "judge",
  "flashcard",
  "analysis",
  "map",
  "choice",
  "match",
  "flashcard",
  "map"
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const REVIEW_HISTORY_WINDOW = 28;
const MAP_HISTORY_WINDOW = 14;
const HISTORY_LIMIT = 160;
const NON_MAP_TYPES: Array<Exclude<ReviewCard["questionType"], "map">> = [
  "flashcard",
  "choice",
  "judge",
  "analysis",
  "match"
];

export function clampMastery(value: number) {
  return Math.min(5, Math.max(0, value));
}

export function isDue(progress?: ReviewProgress, now = new Date()) {
  if (!progress?.nextReviewAt) {
    return true;
  }

  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
}

export function createRecentHistory(): RecentHistoryState {
  return {
    entries: []
  };
}

export function masteryLabel(mastery: number) {
  return ["不会", "模糊", "一般", "熟练", "非常熟练", "完全掌握"][clampMastery(mastery)];
}

export function applyReviewResult(
  current: ReviewProgress | undefined,
  rating: SelfRating,
  now = new Date()
): ReviewProgress {
  const base: ReviewProgress = current ?? {
    mastery: 1,
    correctCount: 0,
    wrongCount: 0,
    blurCount: 0
  };

  const masteryDelta = rating === "again" ? -1 : rating === "good" ? 1 : 0;
  const mastery = clampMastery(base.mastery + masteryDelta);
  const intervalDays =
    rating === "hard" ? Math.max(1, REVIEW_INTERVALS[mastery] - 1) : REVIEW_INTERVALS[mastery];

  return {
    mastery,
    correctCount: base.correctCount + (rating === "good" ? 1 : 0),
    wrongCount: base.wrongCount + (rating === "again" ? 1 : 0),
    blurCount: base.blurCount + (rating === "hard" ? 1 : 0),
    lastRating: rating,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: new Date(now.getTime() + intervalDays * MS_PER_DAY).toISOString()
  };
}

export function recordRecentCard(
  history: RecentHistoryState,
  card: ReviewCard,
  now = new Date()
): RecentHistoryState {
  const nextEntry = {
    cardId: card.id,
    itemId: card.itemId,
    questionType: card.questionType,
    assetPath: card.assetPath,
    recordedAt: now.toISOString()
  };

  return {
    entries: [
      nextEntry,
      ...history.entries.filter((entry) => entry.cardId !== card.id)
    ].slice(0, HISTORY_LIMIT)
  };
}

function hashText(text: string) {
  return Array.from(text).reduce((total, char) => total + char.charCodeAt(0), 0);
}

function importanceScore(value: UnitItem["importance"]) {
  return value === "high" ? 0 : value === "medium" ? 1 : 2;
}

function recentEntriesByType(history: RecentHistoryState, type: "review" | "map") {
  return history.entries
    .filter((entry) => (type === "map" ? entry.questionType === "map" : entry.questionType !== "map"))
    .slice(0, type === "map" ? MAP_HISTORY_WINDOW : REVIEW_HISTORY_WINDOW);
}

function sectionBalancedPool(items: UnitItem[], targetSize: number) {
  const candidateLimit = Math.max(targetSize * 2, targetSize);
  const candidates = items.slice(0, candidateLimit);
  const sectionBuckets = new Map<string, UnitItem[]>();
  const sectionOrder: string[] = [];

  for (const item of candidates) {
    if (!sectionBuckets.has(item.section)) {
      sectionBuckets.set(item.section, []);
      sectionOrder.push(item.section);
    }

    sectionBuckets.get(item.section)?.push(item);
  }

  const pool: UnitItem[] = [];
  const selectedIds = new Set<string>();
  let cursor = 0;

  while (pool.length < targetSize) {
    const availableSections = sectionOrder.filter(
      (section) => (sectionBuckets.get(section)?.length ?? 0) > 0
    );

    if (!availableSections.length) {
      break;
    }

    const preferredSection = availableSections[cursor % availableSections.length];
    const previousSection = pool[pool.length - 1]?.section;
    const nextSection =
      availableSections.find((section) => section !== previousSection) ?? preferredSection;
    const bucket = sectionBuckets.get(nextSection);
    const nextItem = bucket?.shift();

    if (!nextItem || selectedIds.has(nextItem.id)) {
      cursor += 1;
      continue;
    }

    selectedIds.add(nextItem.id);
    pool.push(nextItem);
    cursor += 1;
  }

  if (pool.length < targetSize) {
    for (const item of items) {
      if (selectedIds.has(item.id)) {
        continue;
      }

      pool.push(item);
      selectedIds.add(item.id);

      if (pool.length >= targetSize) {
        break;
      }
    }
  }

  return pool;
}

function rankItems(
  items: UnitItem[],
  progressMap: Record<string, ReviewProgress>,
  history: RecentHistoryState,
  mode: "review" | "map"
) {
  const recentHistory = recentEntriesByType(history, mode);
  const recentItemIds = new Set(recentHistory.map((entry) => entry.itemId));
  const freshnessSeed = recentHistory.length + history.entries.length;

  return [...items].sort((left, right) => {
    const leftProgress = progressMap[left.id];
    const rightProgress = progressMap[right.id];
    const leftDue = isDue(leftProgress) ? 0 : 1;
    const rightDue = isDue(rightProgress) ? 0 : 1;

    if (leftDue !== rightDue) {
      return leftDue - rightDue;
    }

    const leftRecent = recentItemIds.has(left.id) ? 1 : 0;
    const rightRecent = recentItemIds.has(right.id) ? 1 : 0;

    if (leftRecent !== rightRecent) {
      return leftRecent - rightRecent;
    }

    const leftMastery = leftProgress?.mastery ?? 0;
    const rightMastery = rightProgress?.mastery ?? 0;

    if (leftMastery !== rightMastery) {
      return leftMastery - rightMastery;
    }

    const leftMistakes = (leftProgress?.wrongCount ?? 0) + (leftProgress?.blurCount ?? 0);
    const rightMistakes = (rightProgress?.wrongCount ?? 0) + (rightProgress?.blurCount ?? 0);

    if (leftMistakes !== rightMistakes) {
      return rightMistakes - leftMistakes;
    }

    const leftImportance = importanceScore(left.importance);
    const rightImportance = importanceScore(right.importance);

    if (leftImportance !== rightImportance) {
      return leftImportance - rightImportance;
    }

    return hashText(`${left.id}-${freshnessSeed}`) - hashText(`${right.id}-${freshnessSeed}`);
  });
}

function questionTypeOrder(
  preferredType: Exclude<ReviewCard["questionType"], "map">
) {
  return [preferredType, ...NON_MAP_TYPES.filter((type) => type !== preferredType)];
}

export function createReviewCard(item: Exclude<UnitItem, MapChallenge>): ReviewCard {
  if (item.type === "judge") {
    return {
      id: `${item.id}-card`,
      itemId: item.id,
      questionType: item.type,
      bookLabel: item.bookLabel,
      chapter: item.chapter,
      section: item.section,
      knowledgePoint: item.knowledgePoint,
      prompt: item.statement,
      answer: item.answer,
      explanation: item.explanation,
      options: item.options,
      correctOption: item.correctOption,
      assetPath: item.assetPath,
      sourceLabel: item.source.label,
      sourceFile: item.source.file,
      sourceSlide: item.source.slide,
      sourceNote: item.source.note
    };
  }

  if (item.type === "match") {
    return {
      id: `${item.id}-card`,
      itemId: item.id,
      questionType: item.type,
      bookLabel: item.bookLabel,
      chapter: item.chapter,
      section: item.section,
      knowledgePoint: item.knowledgePoint,
      prompt: item.prompt,
      answer: item.answer,
      explanation: item.explanation,
      pairs: item.pairs,
      sourceLabel: item.source.label,
      sourceFile: item.source.file,
      sourceSlide: item.source.slide,
      sourceNote: item.source.note
    };
  }

  if (item.type === "choice" || item.type === "analysis") {
    return {
      id: `${item.id}-card`,
      itemId: item.id,
      questionType: item.type,
      bookLabel: item.bookLabel,
      chapter: item.chapter,
      section: item.section,
      knowledgePoint: item.knowledgePoint,
      prompt: item.prompt,
      answer: item.answer,
      explanation: item.explanation,
      options: item.options,
      correctOption: item.correctOption,
      assetPath: item.assetPath,
      sourceLabel: item.source.label,
      sourceFile: item.source.file,
      sourceSlide: item.source.slide,
      sourceNote: item.source.note
    };
  }

  return {
    id: `${item.id}-card`,
    itemId: item.id,
    questionType: item.type,
    bookLabel: item.bookLabel,
    chapter: item.chapter,
    section: item.section,
    knowledgePoint: item.knowledgePoint,
    prompt: item.prompt,
    answer: item.answer,
    explanation: item.explanation,
    sourceLabel: item.source.label,
    sourceFile: item.source.file,
    sourceSlide: item.source.slide,
    sourceNote: item.source.note
  };
}

export function createMapReviewCard(challenge: MapChallenge): ReviewCard {
  return {
    id: `${challenge.id}-card`,
    itemId: challenge.id,
    questionType: "map",
    bookLabel: challenge.bookLabel,
    chapter: challenge.chapter,
    section: challenge.section,
    knowledgePoint: challenge.knowledgePoint,
    prompt: challenge.prompt,
    answer: challenge.answer,
    explanation: challenge.explanation,
    options: challenge.options,
    correctOption: challenge.correctOption,
    assetPath: challenge.assetPath,
    sourceLabel: challenge.source.label,
    sourceFile: challenge.source.file,
    sourceSlide: challenge.source.slide,
    sourceNote: challenge.source.note,
    extractionNote: challenge.extractionNote
  };
}

function selectMapChallenges(
  mapChallenges: MapChallenge[],
  progressMap: Record<string, ReviewProgress>,
  history: RecentHistoryState,
  targetSize: number
) {
  const recentMapHistory = recentEntriesByType(history, "map");
  const recentItemIds = new Set(recentMapHistory.map((entry) => entry.itemId));
  const recentAssets = new Set(
    recentMapHistory.map((entry) => entry.assetPath).filter(Boolean)
  );
  const freshnessSeed = recentMapHistory.length + history.entries.length;

  const ranked = [...mapChallenges].sort((left, right) => {
    const leftDue = isDue(progressMap[left.id]) ? 0 : 1;
    const rightDue = isDue(progressMap[right.id]) ? 0 : 1;

    if (leftDue !== rightDue) {
      return leftDue - rightDue;
    }

    const leftRecent = recentItemIds.has(left.id) ? 1 : 0;
    const rightRecent = recentItemIds.has(right.id) ? 1 : 0;

    if (leftRecent !== rightRecent) {
      return leftRecent - rightRecent;
    }

    const leftMastery = progressMap[left.id]?.mastery ?? 0;
    const rightMastery = progressMap[right.id]?.mastery ?? 0;

    if (leftMastery !== rightMastery) {
      return leftMastery - rightMastery;
    }

    return hashText(`${left.id}-${freshnessSeed}`) - hashText(`${right.id}-${freshnessSeed}`);
  });

  const selected: MapChallenge[] = [];
  const usedAssets = new Set<string>();

  for (const challenge of ranked) {
    const assetKey = challenge.assetPath ?? challenge.id;
    const assetRecentlyUsed = recentAssets.has(challenge.assetPath);
    const previousSection = selected[selected.length - 1]?.section;

    if (usedAssets.has(assetKey) || assetRecentlyUsed || previousSection === challenge.section) {
      continue;
    }

    usedAssets.add(assetKey);
    selected.push(challenge);

    if (selected.length >= targetSize) {
      return selected;
    }
  }

  for (const challenge of ranked) {
    if (selected.some((entry) => entry.id === challenge.id)) {
      continue;
    }

    const assetKey = challenge.assetPath ?? challenge.id;
    if (usedAssets.has(assetKey)) {
      continue;
    }

    usedAssets.add(assetKey);
    selected.push(challenge);

    if (selected.length >= targetSize) {
      return selected;
    }
  }

  return selected;
}

export function buildMapDeck(
  mapChallenges: MapChallenge[],
  progressMap: Record<string, ReviewProgress>,
  history: RecentHistoryState,
  targetSize = 12
) {
  return selectMapChallenges(mapChallenges, progressMap, history, targetSize).map(
    createMapReviewCard
  );
}

export function buildReviewDeck(
  knowledgePoints: Exclude<UnitItem, MapChallenge>[],
  questions: UnitQuestion[],
  maps: MapChallenge[],
  progressMap: Record<string, ReviewProgress>,
  history: RecentHistoryState,
  targetSize = 20
) {
  const reviewItems = [...knowledgePoints, ...questions];
  const rankedReviewItems = rankItems(reviewItems, progressMap, history, "review");
  const nonMapSlots = QUESTION_PATTERN.slice(0, targetSize).filter((type) => type !== "map").length;
  const mapSlots = QUESTION_PATTERN.slice(0, targetSize).filter((type) => type === "map").length;
  const reviewPool = sectionBalancedPool(
    rankedReviewItems,
    Math.max(nonMapSlots * 2, nonMapSlots)
  );
  const mapPool = selectMapChallenges(maps, progressMap, history, Math.max(mapSlots, 1));
  const buckets = new Map<Exclude<ReviewCard["questionType"], "map">, UnitItem[]>();
  const deck: ReviewCard[] = [];
  const usedIds = new Set<string>();
  let mapCursor = 0;

  for (const type of NON_MAP_TYPES) {
    buckets.set(
      type,
      reviewPool.filter((item) => item.type === type)
    );
  }

  const takeNextItem = (
    preferredType: Exclude<ReviewCard["questionType"], "map">
  ) => {
    for (const type of questionTypeOrder(preferredType)) {
      const bucket = buckets.get(type);

      while (bucket?.length) {
        const nextItem = bucket.shift();

        if (nextItem && !usedIds.has(nextItem.id)) {
          usedIds.add(nextItem.id);
          return nextItem;
        }
      }
    }

    const fallback = rankedReviewItems.find((item) => !usedIds.has(item.id));

    if (fallback) {
      usedIds.add(fallback.id);
    }

    return fallback;
  };

  for (let index = 0; index < targetSize; index += 1) {
    const questionType = QUESTION_PATTERN[index % QUESTION_PATTERN.length];

    if (questionType === "map" && mapCursor < mapPool.length) {
      deck.push(createMapReviewCard(mapPool[mapCursor]));
      usedIds.add(mapPool[mapCursor].id);
      mapCursor += 1;
      continue;
    }

    const nextItem = takeNextItem(questionType === "map" ? "choice" : questionType);

    if (!nextItem) {
      break;
    }

    deck.push(createReviewCard(nextItem));
  }

  return deck;
}

export function buildFocusedDeck(
  items: UnitItem[],
  progressMap: Record<string, ReviewProgress>,
  history: RecentHistoryState,
  targetSize = 12
) {
  return sectionBalancedPool(
    rankItems(items, progressMap, history, "review"),
    targetSize
  )
    .slice(0, targetSize)
    .map((item) => (item.type === "map" ? createMapReviewCard(item) : createReviewCard(item)));
}
