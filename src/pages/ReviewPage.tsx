import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { StudyCard } from "../components/study/study-card";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { buildReviewDeck } from "../utils/review";
import type { BookCode, ReviewCard } from "../types";
import type { StudyEngine } from "../hooks/useStudyEngine";

type PracticeScope = "all" | BookCode;
const BOOK_OPTIONS: BookCode[] = ["七上", "七下"];

export function ReviewPage({ engine }: { engine: StudyEngine }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBook = searchParams.get("book");
  const initialChapter = searchParams.get("chapter");
  const initialScope: PracticeScope = BOOK_OPTIONS.includes(initialBook as BookCode)
    ? (initialBook as BookCode)
    : "all";
  const initialChapterIsValid = engine.chapters.some(
    (item) =>
      item.chapter === initialChapter &&
      (initialScope === "all" || item.book === initialScope)
  );
  const [scope, setScope] = useState<PracticeScope>(initialScope);
  const [chapter, setChapter] = useState(
    initialChapter && initialChapterIsValid ? initialChapter : "all"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const availableChapters = engine.chapters.filter((item) =>
    scope === "all" ? true : item.book === scope
  );

  const buildScopedDeck = (nextScope = scope, nextChapter = chapter) => {
    const filteredKnowledge = engine.knowledgeBase.filter((item) => {
      const matchesBook = nextScope === "all" || item.book === nextScope;
      const matchesChapter = nextChapter === "all" || item.chapter === nextChapter;
      return matchesBook && matchesChapter;
    });
    const filteredMaps = engine.mapChallenges.filter((item) => {
      const matchesBook = nextScope === "all" || item.book === nextScope;
      const matchesChapter = nextChapter === "all" || item.chapter === nextChapter;
      return matchesBook && matchesChapter;
    });

    return buildReviewDeck(
      filteredKnowledge,
      filteredMaps,
      engine.progressMap,
      engine.recentHistory,
      20
    );
  };

  const [sessionCards, setSessionCards] = useState<ReviewCard[]>(() => buildScopedDeck());
  const card = sessionCards[currentIndex];
  const scopeLabel = chapter !== "all" ? chapter : scope === "all" ? "全部教材" : scope;
  const scopedKnowledgeCount = engine.knowledgeBase.filter((item) => {
    const matchesBook = scope === "all" || item.book === scope;
    const matchesChapter = chapter === "all" || item.chapter === chapter;
    return matchesBook && matchesChapter;
  }).length;
  const scopedMapCount = engine.mapChallenges.filter((item) => {
    const matchesBook = scope === "all" || item.book === scope;
    const matchesChapter = chapter === "all" || item.chapter === chapter;
    return matchesBook && matchesChapter;
  }).length;

  const resetSession = (nextScope = scope, nextChapter = chapter) => {
    setSessionCards(buildScopedDeck(nextScope, nextChapter));
    setCurrentIndex(0);
    const nextParams: Record<string, string> = {};

    if (nextScope !== "all") {
      nextParams.book = nextScope;
    }

    if (nextChapter !== "all") {
      nextParams.chapter = nextChapter;
    }

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <AppShell pathname="/review">
      <div className="mx-auto max-w-4xl space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>今日智能训练</CardTitle>
              <CardDescription className="mt-2">
                系统会优先抽取应复习内容，并自动避开最近刚做过的卡片，让手机和平板上的重复率更低。
              </CardDescription>
            </div>
            <div className="rounded-[1.4rem] bg-ocean-50 px-4 py-3 text-ocean-900">
              <div className="text-sm">剩余卡片</div>
              <div className="text-3xl font-bold">
                {Math.max(sessionCards.length - currentIndex, 0)}
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            当前范围：<span className="font-semibold text-ink">{scopeLabel}</span>
            <span className="mx-2 text-slate-300">/</span>
            知识卡 {scopedKnowledgeCount} 条，地图题 {scopedMapCount} 组
          </div>
          <div className="mt-4">
            <Progress value={(currentIndex / Math.max(sessionCards.length, 1)) * 100} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              教材
              <select
                value={scope}
                onChange={(event) => {
                  const nextScope = event.target.value as PracticeScope;
                  setScope(nextScope);
                  setChapter("all");
                  resetSession(nextScope, "all");
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-ink"
              >
                <option value="all">全部教材</option>
                <option value="七上">七上</option>
                <option value="七下">七下</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              单元 / 章节
              <select
                value={chapter}
                onChange={(event) => {
                  const nextChapter = event.target.value;
                  setChapter(nextChapter);
                  resetSession(scope, nextChapter);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-base font-medium text-ink"
              >
                <option value="all">全部单元</option>
                {availableChapters.map((item) => (
                  <option key={item.chapter} value={item.chapter}>
                    {item.book} {item.chapter}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => resetSession()}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              重新组题
            </button>
          </div>
        </Card>

        {card ? (
          <StudyCard
            card={card}
            indexLabel={`${currentIndex + 1} / ${sessionCards.length}`}
            onRate={(rating) => {
              engine.reviewKnowledge(card, rating);
              setCurrentIndex((value) => value + 1);
            }}
          />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-slate-950 text-white">
              <div className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold">
                今日任务完成
              </div>
              <CardTitle className="text-white">这一轮训练已经刷完了</CardTitle>
              <CardDescription className="mt-3 text-slate-300">
                你可以去地图挑战继续练真实地图，也可以直接换一组系统重新避重后的新题。
              </CardDescription>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/map" className={buttonVariants({ size: "lg" })}>
                  <Compass className="mr-2 h-4 w-4" />
                  去做地图挑战
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    resetSession();
                  }}
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  换一组新题
                </button>
                <Link
                  to="/sprint"
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  看冲刺包
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
