import { useEffect, useMemo, useState } from "react";
import { BookOpen, Compass, Lightbulb, MapPinned, RotateCcw } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import type { KnowledgeCard } from "../types";
import type { StudyEngine } from "../hooks/useStudyEngine";
import { STORAGE_KEYS } from "../utils/storage";

function clampIndex(index: number, total: number) {
  return Math.min(Math.max(index, 0), total);
}

export function HandbookPage({ engine }: { engine: StudyEngine }) {
  const params = useParams();
  const unitId = params.unitId ?? "";
  const unit = engine.getUnit(unitId);
  const data = engine.getUnitData(unitId);
  const cards = useMemo<KnowledgeCard[]>(() => data?.knowledgePoints ?? [], [data]);
  const [storedPositions, setStoredPositions] = useLocalStorage<Record<string, number>>(
    STORAGE_KEYS.handbookPosition,
    {}
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const card = cards[currentIndex];

  useEffect(() => {
    if (unit) {
      engine.setFeaturedUnit(unit.unitId);
    }
  }, [engine, unit]);

  useEffect(() => {
    setCurrentIndex(clampIndex(storedPositions[unitId] ?? 0, cards.length));
  }, [cards.length, storedPositions, unitId]);

  const updateIndex = (nextIndex: number) => {
    const clampedIndex = clampIndex(nextIndex, cards.length);
    setCurrentIndex(clampedIndex);
    setStoredPositions((current) => ({
      ...current,
      [unitId]: clampedIndex
    }));
  };

  if (!unit) {
    return <Navigate to="/units" replace />;
  }

  if (!data) {
    return <Navigate to={`/unit/${unit.unitId}`} replace />;
  }

  return (
    <AppShell
      title={`${unit.title} 知识手册`}
      subtitle="把课前梳理和课堂解析里的重点内容整理成手册卡，适合一张一张浏览阅读。这里以阅读为主，不会写入错题本。"
      headerAside={
        <div className="rounded-[1.5rem] bg-ocean-50 px-5 py-4 text-ocean-900">
          <div className="text-sm">知识卡总数</div>
          <div className="mt-2 text-3xl font-bold">{cards.length}</div>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>手册浏览模式</CardTitle>
              <CardDescription className="mt-2">
                当前按卡片顺序浏览本单元的核心知识，适合课前过一遍，也适合考前快速回顾。
              </CardDescription>
            </div>
            <div className="rounded-[1.4rem] bg-slate-950 px-4 py-3 text-white">
              <div className="text-sm text-slate-300">当前进度</div>
              <div className="text-3xl font-bold">
                {Math.min(currentIndex + 1, Math.max(cards.length, 1))} / {cards.length}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={(currentIndex / Math.max(cards.length, 1)) * 100} />
          </div>
        </Card>

        {card ? (
          <Card className="overflow-hidden bg-gradient-to-br from-white via-ocean-50/40 to-sand/50">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{card.bookLabel}</Badge>
              <Badge variant="sand">{card.section}</Badge>
              <Badge variant="slate">
                {currentIndex + 1} / {cards.length}
              </Badge>
            </div>

            <div className="mt-5">
              <div className="text-sm font-medium text-ocean-700">{card.knowledgePoint}</div>
              <CardTitle className="mt-2 text-2xl leading-9 sm:text-[1.7rem]">
                {card.prompt}
              </CardTitle>
              <CardDescription className="mt-3 text-base leading-7 text-slate-600">
                来自 {card.source.label}
                {card.source.note ? ` · ${card.source.note}` : ""}
              </CardDescription>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.35rem] bg-white/90 p-5 shadow-sm shadow-slate-200/60">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ocean-700">
                  <BookOpen className="h-4 w-4" />
                  核心结论
                </div>
                <div className="text-lg font-semibold leading-8 text-ink">{card.answer}</div>
              </div>

              <div className="rounded-[1.35rem] border border-white/70 bg-white/72 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-900">
                  <Lightbulb className="h-4 w-4" />
                  记忆提醒
                </div>
                <div className="text-sm leading-7 text-slate-700">{card.explanation}</div>
              </div>
            </div>

            <div className="mt-5 rounded-[1.25rem] bg-slate-950 px-4 py-4 text-sm text-slate-300">
              <div>{card.chapter}</div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {card.source.file ? <span>文件：{card.source.file}</span> : null}
                {card.source.slide ? <span>页码：第 {card.source.slide} 页</span> : null}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => updateIndex(currentIndex - 1)}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
                disabled={currentIndex === 0}
              >
                上一张
              </button>
              <button
                type="button"
                onClick={() => updateIndex(currentIndex + 1)}
                className={buttonVariants({ size: "lg" })}
              >
                下一张知识卡
              </button>
            </div>
          </Card>
        ) : (
          <Card className="bg-slate-950 text-white">
            <div className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold">
              知识手册浏览完成
            </div>
            <CardTitle className="text-white">
              {unit.title} 这一轮知识卡已经看完了
            </CardTitle>
            <CardDescription className="mt-3 text-slate-300">
              你可以重新浏览一遍，也可以直接回到训练或地图挑战，把刚刚看过的内容转成做题练习。
            </CardDescription>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => updateIndex(0)}
                className={buttonVariants({ size: "lg" })}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                再看一遍
              </button>
              <Link
                to={`/training/${unit.unitId}`}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                <Compass className="mr-2 h-4 w-4" />
                去做训练
              </Link>
              <Link
                to={`/maps/${unit.unitId}`}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                <MapPinned className="mr-2 h-4 w-4" />
                地图挑战
              </Link>
            </div>
          </Card>
        )}

        <Card>
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-ocean-500" />
            <div>
              <CardTitle>这套卡片来自当前单元整理后的知识点</CardTitle>
              <CardDescription className="mt-2">
                现在会优先使用你已经整理好的亚洲单元知识卡。后面其他单元按同样结构接入后，这个页面也可以直接复用。
              </CardDescription>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
