import { useMemo, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { cn } from "../utils/cn";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function MistakesPage({ engine }: { engine: StudyEngine }) {
  const readyUnits = engine.units.filter((unit) => unit.ready);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

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

  return (
    <AppShell
      title="错题本"
      subtitle="错题页已经支持按单元和知识点筛选。后续继续接入别的单元后，这里会自动汇总所有易错内容。"
      headerAside={
        <div className="rounded-[1.5rem] bg-amber-50 px-5 py-4 text-amber-900">
          <div className="text-sm">待回看错题</div>
          <div className="mt-2 text-3xl font-bold">{displayedItems.length}</div>
        </div>
      }
    >
      <div className="mx-auto max-w-5xl space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>按单元和知识点查看错题</CardTitle>
              <CardDescription className="mt-2">
                做错的题会自动保留答案与解析，方便你针对薄弱点反复回看。
              </CardDescription>
            </div>
            <Badge variant="sand">共 {engine.wrongItems.length} 条错题记录</Badge>
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
        </Card>

        {displayedItems.length === 0 ? (
          <Card className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint-100">
              <RotateCcw className="h-6 w-6 text-mint-700" />
            </div>
            <CardTitle>这里暂时还是空的</CardTitle>
            <CardDescription className="mt-2">
              继续做题后，这里会自动记录最近做错的题目和解析。
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
                    错误 {item.progress.wrongCount} 次
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
