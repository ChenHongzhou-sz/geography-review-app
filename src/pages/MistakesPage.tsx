import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { StudyCard } from "../components/study/study-card";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { cn } from "../utils/cn";
import { inferAnsweredCorrectly } from "../utils/review";
import type { StudyEngine } from "../hooks/useStudyEngine";
import type { ReviewCard, SelfRating } from "../types";

export function MistakesPage({ engine }: { engine: StudyEngine }) {
  const readyUnits = engine.units.filter((unit) => unit.ready);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [practiceItemIds, setPracticeItemIds] = useState<string[]>([]);
  const [practiceTotal, setPracticeTotal] = useState(0);

  const unitFilteredItems =
    selectedUnitId === "all" ? engine.wrongItems : engine.getUnitWrongItems(selectedUnitId);

  const knowledgePoints = useMemo(
    () =>
      Array.from(new Set(unitFilteredItems.map((item) => item.knowledgePoint))).sort((a, b) =>
        a.localeCompare(b, "zh-CN")
      ),
    [unitFilteredItems]
  );

  const displayedItems =
    selectedTopic === "all"
      ? unitFilteredItems
      : unitFilteredItems.filter((item) => item.knowledgePoint === selectedTopic);

  const displayedItemsById = useMemo(
    () => new Map(displayedItems.map((item) => [item.itemId, item])),
    [displayedItems]
  );

  const practiceCards = useMemo(
    () =>
      practiceItemIds
        .map((itemId) => displayedItemsById.get(itemId))
        .filter((item): item is ReviewCard => Boolean(item)),
    [displayedItemsById, practiceItemIds]
  );

  const practiceCard = practiceCards[0];
  const isPracticing = practiceItemIds.length > 0;
  const practiceProgress = practiceTotal
    ? ((practiceTotal - practiceCards.length) / practiceTotal) * 100
    : 0;

  useEffect(() => {
    setPracticeItemIds([]);
    setPracticeTotal(0);
  }, [selectedUnitId, selectedTopic]);

  function startPracticeSession() {
    setPracticeItemIds(displayedItems.map((item) => item.itemId));
    setPracticeTotal(displayedItems.length);
  }

  function handleMistakeRate(rating: SelfRating, answeredCorrectly?: boolean) {
    if (!practiceCard) {
      return;
    }

    const solved = inferAnsweredCorrectly(rating, answeredCorrectly) === true;

    engine.reviewKnowledge(practiceCard, rating, {
      answeredCorrectly,
      source: "mistakes"
    });

    setPracticeItemIds((current) => {
      const remaining = current.filter((itemId) => itemId !== practiceCard.itemId);
      return solved ? remaining : [...remaining, practiceCard.itemId];
    });
  }

  return (
    <AppShell
      title="错题本"
      subtitle="现在错题本已经区分“历史错过”和“当前待订正”。普通训练里答错会自动进来，在这里订正做对后会立即移出。"
      headerAside={
        <div className="rounded-[1.5rem] bg-amber-50 px-5 py-4 text-amber-900">
          <div className="text-sm">{isPracticing ? "本轮剩余" : "待订正错题"}</div>
          <div className="mt-2 text-3xl font-bold">
            {isPracticing ? practiceCards.length : displayedItems.length}
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-5xl space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>按单元和知识点筛选错题</CardTitle>
              <CardDescription className="mt-2">
                先缩小范围，再开始一轮订正。做对的题会当场移出错题本，没做对的会继续留在本轮里。
              </CardDescription>
            </div>
            <Badge variant="sand">当前 {engine.wrongItems.length} 条待订正</Badge>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedUnitId("all");
                setSelectedTopic("all");
              }}
              className={cn(
                buttonVariants({
                  variant: selectedUnitId === "all" ? "default" : "secondary",
                  size: "sm"
                })
              )}
            >
              全部单元
            </button>
            {readyUnits.map((unit) => (
              <button
                key={unit.unitId}
                type="button"
                onClick={() => {
                  setSelectedUnitId(unit.unitId);
                  setSelectedTopic("all");
                }}
                className={cn(
                  buttonVariants({
                    variant: selectedUnitId === unit.unitId ? "default" : "secondary",
                    size: "sm"
                  })
                )}
              >
                {unit.title}
              </button>
            ))}
          </div>

          {knowledgePoints.length ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSelectedTopic("all")}
                className={cn(
                  buttonVariants({
                    variant: selectedTopic === "all" ? "secondary" : "ghost",
                    size: "sm"
                  })
                )}
              >
                全部知识点
              </button>
              {knowledgePoints.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={cn(
                    buttonVariants({
                      variant: selectedTopic === topic ? "secondary" : "ghost",
                      size: "sm"
                    })
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          ) : null}

          {displayedItems.length ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {!isPracticing ? (
                <button
                  type="button"
                  onClick={startPracticeSession}
                  className={buttonVariants({ size: "lg" })}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  开始订正当前筛选
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setPracticeItemIds([]);
                    setPracticeTotal(0);
                  }}
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  结束本轮订正
                </button>
              )}
            </div>
          ) : null}
        </Card>

        {isPracticing && practiceCard ? (
          <>
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle>错题订正模式</CardTitle>
                  <CardDescription className="mt-2">
                    当前按筛选结果逐题订正。做对就移出错题本，做错会继续排到后面。
                  </CardDescription>
                </div>
                <div className="rounded-[1.4rem] bg-slate-950 px-4 py-3 text-white">
                  <div className="text-sm text-slate-300">本轮进度</div>
                  <div className="text-3xl font-bold">
                    {Math.max(practiceTotal - practiceCards.length + 1, 1)} / {practiceTotal}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={practiceProgress} />
              </div>
            </Card>

            <StudyCard
              card={practiceCard}
              indexLabel={`${Math.max(practiceTotal - practiceCards.length + 1, 1)} / ${practiceTotal}`}
              onAdvance={({ rating, answeredCorrectly }) =>
                handleMistakeRate(rating, answeredCorrectly)
              }
              advanceLabel="下一道错题"
            />
          </>
        ) : null}

        {displayedItems.length === 0 ? (
          <Card className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint-100">
              <RotateCcw className="h-6 w-6 text-mint-700" />
            </div>
            <CardTitle>当前没有待订正错题</CardTitle>
            <CardDescription className="mt-2">
              继续去做题吧。以后做错的题会自动进入这里，订正做对后会自动移出。
            </CardDescription>
            <div className="mt-5">
              <Link
                to={`/training/${engine.featuredUnit.unitId}`}
                className={buttonVariants({ size: "lg" })}
              >
                回到训练
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {displayedItems.map((item) => (
              <Card key={item.id}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{item.questionType === "flashcard" ? "记忆卡片" : item.questionType}</Badge>
                    <Badge variant="slate">{item.section}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-rose-500">
                    <AlertTriangle className="h-4 w-4" />
                    历史答错 {item.progress.wrongCount} 次
                  </div>
                </div>

                <CardTitle>{item.knowledgePoint}</CardTitle>
                <CardDescription className="mt-2 text-base leading-7">{item.prompt}</CardDescription>

                <div className="mt-4 rounded-[1.2rem] bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-ocean-700">正确答案</div>
                  <div className="mt-2 text-lg font-semibold text-ink">{item.answer}</div>
                  <div className="mt-3 text-sm leading-7 text-slate-600">{item.explanation}</div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                  <span>{item.chapter}</span>
                  <span>
                    {item.sourceLabel}
                    {item.sourceSlide ? ` 第 ${item.sourceSlide} 页` : ""}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
