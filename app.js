const STORAGE_KEY = "geography-review-app-v2";
const data = buildQuestionBank(
  structuredClone(window.GEOGRAPHY_REVIEW_DATA),
  window.GEOGRAPHY_REVIEW_EXPANSIONS || {}
);

const dom = {
  statsPanel: document.querySelector("#stats-panel"),
  scopePanel: document.querySelector("#scope-panel"),
  chapterNavPanel: document.querySelector("#chapter-nav-panel"),
  overviewPanel: document.querySelector("#overview-panel"),
  sessionPanel: document.querySelector("#session-panel"),
  wrongbookPanel: document.querySelector("#wrongbook-panel"),
  coveragePanel: document.querySelector("#coverage-panel")
};

function buildQuestionBank(baseData, expansions) {
  const seenIds = new Set();
  const seenPrompts = new Set();

  for (const volume of baseData.volumes) {
    for (const chapter of volume.chapters) {
      const merged = [...chapter.questions, ...(expansions[chapter.id] || [])];
      const deduped = [];

      for (const question of merged) {
        const idKey = String(question.id || "").trim();
        const promptKey = normalizePrompt(question.prompt);

        if (!idKey || !promptKey) {
          continue;
        }

        if (seenIds.has(idKey) || seenPrompts.has(promptKey)) {
          console.warn("Skipped duplicate geography question:", idKey, question.prompt);
          continue;
        }

        seenIds.add(idKey);
        seenPrompts.add(promptKey);
        deduped.push(question);
      }

      chapter.questions = deduped;
    }
  }

  return baseData;
}

function normalizePrompt(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

const volumes = data.volumes;
const chapters = [];
const lessons = [];
const questionMap = new Map();
const chapterMap = new Map();
const lessonMap = new Map();

for (const volume of volumes) {
  for (const chapter of volume.chapters) {
    const enrichedChapter = {
      ...chapter,
      volumeId: volume.id,
      volumeTitle: volume.title
    };
    chapters.push(enrichedChapter);
    chapterMap.set(chapter.id, enrichedChapter);

    for (const lesson of chapter.lessons) {
      const enrichedLesson = {
        ...lesson,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        volumeId: volume.id,
        volumeTitle: volume.title
      };
      lessons.push(enrichedLesson);
      lessonMap.set(lesson.id, enrichedLesson);
    }

    for (const question of chapter.questions) {
      questionMap.set(question.id, {
        ...question,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        volumeId: volume.id,
        volumeTitle: volume.title,
        lessonTitle: chapter.lessons.find((item) => item.id === question.lessonId)?.title || ""
      });
    }
  }
}

const allQuestions = [...questionMap.values()];

const defaultState = {
  selectedChapterId: chapters[0]?.id || null,
  progress: {}
};

let state = loadState();
let activeSession = null;

normalizeState();
bindEvents();
render();
registerServiceWorker();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(defaultState);
    }
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch (error) {
    console.warn("Failed to load saved progress.", error);
    return structuredClone(defaultState);
  }
}

function normalizeState() {
  if (!chapterMap.has(state.selectedChapterId)) {
    state.selectedChapterId = chapters[0]?.id || null;
  }
  if (!state.progress || typeof state.progress !== "object") {
    state.progress = {};
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) {
      return;
    }

    const { action, id } = actionTarget.dataset;

    if (action === "select-chapter") {
      state.selectedChapterId = id;
      saveState();
      render();
      return;
    }

    if (action === "start-chapter") {
      startSessionFromQuestions(getQuestionsForChapter(id), `${chapterMap.get(id).title} 单元练习`, "按当前单元完整出题。");
      return;
    }

    if (action === "start-lesson") {
      const lesson = lessonMap.get(id);
      const chapter = chapterMap.get(lesson.chapterId);
      state.selectedChapterId = chapter.id;
      saveState();
      startSessionFromQuestions(getQuestionsForLesson(id), `${lesson.title} 课时练习`, `来自 ${chapter.title}。`);
      return;
    }

    if (action === "start-volume-mix") {
      const volume = volumes.find((item) => item.id === id);
      const questions = sampleQuestions(getQuestionsForVolume(id), 18);
      startSessionFromQuestions(questions, `${volume.title} 交叉考核`, "跨单元抽题，侧重综合辨析。");
      return;
    }

    if (action === "start-grand-mix") {
      startSessionFromQuestions(sampleQuestions(allQuestions, 24), "七上七下综合测试", "全书随机抽题，适合考前冲刺。");
      return;
    }

    if (action === "start-wrongbook") {
      const wrongQuestions = getWrongQuestions();
      if (!wrongQuestions.length) {
        activeSession = null;
        renderSession("当前还没有待回炉的错题。");
        return;
      }
      startSessionFromQuestions(sampleQuestions(wrongQuestions, Math.min(20, wrongQuestions.length)), "错题回炉", "优先重练最近答错的题目。");
      return;
    }

    if (action === "submit-session") {
      gradeSession();
      return;
    }

    if (action === "restart-session") {
      if (!activeSession) {
        return;
      }
      const questions = activeSession.questionIds.map((questionId) => questionMap.get(questionId));
      startSessionFromQuestions(questions, activeSession.title, activeSession.note);
      return;
    }

    if (action === "clear-progress") {
      state = structuredClone(defaultState);
      activeSession = null;
      saveState();
      render();
    }
  });
}

function render() {
  renderStats();
  renderScopes();
  renderChapterNav();
  renderOverview();
  renderSession();
  renderWrongbook();
  renderCoverage();
}

function renderStats() {
  const total = allQuestions.length;
  const mastered = allQuestions.filter((question) => getProgress(question.id).correctCount > 0).length;
  const wrongPending = getWrongQuestions().length;
  const attempted = allQuestions.filter((question) => getProgress(question.id).attempts > 0).length;

  dom.statsPanel.innerHTML = [
    statCard("总题量", `${total}`, "按当前题库统计"),
    statCard("已掌握", `${mastered}`, "至少答对过一次"),
    statCard("待回炉", `${wrongPending}`, "最后一次答题仍错误"),
    statCard("已练习", `${attempted}`, "已经做过的题目")
  ].join("");
}

function statCard(label, value, note) {
  return `
    <article class="stat-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(note)}</span>
    </article>
  `;
}

function renderScopes() {
  const selectedChapter = chapterMap.get(state.selectedChapterId);
  const currentVolume = volumes.find((item) => item.id === selectedChapter.volumeId);

  dom.scopePanel.innerHTML = `
    <p class="section-kicker">Quick Modes</p>
    <h2>练习入口</h2>
    <p class="section-note">先练单元，再做交叉考核，最后回炉错题。</p>
    <div class="scope-grid">
      <button class="action-card" data-action="start-chapter" data-id="${selectedChapter.id}">
        <strong>当前单元完整练习</strong>
        <small>${selectedChapter.title} · ${getQuestionsForChapter(selectedChapter.id).length} 题</small>
      </button>
      <button class="action-card" data-action="start-volume-mix" data-id="${currentVolume.id}">
        <strong>当前册交叉考核</strong>
        <small>${currentVolume.title} · 随机抽 18 题</small>
      </button>
      <button class="action-card" data-action="start-grand-mix">
        <strong>全书综合测试</strong>
        <small>七上 + 七下 · 随机抽 24 题</small>
      </button>
      <button class="action-card" data-action="start-wrongbook">
        <strong>错题回炉</strong>
        <small>${getWrongQuestions().length} 题待复习</small>
      </button>
    </div>
    <div class="toolbar">
      <button class="secondary-button" data-action="clear-progress">清空本地进度</button>
    </div>
    <p class="footer-note">${escapeHtml(data.meta.sourceNote)}</p>
  `;
}

function renderChapterNav() {
  const groups = volumes
    .map((volume) => {
      const list = volume.chapters
        .map((chapter) => {
          const coverage = getCoverageText(chapter.id);
          const isActive = chapter.id === state.selectedChapterId;
          return `
            <button class="chapter-button ${isActive ? "is-active" : ""}" data-action="select-chapter" data-id="${chapter.id}">
              <div class="chapter-button-title">
                <span>${escapeHtml(chapter.number)} · ${escapeHtml(chapter.title)}</span>
                <span>${getQuestionsForChapter(chapter.id).length} 题</span>
              </div>
              <small>${escapeHtml(chapter.summary)}</small>
              <small>${escapeHtml(coverage)}</small>
            </button>
          `;
        })
        .join("");

      return `
        <div>
          <p class="chapter-group-title">${escapeHtml(volume.title)}</p>
          <div class="chapter-list">${list}</div>
        </div>
      `;
    })
    .join("");

  dom.chapterNavPanel.innerHTML = `
    <p class="section-kicker">Catalog</p>
    <h2>教材目录</h2>
    <p class="section-note">按 2022 版教材目录重建，先从单元推进。</p>
    ${groups}
  `;
}

function renderOverview() {
  const chapter = chapterMap.get(state.selectedChapterId);
  const lessonCards = chapter.lessons
    .map((lesson) => {
      const relatedQuestions = getQuestionsForLesson(lesson.id);
      return `
        <button class="lesson-card" data-action="start-lesson" data-id="${lesson.id}">
          <h4>${escapeHtml(lesson.title)}</h4>
          <small>${relatedQuestions.length} 道选择题</small>
          <ul class="points">
            ${lesson.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
          </ul>
        </button>
      `;
    })
    .join("");

  dom.overviewPanel.innerHTML = `
    <div class="overview-head">
      <div>
        <p class="section-kicker">${escapeHtml(chapter.volumeTitle)}</p>
        <h2>${escapeHtml(chapter.number)} · ${escapeHtml(chapter.title)}</h2>
        <p class="overview-summary muted">${escapeHtml(chapter.summary)}</p>
        <div class="meta-row">
          <span class="badge">${getQuestionsForChapter(chapter.id).length} 道题</span>
          <span class="badge">${getCoverageText(chapter.id)}</span>
        </div>
      </div>
      <div class="toolbar">
        <button class="primary-button" data-action="start-chapter" data-id="${chapter.id}">开始本单元</button>
        <button class="secondary-button" data-action="start-volume-mix" data-id="${chapter.volumeId}">做本册交叉</button>
      </div>
    </div>

    <div class="test-grid">
      <div class="action-card">
        <strong>练习建议</strong>
        <small>先做当前单元，再抽本册交叉题，最后用错题回炉复盘。</small>
      </div>
      <div class="action-card">
        <strong>当前节数</strong>
        <small>${chapter.lessons.length} 节内容，支持按课时单独练习。</small>
      </div>
      <div class="action-card">
        <strong>随机机制</strong>
        <small>题目顺序和选项顺序都会重新打乱。</small>
      </div>
    </div>

    <div class="lesson-grid">${lessonCards}</div>
  `;
}

function renderSession(emptyMessage = "") {
  if (!activeSession) {
    dom.sessionPanel.innerHTML = `
      <div class="session-empty">
        <p class="section-kicker">Session</p>
        <h2>开始一次练习</h2>
        <p class="muted">${escapeHtml(emptyMessage || "从左侧单元目录或上方练习入口里选一种方式开始。")}</p>
      </div>
    `;
    return;
  }

  const questionsMarkup = activeSession.items
    .map((item, index) => {
      const answerName = `question-${item.id}`;
      const selected = activeSession.answers[item.id];
      const progress = activeSession.result?.details[item.id];

      return `
        <article class="question-card">
          <h4>${index + 1}. ${escapeHtml(item.prompt)}</h4>
          <div class="option-list">
            ${item.options
              .map((option, optionIndex) => {
                const isSelected = Number(selected) === optionIndex;
                const optionClasses = ["choice"];

                if (activeSession.submitted) {
                  if (option.isCorrect) {
                    optionClasses.push("is-correct");
                  } else if (isSelected && !option.isCorrect) {
                    optionClasses.push("is-wrong");
                  }
                }

                return `
                  <label class="${optionClasses.join(" ")}">
                    <input
                      type="radio"
                      name="${answerName}"
                      value="${optionIndex}"
                      data-question-id="${item.id}"
                      ${isSelected ? "checked" : ""}
                      ${activeSession.submitted ? "disabled" : ""}
                    >
                    <span>${escapeHtml(option.text)}</span>
                  </label>
                `;
              })
              .join("")}
          </div>
          ${
            activeSession.submitted
              ? `
                <div class="question-result">
                  <strong>${progress?.correct ? "回答正确" : "回答错误"}</strong>
                  <div>${escapeHtml(item.explanation)}</div>
                  <div class="summary-line">${escapeHtml(item.lessonTitle)} · ${escapeHtml(item.chapterTitle)}</div>
                </div>
              `
              : ""
          }
        </article>
      `;
    })
    .join("");

  const banner = activeSession.submitted
    ? `
      <div class="result-banner ${activeSession.result.scoreRate >= 0.8 ? "pass" : "fail"}">
        本次得分：${activeSession.result.score} / ${activeSession.result.total}（${Math.round(activeSession.result.scoreRate * 100)}%）
      </div>
    `
    : "";

  const actionButton = activeSession.submitted
    ? `<button class="secondary-button" data-action="restart-session">再来一轮</button>`
    : `<button class="primary-button" data-action="submit-session">提交并判分</button>`;

  dom.sessionPanel.innerHTML = `
    <div class="session-head">
      <div>
        <p class="section-kicker">Session</p>
        <h2>${escapeHtml(activeSession.title)}</h2>
        <p class="muted">${escapeHtml(activeSession.note)}</p>
      </div>
      <div class="toolbar">${actionButton}</div>
    </div>
    ${banner}
    <div class="question-list">${questionsMarkup}</div>
  `;

  if (!activeSession.submitted) {
    dom.sessionPanel.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener("change", (event) => {
        activeSession.answers[event.target.dataset.questionId] = Number(event.target.value);
      });
    });
  }
}

function renderWrongbook() {
  const wrongQuestions = getWrongQuestions();

  dom.wrongbookPanel.innerHTML = `
    <p class="section-kicker">Wrong Book</p>
    <h3>错题回炉</h3>
    <p class="section-note">系统按“最后一次是否答错”记录待回炉题。</p>
    ${
      wrongQuestions.length
        ? `
          <div class="wrong-list">
            ${wrongQuestions
              .slice(0, 6)
              .map(
                (question) => `
                  <div class="wrong-item">
                    <strong>${escapeHtml(question.prompt)}</strong>
                    <div class="summary-line">${escapeHtml(question.chapterTitle)} · ${escapeHtml(question.lessonTitle)}</div>
                  </div>
                `
              )
              .join("")}
          </div>
          <div class="toolbar">
            <button class="primary-button" data-action="start-wrongbook">开始回炉</button>
          </div>
        `
        : `<p class="muted">还没有待回炉的错题，继续保持。</p>`
    }
  `;
}

function renderCoverage() {
  const chapter = chapterMap.get(state.selectedChapterId);
  const items = chapter.lessons
    .map((lesson) => {
      const relatedQuestions = getQuestionsForLesson(lesson.id);
      const mastered = relatedQuestions.filter((question) => getProgress(question.id).correctCount > 0).length;
      return `
        <div class="coverage-item">
          <strong>${escapeHtml(lesson.title)}</strong>
          <div class="summary-line">${mastered} / ${relatedQuestions.length} 题已掌握</div>
          <div class="pill-row">
            ${lesson.points.map((point) => `<span class="pill">${escapeHtml(point)}</span>`).join("")}
          </div>
        </div>
      `;
    })
    .join("");

  dom.coveragePanel.innerHTML = `
    <p class="section-kicker">Coverage</p>
    <h3>知识点覆盖</h3>
    <p class="section-note">这里先看每节的覆盖点，再进入课时练或单元练。</p>
    <div class="coverage-list">${items}</div>
  `;
}

function startSessionFromQuestions(questions, title, note) {
  const uniqueQuestions = dedupeQuestions(questions);
  activeSession = {
    title,
    note,
    submitted: false,
    questionIds: uniqueQuestions.map((question) => question.id),
    answers: {},
    items: shuffleArray(uniqueQuestions).map((question) => buildSessionQuestion(question)),
    result: null
  };
  renderSession();
}

function buildSessionQuestion(question) {
  const options = question.options.map((text, index) => ({
    text,
    isCorrect: index === question.answer
  }));

  return {
    ...question,
    options: shuffleArray(options)
  };
}

function gradeSession() {
  if (!activeSession || activeSession.submitted) {
    return;
  }

  const details = {};
  let score = 0;

  for (const item of activeSession.items) {
    const selectedIndex = activeSession.answers[item.id];
    const selectedOption = item.options[Number.isInteger(selectedIndex) ? selectedIndex : -1];
    const correct = Boolean(selectedOption?.isCorrect);
    details[item.id] = { correct };

    recordProgress(item.id, correct);

    if (correct) {
      score += 1;
    }
  }

  activeSession.submitted = true;
  activeSession.result = {
    score,
    total: activeSession.items.length,
    scoreRate: activeSession.items.length ? score / activeSession.items.length : 0,
    details
  };

  saveState();
  render();
}

function recordProgress(questionId, correct) {
  const progress = getProgress(questionId);
  progress.attempts += 1;
  progress.lastResult = correct;
  progress.lastStudiedAt = new Date().toISOString();
  if (correct) {
    progress.correctCount += 1;
  } else {
    progress.wrongCount += 1;
  }
}

function getProgress(questionId) {
  if (!state.progress[questionId]) {
    state.progress[questionId] = {
      attempts: 0,
      correctCount: 0,
      wrongCount: 0,
      lastResult: null,
      lastStudiedAt: null
    };
  }
  return state.progress[questionId];
}

function getQuestionsForChapter(chapterId) {
  return allQuestions.filter((question) => question.chapterId === chapterId);
}

function getQuestionsForLesson(lessonId) {
  return allQuestions.filter((question) => question.lessonId === lessonId);
}

function getQuestionsForVolume(volumeId) {
  return allQuestions.filter((question) => question.volumeId === volumeId);
}

function getWrongQuestions() {
  return allQuestions.filter((question) => getProgress(question.id).attempts > 0 && getProgress(question.id).lastResult === false);
}

function getCoverageText(chapterId) {
  const questions = getQuestionsForChapter(chapterId);
  const mastered = questions.filter((question) => getProgress(question.id).correctCount > 0).length;
  return `已掌握 ${mastered} / ${questions.length}`;
}

function sampleQuestions(items, count) {
  return shuffleArray(items).slice(0, Math.min(count, items.length));
}

function dedupeQuestions(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch((error) => {
        console.warn("Service worker registration failed.", error);
      });
    });
  }
}
