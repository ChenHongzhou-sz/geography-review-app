import { useEffect, useState } from "react";
import { Compass, MapPinned, Sparkles } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { StudyCard } from "../components/study/study-card";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import type { ReviewCard } from "../types";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function TrainingPage({ engine }: { engine: StudyEngine }) {
  const params = useParams();
  const unitId = params.unitId ?? "";
  const unit = engine.getUnit(unitId);
  const data = engine.getUnitData(unitId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<ReviewCard[]>(() =>
    engine.getUnitReviewDeck(unitId)
  );
  const card = sessionCards[currentIndex];

  useEffect(() => {
    setSessionCards(engine.getUnitReviewDeck(unitId));
    setCurrentIndex(0);
  }, [unitId]);

  if (!unit) {
    return <Navigate to="/units" replace />;
  }

  if (!data) {
    return <Navigate to={`/unit/${unit.unitId}`} replace />;
  }

  return (
    <AppShell
      title={`${unit.title} 单元训练`}
      subtitle="训练页已经改成按 unitId 取数。以后新增任何单元，只要补同结构的数据文件，就能复用这套页面。"
      headerAside={
        <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white">
          <div className="text-sm text-slate-300">本轮剩余</div>
          <div className="mt-2 text-3xl font-bold">
            {Math.max(sessionCards.length - currentIndex, 0)}
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>开始 {unit.title} 训练</CardTitle>
              <CardDescription className="mt-2">
                当前轮次会优先覆盖待复习知识点，并混入地图题、选择题、判断题和填空题。
              </CardDescription>
            </div>
            <div className="rounded-[1.4rem] bg-ocean-50 px-4 py-3 text-ocean-900">
              <div className="text-sm">知识点</div>
              <div className="text-3xl font-bold">{unit.knowledgeCount}</div>
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
            onRate={(rating) => {
              engine.reviewKnowledge(card, rating);
              setCurrentIndex((value) => value + 1);
            }}
          />
        ) : (
          <Card className="bg-slate-950 text-white">
            <div className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold">
              本轮训练完成
            </div>
            <CardTitle className="text-white">{unit.title} 这一轮已经练完了</CardTitle>
            <CardDescription className="mt-3 text-slate-300">
              你可以继续做地图挑战，也可以重新抽一轮单元训练，让系统按最近记录避开刚做过的内容。
            </CardDescription>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/maps/${unit.unitId}`} className={buttonVariants({ size: "lg" })}>
                <MapPinned className="mr-2 h-4 w-4" />
                去做地图挑战
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSessionCards(engine.getUnitReviewDeck(unit.unitId));
                  setCurrentIndex(0);
                }}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                <Compass className="mr-2 h-4 w-4" />
                再来一轮
              </button>
              <Link to="/review" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                <Sparkles className="mr-2 h-4 w-4" />
                回到今日复习
              </Link>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
