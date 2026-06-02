const STORAGE_KEY = "geo-review-state-v1";
const REVIEW_INTERVALS = [1, 3, 7, 14];
const memoryStore = {};

const curriculum = window.GEOGRAPHY_CURRICULUM;
const mapTasksByLesson = window.GEOGRAPHY_MAP_TASKS || {};
const dom = {
  ring: document.querySelector("#overall-ring"),
  overallProgressValue: document.querySelector("#overall-progress-value"),
  masteredCount: document.querySelector("#mastered-count"),
  dueCount: document.querySelector("#due-count"),
  wrongCount: document.querySelector("#wrong-count"),
  lastStudyDate: document.querySelector("#last-study-date"),
  todayList: document.querySelector("#today-list"),
  catalogTree: document.querySelector("#catalog-tree"),
  lessonPanel: document.querySelector("#lesson-panel"),
  wrongbookPanel: document.querySelector("#wrongbook-panel"),
  reviewPanel: document.querySelector("#review-panel"),
  searchInput: document.querySelector("#search-input"),
  statusFilter: document.querySelector("#status-filter")
};

const flatLessons = [];
const lessonMap = new Map();
const chapterMap = new Map();
const volumeMap = new Map();

curriculum.volumes.forEach((volume, volumeIndex) => {
  volume.order = volumeIndex;
  volumeMap.set(volume.id, volume);

  volume.chapters.forEach((chapter, chapterIndex) => {
    chapter.order = chapterIndex;
    chapter.volumeId = volume.id;
    chapter.volumeTitle = volume.title;
    chapterMap.set(chapter.id, chapter);

    chapter.lessons.forEach((lesson, lessonIndex) => {
      const enrichedLesson = {
        ...lesson,
        mapTasks: mapTasksByLesson[lesson.id] || [],
        volumeId: volume.id,
        volumeTitle: volume.title,
        volumeSummary: volume.summary,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        chapterNumber: chapter.number,
        chapterImportance: chapter.importance,
        chapterSummary: chapter.summary,
        orderKey: `${volumeIndex}-${chapterIndex}-${lessonIndex}`
      };

      flatLessons.push(enrichedLesson);
      lessonMap.set(lesson.id, enrichedLesson);
    });
  });
});

const defaultState = {
  selectedLessonId: flatLessons[0]?.id ?? null,
  query: "",
  statusFilter: "all",
  lessons: {}
};

let state = loadState();
normalizeState();

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function readStorage(key) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (error) {
    console.warn("Persistent storage is unavailable, using memory store.", error);
  }

  return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
}

function writeStorage(key, value) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (error) {
    console.warn("Persistent storage is unavailable, using memory store.", error);
  }

  memoryStore[key] = value;
}

function loadState() {
  try {
    const raw = readStorage(STORAGE_KEY);
    if (!raw) {
      return cloneDefaultState();
    }
    return { ...cloneDefaultState(), ...JSON.parse(raw) };
  } catch (error) {
    console.warn("Failed to load saved progress.", error);
    return cloneDefaultState();
  }
}

function normalizeState() {
  if (!lessonMap.has(state.selectedLessonId)) {
    state.selectedLessonId = flatLessons[0]?.id ?? null;
  }
  state.query = typeof state.query === "string" ? state.query : "";
  state.statusFilter = state.statusFilter || "all";
  state.lessons = state.lessons && typeof state.lessons === "object" ? state.lessons : {};
  dom.searchInput.value = state.query;
  dom.statusFilter.value = state.statusFilter;
}

function saveState() {
  writeStorage(STORAGE_KEY, JSON.stringify(state));
}

function ensureLessonState(lessonId) {
  if (!state.lessons[lessonId]) {
    state.lessons[lessonId] = {
      cardsDone: false,
      writingText: "",
      writingDone: false,
      quiz: {},
      mapTasks: {},
      lastStudiedAt: null,
      masteredAt: null,
      nextReviewAt: null,
      reviewStep: -1,
      lastReviewAdvanceAt: null
    };
  }
  if (!state.lessons[lessonId].quiz) {
    state.lessons[lessonId].quiz = {};
  }
  if (!state.lessons[lessonId].mapTasks) {
    state.lessons[lessonId].mapTasks = {};
  }
  return state.lessons[lessonId];
}

function todayString() {
  return new Date().toLocaleDateString("en-CA");
}

function addDays(dateString, amount) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return date.toLocaleDateString("en-CA");
}

function formatDate(dateString) {
  if (!dateString) {
    return "未安排";
  }
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric"
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function shuffleOptions(question) {
  return [...question.options]
    .map((option, index) => ({
      option,
      key: hashString(`${question.id}-${option}-${index}`)
    }))
    .sort((left, right) => left.key - right.key)
    .map((entry) => entry.option);
}

function renderSvgLabels(labels, positions) {
  return labels
    .map((label, index) => {
      const [x, y] = positions[index % positions.length];
      return `<text x="${x}" y="${y}" class="svg-label">${escapeHTML(label)}</text>`;
    })
    .join("");
}

function renderMapVisual(task) {
  const visual = task.visual || {};
  const labels = visual.labels || [];
  const title = escapeHTML(visual.title || task.title);
  const labelPositions = [
    [54, 34],
    [208, 46],
    [120, 106],
    [274, 132],
    [82, 158],
    [220, 176]
  ];

  const labelMarkup = renderSvgLabels(labels, labelPositions);
  const caption = `<div class="map-caption">${title}</div>`;
  let svg = "";

  if (visual.type === "globe-grid") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-sea"/>
        <circle cx="160" cy="105" r="78" class="svg-land-soft"/>
        <ellipse cx="160" cy="105" rx="78" ry="26" class="svg-line"/>
        <ellipse cx="160" cy="105" rx="42" ry="78" class="svg-line"/>
        <line x1="82" y1="105" x2="238" y2="105" class="svg-accent-line"/>
        <line x1="160" y1="27" x2="160" y2="183" class="svg-accent-line"/>
        <circle cx="186" cy="82" r="7" class="svg-point"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "orbit") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-sky"/>
        <circle cx="82" cy="105" r="32" class="svg-sun"/>
        <ellipse cx="202" cy="105" rx="86" ry="58" class="svg-line"/>
        <circle cx="202" cy="51" r="20" class="svg-earth"/>
        <circle cx="262" cy="105" r="20" class="svg-earth"/>
        <circle cx="202" cy="159" r="20" class="svg-earth"/>
        <path d="M112 105h78" class="svg-accent-line"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "map-elements" || visual.type === "settlement-map") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-map-bg"/>
        <path d="M0 138 C70 92 112 176 196 124 S276 58 320 76" class="svg-river"/>
        <path d="M24 42 C96 66 155 68 292 42" class="svg-road"/>
        <rect x="126" y="84" width="48" height="34" rx="6" class="svg-building"/>
        <path d="M262 34 l10 22 h-20z" class="svg-point"/>
        <text x="272" y="70" class="svg-small-label">N</text>
        <line x1="34" y1="184" x2="106" y2="184" class="svg-accent-line"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "scale-compare") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-map-bg"/>
        <rect x="32" y="48" width="112" height="116" rx="12" class="svg-paper"/>
        <rect x="176" y="48" width="112" height="116" rx="12" class="svg-paper"/>
        <path d="M44 126 C76 92 104 150 132 80" class="svg-river"/>
        <path d="M188 128 C224 106 246 138 276 92" class="svg-river"/>
        <circle cx="74" cy="82" r="7" class="svg-point"/>
        <circle cx="100" cy="132" r="7" class="svg-point"/>
        <circle cx="236" cy="104" r="7" class="svg-point"/>
        ${renderSvgLabels(labels, [[74, 32], [220, 32]])}
      </svg>`;
  } else if (visual.type === "contour") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-map-bg"/>
        <ellipse cx="158" cy="104" rx="104" ry="70" class="svg-contour"/>
        <ellipse cx="158" cy="104" rx="76" ry="48" class="svg-contour"/>
        <ellipse cx="158" cy="104" rx="44" ry="26" class="svg-contour"/>
        <path d="M74 136 C112 116 124 96 150 70" class="svg-accent-line"/>
        <path d="M206 48 C228 86 232 132 206 172" class="svg-line"/>
        <circle cx="158" cy="104" r="6" class="svg-point"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "plate-boundary") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-sea"/>
        <path d="M16 40 h132 l-28 140 H16z" class="svg-plate"/>
        <path d="M304 40 H172 l28 140 h104z" class="svg-plate-alt"/>
        <path d="M132 105 h48" class="svg-accent-line"/>
        <path d="M180 105 h-48" class="svg-accent-line"/>
        <path d="M155 68 l18 44 h-36z" class="svg-volcano"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "weather-map") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-map-bg"/>
        <circle cx="82" cy="78" r="22" class="svg-sun"/>
        <path d="M174 78 c10-22 44-16 45 8 c22 0 26 34 2 38 h-70 c-24-5-18-42 8-40 c5-12 14-18 25-18z" class="svg-cloud"/>
        <path d="M164 132 l-10 22 M194 132 l-10 22" class="svg-rain"/>
        <path d="M246 90 C278 76 276 118 246 104" class="svg-accent-line"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "temperature-latitude" || visual.type === "mountain-temperature") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-chart-bg"/>
        <line x1="46" y1="166" x2="286" y2="166" class="svg-axis"/>
        <line x1="46" y1="166" x2="46" y2="36" class="svg-axis"/>
        <path d="M54 56 C108 72 154 94 200 124 S254 154 282 160" class="svg-temp-line"/>
        <path d="M58 156 L136 72 L212 156 Z" class="svg-mountain"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "precipitation-chart" || visual.type === "savanna-chart") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-chart-bg"/>
        <line x1="42" y1="166" x2="292" y2="166" class="svg-axis"/>
        <line x1="42" y1="166" x2="42" y2="36" class="svg-axis"/>
        ${[34, 42, 88, 132, 146, 118, 82, 44].map((height, index) => `<rect x="${62 + index * 28}" y="${166 - height}" width="16" height="${height}" class="svg-bar"/>`).join("")}
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "orographic-rain") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-sky"/>
        <path d="M42 166 L156 58 L278 166 Z" class="svg-mountain"/>
        <path d="M30 102 C72 78 96 88 128 102" class="svg-accent-line"/>
        <path d="M98 118 l-9 22 M124 118 l-9 22 M150 118 l-9 22" class="svg-rain"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "climate-chart") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-chart-bg"/>
        <line x1="42" y1="166" x2="292" y2="166" class="svg-axis"/>
        <line x1="42" y1="166" x2="42" y2="36" class="svg-axis"/>
        ${[24, 28, 54, 92, 138, 146, 112, 58].map((height, index) => `<rect x="${62 + index * 28}" y="${166 - height}" width="14" height="${height}" class="svg-bar"/>`).join("")}
        <path d="M64 82 C104 70 142 66 180 70 S244 84 286 76" class="svg-temp-line"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "climate-zones") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-chart-bg"/>
        <rect x="36" y="42" width="248" height="42" class="svg-hot"/>
        <rect x="36" y="84" width="248" height="48" class="svg-mild"/>
        <rect x="36" y="132" width="248" height="42" class="svg-cold"/>
        <line x1="160" y1="28" x2="160" y2="184" class="svg-line"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "population-map" || visual.type === "culture-map" || visual.type === "development-map") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-sea"/>
        <path d="M34 72 C82 34 142 52 132 104 C122 144 62 136 34 116z" class="svg-land"/>
        <path d="M176 62 C238 28 292 72 270 126 C252 174 196 156 178 126z" class="svg-land"/>
        ${[66, 82, 98, 210, 230, 248].map((x, index) => `<circle cx="${x}" cy="${index < 3 ? 92 + index * 18 : 76 + (index - 3) * 24}" r="5" class="svg-point"/>`).join("")}
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "house-climate") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-map-bg"/>
        <path d="M58 112 L94 76 L130 112 Z" class="svg-roof"/>
        <rect x="68" y="112" width="52" height="46" class="svg-building"/>
        <rect x="176" y="90" width="64" height="68" class="svg-building"/>
        <path d="M168 90 h80 l-14-28 h-54z" class="svg-roof"/>
        <line x1="190" y1="158" x2="190" y2="178" class="svg-line"/>
        <line x1="224" y1="158" x2="224" y2="178" class="svg-line"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "asia-relief" || visual.type === "asia-climate") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-sea"/>
        <path d="M82 52 C164 12 270 48 278 110 C288 164 204 184 118 162 C54 146 40 82 82 52z" class="svg-land"/>
        <circle cx="160" cy="104" r="28" class="svg-highland"/>
        <path d="M160 104 L78 70 M160 104 L260 76 M160 104 L242 158 M160 104 L94 154" class="svg-accent-line"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "monsoon-risk") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-chart-bg"/>
        <rect x="48" y="132" width="54" height="34" class="svg-dry"/>
        <rect x="136" y="96" width="54" height="70" class="svg-bar"/>
        <rect x="224" y="58" width="54" height="108" class="svg-wet"/>
        <line x1="42" y1="166" x2="292" y2="166" class="svg-axis"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "tourism-map") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-map-bg"/>
        <path d="M50 158 L100 74 L148 158 Z" class="svg-mountain"/>
        <rect x="180" y="84" width="72" height="70" rx="8" class="svg-building"/>
        <path d="M180 84 h72 l-36-34z" class="svg-roof"/>
        <path d="M32 174 C112 152 198 188 292 154" class="svg-river"/>
        ${labelMarkup}
      </svg>`;
  } else if (visual.type === "polar-map") {
    svg = `
      <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
        <rect width="320" height="210" rx="18" class="svg-polar-bg"/>
        <circle cx="100" cy="105" r="62" class="svg-ice"/>
        <circle cx="230" cy="105" r="62" class="svg-sea-circle"/>
        <path d="M68 100 C92 64 126 78 138 112 C116 148 78 138 68 100z" class="svg-land-soft"/>
        ${labelMarkup}
      </svg>`;
  } else {
    svg = renderRegionMapVisual(visual, labels, title);
  }

  return `<div class="map-visual">${caption}${svg}</div>`;
}

function renderRegionMapVisual(visual, labels, title) {
  const region = visual.region || "world";
  const labelMarkup = renderSvgLabels(labels, [
    [58, 42],
    [216, 42],
    [142, 94],
    [248, 126],
    [70, 158],
    [198, 172]
  ]);
  const regionClass = `svg-region-${region}`;

  return `
    <svg viewBox="0 0 320 210" role="img" aria-label="${title}">
      <rect width="320" height="210" rx="18" class="svg-sea"/>
      <path d="M58 66 C104 24 184 32 236 64 C292 100 256 168 178 174 C92 182 28 128 58 66z" class="svg-land ${regionClass}"/>
      <path d="M42 166 C108 130 174 188 288 132" class="svg-river"/>
      <path d="M52 120 C118 92 204 92 270 68" class="svg-road"/>
      <circle cx="218" cy="92" r="8" class="svg-point"/>
      ${labelMarkup}
    </svg>`;
}

function computeLessonMetrics(lessonId) {
  const lesson = lessonMap.get(lessonId);
  const lessonState = ensureLessonState(lessonId);
  const totalQuiz = lesson.quiz.length;
  const totalMapTasks = lesson.mapTasks.length;
  let checkedCount = 0;
  let correctCount = 0;
  let quizWrongCount = 0;
  let checkedMapCount = 0;
  let correctMapCount = 0;
  let mapWrongCount = 0;

  lesson.quiz.forEach((question) => {
    const saved = lessonState.quiz[question.id];
    if (!saved || typeof saved.correct !== "boolean") {
      return;
    }
    checkedCount += 1;
    if (saved.correct) {
      correctCount += 1;
    } else {
      quizWrongCount += 1;
    }
  });

  lesson.mapTasks.forEach((task) => {
    const saved = lessonState.mapTasks[task.id];
    if (!saved || typeof saved.correct !== "boolean") {
      return;
    }
    checkedMapCount += 1;
    if (saved.correct) {
      correctMapCount += 1;
    } else {
      mapWrongCount += 1;
    }
  });

  const started = Boolean(
    lessonState.cardsDone ||
    lessonState.writingDone ||
    lessonState.writingText.trim() ||
    checkedCount > 0 ||
    checkedMapCount > 0
  );
  const mastered = Boolean(
    lessonState.cardsDone &&
    lessonState.writingDone &&
    checkedCount === totalQuiz &&
    correctCount === totalQuiz &&
    checkedMapCount === totalMapTasks &&
    correctMapCount === totalMapTasks
  );
  const quizProgress = totalQuiz ? correctCount / totalQuiz : 1;
  const mapProgress = totalMapTasks ? correctMapCount / totalMapTasks : 1;
  const completion =
    (lessonState.cardsDone ? 0.2 : 0) +
    quizProgress * 0.3 +
    mapProgress * 0.3 +
    (lessonState.writingDone ? 0.2 : 0);
  const wrongCount = quizWrongCount + mapWrongCount;

  let status = "未学";
  if (mastered) {
    status = "已掌握";
  } else if (wrongCount > 0) {
    status = "易错";
  } else if (started) {
    status = "已练";
  }

  return {
    started,
    mastered,
    status,
    totalQuiz,
    checkedCount,
    correctCount,
    quizWrongCount,
    totalMapTasks,
    checkedMapCount,
    correctMapCount,
    mapWrongCount,
    wrongCount,
    writingDone: lessonState.writingDone,
    cardsDone: lessonState.cardsDone,
    completion: Math.min(1, completion)
  };
}

function updateReviewSchedule(lessonId) {
  const lessonState = ensureLessonState(lessonId);
  const metrics = computeLessonMetrics(lessonId);
  const today = todayString();

  if (!metrics.started) {
    lessonState.masteredAt = null;
    lessonState.nextReviewAt = null;
    lessonState.reviewStep = -1;
    lessonState.lastReviewAdvanceAt = null;
    return;
  }

  if (metrics.mastered) {
    if (!lessonState.masteredAt) {
      lessonState.masteredAt = today;
      lessonState.reviewStep = 0;
      lessonState.nextReviewAt = addDays(today, REVIEW_INTERVALS[0]);
      lessonState.lastReviewAdvanceAt = today;
      return;
    }

    if (lessonState.nextReviewAt && today >= lessonState.nextReviewAt && lessonState.lastReviewAdvanceAt !== today) {
      const nextIndex = Math.min((lessonState.reviewStep || 0) + 1, REVIEW_INTERVALS.length - 1);
      lessonState.reviewStep = nextIndex;
      lessonState.masteredAt = today;
      lessonState.nextReviewAt = addDays(today, REVIEW_INTERVALS[nextIndex]);
      lessonState.lastReviewAdvanceAt = today;
      return;
    }

    if (!lessonState.nextReviewAt) {
      const reviewIndex = lessonState.reviewStep >= 0 ? lessonState.reviewStep : 0;
      lessonState.nextReviewAt = addDays(today, REVIEW_INTERVALS[reviewIndex]);
    }

    return;
  }

  lessonState.masteredAt = null;
  lessonState.reviewStep = -1;
  lessonState.nextReviewAt = today;
  lessonState.lastReviewAdvanceAt = null;
}

function touchLesson(lessonId) {
  const lessonState = ensureLessonState(lessonId);
  lessonState.lastStudiedAt = todayString();
  updateReviewSchedule(lessonId);
}

function getOverallMetrics() {
  const lessonMetrics = flatLessons.map((lesson) => ({
    lesson,
    state: ensureLessonState(lesson.id),
    metrics: computeLessonMetrics(lesson.id)
  }));

  const masteredCount = lessonMetrics.filter((item) => item.metrics.mastered).length;
  const wrongCount = lessonMetrics.reduce((sum, item) => sum + item.metrics.wrongCount, 0);
  const overallCompletion =
    lessonMetrics.reduce((sum, item) => sum + item.metrics.completion, 0) / (lessonMetrics.length || 1);

  const lastStudyDate = lessonMetrics
    .map((item) => item.state.lastStudiedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    lessonMetrics,
    totalLessons: lessonMetrics.length,
    masteredCount,
    wrongCount,
    overallCompletion,
    lastStudyDate
  };
}

function getChapterMetrics(chapterId) {
  const chapter = chapterMap.get(chapterId);
  const lessonEntries = chapter.lessons.map((lesson) => computeLessonMetrics(lesson.id));
  const masteredCount = lessonEntries.filter((item) => item.mastered).length;
  const completion =
    lessonEntries.reduce((sum, item) => sum + item.completion, 0) / (lessonEntries.length || 1);

  return {
    totalLessons: chapter.lessons.length,
    masteredCount,
    completion
  };
}

function getDueLessons() {
  const today = todayString();
  const due = [];
  const untouched = [];

  flatLessons.forEach((lesson) => {
    const metrics = computeLessonMetrics(lesson.id);
    const lessonState = ensureLessonState(lesson.id);

    if (metrics.status === "易错") {
      due.push({ lesson, reason: "优先回看错题", priority: 0 });
      return;
    }

    if (metrics.mastered && lessonState.nextReviewAt && lessonState.nextReviewAt <= today) {
      due.push({ lesson, reason: `到期回炉：${formatDate(lessonState.nextReviewAt)}`, priority: 1 });
      return;
    }

    if (metrics.started && !metrics.mastered) {
      due.push({ lesson, reason: "继续补完本课训练", priority: 2 });
      return;
    }

    if (!metrics.started) {
      untouched.push({ lesson, reason: "可以开始新课", priority: 3 });
    }
  });

  due.sort((left, right) => left.priority - right.priority || left.lesson.orderKey.localeCompare(right.lesson.orderKey));
  untouched.sort((left, right) => left.lesson.orderKey.localeCompare(right.lesson.orderKey));

  return [...due, ...untouched].slice(0, 6);
}

function getWrongbookEntries() {
  const entries = [];

  flatLessons.forEach((lesson) => {
    const lessonState = ensureLessonState(lesson.id);
    lesson.quiz.forEach((question) => {
      const saved = lessonState.quiz[question.id];
      if (!saved || saved.correct !== false) {
        return;
      }
      entries.push({
        lesson,
        type: "基础题",
        prompt: question.prompt,
        explanation: question.explanation
      });
    });

    lesson.mapTasks.forEach((task) => {
      const saved = lessonState.mapTasks[task.id];
      if (!saved || saved.correct !== false) {
        return;
      }
      entries.push({
        lesson,
        type: "读图题",
        prompt: task.prompt,
        explanation: task.explanation
      });
    });
  });

  return entries;
}

function lessonMatchesFilters(lesson) {
  const metrics = computeLessonMetrics(lesson.id);
  const query = state.query.trim().toLowerCase();

  if (state.statusFilter !== "all" && metrics.status !== state.statusFilter) {
    return false;
  }

  if (!query) {
    return true;
  }

  const haystack = [
    lesson.title,
    lesson.chapterTitle,
    lesson.chapterNumber,
    lesson.focus,
    lesson.keywords.join(" "),
    lesson.mapTasks.map((task) => `${task.title} ${task.skill}`).join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function getSelectedLesson() {
  return lessonMap.get(state.selectedLessonId) || flatLessons[0];
}

function renderStats() {
  const overall = getOverallMetrics();
  const percent = Math.round(overall.overallCompletion * 100);
  const dueLessons = getDueLessons();

  dom.ring.style.setProperty("--progress", `${percent * 3.6}deg`);
  dom.overallProgressValue.textContent = `${percent}%`;
  dom.masteredCount.textContent = `${overall.masteredCount} / ${overall.totalLessons}`;
  dom.dueCount.textContent = String(dueLessons.length);
  dom.wrongCount.textContent = String(overall.wrongCount);
  dom.lastStudyDate.textContent = overall.lastStudyDate ? formatDate(overall.lastStudyDate) : "还没开始";
}

function renderTodayPanel() {
  const selectedLesson = getSelectedLesson();
  const dueLessons = getDueLessons();

  if (!dueLessons.length) {
    dom.todayList.innerHTML = '<div class="empty-state">目前没有待复习内容，可以从目录里挑一课开始。</div>';
    return;
  }

  dom.todayList.innerHTML = dueLessons
    .map(({ lesson, reason }) => {
      const metrics = computeLessonMetrics(lesson.id);
      return `
        <button class="today-button ${lesson.id === selectedLesson.id ? "is-active" : ""}" data-action="open-lesson" data-lesson-id="${lesson.id}">
          <div class="today-topline">
            <span class="count-badge">${escapeHTML(lesson.chapterNumber)}</span>
            <span class="status-badge" data-status="${metrics.status}">${metrics.status}</span>
          </div>
          <span class="today-title">${escapeHTML(lesson.title)}</span>
          <span class="today-copy">${escapeHTML(reason)} · 完成度 ${Math.round(metrics.completion * 100)}%</span>
        </button>
      `;
    })
    .join("");
}

function renderCatalog() {
  const selectedLesson = getSelectedLesson();

  const volumeMarkup = curriculum.volumes
    .map((volume) => {
      const chapterMarkup = volume.chapters
        .map((chapter) => {
          const visibleLessons = chapter.lessons.filter((lesson) => lessonMatchesFilters(lessonMap.get(lesson.id)));
          if (!visibleLessons.length) {
            return "";
          }

          const chapterMetrics = getChapterMetrics(chapter.id);
          const lessonButtons = visibleLessons
            .map((lesson) => {
              const fullLesson = lessonMap.get(lesson.id);
              const metrics = computeLessonMetrics(fullLesson.id);
              return `
                <button class="lesson-button ${selectedLesson.id === fullLesson.id ? "is-active" : ""}" data-action="open-lesson" data-lesson-id="${fullLesson.id}">
                  <div class="lesson-row">
                    <div>
                      <span class="lesson-button-title">${escapeHTML(fullLesson.title)}</span>
                      <span class="lesson-button-subtitle">${escapeHTML(fullLesson.focus)}</span>
                    </div>
                    <span class="status-badge" data-status="${metrics.status}">${metrics.status}</span>
                  </div>
                  <div class="progress-bar" aria-hidden="true">
                    <span style="width: ${Math.round(metrics.completion * 100)}%"></span>
                  </div>
                </button>
              `;
            })
            .join("");

          return `
            <article class="chapter-card">
              <div class="chapter-top">
                <div class="chapter-title-row">
                  <div class="lesson-kicker">
                    <span class="volume-chip">${escapeHTML(volume.title)}</span>
                    <span class="importance-badge">${escapeHTML(chapter.importance)}</span>
                  </div>
                  <span class="count-badge">已掌握 ${chapterMetrics.masteredCount}/${chapterMetrics.totalLessons}</span>
                </div>
                <div class="chapter-title">${escapeHTML(chapter.number)} ${escapeHTML(chapter.title)}</div>
                <div class="progress-bar" aria-hidden="true">
                  <span style="width: ${Math.round(chapterMetrics.completion * 100)}%"></span>
                </div>
                <div class="progress-meta">${escapeHTML(chapter.summary)}</div>
              </div>
              <div class="chapter-lessons">
                ${lessonButtons}
              </div>
            </article>
          `;
        })
        .join("");

      return chapterMarkup;
    })
    .join("");

  dom.catalogTree.innerHTML = volumeMarkup || '<div class="empty-state">没有匹配到课次，换个关键词试试。</div>';
}

function renderLessonPanel() {
  const lesson = getSelectedLesson();
  const lessonState = ensureLessonState(lesson.id);
  const metrics = computeLessonMetrics(lesson.id);
  const nextReviewText = metrics.mastered ? formatDate(lessonState.nextReviewAt) : "完成全课后自动安排";

  const cardsMarkup = lesson.cards
    .map(
      (card) => `
        <article class="knowledge-card">
          <span class="card-type">${escapeHTML(card.type)}</span>
          <h4>${escapeHTML(card.title)}</h4>
          <p class="card-copy">${escapeHTML(card.prompt)}</p>
          <p class="card-answer">${escapeHTML(card.answer)}</p>
        </article>
      `
    )
    .join("");

  const quizMarkup = lesson.quiz
    .map((question, index) => {
      const questionState = lessonState.quiz[question.id] || {};
      const shuffledOptions = shuffleOptions(question);
      const feedback = typeof questionState.correct === "boolean"
        ? `
          <div class="question-feedback" data-result="${questionState.correct ? "correct" : "wrong"}">
            ${questionState.correct ? "回答正确。" : "这题还需要再看一遍。"} ${escapeHTML(question.explanation)}
          </div>
        `
        : "";

      return `
        <article class="question-card">
          <div class="question-header">
            <h4>基础题 ${index + 1}</h4>
            <span class="count-badge">${questionState.correct === true ? "已答对" : questionState.correct === false ? "待回炉" : "未检查"}</span>
          </div>
          <p>${escapeHTML(question.prompt)}</p>
          <div class="question-options">
            ${shuffledOptions
              .map(
                (option) => `
                  <label class="option-label">
                    <input type="radio" name="${question.id}" value="${escapeHTML(option)}" ${questionState.choice === option ? "checked" : ""}>
                    <span>${escapeHTML(option)}</span>
                  </label>
                `
              )
              .join("")}
          </div>
          <div class="action-row">
            <button class="quiz-submit" data-action="check-question" data-question-id="${question.id}" data-lesson-id="${lesson.id}">
              检查答案
            </button>
          </div>
          ${feedback}
        </article>
      `;
    })
    .join("");

  const mapTasksMarkup = lesson.mapTasks
    .map((task, index) => {
      const taskState = lessonState.mapTasks[task.id] || {};
      const shuffledOptions = shuffleOptions(task);
      const feedback = typeof taskState.correct === "boolean"
        ? `
          <div class="question-feedback" data-result="${taskState.correct ? "correct" : "wrong"}">
            ${taskState.correct ? "读图判断正确。" : "这张图还需要再读一遍。"} ${escapeHTML(task.explanation)}
          </div>
        `
        : "";

      return `
        <article class="map-task-card">
          <div class="question-header">
            <div>
              <h4>读图题 ${index + 1} · ${escapeHTML(task.title)}</h4>
              <p class="small-note">训练点：${escapeHTML(task.skill)}</p>
            </div>
            <span class="count-badge">${taskState.correct === true ? "已答对" : taskState.correct === false ? "待回炉" : "未检查"}</span>
          </div>
          ${renderMapVisual(task)}
          <p>${escapeHTML(task.prompt)}</p>
          <div class="question-options">
            ${shuffledOptions
              .map(
                (option) => `
                  <label class="option-label">
                    <input type="radio" name="${task.id}" value="${escapeHTML(option)}" ${taskState.choice === option ? "checked" : ""}>
                    <span>${escapeHTML(option)}</span>
                  </label>
                `
              )
              .join("")}
          </div>
          <div class="action-row">
            <button class="quiz-submit" data-action="check-map-task" data-task-id="${task.id}" data-lesson-id="${lesson.id}">
              检查读图答案
            </button>
          </div>
          ${feedback}
        </article>
      `;
    })
    .join("");

  dom.lessonPanel.innerHTML = `
    <div class="lesson-hero">
      <div>
        <div class="lesson-kicker">
          <span class="volume-chip">${escapeHTML(lesson.volumeTitle)}</span>
          <span class="importance-badge">${escapeHTML(lesson.chapterNumber)} ${escapeHTML(lesson.chapterTitle)}</span>
          <span class="status-badge" data-status="${metrics.status}">${metrics.status}</span>
        </div>
        <h2>${escapeHTML(lesson.title)}</h2>
        <p class="lesson-focus">${escapeHTML(lesson.focus)}</p>
      </div>

      <div class="lesson-overview-grid">
        <div class="overview-box">
          <span class="stat-label">本课完成度</span>
          <strong>${Math.round(metrics.completion * 100)}%</strong>
          <p class="small-note">知识卡 20% · 基础题 30% · 读图题 30% · 书写题 20%</p>
        </div>
        <div class="overview-box">
          <span class="stat-label">基础题进度</span>
          <strong>${metrics.correctCount} / ${metrics.totalQuiz}</strong>
          <p class="small-note">答错题会自动进入错题本</p>
        </div>
        <div class="overview-box">
          <span class="stat-label">读图题进度</span>
          <strong>${metrics.correctMapCount} / ${metrics.totalMapTasks}</strong>
          <p class="small-note">地图、图表和区域示意都会计入掌握度</p>
        </div>
        <div class="overview-box">
          <span class="stat-label">下次回看</span>
          <strong>${escapeHTML(nextReviewText)}</strong>
          <p class="small-note">掌握后按 1 / 3 / 7 / 14 天回炉</p>
        </div>
      </div>

      <div class="progress-bar" aria-label="本课完成度">
        <span style="width: ${Math.round(metrics.completion * 100)}%"></span>
      </div>
      <div class="action-row">
        <button class="action-button" data-action="toggle-cards" data-lesson-id="${lesson.id}">
          ${lessonState.cardsDone ? "已完成知识卡，点此取消" : "标记本课知识卡已完成"}
        </button>
        <button class="ghost-button" data-action="reset-lesson" data-lesson-id="${lesson.id}">
          重置本课进度
        </button>
      </div>
    </div>

    <section class="section-block">
      <div class="section-heading">
        <h3>知识卡</h3>
        <p>先看概念，再做题，再进入书写表达。</p>
      </div>
      <div class="card-grid">${cardsMarkup}</div>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <h3>基础题</h3>
        <p>选择题位置已打乱，避免只记住固定答案顺序。</p>
      </div>
      <div class="quiz-grid">${quizMarkup}</div>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <h3>读图训练</h3>
        <p>先看图名、图例和方向，再判断位置、特征、原因和影响。</p>
      </div>
      <div class="map-task-grid">${mapTasksMarkup}</div>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <h3>书写训练</h3>
        <p>会选不等于会写，建议先自己写，再对照参考要点。</p>
      </div>
      <article class="writing-card">
        <h4>${escapeHTML(lesson.writing.prompt)}</h4>
        <textarea id="writing-input" data-lesson-id="${lesson.id}" placeholder="在这里写关键词、完整句或答题提纲……">${escapeHTML(lessonState.writingText)}</textarea>
        <div class="writing-actions">
          <button class="action-button" data-action="save-writing" data-lesson-id="${lesson.id}">保存书写内容</button>
          <button class="ghost-button" data-action="toggle-writing" data-lesson-id="${lesson.id}">
            ${lessonState.writingDone ? "已完成书写训练，点此取消" : "标记书写训练已完成"}
          </button>
        </div>
        <ol class="writing-points">
          ${lesson.writing.points.map((point) => `<li>${escapeHTML(point)}</li>`).join("")}
        </ol>
      </article>
    </section>
  `;
}

function renderWrongbookPanel() {
  const entries = getWrongbookEntries();

  if (!entries.length) {
    dom.wrongbookPanel.innerHTML = `
      <div class="section-heading">
        <h2>错题本</h2>
        <p>答错的题会出现在这里，直到重新答对。</p>
      </div>
      <div class="empty-state">目前没有待回看的错题，继续保持。</div>
    `;
    return;
  }

  dom.wrongbookPanel.innerHTML = `
    <div class="section-heading">
      <h2>错题本</h2>
      <p>优先回看这些题，重新答对后会自动移出。</p>
    </div>
    <div class="stack-list">
      ${entries
        .map(
          ({ lesson, type, prompt, explanation }) => `
            <button class="wrongbook-entry" data-action="open-lesson" data-lesson-id="${lesson.id}">
              <div class="lesson-row">
                <span class="lesson-button-title">${escapeHTML(lesson.title)}</span>
                <span class="status-badge" data-status="易错">易错</span>
              </div>
              <span class="count-badge">${escapeHTML(type)}</span>
              <span class="small-note">${escapeHTML(prompt)}</span>
              <span class="small-note">提示：${escapeHTML(explanation)}</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderReviewPanel() {
  const lesson = getSelectedLesson();
  const lessonState = ensureLessonState(lesson.id);
  const metrics = computeLessonMetrics(lesson.id);
  const chapterMetrics = getChapterMetrics(lesson.chapterId);

  dom.reviewPanel.innerHTML = `
    <div class="section-heading">
      <h2>复习节奏</h2>
      <p>围绕完成度和回炉日期，观察本课和本章复习状态。</p>
    </div>
    <div class="review-card">
      <div class="review-calendar">
        <span>第 1 天回看</span>
        <span>第 3 天回看</span>
        <span>第 7 天回看</span>
        <span>第 14 天回看</span>
      </div>

      <div class="review-line">
        <div>
          <strong>${escapeHTML(lesson.chapterNumber)} ${escapeHTML(lesson.chapterTitle)}</strong>
          <div class="small-note">本章已掌握 ${chapterMetrics.masteredCount} / ${chapterMetrics.totalLessons}</div>
        </div>
        <span class="count-badge">章节进度 ${Math.round(chapterMetrics.completion * 100)}%</span>
      </div>

      <div class="review-line">
        <div>
          <strong>本课当前掌握度</strong>
          <div class="small-note">${metrics.status === "已掌握" ? "本课已经进入回炉跟踪。" : "本课仍在训练中，建议先补齐四类任务。"}</div>
        </div>
        <span class="status-badge" data-status="${metrics.status}">${metrics.status}</span>
      </div>

      <div class="review-line">
        <div>
          <strong>最近学习</strong>
          <div class="small-note">上次学习：${lessonState.lastStudiedAt ? formatDate(lessonState.lastStudiedAt) : "还没记录"}</div>
        </div>
        <span class="count-badge">${lessonState.nextReviewAt ? `下次 ${formatDate(lessonState.nextReviewAt)}` : "未安排"}</span>
      </div>

      <div class="review-line">
        <div>
          <strong>本版整理说明</strong>
          <div class="small-note">${escapeHTML(curriculum.meta.sourceNote)}</div>
        </div>
      </div>
    </div>
  `;
}

function render() {
  renderStats();
  renderTodayPanel();
  renderCatalog();
  renderLessonPanel();
  renderWrongbookPanel();
  renderReviewPanel();
  saveState();
}

function openLesson(lessonId) {
  state.selectedLessonId = lessonId;
  render();
}

function handleAction(event) {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.action;
  const lessonId = actionButton.dataset.lessonId;

  if (action === "open-lesson") {
    openLesson(lessonId);
    return;
  }

  if (!lessonId || !lessonMap.has(lessonId)) {
    return;
  }

  const lessonState = ensureLessonState(lessonId);

  if (action === "toggle-cards") {
    lessonState.cardsDone = !lessonState.cardsDone;
    touchLesson(lessonId);
    render();
    return;
  }

  if (action === "toggle-writing") {
    lessonState.writingDone = !lessonState.writingDone;
    touchLesson(lessonId);
    render();
    return;
  }

  if (action === "save-writing") {
    const textarea = document.querySelector("#writing-input");
    lessonState.writingText = textarea ? textarea.value.trim() : lessonState.writingText;
    touchLesson(lessonId);
    render();
    return;
  }

  if (action === "reset-lesson") {
    state.lessons[lessonId] = {
      cardsDone: false,
      writingText: "",
      writingDone: false,
      quiz: {},
      mapTasks: {},
      lastStudiedAt: null,
      masteredAt: null,
      nextReviewAt: null,
      reviewStep: -1,
      lastReviewAdvanceAt: null
    };
    render();
    return;
  }

  if (action === "check-question") {
    const questionId = actionButton.dataset.questionId;
    const lesson = lessonMap.get(lessonId);
    const question = lesson.quiz.find((item) => item.id === questionId);
    const selected = document.querySelector(`input[name="${CSS.escape(questionId)}"]:checked`);

    if (!question || !selected) {
      return;
    }

    lessonState.quiz[questionId] = {
      choice: selected.value,
      correct: selected.value === question.answer,
      checkedAt: todayString()
    };
    touchLesson(lessonId);
    render();
    return;
  }

  if (action === "check-map-task") {
    const taskId = actionButton.dataset.taskId;
    const lesson = lessonMap.get(lessonId);
    const task = lesson.mapTasks.find((item) => item.id === taskId);
    const selected = document.querySelector(`input[name="${CSS.escape(taskId)}"]:checked`);

    if (!task || !selected) {
      return;
    }

    lessonState.mapTasks[taskId] = {
      choice: selected.value,
      correct: selected.value === task.answer,
      checkedAt: todayString()
    };
    touchLesson(lessonId);
    render();
  }
}

function handleSearch() {
  state.query = dom.searchInput.value;
  renderCatalog();
  saveState();
}

function handleFilter() {
  state.statusFilter = dom.statusFilter.value;
  renderCatalog();
  saveState();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("Service worker registration failed.", error);
    });
  });
}

document.addEventListener("click", handleAction);
dom.searchInput.addEventListener("input", handleSearch);
dom.statusFilter.addEventListener("change", handleFilter);

registerServiceWorker();
render();
