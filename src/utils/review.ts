import type {
  KnowledgeCard,
  MapChallenge,
  RecentHistoryState,
  ReviewCard,
  ReviewProgress,
  SelfRating
} from "../types";

export const REVIEW_INTERVALS = [0, 1, 3, 7, 15, 30] as const;
export const QUESTION_PATTERN: ReviewCard["questionType"][] = [
  "select",
  "flashcard",
  "map",
  "select",
  "judge",
  "select",
  "map",
  "fill",
  "flashcard",
  "map",
  "judge",
  "select"
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const REVIEW_HISTORY_WINDOW = 26;
const MAP_HISTORY_WINDOW = 14;
const HISTORY_LIMIT = 120;
const NON_MAP_TYPES: Array<Exclude<ReviewCard["questionType"], "map">> = [
  "select",
  "judge",
  "fill",
  "flashcard"
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
  const nextReviewAt = new Date(
    now.getTime() + intervalDays * MS_PER_DAY
  ).toISOString();

  return {
    mastery,
    correctCount: base.correctCount + (rating === "good" ? 1 : 0),
    wrongCount: base.wrongCount + (rating === "again" ? 1 : 0),
    blurCount: base.blurCount + (rating === "hard" ? 1 : 0),
    lastRating: rating,
    lastReviewedAt: now.toISOString(),
    nextReviewAt
  };
}

export function recordRecentCard(
  history: RecentHistoryState,
  card: ReviewCard,
  now = new Date()
): RecentHistoryState {
  const nextEntry = {
    cardId: card.id,
    knowledgeId: card.knowledgeId,
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

function importanceScore(value: KnowledgeCard["importance"]) {
  return value === "high" ? 0 : value === "medium" ? 1 : 2;
}

function averageMastery(
  knowledgeIds: string[],
  progressMap: Record<string, ReviewProgress>
) {
  const total = knowledgeIds.reduce(
    (sum, knowledgeId) => sum + (progressMap[knowledgeId]?.mastery ?? 0),
    0
  );

  return total / Math.max(knowledgeIds.length, 1);
}

function recentEntriesByType(
  history: RecentHistoryState,
  type: "review" | "map"
) {
  return history.entries
    .filter((entry) => (type === "map" ? entry.questionType === "map" : entry.questionType !== "map"))
    .slice(0, type === "map" ? MAP_HISTORY_WINDOW : REVIEW_HISTORY_WINDOW);
}

function reviewCardId(
  itemId: string,
  type: Exclude<ReviewCard["questionType"], "map">
) {
  return `${itemId}-${type}`;
}

function questionTypeOrder(
  preferredType: Exclude<ReviewCard["questionType"], "map">
) {
  return [preferredType, ...NON_MAP_TYPES.filter((type) => type !== preferredType)];
}

function buildDiverseKnowledgePool(
  rankedKnowledge: KnowledgeCard[],
  targetSize: number
) {
  const candidateLimit = Math.max(targetSize * 2, targetSize);
  const candidates = rankedKnowledge.slice(0, candidateLimit);
  const chapterBuckets = new Map<string, KnowledgeCard[]>();
  const chapterOrder: string[] = [];

  for (const item of candidates) {
    if (!chapterBuckets.has(item.chapter)) {
      chapterBuckets.set(item.chapter, []);
      chapterOrder.push(item.chapter);
    }

    chapterBuckets.get(item.chapter)?.push(item);
  }

  const pool: KnowledgeCard[] = [];
  const selectedIds = new Set<string>();
  let cursor = 0;

  while (pool.length < targetSize) {
    const availableChapters = chapterOrder.filter(
      (chapter) => (chapterBuckets.get(chapter)?.length ?? 0) > 0
    );

    if (!availableChapters.length) {
      break;
    }

    const preferredChapter = availableChapters[cursor % availableChapters.length];
    const previousChapter =
      pool.length > 0 ? pool[pool.length - 1]?.chapter : undefined;
    const chapterToUse =
      availableChapters.find((chapter) => chapter !== previousChapter) ?? preferredChapter;
    const bucket = chapterBuckets.get(chapterToUse);

    if (!bucket?.length) {
      cursor += 1;
      continue;
    }

    const nextItem = bucket.shift();

    if (!nextItem || selectedIds.has(nextItem.id)) {
      cursor += 1;
      continue;
    }

    pool.push(nextItem);
    selectedIds.add(nextItem.id);
    cursor += 1;
  }

  if (pool.length < targetSize) {
    for (const item of rankedKnowledge) {
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

function rankedDistractors(item: KnowledgeCard, knowledgeBase: KnowledgeCard[]) {
  const sameBook = knowledgeBase.filter(
    (candidate) => candidate.id !== item.id && candidate.book === item.book
  );

  return [...sameBook, ...knowledgeBase.filter((candidate) => candidate.id !== item.id)]
    .filter((candidate, index, array) =>
      array.findIndex((entry) => entry.answer === candidate.answer) === index
    )
    .sort((left, right) => hashText(left.id) - hashText(right.id));
}

function createOptions(item: KnowledgeCard, knowledgeBase: KnowledgeCard[]) {
  const distractors = rankedDistractors(item, knowledgeBase)
    .slice(0, 3)
    .map((candidate) => candidate.answer);
  const options = [item.answer, ...distractors];

  return options.sort((left, right) => hashText(item.id + left) - hashText(item.id + right));
}

export function createReviewCard(
  item: KnowledgeCard,
  type: ReviewCard["questionType"],
  knowledgeBase: KnowledgeCard[]
): ReviewCard {
  if (type === "flashcard") {
    return {
      id: `${item.id}-flashcard`,
      knowledgeId: item.id,
      questionType: type,
      book: item.book,
      chapter: item.chapter,
      section: item.section,
      prompt: item.question,
      answer: item.answer,
      explanation: item.explanation,
      sourceLabel: item.source.label,
      sourcePage: item.source.page
    };
  }

  if (type === "fill") {
    return {
      id: `${item.id}-fill`,
      knowledgeId: item.id,
      questionType: type,
      book: item.book,
      chapter: item.chapter,
      section: item.section,
      prompt: `填空：${item.knowledgePoint}`,
      answer: item.answer,
      explanation: item.explanation,
      sourceLabel: item.source.label,
      sourcePage: item.source.page
    };
  }

  if (type === "judge") {
    const distractor = rankedDistractors(item, knowledgeBase)[0];
    const statementIsTrue = hashText(item.id) % 2 === 0 || !distractor;
    const statementAnswer = statementIsTrue ? item.answer : distractor.answer;

    return {
      id: `${item.id}-judge`,
      knowledgeId: item.id,
      questionType: type,
      book: item.book,
      chapter: item.chapter,
      section: item.section,
      prompt: `判断正误：${item.knowledgePoint}是“${statementAnswer}”。`,
      answer: statementIsTrue ? "正确" : "错误",
      explanation: `正确表述：${item.answer}。${item.explanation}`,
      options: ["正确", "错误"],
      correctOption: statementIsTrue ? "正确" : "错误",
      sourceLabel: item.source.label,
      sourcePage: item.source.page
    };
  }

  return {
    id: `${item.id}-select`,
    knowledgeId: item.id,
    questionType: "select",
    book: item.book,
    chapter: item.chapter,
    section: item.section,
    prompt: item.question,
    answer: item.answer,
    explanation: item.explanation,
    options: createOptions(item, knowledgeBase),
    correctOption: item.answer,
    sourceLabel: item.source.label,
    sourcePage: item.source.page
  };
}

export function createMapReviewCard(challenge: MapChallenge): ReviewCard {
  return {
    id: `${challenge.id}-map`,
    knowledgeId: challenge.knowledgePointIds[0] ?? challenge.id,
    questionType: "map",
    book: challenge.book,
    chapter: challenge.chapter,
    section: challenge.section,
    prompt: challenge.prompt,
    answer: challenge.correctAnswer,
    explanation: challenge.explanation,
    options: challenge.options,
    correctOption: challenge.correctAnswer,
    assetPath: challenge.assetPath,
    sourceLabel: challenge.sourceLabel,
    sourcePage: challenge.sourcePage,
    extractionNote: challenge.extractionNote
  };
}

function rankKnowledge(
  knowledgeBase: KnowledgeCard[],
  progressMap: Record<string, ReviewProgress>,
  history: RecentHistoryState
) {
  const reviewHistory = recentEntriesByType(history, "review");
  const recentKnowledgeIds = new Set(reviewHistory.map((entry) => entry.knowledgeId));
  const freshnessSeed = reviewHistory.length + history.entries.length;

  return [...knowledgeBase].sort((left, right) => {
    const leftProgress = progressMap[left.id];
    const rightProgress = progressMap[right.id];
    const leftDue = isDue(leftProgress) ? 0 : 1;
    const rightDue = isDue(rightProgress) ? 0 : 1;

    if (leftDue !== rightDue) {
      return leftDue - rightDue;
    }

    const leftRecent = recentKnowledgeIds.has(left.id) ? 1 : 0;
    const rightRecent = recentKnowledgeIds.has(right.id) ? 1 : 0;

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

    return (
      hashText(`${left.id}-${freshnessSeed}`) - hashText(`${right.id}-${freshnessSeed}`)
    );
  });
}

function selectMapChallenges(
  mapChallenges: MapChallenge[],
  progressMap: Record<string, ReviewProgress>,
  history: RecentHistoryState,
  targetSize: number
) {
  const recentMapHistory = recentEntriesByType(history, "map");
  const recentMapIds = new Set(recentMapHistory.map((entry) => entry.cardId));
  const recentAssets = new Set(
    recentMapHistory.map((entry) => entry.assetPath).filter(Boolean)
  );
  const freshnessSeed = recentMapHistory.length + history.entries.length;

  const ranked = [...mapChallenges].sort((left, right) => {
    const leftDue = left.knowledgePointIds.some((knowledgeId) => isDue(progressMap[knowledgeId]))
      ? 0
      : 1;
    const rightDue = right.knowledgePointIds.some((knowledgeId) => isDue(progressMap[knowledgeId]))
      ? 0
      : 1;

    if (leftDue !== rightDue) {
      return leftDue - rightDue;
    }

    const leftRecent = recentMapIds.has(`${left.id}-map`) ? 1 : 0;
    const rightRecent = recentMapIds.has(`${right.id}-map`) ? 1 : 0;

    if (leftRecent !== rightRecent) {
      return leftRecent - rightRecent;
    }

    const leftMastery = averageMastery(left.knowledgePointIds, progressMap);
    const rightMastery = averageMastery(right.knowledgePointIds, progressMap);

    if (leftMastery !== rightMastery) {
      return leftMastery - rightMastery;
    }

    return (
      hashText(`${left.id}-${freshnessSeed}`) - hashText(`${right.id}-${freshnessSeed}`)
    );
  });

  const selected: MapChallenge[] = [];
  const usedAssets = new Set<string>();

  for (const challenge of ranked) {
    const assetKey = challenge.assetPath ?? challenge.id;
    const assetRecentlyUsed = challenge.assetPath ? recentAssets.has(challenge.assetPath) : false;
    const previousChallenge =
      selected.length > 0 ? selected[selected.length - 1] : undefined;

    if (
      usedAssets.has(assetKey) ||
      assetRecentlyUsed ||
      previousChallenge?.chapter === challenge.chapter
    ) {
      continue;
    }

    selected.push(challenge);
    usedAssets.add(assetKey);

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

    selected.push(challenge);
    usedAssets.add(assetKey);

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
  knowledgeBase: KnowledgeCard[],
  mapChallenges: MapChallenge[],
  progressMap: Record<string, ReviewProgress>,
  history: RecentHistoryState,
  targetSize = 20
) {
  if (!knowledgeBase.length) {
    return buildMapDeck(mapChallenges, progressMap, history, targetSize);
  }

  const rankedKnowledge = rankKnowledge(knowledgeBase, progressMap, history);
  const reviewHistory = recentEntriesByType(history, "review");
  const recentReviewCardIds = new Set(reviewHistory.map((entry) => entry.cardId));
  const nonMapSlots = QUESTION_PATTERN.slice(0, targetSize).filter(
    (type) => type !== "map"
  ).length;
  const mapSlots = QUESTION_PATTERN.slice(0, targetSize).filter((type) => type === "map").length;
  const reviewPool = buildDiverseKnowledgePool(
    rankedKnowledge,
    Math.max(nonMapSlots, 1)
  );
  const mapPool = selectMapChallenges(
    mapChallenges,
    progressMap,
    history,
    Math.max(mapSlots, 1)
  );
  const deck: ReviewCard[] = [];
  let knowledgeCursor = 0;
  let mapCursor = 0;

  for (let index = 0; index < targetSize; index += 1) {
    const questionType = QUESTION_PATTERN[index % QUESTION_PATTERN.length];

    if (questionType === "map" && mapCursor < mapPool.length) {
      deck.push(createMapReviewCard(mapPool[mapCursor]));
      mapCursor += 1;
      continue;
    }

    const item = reviewPool[knowledgeCursor % reviewPool.length];
    const preferredType = questionType === "map" ? "select" : questionType;
    const resolvedType =
      questionTypeOrder(preferredType).find(
        (type) => !recentReviewCardIds.has(reviewCardId(item.id, type))
      ) ?? preferredType;
    const nextCard = createReviewCard(item, resolvedType, knowledgeBase);

    deck.push(nextCard);
    recentReviewCardIds.add(nextCard.id);
    knowledgeCursor += 1;
  }

  return deck;
}
