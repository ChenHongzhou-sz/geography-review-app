import { useEffect, useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { StudyCard } from "../components/study/study-card";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { cn } from "../utils/cn";
import type { ReviewCard } from "../types";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function SprintPage({ engine }: { engine: StudyEngine }) {
  const unit = engine.featuredUnit;
  const data = engine.getUnitData(unit.unitId);
  const stages = engine.getUnitStages(unit.unitId);
  const [selectedStageId, setSelectedStageId] = useState(stages[0]?.id ?? "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<ReviewCard[]>(() =>
    stages[0] ? engine.getUnitChallengeDeck(unit.unitId, stages[0].id) : []
  );

  const selectedStage = useMemo(
    () => stages.find((stage) => stage.id === selectedStageId) ?? stages[0],
    [selectedStageId, stages]
  );

  useEffect(() => {
    if (!selectedStage) {
      setSessionCards([]);
      setCurrentIndex(0);
      return;
    }

    setSessionCards(engine.getUnitChallengeDeck(unit.unitId, selectedStage.id));
    setCurrentIndex(0);
  }, [selectedStageId, unit.unitId]);

  if (!data || !selectedStage) {
    return (
      <AppShell
        title="单元闯关"
        subtitle="当前还没有可用的闯关数据。"
      >
        <Card>
          <CardTitle>暂时还没有闯关内容</CardTitle>
          <CardDescription className="mt-2">
            等单元数据接入后，这里会自动生成按模块闯关的训练流程。
          </CardDescription>
        </Card>
      </AppShell>
    );
  }

  const card = sessionCards[currentIndex];
  const stageIndex = stages.findIndex((stage) => stage.id === selectedStage.id);
  const nextStage = stages[stageIndex + 1];
  const stageMastery = engine.getStageMastery(unit.unitId, selectedStage.id);

  return (
    <AppShell
      title="单元闯关"
      subtitle="把亚洲单元拆成六关逐步推进。每关都会从对应模块中抽取知识卡片、原题和地图题，适合考前做结构化复习。"
      headerAside={
        <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white">
          <div className="text-sm text-slate-300">当前关卡掌握率</div>
          <div className="mt-2 text-3xl font-bold">{stageMastery}%</div>
        </div>
      }
    >
      <div className="mx-auto max-w-5xl space-y-5">
        <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-ocean-900 text-white">
          <div className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold">
            单元闯关路线
          </div>
          <CardTitle className="text-white">{unit.title}</CardTitle>
          <CardDescription className="mt-3 max-w-3xl text-slate-300">
            每一关都围绕一个核心模块设计，既保留原题，也穿插地图图像和记忆卡片，适合手机和 iPad 连续练习。
          </CardDescription>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {stages.map((stage) => {
            const isSelected = stage.id === selectedStage.id;
            const mastery = engine.getStageMastery(unit.unitId, stage.id);

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={cn(
                  "rounded-[1.5rem] border p-5 text-left transition",
                  isSelected
                    ? "border-ocean-300 bg-ocean-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-ocean-200 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={isSelected ? "default" : "slate"}>{stage.title}</Badge>
                  <div className="text-sm font-semibold text-slate-500">{mastery}%</div>
                </div>
                <div className="mt-3 font-semibold text-ink">{stage.description}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">{stage.focus}</div>
              </button>
            );
          })}
        </div>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>{selectedStage.title}</CardTitle>
              <CardDescription className="mt-2">{selectedStage.description}</CardDescription>
            </div>
            <div className="rounded-[1.4rem] bg-amber-50 px-4 py-3 text-amber-900">
              <div className="text-sm">关卡目标</div>
              <div className="text-2xl font-bold">{selectedStage.passThreshold}%</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={(currentIndex / Math.max(sessionCards.length, 1)) * 100} />
          </div>
        </Card>

        {card ? (
          <StudyCard
            card={card}
            indexLabel={`${currentIndex + 1} / ${sessionCards.length}`}
            onAdvance={({ rating, answeredCorrectly }) => {
              engine.reviewKnowledge(card, rating, { answeredCorrectly });
              setCurrentIndex((value) => value + 1);
            }}
          />
        ) : (
          <Card>
            <div className="mb-3 inline-flex rounded-full bg-ocean-50 px-3 py-1 text-sm font-semibold text-ocean-900">
              当前关卡完成
            </div>
            <CardTitle>{selectedStage.title} 已完成</CardTitle>
            <CardDescription className="mt-2">
              可以重新练这一关，也可以直接进入下一关继续推进。
            </CardDescription>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setSessionCards(engine.getUnitChallengeDeck(unit.unitId, selectedStage.id));
                  setCurrentIndex(0);
                }}
                className={buttonVariants({ size: "lg" })}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                重练本关
              </button>
              {nextStage ? (
                <button
                  type="button"
                  onClick={() => setSelectedStageId(nextStage.id)}
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  进入下一关
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <Link to={`/training/${unit.unitId}`} className={buttonVariants({ variant: "secondary", size: "lg" })}>
                  <Trophy className="mr-2 h-4 w-4" />
                  回到单元训练
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
